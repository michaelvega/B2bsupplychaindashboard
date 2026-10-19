import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Callout, Panel, SectionHeading } from '../ui/index.js';
import { parseCsvPreview } from '../lib/csvPreview.js';
import '../styles/setup.css';
import PresetCards from './setup/PresetCards.jsx';
import DataStep from './setup/DataStep.jsx';
import GradingStep from './setup/GradingStep.jsx';
import PromptStep from './setup/PromptStep.jsx';
import ReviewStep from './setup/ReviewStep.jsx';
import { autoConfigure, buildPromptTemplate, validateForm } from './setup/formModel.js';

/**
 * Setup wizard. See SetupWizard.PROPS.md for the full contract.
 * Props: form, onFormChange(nextForm), csvText, onCsvChange(text), keyReady, onOpenKeyGate,
 * busy, error, projectExists, onPreset(key), onCreateOrUpdate, numEpochs, onNumEpochs(n),
 * onStart, canStart, startDisabledReason, step?, onStepChange?
 */
const STEPS = [
  { key: 'start', label: 'Start' },
  { key: 'data', label: 'Your data' },
  { key: 'prompt', label: 'Task prompt' },
  { key: 'review', label: 'Review & run' },
];

export function SetupWizard({ form, onFormChange, csvText, onCsvChange, keyReady, onOpenKeyGate, busy = '', error = '', projectExists = false, onPreset, onCreateOrUpdate, numEpochs, onNumEpochs, onStart, canStart = false, startDisabledReason = '', step: stepProp, onStepChange }) {
  const [inner, setInner] = useState('start');
  const step = stepProp ?? inner;
  const go = (s) => { if (stepProp === undefined) setInner(s); onStepChange?.(s); };
  const [fileName, setFileName] = useState('');
  const promptTouched = useRef(!!projectExists); // saved projects keep their prompt until the user resets it

  const csvPreview = useMemo(() => parseCsvPreview(csvText || ''), [csvText]);
  const problems = useMemo(() => validateForm(form, csvPreview), [form, csvPreview]);
  const columns = csvPreview.columns.filter(Boolean);
  const idx = STEPS.findIndex((s) => s.key === step);

  // Keep the auto-built prompt in sync with chosen input columns until the user edits it.
  useEffect(() => {
    if (promptTouched.current) return;
    const t = buildPromptTemplate(form.input_columns);
    if ((form.input_columns || []).length && form.system_prompt !== t) onFormChange({ ...form, system_prompt: t });
  }, [form.input_columns]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCsv(text, name) {
    if (name !== undefined) setFileName(name);
    onCsvChange(text, name);
    const next = autoConfigure(form, parseCsvPreview(text || ''), { fileName: name || '', touchedPrompt: promptTouched.current });
    if (next !== form) onFormChange(next);
  }
  async function handlePreset(key) {
    const ok = await onPreset(key);
    if (ok !== false) { promptTouched.current = true; go('review'); }
  }
  useEffect(() => { if (!csvText && !projectExists) promptTouched.current = false; }, [csvText, projectExists]);
  const onPromptEdited = (reset) => { promptTouched.current = !reset; };

  const dataBlocked = problems.errors.some((e) => ['csv', 'golden_column', 'rubric_column', 'rubric_json', 'sample_answer_column'].includes(e.field));
  const promptBlocked = problems.errors.some((e) => ['system_prompt', 'output_format', 'holdout_pct', 'edit_budget', 'max_new_meta', 'max_edits_meta', 'min_citations'].includes(e.field));

  const titles = {
    start: <>Pick a <em>starting</em> point</>,
    data: <>Bring your <em>data</em></>,
    prompt: <>Write the <em>task</em></>,
    review: <>Review, then <em>run</em></>,
  };
  const subs = {
    start: 'Try a sample in one click, or use your own CSV.',
    data: 'Upload a CSV, say what the model reads, and say how answers are graded.',
    prompt: 'Tell the model what to do for each row. Defaults are sensible.',
    review: 'Check the summary. Nothing runs until you press Start.',
  };

  return (
    <div className="sw-wrap">
      <SectionHeading num="02" label="SETUP" title={titles[step]} sub={subs[step]} />
      <ol className="sw-steps" aria-label="Setup steps">
        {STEPS.map((s, i) => {
          const reachable = i <= idx || (i === 1) || (i === 2 && !dataBlocked) || (i === 3 && !dataBlocked && !promptBlocked);
          const cls = `pf-step${i < idx ? ' is-done' : ''}${i === idx ? ' is-current' : ''}`;
          return (
            <li key={s.key} style={{ display: 'contents' }}>
              <button type="button" className={cls} disabled={!reachable} aria-current={i === idx ? 'step' : undefined} onClick={() => go(s.key)}>
                <span className="pf-step-num">{i + 1}</span><span className="pf-step-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {error && step !== 'review' ? <Callout tone="error">{error}</Callout> : null}

      {step === 'start' ? <PresetCards onPreset={handlePreset} onOwnData={() => go('data')} busy={busy} /> : null}

      {step === 'data' ? (
        <>
          <Panel title="1 / CSV"><DataStep csvText={csvText || ''} onCsvChange={handleCsv} csvPreview={csvPreview} problems={problems} fileName={fileName} /></Panel>
          <Panel title="2 / Columns and grading"><GradingStep form={form} onFormChange={onFormChange} columns={columns} problems={problems} /></Panel>
        </>
      ) : null}

      {step === 'prompt' ? <Panel title="Task prompt"><PromptStep form={form} onFormChange={onFormChange} columns={columns} problems={problems} onPromptEdited={onPromptEdited} /></Panel> : null}

      {step === 'review' ? (
        <ReviewStep form={form} csvPreview={csvPreview} problems={problems} keyReady={keyReady} onOpenKeyGate={onOpenKeyGate} busy={busy} error={error}
          projectExists={projectExists} onCreateOrUpdate={onCreateOrUpdate} numEpochs={numEpochs} onNumEpochs={onNumEpochs} onStart={onStart} canStart={canStart} startDisabledReason={startDisabledReason} />
      ) : null}

      {step !== 'start' ? (
        <div className="sw-nav">
          <button type="button" className="pf-btn" onClick={() => go(STEPS[Math.max(0, idx - 1)].key)}>Back</button>
          {step !== 'review' ? (
            <button type="button" className="pf-btn pf-btn-primary" disabled={(step === 'data' && dataBlocked) || (step === 'prompt' && promptBlocked)} onClick={() => go(STEPS[idx + 1].key)}>Next</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
export default SetupWizard;
