import React, { useState } from 'react';
import '../styles/deliverable.css';
import { Panel, Button, CopyButton, Callout, Stat } from '../ui/index.js';
import { buildSnippet, downloadText } from '../lib/snippet.js';
import { bestMetric } from '../lib/runState.js';

const pct = (v) => `${(v * 100).toFixed(0)}%`;

/**
 * "Your snippet" hero panel. Pure display.
 * Props: { status: {taxonomy:[{rule_id,text}], epochs:[...]} | null, isRunning?: boolean, openEnded?: boolean, onJumpToRun?: ()=>void }
 * See Deliverable.PROPS.md.
 */
export function Deliverable({ status, isRunning = false, openEnded = false, onJumpToRun }) {
  const [cite, setCite] = useState(false);
  const taxonomy = status?.taxonomy || [];
  const epochs = status?.epochs || [];
  const snippet = buildSnippet(taxonomy, { includeCitation: cite });
  const best = bestMetric(epochs, openEnded);
  const name = openEnded ? 'continuousAccuracy' : 'accuracy';
  const first = Number(epochs[0]?.metrics?.[name]);
  const showDelta = best && Number.isFinite(first) && epochs.length > 1;
  const accepted = epochs.filter((e) => e.gate_passed).length;

  return (
    <Panel title="Your snippet">
      {!snippet ? (
        <div className="dv-empty">
          <p>No accepted rules yet.</p>
          <p className="pf-help">Rules appear here once an epoch passes the gate.</p>
          {onJumpToRun && <Button size="sm" onClick={onJumpToRun}>Go to run</Button>}
        </div>
      ) : (
        <div className="pf-stack">
          {isRunning && <Callout tone="warn" title="Still learning">Rules may still change. Wait for the run to finish before shipping.</Callout>}
          <pre className="pf-code dv-code" tabIndex={0} aria-label="Snippet preview">{snippet}</pre>
          <label className="dv-toggle">
            <input type="checkbox" checked={cite} onChange={(e) => setCite(e.target.checked)} />
            Append the citation instruction line
          </label>
          <div className="pf-row">
            <CopyButton text={snippet} label="Copy snippet" variant="primary" />
            <Button icon="download" onClick={() => downloadText('procept-rules.txt', snippet)}>Download .txt</Button>
          </div>
          <div className="dv-stats">
            <Stat label="Rules" value={String(taxonomy.length)} />
            <Stat label="Epochs accepted" value={`${accepted}/${epochs.length}`} />
            {best && <Stat label={`Best ${openEnded ? 'score' : 'accuracy'} (epoch ${best.epoch})`} value={pct(best.value)} />}
            {showDelta && <Stat label="Epoch 1 to best" value={`${pct(first)} to ${pct(best.value)}`} delta={`${best.value - first >= 0 ? '+' : ''}${((best.value - first) * 100).toFixed(0)} pts`} />}
          </div>
          <ol className="dv-steps">
            <li><span><b>Paste it</b> into your system prompt, after your own instructions.</span></li>
            <li><span><b>Keep the rule numbers.</b> Don't reorder or renumber.</span></li>
            <li><span><b>Re-run to improve.</b> More epochs, more rules. No GPUs. You own the text.</span></li>
          </ol>
        </div>
      )}
    </Panel>
  );
}
export default Deliverable;
