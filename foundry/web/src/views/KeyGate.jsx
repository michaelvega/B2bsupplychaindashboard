import React, { useEffect, useState } from 'react';
import { Modal, Button, Field, Callout, Accordion, StatusChip } from '../ui/index.js';
import { testOpenRouterKey } from '../api.js';
import '../styles/onboarding.css';

/**
 * OpenRouter key modal.
 * Props:
 *  - open: boolean
 *  - apiKey: string (currently saved key, '' if none)
 *  - onSaveKey(key: string): persist the key (parent calls setApiKey). Called on Save.
 *  - onClose(): dismiss (Esc, backdrop, Close, "Browse first")
 *  - model: string; onModelChange(model: string): called on Save-with-model-change (live on blur)
 *  - testKey?: (key) => Promise<{ok, label?, usage?, limit?, error?}>  defaults to api.testOpenRouterKey
 *  - dismissible?: boolean (default true)
 */
export function KeyGate({ open, apiKey = '', onSaveKey, onClose, model = '', onModelChange, testKey = testOpenRouterKey, dismissible = true }) {
  const [draft, setDraft] = useState(apiKey);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [modelDraft, setModelDraft] = useState(model);

  useEffect(() => { if (open) { setDraft(apiKey); setModelDraft(model); setResult(null); setShow(false); } }, [open, apiKey, model]);

  const trimmed = draft.trim();
  const saved = !!apiKey && trimmed === apiKey;

  async function runTest() {
    setTesting(true); setResult(null);
    try { setResult(await testKey(trimmed)); } catch { setResult({ ok: false, error: 'Could not test the key.' }); }
    setTesting(false);
  }
  function save() {
    onSaveKey?.(trimmed);
    if (modelDraft.trim() && modelDraft.trim() !== model) onModelChange?.(modelDraft.trim());
    onClose?.();
  }

  return (
    <Modal open={open} onClose={onClose} dismissible={dismissible} title="OpenRouter key"
      footer={
        <>
          {dismissible ? <Button variant="ghost" onClick={onClose}>{apiKey ? 'Close' : 'Browse first'}</Button> : null}
          <Button variant="primary" disabled={!trimmed || saved && modelDraft.trim() === model} onClick={save}>Save key</Button>
        </>
      }>
      <div className="pf-stack">
        <div>
          <div className="pf-kicker">KEY / OPENROUTER</div>
          <p className="pf-sub" style={{ marginTop: 6 }}>Nothing runs without a key. The engine calls models through OpenRouter, using your credits.</p>
        </div>
        <Field label="API key" htmlFor="pfo-key" help="Starts with sk-or-. Create one at openrouter.ai/keys." error={result && !result.ok ? result.error : undefined}>
          <div className="pfo-key-row">
            <input id="pfo-key" className="pf-input" type={show ? 'text' : 'password'} value={draft} autoComplete="off" spellCheck={false}
              placeholder="sk-or-v1-..." onChange={(e) => { setDraft(e.target.value); setResult(null); }}
              aria-invalid={result && !result.ok ? 'true' : undefined} />
            <Button size="sm" onClick={() => setShow((v) => !v)} aria-pressed={show}>{show ? 'Hide' : 'Show'}</Button>
          </div>
        </Field>
        <div className="pf-row">
          <Button icon="key" loading={testing} disabled={!trimmed} onClick={runTest}>Test key</Button>
          <a className="pf-help" href="https://openrouter.ai/keys" target="_blank" rel="noreferrer noopener">Get a key at openrouter.ai/keys</a>
        </div>
        <div aria-live="polite">
          {result?.ok ? (
            <Callout tone="ok" title="Key works.">
              {result.label ? `Label: ${result.label}. ` : ''}
              {typeof result.usage === 'number' ? `Used so far: $${result.usage.toFixed(2)}. ` : ''}
              {result.limit != null ? `Limit: $${Number(result.limit).toFixed(2)}.` : 'No spend limit set on this key.'}
            </Callout>
          ) : null}
        </div>
        <Callout tone="info" title="Keep it safe">
          <ul className="pfo-key-list">
            <li>Use a key with a small credit limit.</li>
            <li>It is stored only in this browser (localStorage).</li>
            <li>Calls go from your browser straight to OpenRouter. We have no server.</li>
          </ul>
        </Callout>
        <Accordion title="Advanced: model">
          <Field label="Model id" htmlFor="pfo-model" help="Any OpenRouter model id, e.g. provider/model-name. Leave as is unless you know you need another.">
            <input id="pfo-model" className="pf-input" value={modelDraft} spellCheck={false} onChange={(e) => setModelDraft(e.target.value)} />
          </Field>
        </Accordion>
        {apiKey ? <StatusChip tone="ok">Key saved in this browser</StatusChip> : <StatusChip tone="warn">No key saved</StatusChip>}
      </div>
    </Modal>
  );
}
export default KeyGate;
