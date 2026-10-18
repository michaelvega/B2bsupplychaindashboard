import { EMPTY_FORM } from '../views/setup/formModel.js';

/** Stringify a project field for the form (null -> fallback). */
function s(v, fallback = '') {
  if (v == null) return fallback;
  return typeof v === 'string' ? v : JSON.stringify(v);
}

/** Map a mapped project (api.mapProject shape) to the wizard form shape. input_columns stays empty so the saved prompt is never rewritten. */
export function projectToForm(p) {
  if (!p) return { ...EMPTY_FORM };
  return {
    ...EMPTY_FORM,
    title: s(p.title),
    system_prompt: s(p.system_prompt, EMPTY_FORM.system_prompt),
    output_format: s(p.output_format, EMPTY_FORM.output_format),
    golden_column: s(p.golden_column),
    sample_answer_column: s(p.sample_answer_column),
    rubric_mode: p.rubric_mode === 'global' ? 'global' : 'per_row',
    rubric_column: s(p.rubric_column),
    open_ended: !!p.open_ended,
    rubric_json: s(p.rubric_json),
    holdout_pct: s(p.holdout_pct, EMPTY_FORM.holdout_pct),
    edit_budget: s(p.edit_budget, EMPTY_FORM.edit_budget),
    max_new_meta: s(p.max_new_meta, EMPTY_FORM.max_new_meta),
    max_edits_meta: s(p.max_edits_meta, EMPTY_FORM.max_edits_meta),
    min_citations: s(p.min_citations, EMPTY_FORM.min_citations),
    input_columns: [],
  };
}

function cell(v) {
  const t = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

/** Rebuild CSV text from stored rows so the wizard can validate an existing project. */
export function rowsToCsv(rows, columns) {
  const list = Array.isArray(rows) ? rows : [];
  const payloads = list.map((r) => {
    let p = r?.payload;
    if (typeof p === 'string') { try { p = JSON.parse(p); } catch { p = {}; } }
    return p && typeof p === 'object' ? p : {};
  });
  let cols = Array.isArray(columns) ? columns.filter(Boolean) : [];
  if (cols.length === 0 && payloads[0]) cols = Object.keys(payloads[0]);
  if (cols.length === 0) return '';
  return [cols.map(cell).join(','), ...payloads.map((p) => cols.map((c) => cell(p[c])).join(','))].join('\n');
}
