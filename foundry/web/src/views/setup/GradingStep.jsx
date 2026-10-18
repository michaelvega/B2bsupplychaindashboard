import React from 'react';
import { Callout, Field } from '../../ui/index.js';
import { applyGradingMode, errorFor, gradingColumns, gradingOf, guessColumn } from './formModel.js';

/**
 * Props:
 *  - form, onFormChange(nextForm)
 *  - columns: string[]            CSV column names (empty until data is loaded)
 *  - problems: validateForm result
 */
const MODES = [
  { key: 'exact', tag: 'Closed answers', title: 'Exact answer column', desc: 'Each row has one correct answer. Best for short labels, multiple choice, numbers.' },
  { key: 'per_row', tag: 'Open-ended', title: 'Rubric per row', desc: 'Each row has its own grading rubric. Best for long, free-form answers.' },
  { key: 'global', tag: 'Open-ended', title: 'One rubric for all rows', desc: 'You write one rubric. Every answer is graded against it.' },
];

function ColumnSelect({ id, value, onChange, columns, placeholder = 'Choose a column', optional }) {
  return (
    <select id={id} className="pf-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{optional ? 'None' : placeholder}</option>
      {columns.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}

export function GradingStep({ form, onFormChange, columns, problems }) {
  const mode = gradingOf(form);
  const set = (patch) => onFormChange({ ...form, ...patch });
  const inputs = form.input_columns || [];

  const hidden = gradingColumns(form);
  function toggleInput(c) {
    if (hidden.includes(c)) return;
    const next = inputs.includes(c) ? inputs.filter((x) => x !== c) : [...inputs, c];
    set({ input_columns: next });
  }
  function pickMode(m) {
    let next = applyGradingMode(form, m, columns);
    if (m !== 'exact' && !next.sample_answer_column) {
      const guess = guessColumn(columns, 'sample', [...inputs, next.rubric_column]);
      if (guess && guess !== next.rubric_column && m === 'global') next = { ...next, sample_answer_column: guess };
    }
    onFormChange(next);
  }

  return (
    <div className="pf-stack">
      <fieldset className="pf-fieldset">
        <legend className="pf-legend">Input column(s)</legend>
        <p className="pf-help">What the model reads. Each chosen column is inserted into the prompt as a {'{{column}}'} placeholder.</p>
        {columns.length === 0 ? <p className="pf-help">Load a CSV first.</p> : (
          <div className="sw-chips">
            {columns.map((c) => (
              <button key={c} type="button" className="sw-col" aria-pressed={inputs.includes(c)} disabled={hidden.includes(c)} onClick={() => toggleInput(c)} title={hidden.includes(c) ? `${c} holds the answer or rubric, so the model cannot read it` : c}>{c}</button>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="pf-fieldset">
        <legend className="pf-legend">How should answers be graded?</legend>
        <div className="sw-grading" role="radiogroup">
          {MODES.map((m) => (
            <label key={m.key} className={`pf-card-choice${mode === m.key ? ' is-selected' : ''}`}>
              <input type="radio" name="sw-grading" value={m.key} checked={mode === m.key} onChange={() => pickMode(m.key)} />
              <span className="pf-card-tag">{m.tag}</span>
              <span className="pf-card-title">{m.title}</span>
              <span className="pf-card-desc">{m.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {mode === 'exact' ? (
        <Field label="Exact answer column" htmlFor="sw-golden" help="The column with the correct answer for each row." error={errorFor(problems, 'golden_column')}>
          <ColumnSelect id="sw-golden" value={form.golden_column} onChange={(v) => set({ golden_column: v })} columns={columns} />
        </Field>
      ) : null}

      {mode === 'per_row' ? (
        <>
          <Field label="Rubric column" htmlFor="sw-rubric-col" help="The column with the grading rubric for each row." error={errorFor(problems, 'rubric_column')}>
            <ColumnSelect id="sw-rubric-col" value={form.rubric_column} onChange={(v) => set({ rubric_column: v })} columns={columns} />
          </Field>
        </>
      ) : null}

      {mode === 'global' ? (
        <Field label="Global rubric" htmlFor="sw-rubric-json" help="List what a good answer must contain. Short bullet points work. One per line." error={errorFor(problems, 'rubric_json')}>
          <textarea id="sw-rubric-json" className="pf-textarea" rows={6} value={form.rubric_json} onChange={(e) => set({ rubric_json: e.target.value })} placeholder={'- States the final answer clearly\n- Shows the key reasoning step\n- Cites no invented facts'} aria-invalid={!!errorFor(problems, 'rubric_json') || undefined} />
        </Field>
      ) : null}

      {mode !== 'exact' ? (
        <Field label="Sample answer column (optional)" htmlFor="sw-sample" help="A model answer per row. It is shown to the rule rewriter as an example of a good answer. It does not replace the rubric." error={errorFor(problems, 'sample_answer_column')}>
          <ColumnSelect id="sw-sample" value={form.sample_answer_column} onChange={(v) => set({ sample_answer_column: v })} columns={columns} optional />
        </Field>
      ) : null}

      {mode !== 'exact' ? (
        <Callout tone="info" title="Only have sample answers?">
          Sample answers alone cannot grade a run. The grader needs a rubric. If your answers are short (labels, numbers, choices), use Exact answer column. Otherwise write a short global rubric above and keep your sample answers in the optional column.
        </Callout>
      ) : null}
    </div>
  );
}
export default GradingStep;
