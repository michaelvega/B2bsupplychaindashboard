/**
 * Pure form model for the setup wizard. No React, no browser globals.
 * Field values/defaults mirror the original DatasetLearningV2 form exactly.
 * UI-only fields (not sent to the engine): input_columns.
 */
import { parseCsvPreview } from '../../lib/csvPreview.js';

export const EMPTY_FORM = {
  title: '',
  system_prompt: 'Answer the question accurately.\nQuestion: {{problem}}',
  output_format: '{"answer": "a short free-form answer"}',
  golden_column: '',
  sample_answer_column: '',
  rubric_mode: 'per_row',
  rubric_column: 'answer',
  open_ended: true,
  rubric_json: '',
  holdout_pct: '0.2',
  edit_budget: '3',
  max_new_meta: '2',
  max_edits_meta: '3',
  min_citations: '5',
  input_columns: [], // UI only
};

/** Defaults for the advanced knobs, as shown in the UI. */
export const ADVANCED_DEFAULTS = {
  holdout_pct: '0.2',
  edit_budget: '3',
  max_new_meta: '2',
  max_edits_meta: '3',
  min_citations: '5',
};

/** Bundled presets (copied verbatim from the original page). */
export const SAMPLE_DATASETS = {
  frontier: {
    label: 'FrontierScience sample',
    file: 'frontier-sample.csv',
    title: 'FrontierScience demo',
    fields: {
      system_prompt: 'Answer the question accurately.\nQuestion: {{problem}}',
      output_format: '{"answer": "a short free-form answer"}',
      golden_column: '',
      rubric_mode: 'per_row',
      rubric_column: 'answer',
      open_ended: true,
      rubric_json: '',
      holdout_pct: '0.2',
      edit_budget: '3',
      max_new_meta: '2',
      max_edits_meta: '3',
      min_citations: '5',
    },
  },
  research: {
    label: 'ResearchRubrics sample',
    file: 'research-sample.csv',
    title: 'ResearchRubrics demo',
    fields: {
      system_prompt: 'Domain: {{domain}}.\n{{taxonomy}}, solve this problem with the taxonomy of relevant rules: {{prompt}}.',
      output_format: '{"answer": "a complete, detailed answer", "cited_rules": "list of rule numbers used", "explanation": "a brief explanation"}',
      golden_column: '',
      rubric_mode: 'per_row',
      rubric_column: 'rubrics',
      open_ended: true,
      rubric_json: '',
      holdout_pct: '0.2',
      edit_budget: '3',
      max_new_meta: '2',
      max_edits_meta: '3',
      min_citations: '5',
    },
  },
};

export function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Build the project-creation request body (verbatim original logic + sample_answer_column). */
export function buildProjectBody(fields) {
  return {
    title: fields.title || 'untitled',
    system_prompt: fields.system_prompt,
    output_format: fields.output_format,
    golden_column: fields.golden_column || null,
    sample_answer_column: fields.sample_answer_column || null,
    rubric_mode: fields.rubric_mode,
    rubric_column: fields.rubric_column || null,
    open_ended: fields.open_ended ? 1 : 0,
    rubric_json: fields.rubric_json || null,
    holdout_pct: num(fields.holdout_pct, 0.2),
    edit_budget: num(fields.edit_budget, 3),
    max_new_meta: num(fields.max_new_meta, 2),
    max_edits_meta: num(fields.max_edits_meta, 3),
    min_citations: num(fields.min_citations, 5),
  };
}

/** 'exact' | 'per_row' | 'global' from the real engine fields. */
export function gradingOf(form) {
  if (!form.open_ended) return 'exact';
  return form.rubric_mode === 'global' ? 'global' : 'per_row';
}

const PATTERNS = {
  exact: /(golden|answer|label|solution|target|correct|truth)/i,
  rubric: /(rubric|criteria|criterion|checklist|grading)/i,
  sample: /(sample|reference|ideal|gold|answer|solution)/i,
};

export function guessColumn(columns, kind, exclude = []) {
  const pool = columns.filter((c) => c && !exclude.includes(c));
  return pool.find((c) => PATTERNS[kind].test(c)) || '';
}

/** Switch grading mode, setting the real engine fields and auto-picking columns. */
export function applyGradingMode(form, mode, columns = []) {
  const inputs = form.input_columns || [];
  const next = { ...form };
  if (mode === 'exact') {
    next.open_ended = false;
    next.rubric_column = '';
    next.rubric_json = '';
    next.sample_answer_column = '';
    if (!columns.includes(next.golden_column)) next.golden_column = guessColumn(columns, 'exact', inputs);
  } else if (mode === 'per_row') {
    next.open_ended = true;
    next.rubric_mode = 'per_row';
    next.golden_column = '';
    next.rubric_json = '';
    if (!columns.includes(next.rubric_column)) next.rubric_column = guessColumn(columns, 'rubric', inputs) || guessColumn(columns, 'exact', inputs);
  } else {
    next.open_ended = true;
    next.rubric_mode = 'global';
    next.golden_column = '';
    next.rubric_column = '';
  }
  return next;
}

/** Build a sensible prompt template from input column names. */
export function buildPromptTemplate(inputColumns) {
  const cols = (inputColumns || []).filter(Boolean);
  if (cols.length === 0) return 'Answer the question accurately.';
  if (cols.length === 1) return `Answer the question accurately.\nQuestion: {{${cols[0]}}}`;
  return `Answer the question accurately.\n${cols.map((c) => `${c}: {{${c}}}`).join('\n')}`;
}

