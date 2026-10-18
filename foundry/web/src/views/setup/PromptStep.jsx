import React, { useRef } from 'react';
import { Accordion, Button, Field } from '../../ui/index.js';
import { ADVANCED_DEFAULTS, buildPromptTemplate, errorFor, gradingColumns, jsonProblem } from './formModel.js';

/**
 * Props:
 *  - form, onFormChange(nextForm)
 *  - columns: string[]
 *  - problems: validateForm result
 *  - onPromptEdited(): called when the user hand-edits the prompt (stops auto-rebuilding it)
 */
const ADV = [
  { f: 'holdout_pct', label: 'Holdout share', help: 'Fraction of rows kept aside to test each new rule set. Default 0.2.', step: '0.05' },
  { f: 'edit_budget', label: 'Edit budget', help: 'How many rule changes the engine may try per epoch. Default 3.', step: '1' },
  { f: 'max_new_meta', label: 'New rules per epoch', help: 'Most new rules the meta agent can propose each epoch. Default 2.', step: '1' },
  { f: 'max_edits_meta', label: 'Rule edits per epoch', help: 'Most existing rules it can edit or combine each epoch. Default 3.', step: '1' },
  { f: 'min_citations', label: 'Minimum citations', help: 'How many answers must cite a rule before it counts as used. Default 5.', step: '1' },
];

export function PromptStep({ form, onFormChange, columns, problems, onPromptEdited }) {
  const ref = useRef(null);
  const set = (patch) => onFormChange({ ...form, ...patch });
  const jp = form.output_format ? jsonProblem(form.output_format) : null;
  const dirtyAdv = ADV.some((a) => String(form[a.f]) !== ADVANCED_DEFAULTS[a.f]);

  function insert(col) {
    const el = ref.current;
    const token = `{{${col}}}`;
    const v = form.system_prompt || '';
    const s = el ? el.selectionStart : v.length;
    const e = el ? el.selectionEnd : v.length;
    set({ system_prompt: v.slice(0, s) + token + v.slice(e) });
    onPromptEdited?.();
    requestAnimationFrame(() => { if (el) { el.focus(); const p = s + token.length; el.setSelectionRange(p, p); } });
  }

  return (
    <div className="pf-stack">
      <Field label="Task prompt" htmlFor="sw-prompt" help="What you tell the model for every row. Click a column to insert it where the cursor is." error={errorFor(problems, 'system_prompt')}>
        <textarea id="sw-prompt" ref={ref} className="pf-textarea sw-textarea-mono" rows={6} value={form.system_prompt} spellCheck={false}
          onChange={(e) => { set({ system_prompt: e.target.value }); onPromptEdited?.(); }}
          aria-invalid={!!errorFor(problems, 'system_prompt') || undefined} aria-describedby="sw-prompt-help" />
      </Field>
      <div className="sw-chips" aria-label="Insert a column">
        {columns.map((c) => <button key={c} type="button" className="sw-col" disabled={gradingColumns(form).includes(c)} onClick={() => insert(c)} title={gradingColumns(form).includes(c) ? `${c} holds the answer or rubric, so the model cannot read it` : `Insert {{${c}}}`}>{`{{${c}}}`}</button>)}
        <Button size="sm" variant="ghost" onClick={() => { set({ system_prompt: buildPromptTemplate(form.input_columns) }); onPromptEdited?.(true); }}>Reset to template</Button>
      </div>

      <Field label="Output format (JSON)" htmlFor="sw-output" help='The shape of the model reply, e.g. {"answer": "..."}.' error={errorFor(problems, 'output_format') || jp || undefined}>
        <textarea id="sw-output" className="pf-textarea sw-textarea-mono" rows={3} value={form.output_format} spellCheck={false}
          onChange={(e) => set({ output_format: e.target.value })} aria-invalid={!!jp || undefined} />
      </Field>
      {!jp && form.output_format ? <p className="pf-help" style={{ marginTop: -8 }}>Valid JSON.</p> : null}

      <Field label="Project name" htmlFor="sw-title" help="Only for you. Suggested from your file name.">
        <input id="sw-title" className="pf-input" value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="My dataset" />
      </Field>

      <Accordion title={dirtyAdv ? 'Advanced settings (changed)' : 'Advanced settings (defaults are fine)'}>
        <div className="pf-grid pf-grid-2">
          {ADV.map((a) => (
            <Field key={a.f} label={a.label} htmlFor={`sw-${a.f}`} help={a.help} error={errorFor(problems, a.f)}>
              <input id={`sw-${a.f}`} type="number" step={a.step} className="pf-input" value={form[a.f]} onChange={(e) => set({ [a.f]: e.target.value })} aria-invalid={!!errorFor(problems, a.f) || undefined} />
            </Field>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={() => set({ ...ADVANCED_DEFAULTS })}>Restore defaults</Button>
      </Accordion>
    </div>
  );
}
export default PromptStep;
