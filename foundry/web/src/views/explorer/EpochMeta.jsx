import React, { useState } from 'react';
import '../../styles/explorer.css';
import Truncated from './Truncated.jsx';
import EditBadge from './EditBadge.jsx';
import { Button } from '../../ui/index.js';

const f2 = (v) => { const x = Number(v); return (Number.isFinite(x) ? x : 0).toFixed(2); };

/**
 * Epoch + meta-change carousel.
 * Props: { status: {epochs:[{epoch,status,gate_passed,metrics,meta_reasoning,meta_edits:[{op,rule_id,rule_ids,text}]}]} | null }
 */
export function EpochMeta({ status }) {
  const epochs = status?.epochs || [];
  const [idx, setIdx] = useState(0);
  if (epochs.length === 0) return <p className="pf-help">Start a run to inspect per-epoch meta changes.</p>;
  const i = Math.min(idx, epochs.length - 1);
  const ep = epochs[i];
  const edits = ep?.meta_edits || [];
  const m = ep?.metrics || {};
  return (
    <div>
      <div className="ex-bar">
        <Button size="sm" icon="arrow-left" aria-label="Previous epoch" onClick={() => setIdx((i - 1 + epochs.length) % epochs.length)} />
        <span className="ex-pos" aria-live="polite">epoch {ep.epoch} ({i + 1}/{epochs.length})</span>
        <Button size="sm" icon="arrow-right" aria-label="Next epoch" onClick={() => setIdx((i + 1) % epochs.length)} />
        <span className={'ex-badge ' + (ep.gate_passed ? 'ex-badge-ok' : 'ex-badge-fail')}>{ep.status}</span>
      </div>
      <div className="ex-box">
        <div className="ex-meta" style={{ marginTop: 0 }}>
          acc {f2(m.accuracy)} · contAcc {f2(m.continuousAccuracy)} · repairs {m.repairs ?? 0} · regressions {m.regressions ?? 0}
        </div>
        <div className="ex-item">
          <b>Meta reasoning</b>
          <div className="ex-text"><Truncated text={ep.meta_reasoning} limit={400} /></div>
        </div>
        <div className="ex-item">
          <b>Meta edits</b>
          {edits.length === 0 ? <div className="ex-text">(none)</div> : edits.map((e, k) => (
            <div key={k} className="ex-text"><EditBadge edit={e} /> <Truncated text={e.text} limit={160} empty="" /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default EpochMeta;