/** Columns that hold the answer, rubric or sample answer. The student model must never see them. */
export function gradingColumns(form) {
  return [form.golden_column, form.rubric_column, form.sample_answer_column].filter(Boolean);
}

/** {{placeholders}} used in a template. */
export function placeholdersOf(template) {
  const out = [];
  const re = /\{\{\s*([^{}\s]+)\s*\}\}/g;
  let m;
  while ((m = re.exec(template || ''))) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Placeholders the engine fills itself rather than from a CSV column. */
export const RESERVED_PLACEHOLDERS = ['taxonomy'];

/** Suggest a title from a file name ("my-data_v2.csv" -> "my data v2"). */
export function titleFromFileName(name) {
  const base = String(name || '').replace(/\.[^.]+$/, '').replace(/[_\-]+/g, ' ').trim();
  return base;
}

/**
 * Called when CSV text changes. Fills in input column, grading column, template
 * and title only where the user has not already made a valid choice.
 * `touched` = { prompt?: bool } skips rewriting a hand-edited prompt.
 */
export function autoConfigure(form, preview, { fileName = '', touchedPrompt = false } = {}) {
  if (!preview || preview.empty || preview.columns.length === 0) return form;
  const cols = preview.columns;
  let next = { ...form };
  if (fileName && !next.title) next.title = titleFromFileName(fileName);
  let inputs = (next.input_columns || []).filter((c) => cols.includes(c));
  if (inputs.length === 0) {
    const reserved = [guessColumn(cols, 'rubric'), guessColumn(cols, 'exact')].filter(Boolean);
    const first = cols.find((c) => !reserved.includes(c)) || cols[0];
    inputs = [first];
  }
  next.input_columns = inputs;
  next = applyGradingMode(next, gradingOf(next), cols);
  if (!cols.includes(next.rubric_column) && next.open_ended && next.rubric_mode === 'per_row') next.rubric_column = '';
  if (!touchedPrompt) next.system_prompt = buildPromptTemplate(inputs);
  return next;
}

export function jsonProblem(text) {
  if (!String(text || '').trim()) return 'Output format is empty.';
  try { JSON.parse(text); return null; } catch (err) { return `Not valid JSON (${err.message}).`; }
}

/** -> { errors:[{field,message}], warnings:[string] } */
export function validateForm(form, csvPreview) {
  const errors = [];
  const warnings = [];
  const preview = csvPreview || parseCsvPreview('');
  const cols = preview.columns || [];
  if (preview.empty || cols.length === 0) {
    errors.push({ field: 'csv', message: 'Add a CSV file with a header row and your data.' });
  } else {
    if (preview.rowCount === 0) errors.push({ field: 'csv', message: 'The CSV has a header but no data rows.' });
    else if (preview.rowCount < 20) warnings.push(`Only ${preview.rowCount} rows. The holdout is 20% and the rest trains, so aim for 20 or more.`);
    for (const w of preview.warnings || []) if (!/Only \d+ row/.test(w) && !/empty/.test(w)) warnings.push(w);
    warnings.push('Duplicate rows are removed automatically.');
  }

  const mode = gradingOf(form);
  if (cols.length) {
    if (mode === 'exact' && !cols.includes(form.golden_column)) errors.push({ field: 'golden_column', message: 'Pick the column that holds the exact answer.' });
    if (mode === 'per_row' && !cols.includes(form.rubric_column)) errors.push({ field: 'rubric_column', message: 'Pick the column that holds each row\'s rubric.' });
    if (form.sample_answer_column && !cols.includes(form.sample_answer_column)) errors.push({ field: 'sample_answer_column', message: 'That sample answer column is not in your CSV.' });
  }
  if (mode === 'global' && !String(form.rubric_json || '').trim()) errors.push({ field: 'rubric_json', message: 'Write the rubric every answer will be graded against.' });

  if (!String(form.system_prompt || '').trim()) errors.push({ field: 'system_prompt', message: 'The task prompt is empty.' });
  else if (cols.length) {
    const used = placeholdersOf(form.system_prompt);
    const inputsUsed = used.filter((u) => !RESERVED_PLACEHOLDERS.includes(u));
    if (inputsUsed.length === 0) errors.push({ field: 'system_prompt', message: 'Add at least one {{column}} placeholder. Without one, every CSV column (including the answer and rubric) is sent to the model.' });
    const hidden = gradingColumns(form);
    const leaks = inputsUsed.filter((u) => hidden.includes(u));
    if (leaks.length) errors.push({ field: 'system_prompt', message: `{{${leaks.join('}}, {{')}}} holds the answer or rubric; the model would see it. Use a different column.` });
    const unknown = used.filter((p) => !cols.includes(p) && !RESERVED_PLACEHOLDERS.includes(p));
    if (unknown.length) errors.push({ field: 'system_prompt', message: `Prompt uses {{${unknown.join('}}, {{')}}} but your CSV has no such column.` });
  }
  const jp = jsonProblem(form.output_format);
  if (jp) errors.push({ field: 'output_format', message: jp });

  const ranges = [['holdout_pct', 0.05, 0.5, 'Holdout'], ['edit_budget', 1, 20, 'Edit budget'], ['max_new_meta', 0, 20, 'New rules per epoch'], ['max_edits_meta', 0, 20, 'Rule edits per epoch'], ['min_citations', 0, 100, 'Min citations']];
  for (const [f, lo, hi, label] of ranges) {
    const n = Number(form[f]);
    if (!Number.isFinite(n) || n < lo || n > hi) errors.push({ field: f, message: `${label} must be between ${lo} and ${hi}.` });
  }
  return { errors, warnings };
}

export function errorFor(result, field) {
  return result.errors.find((e) => e.field === field)?.message;
}
