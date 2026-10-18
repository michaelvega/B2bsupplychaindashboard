/**
 * Browser data access layer for the static demo.
 *
 * This replaces the old Node HTTP API (`src/dataset-learning-v2/http.js`). Each
 * function mirrors the response shape the React page used, but runs in-process
 * against the shared engine and the sql.js / IndexedDB data layer — there is no
 * server and no `/api/*` request.
 *
 * Like the old HTTP handler, every entry point returns `{ ok: false, error }`
 * instead of throwing, so the UI can render failures in its error box.
 */

import * as db from './engine/db.browser.js';
import * as engine from '../../src/dataset-learning-v2/engine.js';
import { initDb, flushDb } from './engine/db.browser.js';

export { initDb, flushDb };
export {
  getApiKey,
  setApiKey,
  hasApiKey,
  getModel,
  setModel,
  getBaseUrl,
  setBaseUrl,
} from './engine/llm.browser.js';

// One in-flight epoch loop per project. The engine's runAll is long-lived, so
// clicking Start twice must not start two loops over the same rows.
const running = new Set();

function requireObject(body) {
  if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  throw new Error('invalid request body');
}

async function withDb(fn) {
  try {
    await initDb();
    return await fn();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function fetchDatasetLearningV2Projects() {
  return withDb(() => ({ ok: true, projects: db.listProjects().map(mapProject) }));
}

export function createDatasetLearningV2Project(body) {
  return withDb(async () => {
    const project = await engine.createProject(requireObject(body));
    return { ok: true, project: mapProject(project) };
  });
}

/** Full status: { project, epochs, taxonomy, taxonomyEpoch, rows, rowHistory, scorecards, log }. */
export function fetchDatasetLearningV2Project(id) {
  return withDb(() => getStatus(id));
}

export function uploadDatasetV2Csv(projectId, csvText) {
  return withDb(async () => {
    if (typeof csvText !== 'string' || !csvText.trim()) {
      return { ok: false, error: 'csvText is required' };
    }
    const result = await engine.uploadCsv(projectId, csvText);
    return { ok: true, ...result };
  });
}

export function configureDatasetV2Project(projectId, body) {
  return withDb(() => {
    const patch = {};
    const fields = ['system_prompt', 'golden_column', 'rubric_mode', 'rubric_column', 'sample_answer_column', 'open_ended', 'output_format', 'rubric_json', 'holdout_pct', 'edit_budget', 'max_new_meta', 'max_edits_meta', 'min_citations', 'title', 'description'];
    for (const key of fields) {
      if (key in body) patch[key] = body[key];
    }
    if (Object.keys(patch).length === 0) return { ok: false, error: 'nothing to update' };
    const project = db.updateProject(projectId, patch);
    if (!project) return { ok: false, error: 'project not found' };
    return { ok: true, project: mapProject(project) };
  });
}

export function startDatasetLearningV2(projectId, numEpochs, opts = {}) {
  return withDb(async () => {
    const project = db.getProject(projectId);
    if (!project) return { ok: false, error: 'project not found' };
    if (running.has(projectId)) {
      return { ok: false, error: 'a run is already in progress for this project' };
    }

    const epochs = Number(numEpochs) > 0 ? Number(numEpochs) : 1;
    await engine.seedInitialTaxonomy(projectId);

    const runOpts = {};
    if (Number.isInteger(opts?.consecutiveRejections) && opts.consecutiveRejections >= 0) {
      runOpts.consecutiveRejections = opts.consecutiveRejections;
    }

    running.add(projectId);
    void engine.runAll(projectId, epochs, runOpts)
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        try {
          db.appendLog(projectId, 0, `run error: ${message}`);
        } catch {
          console.error('dataset-learning run failed:', message);
        }
      })
      .finally(() => running.delete(projectId));

    return { ok: true, numEpochs: epochs };
  });
}

export function deleteDatasetLearningV2Project(projectId) {
  return withDb(() => {
    const project = db.getProject(projectId);
    if (!project) return { ok: false, error: 'project not found' };
    db.resetProjectData(projectId);
    return { ok: true };
  });
}

/** True while an epoch loop started by this tab is in flight for the project. */
export function isRunning(projectId) {
  return running.has(projectId);
}

/** Validate an OpenRouter key. Never throws. -> { ok, label?, usage?, limit?, error? } */
export async function testOpenRouterKey(key) {
  const k = String(key ?? '').trim();
  if (!k) return { ok: false, error: 'Paste a key first.' };
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { Authorization: `Bearer ${k}` },
    });
    if (res.status === 401 || res.status === 403) return { ok: false, error: 'OpenRouter rejected this key (401). Check it and try again.' };
    if (!res.ok) return { ok: false, error: `OpenRouter returned HTTP ${res.status}.` };
    const json = await res.json().catch(() => ({}));
    const d = json?.data ?? {};
    return { ok: true, label: d.label ?? null, usage: d.usage ?? null, limit: d.limit ?? null };
  } catch (err) {
    return { ok: false, error: 'Network error reaching OpenRouter. Check your connection.' };
  }
}

// --- handlers ---------------------------------------------------------------

function getStatus(projectId) {
  const project = db.getProject(projectId);
  if (!project) return { ok: false, error: 'project not found' };

  const epochs = db.listEpochs(projectId).map(mapEpoch);
  const accepted = db.getLatestAcceptedVersion(projectId);
  const rows = db.getRows(projectId).map((row) => ({ id: row.id, payload: row.payload, split: row.split }));

  const rowHistory = {};
  for (const row of rows) {
    const history = db.getRowHistory(projectId, row.id).map(mapRowHistory);
    if (history.length > 0) rowHistory[row.id] = history;
  }

  const scorecards = {};
  for (const epoch of epochs) {
    const cards = db.getScorecard(projectId, epoch.epoch);
    if (cards.length > 0) scorecards[epoch.epoch] = cards;
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
  };
}

// --- mappers (same shape as src/dataset-learning-v2/http.js) ----------------

function mapProject(row) {
  if (!row) return row;
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
    sample_answer_column: row.sample_answer_column ?? null,
    open_ended: Number(row.open_ended) === 1,
    columns_json: row.columns_json ?? [],
    holdout_pct: row.holdout_pct ?? null,
    edit_budget: row.edit_budget ?? null,
    max_new_meta: row.max_new_meta ?? null,
    max_edits_meta: row.max_edits_meta ?? null,
    min_citations: row.min_citations ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

function mapEpoch(row) {
  return {
    epoch: row.epoch,
    status: row.status,
    gate_passed: Number(row.gate_passed) === 1,
    metrics: row.metrics_json ?? {},
    meta_reasoning: row.meta_reasoning ?? null,
    meta_edits: row.meta_edits_json ?? [],
  };
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
  };
}
