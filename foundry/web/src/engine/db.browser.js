/**
 * Browser data layer for dataset-learning-v2.
 *
 * Drop-in replacement for db.js in the Vite build: the same exported query
 * functions and the same SQL, backed by sql.js (SQLite compiled to WASM) and
 * persisted to IndexedDB. The Node CLI keeps using db.js / node:sqlite.
 *
 * The engine's query functions are synchronous, so the WASM database must be
 * loaded before the first call. The app awaits initDb() at startup; every
 * client-API entry point also awaits it defensively.
 */

import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { SCHEMA_SQL } from '../../../src/dataset-learning-v2/schema.js'

const IDB_NAME = 'procept-foundry-demo'
const IDB_STORE = 'sqlite'
const IDB_KEY = 'dataset-learning-v2.db'
const SAVE_DEBOUNCE_MS = 400

let db = null
let initPromise = null
let saveTimer = null
let idbPromise = null

function fallbackUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0
    const v = ch === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// crypto.randomUUID() needs a secure context (HTTPS or localhost). Fall back so
// a static build served over plain HTTP on a LAN address still works.
const randomUUID = () =>
  typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : fallbackUuid()

function openIdb() {
  if (idbPromise) return idbPromise
  idbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable in this browser'))
      return
    }
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => {
      const idb = req.result
      if (!idb.objectStoreNames.contains(IDB_STORE)) idb.createObjectStore(IDB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return idbPromise
}

async function loadBytes() {
  try {
    const idb = await openIdb()
    const value = await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readonly')
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    if (!value) return null
    return value instanceof Uint8Array ? value : new Uint8Array(value)
  } catch {
    return null
  }
}

async function saveBytes(bytes) {
  try {
    const idb = await openIdb()
    await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readwrite')
      tx.objectStore(IDB_STORE).put(bytes, IDB_KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('dataset-learning: IndexedDB persistence failed', err)
  }
}

/**
 * Load sql.js, restore the database from IndexedDB (or create it), and ensure
 * the schema exists. Safe to call more than once.
 * @returns {Promise<object>} the sql.js Database
 */
export async function initDb() {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const SQL = await initSqlJs({ locateFile: () => wasmUrl })
    const bytes = await loadBytes()
    db = bytes ? new SQL.Database(bytes) : new SQL.Database()
    db.exec(SCHEMA_SQL)
    return db
  })()
  return initPromise
}

function requireDb() {
  if (!db) throw new Error('dataset-learning db not initialized — await initDb() first')
  return db
}

function persist() {
  if (!db) return Promise.resolve()
  return saveBytes(db.export())
}

function scheduleSave() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { persist() }, SAVE_DEBOUNCE_MS)
}

/** Force a write-through to IndexedDB (used on page hide / before unload). */
export async function flushDb() {
  clearTimeout(saveTimer)
  await persist()
}

/**
 * SQLite only binds null/number/bigint/string/blob, so coerce undefined to null
 * and booleans to 0/1 before handing parameters over.
 */
function bindables(params) {
  return params.map((value) => {
    if (value === undefined) return null
    if (typeof value === 'boolean') return value ? 1 : 0
    return value
  })
}

function run(sql, params = []) {
  requireDb().run(sql, bindables(params))
  scheduleSave()
}

function all(sql, params = []) {
  const stmt = requireDb().prepare(sql)
  try {
    stmt.bind(bindables(params))
    const rows = []
    while (stmt.step()) rows.push(stmt.getAsObject())
    return rows
  } finally {
    stmt.free()
  }
}

function get(sql, params = []) {
  const rows = all(sql, params)
  return rows.length === 0 ? undefined : { ...rows[0] }
}

function transaction(fn) {
  const handle = requireDb()
  handle.exec('BEGIN')
  try {
    const result = fn()
    handle.exec('COMMIT')
    scheduleSave()
    return result
  } catch (error) {
    handle.exec('ROLLBACK')
    throw error
  }
}

