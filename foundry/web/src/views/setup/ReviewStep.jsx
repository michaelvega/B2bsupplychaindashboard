import React from 'react';
import { Button, Callout, Field, Panel, Stat } from '../../ui/index.js';
import { estimateRun } from '../../lib/estimate.js';
import { gradingOf, num } from './formModel.js';

/**
 * Props:
 *  - form, csvPreview, problems (validateForm result)
 *  - keyReady: boolean, onOpenKeyGate()
 *  - busy: string, error: string
 *  - projectExists: boolean, onCreateOrUpdate()   create/refresh project + upload CSV
 *  - numEpochs: string|number, onNumEpochs(n: number)
 *  - onStart(), canStart: boolean, startDisabledReason: string
 */
const GRADING_LABEL = { exact: 'Exact answer column', per_row: 'Rubric per row', global: 'One global rubric' };

export function ReviewStep({ form, csvPreview, problems, keyReady, onOpenKeyGate, busy, error, projectExists, onCreateOrUpdate, numEpochs, onNumEpochs, onStart, canStart, startDisabledReason }) {
  const mode = gradingOf(form);
  const epochs = Math.max(1, Math.floor(num(numEpochs, 2)));
  const est = estimateRun({ rowCount: csvPreview.rowCount, holdoutPct: num(form.holdout_pct, 0.2), openEnded: !!form.open_ended, epochs });
  const gradeCol = mode === 'exact' ? form.golden_column : mode === 'per_row' ? form.rubric_column : 'your rubric text';

  let reason = '';
  if (!keyReady) reason = 'Add your OpenRouter key first.';
  else if (problems.errors.length) reason = problems.errors[0].message;
  else if (!projectExists) reason = 'Save the project first.';
  else if (!canStart) reason = startDisabledReason || 'Not ready yet.';
  const disabled = !!reason || !!busy;

  return (
    <div className="pf-stack">
      <Panel title="Summary">
        <dl className="sw-summary">
          <div><dt>Project</dt><dd>{form.title || 'untitled'}</dd></div>
          <div><dt>Data</dt><dd>{csvPreview.rowCount} rows, {csvPreview.columns.length} columns</dd></div>
          <div><dt>Inputs</dt><dd>{(form.input_columns || []).join(', ') || 'from prompt placeholders'}</dd></div>
          <div><dt>Grading</dt><dd>{GRADING_LABEL[mode]}{gradeCol ? ` (${gradeCol})` : ''}{mode !== 'exact' && form.sample_answer_column ? `, sample answers: ${form.sample_answer_column}` : ''}</dd></div>
          <div><dt>Prompt</dt><dd><code className="pf-mono">{(form.system_prompt || '').split('\n')[0].slice(0, 90)}</code></dd></div>
        </dl>
      </Panel>

      <Panel title="Rough estimate">
        <div className="sw-stats">
          <Stat label="Train rows / epoch" value={est.trainRows} />
          <Stat label="Holdout rows" value={est.holdoutRows} />
          <Stat label="Model calls" value={`~${est.approxCalls}`} />
          <Stat label="Time" value={`~${est.approxMinutes} min`} />
        </div>
        <p className="pf-help">This is an estimate from row counts only. Real cost depends on your model and answer length. Use a limited-credit key.</p>
      </Panel>

      <Field label="Epochs" htmlFor="sw-epochs" help={epochs < 3 ? 'Each epoch is one learn-and-test round. 2 is a quick demo. Try 3 to 5 for real use.' : 'Each epoch is one learn-and-test round.'}>
        <div className="pf-count" id="sw-epochs" role="group" aria-label="Number of epochs">
          <button type="button" aria-label="Fewer epochs" disabled={epochs <= 1} onClick={() => onNumEpochs(epochs - 1)}>-</button>
          <output aria-live="polite">{epochs}</output>
          <button type="button" aria-label="More epochs" disabled={epochs >= 20} onClick={() => onNumEpochs(epochs + 1)}>+</button>
        </div>
      </Field>

      {error ? <Callout tone="error" title="Something went wrong">{error}</Callout> : null}
      {!keyReady ? <Callout tone="warn" title="Key needed" actions={<Button size="sm" onClick={onOpenKeyGate}>Add key</Button>}>Runs call OpenRouter straight from this browser.</Callout> : null}

      <div className="sw-start">
        <div className="pf-row">
          <Button icon="file" loading={!!busy && !projectExists} disabled={!!busy || problems.errors.length > 0} onClick={onCreateOrUpdate}>{projectExists ? 'Update project' : 'Save project'}</Button>
          <Button variant="primary" filled size="lg" icon="play" disabled={disabled} onClick={onStart} aria-describedby="sw-start-reason">Start {epochs} epoch{epochs === 1 ? '' : 's'}</Button>
        </div>
        <p id="sw-start-reason" className="pf-help" aria-live="polite">{busy || reason || 'Ready. Keep this tab open while it runs.'}</p>
      </div>
    </div>
  );
}
export default ReviewStep;
