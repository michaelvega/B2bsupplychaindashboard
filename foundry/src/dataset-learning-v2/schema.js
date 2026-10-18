/**
 * SQLite schema for dataset-learning-v2.
 *
 * Shared by the Node data layer (db.js, `node:sqlite`) and the browser data
 * layer (db.browser.js, `sql.js` + IndexedDB). This file has no runtime
 * dependencies so both builds can import it.
 */

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS project (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  system_prompt TEXT,
  output_format TEXT,
  golden_column TEXT,
  sample_answer_column TEXT,
  rubric_json TEXT,
  rubric_mode TEXT,
  rubric_column TEXT,
  open_ended INTEGER,
  columns_json TEXT,
  holdout_pct REAL,
  edit_budget INTEGER,
  max_new_meta INTEGER,
  max_edits_meta INTEGER,
  min_citations INTEGER,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS dataset_row (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  source_index INTEGER,
  payload_json TEXT,
  split TEXT
);

CREATE TABLE IF NOT EXISTS taxonomy_rule (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  rule_id INTEGER,
  text TEXT,
  active INTEGER,
  created_epoch INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS taxonomy_version (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  epoch INTEGER,
  rules_json TEXT,
  is_candidate INTEGER,
  accepted INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS epoch (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  epoch INTEGER,
  status TEXT,
  train_row_ids_json TEXT,
  baseline_version_id TEXT,
  candidate_version_id TEXT,
  gate_passed INTEGER,
  metrics_json TEXT,
  meta_reasoning TEXT,
  meta_edits_json TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS row_history (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  row_id TEXT,
  epoch INTEGER,
  taxonomy_version_id TEXT,
  answer TEXT,
  predicted_label TEXT,
  cited_rule_ids_json TEXT,
  rubric_score REAL,
  rubric_total REAL,
  rubric_dock_json TEXT,
  correct INTEGER,
  continuous_correct INTEGER,
  diagnosis TEXT,
  wrong_count_before INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS scorecard (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  epoch INTEGER,
  rule_id INTEGER,
  shrinkage_association REAL
);

CREATE TABLE IF NOT EXISTS meta_history (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  epoch INTEGER,
  reasoning TEXT,
  edits_json TEXT,
  applied INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS run_log (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  epoch INTEGER,
  message TEXT,
  created_at TEXT
);
`