// --- JSON / scalar conversion helpers ---------------------------------------

function toJson(value) {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function readJsonObject(value) {
  if (value === null || value === undefined) return {}
  if (typeof value === 'object' && !Array.isArray(value)) return value
  if (typeof value !== 'string') return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function readJsonArray(value) {
  if (value === null || value === undefined) return []
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Read a JSON column whose stored kind is not fixed — a rubric may be an array
 * of criteria, an object, or plain rubric text. Parse when possible and fall
 * back to the raw stored value so nothing is silently discarded.
 */
function readJsonValue(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function toInt(value) {
  return value ? 1 : 0
}

function nowIso() {
  return new Date().toISOString()
}

// --- row mappers (JSON columns -> parsed values) ----------------------------

function mapProject(row) {
  if (!row) return undefined
  return {
    ...row,
    rubric_json: readJsonValue(row.rubric_json, null),
    columns_json: readJsonArray(row.columns_json),
  }
}

function mapDatasetRow(row) {
  if (!row) return undefined
  return { ...row, payload: readJsonObject(row.payload_json) }
}

function mapTaxonomyVersion(row) {
  if (!row) return undefined
  return { ...row, rules_json: readJsonArray(row.rules_json) }
}

function mapEpoch(row) {
  if (!row) return undefined
  return {
    ...row,
    train_row_ids_json: readJsonArray(row.train_row_ids_json),
    metrics_json: readJsonObject(row.metrics_json),
    meta_edits_json: readJsonArray(row.meta_edits_json),
  }
}

function mapRowHistory(row) {
  if (!row) return undefined
  return {
    ...row,
    cited_rule_ids_json: readJsonArray(row.cited_rule_ids_json),
    rubric_dock_json: readJsonArray(row.rubric_dock_json),
  }
}

function mapMetaHistory(row) {
  if (!row) return undefined
  return { ...row, edits_json: readJsonArray(row.edits_json) }
}

// --- projects ---------------------------------------------------------------

const PROJECT_PATCH_COLUMNS = [
  'title',
  'description',
  'system_prompt',
  'output_format',
  'golden_column',
  'sample_answer_column',
  'rubric_json',
  'rubric_mode',
  'rubric_column',
  'open_ended',
  'columns_json',
  'holdout_pct',
  'edit_budget',
  'max_new_meta',
  'max_edits_meta',
  'min_citations',
]

function projectPatchValue(column, value) {
  if (column === 'open_ended') return toInt(value)
  if (column === 'rubric_json' || column === 'columns_json' || column === 'output_format') {
    return toJson(value)
  }
  return value
}

/**
 * Insert a project row and return it.
 * @param {object} fields
 * @returns {object}
 */
export function createProject(fields = {}) {
  const id = fields.id ?? randomUUID()
  const timestamp = nowIso()
  run(
    `INSERT INTO project (id, title, description, system_prompt, output_format,
      golden_column, sample_answer_column, rubric_json, rubric_mode, rubric_column, open_ended,
      columns_json, holdout_pct, edit_budget, max_new_meta, max_edits_meta, min_citations,
      created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      fields.title ?? null,
      fields.description ?? null,
      fields.system_prompt ?? null,
      toJson(fields.output_format),
      fields.golden_column ?? null,
      fields.sample_answer_column ?? null,
      toJson(fields.rubric_json),
      fields.rubric_mode ?? null,
      fields.rubric_column ?? null,
      toInt(fields.open_ended),
      toJson(fields.columns_json),
      fields.holdout_pct ?? null,
      fields.edit_budget ?? null,
      fields.max_new_meta ?? null,
      fields.max_edits_meta ?? null,
      fields.min_citations ?? null,
      timestamp,
      timestamp,
    ]
  )
  return getProject(id)
}

/**
 * @param {string} id
 * @returns {object|undefined}
 */
export function getProject(id) {
  return mapProject(get('SELECT * FROM project WHERE id = ?', [id]))
}

/**
 * @returns {object[]}
 */
export function listProjects() {
  return all('SELECT * FROM project ORDER BY created_at ASC, rowid ASC').map(mapProject)
}

/**
 * Patch a project's mutable columns and return the updated row.
 * @param {string} id
 * @param {object} patch
 * @returns {object|undefined}
 */
export function updateProject(id, patch = {}) {
  const columns = PROJECT_PATCH_COLUMNS.filter((column) => column in patch)
  if (columns.length === 0) return getProject(id)
  const assignments = columns.map((column) => `${column} = ?`)
  const params = columns.map((column) => projectPatchValue(column, patch[column]))
  assignments.push('updated_at = ?')
  params.push(nowIso())
  run(`UPDATE project SET ${assignments.join(', ')} WHERE id = ?`, [...params, id])
  return getProject(id)
}

// --- dataset rows -----------------------------------------------------------

/**
 * Bulk insert dataset rows.
 * @param {Array<{id?, project_id, source_index, payload, split}>} rows
 * @returns {number} number of rows inserted
 */
export function insertRows(rows = []) {
  if (rows.length === 0) return 0
  transaction(() => {
    for (const row of rows) {
      run(
        `INSERT INTO dataset_row (id, project_id, source_index, payload_json, split)
         VALUES (?, ?, ?, ?, ?)`,
        [
          row.id ?? randomUUID(),
          row.project_id ?? null,
          row.source_index ?? null,
          toJson(row.payload),
          row.split ?? null,
        ]
      )
    }
  })
  return rows.length
}

/**
 * @param {string} projectId
 * @returns {object[]} rows ordered by source_index, payload parsed
 */
export function getRows(projectId) {
  return all('SELECT * FROM dataset_row WHERE project_id = ? ORDER BY source_index ASC', [
    projectId,
  ]).map(mapDatasetRow)
}

/**
 * @param {string} projectId
 * @param {string} split
 * @returns {string[]}
 */
export function getRowIdsBySplit(projectId, split) {
  return all(
    'SELECT id FROM dataset_row WHERE project_id = ? AND split = ? ORDER BY source_index ASC',
    [projectId, split]
  ).map((row) => row.id)
}

/**
 * @param {string} id
 * @returns {object|undefined}
 */
export function getRowById(id) {
  return mapDatasetRow(get('SELECT * FROM dataset_row WHERE id = ?', [id]))
}

// --- taxonomy ---------------------------------------------------------------

/**
 * @param {{project_id, rule_id, text, active, created_epoch}} fields
 * @returns {object}
 */
export function insertRule({ project_id, rule_id, text, active, created_epoch }) {
  const id = randomUUID()
  run(
    `INSERT INTO taxonomy_rule (id, project_id, rule_id, text, active, created_epoch, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      project_id,
      rule_id,
      text,
      active === undefined ? 1 : toInt(active),
      created_epoch ?? null,
      nowIso(),
    ]
  )
  return get('SELECT * FROM taxonomy_rule WHERE id = ?', [id])
}

/**
 * @param {string} id
 * @param {{text?, active?}} patch
 * @returns {object|undefined}
 */
export function updateRule(id, patch = {}) {
  const columns = ['text', 'active'].filter((column) => column in patch)
  if (columns.length === 0) return get('SELECT * FROM taxonomy_rule WHERE id = ?', [id])
  const assignments = columns.map((column) => `${column} = ?`)
  const params = columns.map((column) => (column === 'active' ? toInt(patch[column]) : patch[column]))
  run(`UPDATE taxonomy_rule SET ${assignments.join(', ')} WHERE id = ?`, [...params, id])
  return get('SELECT * FROM taxonomy_rule WHERE id = ?', [id])
}

/**
 * @param {string} projectId
 * @returns {Array<{rule_id:number, text:string}>} ordered by rule_id
 */
export function getActiveRules(projectId) {
  return all(
    'SELECT rule_id, text FROM taxonomy_rule WHERE project_id = ? AND active = 1 ORDER BY rule_id ASC',
    [projectId]
  ).map((row) => ({ rule_id: row.rule_id, text: row.text }))
}

/**
 * @param {string} projectId
 * @returns {number} 1 + max(rule_id), or 1 when the project has no rules
 */
export function getNextRuleId(projectId) {
  const row = get('SELECT MAX(rule_id) AS max_rule_id FROM taxonomy_rule WHERE project_id = ?', [
    projectId,
  ])
  const max = row?.max_rule_id
  return max === null || max === undefined ? 1 : Number(max) + 1
}

/**
 * @param {{project_id, epoch, rules_json, is_candidate, accepted}} fields
 * @returns {object}
 */
export function insertTaxonomyVersion({ project_id, epoch, rules_json, is_candidate, accepted }) {
  const id = randomUUID()
  run(
    `INSERT INTO taxonomy_version (id, project_id, epoch, rules_json, is_candidate, accepted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      project_id,
      epoch ?? null,
      toJson(rules_json ?? []),
      toInt(is_candidate),
      toInt(accepted),
      nowIso(),
    ]
  )
  return getTaxonomyVersion(id)
}

/**
 * @param {string} id
 * @returns {object|undefined} rules_json parsed to an array
 */
export function getTaxonomyVersion(id) {
  return mapTaxonomyVersion(get('SELECT * FROM taxonomy_version WHERE id = ?', [id]))
}

/**
 * Patch a taxonomy version's mutable flags (used to un-accept on roll-back).
 * @param {string} id
 * @param {{accepted?: number}} patch
 * @returns {object|undefined}
 */
export function updateTaxonomyVersion(id, patch = {}) {
  const assignments = []
  const params = []
  if ('accepted' in patch) {
    assignments.push('accepted = ?')
    params.push(patch.accepted ? 1 : 0)
  }
  if (assignments.length === 0) return getTaxonomyVersion(id)
  run(`UPDATE taxonomy_version SET ${assignments.join(', ')} WHERE id = ?`, [...params, id])
  return getTaxonomyVersion(id)
}

/**
 * @param {string} projectId
 * @returns {object|undefined} the accepted version with the highest epoch
 */
export function getLatestAcceptedVersion(projectId) {
  return mapTaxonomyVersion(
    get(
      'SELECT * FROM taxonomy_version WHERE project_id = ? AND accepted = 1 ORDER BY epoch DESC, rowid DESC LIMIT 1',
      [projectId]
    )
  )
}

// --- epochs -----------------------------------------------------------------

const EPOCH_PATCH_COLUMNS = [
  'status',
  'train_row_ids_json',
  'baseline_version_id',
  'candidate_version_id',
  'gate_passed',
  'metrics_json',
  'meta_reasoning',
  'meta_edits_json',
]

function epochPatchValue(column, value) {
  if (column === 'gate_passed') return toInt(value)
  if (
    column === 'train_row_ids_json' ||
    column === 'meta_edits_json' ||
    column === 'metrics_json'
  ) {
    return toJson(value)
  }
  return value
}

/**
 * @param {object} fields
 * @returns {object}
 */
export function insertEpoch(fields = {}) {
  const id = fields.id ?? randomUUID()
  run(
    `INSERT INTO epoch (id, project_id, epoch, status, train_row_ids_json, baseline_version_id,
      candidate_version_id, gate_passed, metrics_json, meta_reasoning, meta_edits_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      fields.project_id ?? null,
      fields.epoch ?? null,
      fields.status ?? null,
      toJson(fields.train_row_ids_json),
      fields.baseline_version_id ?? null,
      fields.candidate_version_id ?? null,
      fields.gate_passed === undefined ? null : toInt(fields.gate_passed),
      toJson(fields.metrics_json),
      fields.meta_reasoning ?? null,
      toJson(fields.meta_edits_json),
      fields.created_at ?? nowIso(),
    ]
  )
  return mapEpoch(get('SELECT * FROM epoch WHERE id = ?', [id]))
}

/**
 * @param {string} projectId
 * @param {number} epoch
 * @returns {object|undefined}
 */
export function getEpoch(projectId, epoch) {
  return mapEpoch(get('SELECT * FROM epoch WHERE project_id = ? AND epoch = ?', [projectId, epoch]))
}

/**
 * @param {string} id
 * @param {object} patch
 * @returns {object|undefined}
 */
export function updateEpoch(id, patch = {}) {
  const columns = EPOCH_PATCH_COLUMNS.filter((column) => column in patch)
  if (columns.length === 0) return mapEpoch(get('SELECT * FROM epoch WHERE id = ?', [id]))
  const assignments = columns.map((column) => `${column} = ?`)
  const params = columns.map((column) => epochPatchValue(column, patch[column]))
  run(`UPDATE epoch SET ${assignments.join(', ')} WHERE id = ?`, [...params, id])
  return mapEpoch(get('SELECT * FROM epoch WHERE id = ?', [id]))
}

/**
 * @param {string} projectId
 * @returns {object[]} ordered by epoch asc
 */
export function listEpochs(projectId) {
  return all('SELECT * FROM epoch WHERE project_id = ? ORDER BY epoch ASC', [projectId]).map(mapEpoch)
}

// --- row history ------------------------------------------------------------

/**
 * @param {object} fields
 * @returns {object}
 */
export function insertRowHistory(fields = {}) {
  const id = fields.id ?? randomUUID()
  run(
    `INSERT INTO row_history (id, project_id, row_id, epoch, taxonomy_version_id, answer,
      predicted_label, cited_rule_ids_json, rubric_score, rubric_total, rubric_dock_json,
      correct, continuous_correct, diagnosis, wrong_count_before, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      fields.project_id ?? null,
      fields.row_id ?? null,
      fields.epoch ?? null,
      fields.taxonomy_version_id ?? null,
      fields.answer ?? null,
      fields.predicted_label ?? null,
      toJson(fields.cited_rule_ids ?? []),
      fields.rubric_score ?? null,
      fields.rubric_total ?? null,
      toJson(fields.rubric_dock),
      fields.correct === undefined || fields.correct === null ? null : toInt(fields.correct),
      fields.continuous_correct === undefined || fields.continuous_correct === null
        ? null
        : toInt(fields.continuous_correct),
      fields.diagnosis ?? null,
      fields.wrong_count_before ?? null,
      fields.created_at ?? nowIso(),
    ]
  )
  return mapRowHistory(get('SELECT * FROM row_history WHERE id = ?', [id]))
}

/**
 * @param {string} projectId
 * @param {string} rowId
 * @returns {object[]} ordered by epoch asc
 */
export function getRowHistory(projectId, rowId) {
  return all(
    'SELECT * FROM row_history WHERE project_id = ? AND row_id = ? ORDER BY epoch ASC',
    [projectId, rowId]
  ).map(mapRowHistory)
}

/**
 * @param {string} projectId
 * @param {number} epoch
 * @returns {object[]}
 */
export function getRowHistoryForEpoch(projectId, epoch) {
  return all(
    'SELECT * FROM row_history WHERE project_id = ? AND epoch = ? ORDER BY row_id ASC',
    [projectId, epoch]
  ).map(mapRowHistory)
}

/**
 * Count prior row_history entries for a row that were wrong. Open-ended projects
 * are judged on continuous_correct, closed-scale projects on correct.
 * @param {string} projectId
 * @param {string} rowId
 * @returns {number}
 */
export function countWrongBefore(projectId, rowId) {
  const project = get('SELECT open_ended FROM project WHERE id = ?', [projectId])
  const openEnded = Number(project?.open_ended) === 1
  const column = openEnded ? 'continuous_correct' : 'correct'
  const row = get(
    `SELECT COUNT(*) AS wrong_count FROM row_history
     WHERE project_id = ? AND row_id = ? AND ${column} = 0`,
    [projectId, rowId]
  )
  return Number(row?.wrong_count ?? 0)
}

// --- scorecard --------------------------------------------------------------

/**
 * @param {object} fields
 * @returns {object}
 */
export function insertScorecard(fields = {}) {
  const id = fields.id ?? randomUUID()
  run(
    `INSERT INTO scorecard (id, project_id, epoch, rule_id, shrinkage_association)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      fields.project_id ?? null,
      fields.epoch ?? null,
      fields.rule_id ?? null,
      fields.shrinkage_association ?? null,
    ]
  )
  return get('SELECT * FROM scorecard WHERE id = ?', [id])
}

/**
 * @param {string} projectId
 * @param {number} epoch
 * @returns {object[]} ordered by rule_id asc
 */
export function getScorecard(projectId, epoch) {
  return all('SELECT * FROM scorecard WHERE project_id = ? AND epoch = ? ORDER BY rule_id ASC', [
    projectId,
    epoch,
  ]).map((row) => ({ ...row }))
}

// --- meta history -----------------------------------------------------------

/**
 * @param {object} fields
 * @returns {object}
 */
export function insertMetaHistory(fields = {}) {
  const id = fields.id ?? randomUUID()
  run(
    `INSERT INTO meta_history (id, project_id, epoch, reasoning, edits_json, applied, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      fields.project_id ?? null,
      fields.epoch ?? null,
      fields.reasoning ?? null,
      toJson(fields.edits),
      fields.applied === undefined ? 0 : toInt(fields.applied),
      fields.created_at ?? nowIso(),
    ]
  )
  return mapMetaHistory(get('SELECT * FROM meta_history WHERE id = ?', [id]))
}

/**
 * @param {string} projectId
 * @returns {object[]} ordered by epoch asc
 */
export function getMetaHistory(projectId) {
  return all('SELECT * FROM meta_history WHERE project_id = ? ORDER BY epoch ASC, rowid ASC', [
    projectId,
  ]).map(mapMetaHistory)
}

// --- run log ----------------------------------------------------------------

/**
 * @param {string} projectId
 * @param {number} epoch
 * @param {string} message
 * @returns {object}
 */
export function appendLog(projectId, epoch, message) {
  const row = { id: randomUUID(), project_id: projectId, epoch, message, created_at: nowIso() }
  run('INSERT INTO run_log (id, project_id, epoch, message, created_at) VALUES (?, ?, ?, ?, ?)', [
    row.id,
    row.project_id,
    row.epoch,
    row.message,
    row.created_at,
  ])
  return row
}

/**
 * @param {string} projectId
 * @returns {object[]} ordered by created_at asc
 */
export function getLog(projectId) {
  return all('SELECT * FROM run_log WHERE project_id = ? ORDER BY created_at ASC, rowid ASC', [
    projectId,
  ]).map((row) => ({ ...row }))
}

// --- reset ------------------------------------------------------------------

/**
 * Delete every row belonging to a project EXCEPT the project row itself.
 * @param {string} projectId
 */
export function resetProjectData(projectId) {
  const tables = [
    'dataset_row',
    'taxonomy_rule',
    'taxonomy_version',
    'epoch',
    'row_history',
    'scorecard',
    'meta_history',
    'run_log',
  ]
  transaction(() => {
    for (const table of tables) {
      run(`DELETE FROM ${table} WHERE project_id = ?`, [projectId])
    }
  })
}

/**
 * Permanently remove a project and everything that belongs to it.
 * (resetProjectData only clears the data and keeps the project row.)
 */
export function deleteProject(projectId) {
  resetProjectData(projectId)
  run('DELETE FROM project WHERE id = ?', [projectId])
}
