/**
 * HTTP routing for dataset-learning-v2.
 *
 * Dispatches /api/dataset-learning-v2/* requests from the --serve dashboard
 * server. Bodies are read manually with a cap, every response is JSON over a
 * 200 status, and errors come back as { ok: false, error }. Storage goes through
 * db.js, lifecycle through engine.js.
 */

import * as db from './db.js'
import * as engine from './engine.js'

const PREFIX = '/api/dataset-learning-v2'
const BODY_CAP = 50 * 1024 * 1024

/** @returns {boolean} true when this request was handled. */
export function handleDatasetLearningV2Api(req, res, urlPath) {
  if (!urlPath.startsWith(PREFIX)) return false

  const method = (req.method || 'GET').toUpperCase()
  const segs = urlPath.slice(PREFIX.length).split('/').filter(Boolean)

  // /projects
  if (segs.length === 1 && segs[0] === 'projects') {
    if (method === 'GET') return run(res, () => listProjects())
    if (method === 'POST') return run(res, async () => createProject(await readBody(req)))
    return false
  }

  // /projects/:id[/action]
  if (segs[0] === 'projects' && segs.length >= 2) {
    const projectId = segs[1]
    if (segs.length === 2 && method === 'GET') return run(res, () => getStatus(projectId))
    if (segs.length === 2 && method === 'DELETE') return run(res, () => deleteProject(projectId))
    if (segs.length === 3) {
      const action = segs[2]
      if (action === 'upload' && method === 'POST') return run(res, async () => upload(projectId, await readBody(req)))
      if (action === 'configure' && method === 'POST') return run(res, async () => configure(projectId, await readBody(req)))
      if (action === 'start' && method === 'POST') return run(res, async () => start(projectId, await readBody(req)))
    }
    return false
  }

  return false
}

function run(res, handler) {
  Promise.resolve()
    .then(handler)
    .then((payload) => {
      if (payload !== undefined) respond(res, payload)
    })
    .catch((err) => respond(res, { ok: false, error: err instanceof Error ? err.message : String(err) }))
  return true
}

function respond(res, payload) {
  if (res.writableEnded || res.destroyed) return
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(payload))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    let exceeded = false
    req.on('data', (chunk) => {
      if (exceeded) return
      body += chunk
      if (body.length > BODY_CAP) {
        exceeded = true
        req.destroy()
        reject(new Error('request body too large'))
      }
    })
    req.on('end', () => {
      if (exceeded) return
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('invalid JSON body'))
      }
    })
    req.on('error', (err) => reject(err))
  })
}

function requireObject(body) {
  if (body && typeof body === 'object' && !Array.isArray(body)) return body
  throw new Error('invalid request body')
}

// --- handlers ---------------------------------------------------------------

async function listProjects() {
  return { projects: db.listProjects().map(mapProject) }
}

async function createProject(body) {
  const fields = requireObject(body)
  const project = await engine.createProject(fields)
  return { ok: true, project: mapProject(project) }
}

async function getStatus(projectId) {
  const project = db.getProject(projectId)
  if (!project) return { ok: false, error: 'project not found' }

  const epochs = db.listEpochs(projectId).map(mapEpoch)
  const accepted = db.getLatestAcceptedVersion(projectId)
  const rows = db.getRows(projectId).map((row) => ({ id: row.id, payload: row.payload, split: row.split }))

  const rowHistory = {}
  for (const row of rows) {
    const history = db.getRowHistory(projectId, row.id).map(mapRowHistory)
    if (history.length > 0) rowHistory[row.id] = history
  }

  const scorecards = {}
  for (const epoch of epochs) {
    const cards = db.getScorecard(projectId, epoch.epoch)
    if (cards.length > 0) scorecards[epoch.epoch] = cards
  }

  return {
    ok: true,
    project: mapProject(project),
    epochs,
    taxonomy: accepted ? accepted.rules_json : [],
    taxonomyEpoch: accepted ? accepted.epoch : 0,
    rows,
    rowHistory,
    scorecards,
    log: db.getLog(projectId).map((entry) => ({ epoch: entry.epoch, message: entry.message })),
  }
}

async function upload(projectId, body) {
  const { csvText } = requireObject(body)
  if (typeof csvText !== 'string' || !csvText.trim()) return { ok: false, error: 'csvText is required' }
  const result = await engine.uploadCsv(projectId, csvText)
  return { ok: true, ...result }
}

async function configure(projectId, body) {
  const patch = {}
  const fields = ['system_prompt', 'golden_column', 'rubric_mode', 'rubric_column', 'open_ended', 'output_format', 'rubric_json', 'holdout_pct', 'edit_budget', 'max_new_meta', 'max_edits_meta', 'min_citations', 'title', 'description']
  for (const key of fields) {
    if (key in body) patch[key] = body[key]
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: 'nothing to update' }
  const project = db.updateProject(projectId, patch)
  if (!project) return { ok: false, error: 'project not found' }
  return { ok: true, project: mapProject(project) }
}

async function start(projectId, body) {
  const project = db.getProject(projectId)
  if (!project) return { ok: false, error: 'project not found' }
  const numEpochs = Number(body.numEpochs) > 0 ? Number(body.numEpochs) : 1
  await engine.seedInitialTaxonomy(projectId)
  void engine.runAll(projectId, numEpochs).catch(() => {})
  return { ok: true, numEpochs }
}

async function deleteProject(projectId) {
  const project = db.getProject(projectId)
  if (!project) return { ok: false, error: 'project not found' }
  db.resetProjectData(projectId)
  return { ok: true }
}

// --- mappers ----------------------------------------------------------------

function mapProject(row) {
  if (!row) return row
  return {
    id: row.id,
    title: row.title ?? null,
    description: row.description ?? null,
    system_prompt: row.system_prompt ?? null,
    output_format: row.output_format ?? null,
    golden_column: row.golden_column ?? null,
    rubric_json: row.rubric_json ?? null,
    rubric_mode: row.rubric_mode ?? 'global',
    rubric_column: row.rubric_column ?? null,
    open_ended: Number(row.open_ended) === 1,
    columns_json: row.columns_json ?? [],
    holdout_pct: row.holdout_pct ?? null,
    edit_budget: row.edit_budget ?? null,
    max_new_meta: row.max_new_meta ?? null,
    max_edits_meta: row.max_edits_meta ?? null,
    min_citations: row.min_citations ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  }
}

function mapEpoch(row) {
  return {
    epoch: row.epoch,
    status: row.status,
    gate_passed: Number(row.gate_passed) === 1,
    metrics: row.metrics_json ?? {},
    meta_reasoning: row.meta_reasoning ?? null,
    meta_edits: row.meta_edits_json ?? [],
  }
}

function mapRowHistory(row) {
  return {
    epoch: row.epoch,
    answer: row.answer ?? null,
    predicted_label: row.predicted_label ?? null,
    cited_rules: row.cited_rule_ids_json ?? [],
    score: row.rubric_score ?? null,
    total: row.rubric_total ?? null,
    dock: row.rubric_dock_json ?? null,
    correct: row.correct ?? null,
    continuous_correct: row.continuous_correct ?? null,
    diagnosis: row.diagnosis ?? null,
    wrong_count_before: row.wrong_count_before ?? 0,
  }
}
