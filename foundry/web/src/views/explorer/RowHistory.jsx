import React, { useState } from 'react';
import '../../styles/explorer.css';
import Truncated from './Truncated.jsx';
import { Button } from '../../ui/index.js';

/**
 * Per-row history carousel.
 * Props: { status: {rows:[{id,payload}], rowHistory:{[rowId]:[{epoch,correct,continuous_correct,score,total,cited_rules,wrong_count_before,answer,diagnosis,dock}]}} | null }
 */
export function RowHistory({ status }) {
  const rows = status?.rows || [];
  const [idx, setIdx] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(9999);
  const [jump, setJump] = useState('');

  if (rows.length === 0) return <p className="pf-help">Upload a CSV to inspect per-row history.</p>;

  const i = Math.min(idx, rows.length - 1);
  const row = rows[i];
  const hist = (status?.rowHistory?.[row.id] || []).filter((h) => h.epoch >= from && h.epoch <= to);
  const n = (v, d) => { const x = parseInt(v, 10); return Number.isFinite(x) ? x : d; };
  const go = (e) => {
    e.preventDefault();
    const k = n(jump, 0);
    if (k >= 1 && k <= rows.length) setIdx(k - 1);
  };
  const firstVal = row?.payload?.[Object.keys(row?.payload || {})[0]];

  return (
    <div>
      <div className="ex-bar">
        <Button size="sm" icon="arrow-left" aria-label="Previous row" onClick={() => setIdx((i - 1 + rows.length) % rows.length)} />
        <span className="ex-pos" aria-live="polite">row {i + 1}/{rows.length}</span>
        <Button size="sm" icon="arrow-right" aria-label="Next row" onClick={() => setIdx((i + 1) % rows.length)} />
        <form className="ex-bar" style={{ margin: 0 }} onSubmit={go}>
          <label htmlFor="ex-jump">go to</label>
          <input id="ex-jump" className="pf-input" type="number" min="1" max={rows.length} value={jump} placeholder="#" onChange={(e) => setJump(e.target.value)} />
          <Button size="sm" type="submit">Jump</Button>
        </form>
        <label htmlFor="ex-from">from epoch</label>
        <input id="ex-from" className="pf-input" inputMode="numeric" value={from} onChange={(e) => setFrom(n(e.target.value, 1))} />
        <label htmlFor="ex-to">to epoch</label>
        <input id="ex-to" className="pf-input" inputMode="numeric" value={to === 9999 ? '' : to} placeholder="∞" onChange={(e) => setTo(n(e.target.value, 9999))} />
      </div>
      <div className="ex-box">
        <div className="ex-text" style={{ marginTop: 0 }}><Truncated text={firstVal} limit={300} empty="(empty row)" /></div>
        {hist.length === 0 ? (
          <p className="pf-help" style={{ marginTop: 12 }}>No history in this epoch range.</p>
        ) : hist.map((h) => {
          const ok = h.correct != null ? h.correct : h.continuous_correct;
          return (
            <div key={h.epoch} className="ex-item">
              <span className={'ex-badge ' + (ok ? 'ex-badge-ok' : 'ex-badge-fail')}>epoch {h.epoch}</span>
              <div className="ex-meta">score {h.score}/{h.total} · cited [{(h.cited_rules || []).join(',')}] · wrong_before {h.wrong_count_before}</div>
              <div className="ex-text"><b>answer</b> <Truncated text={h.answer} /></div>
              {h.diagnosis && <div className="ex-text"><b>diagnosis</b> <Truncated text={h.diagnosis} /></div>}
              {Array.isArray(h.dock) && h.dock.length > 0 && (
                <div className="ex-text"><b>dock</b> {h.dock.map((d) => `${d.criterion} -${d.points}`).join(', ')}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default RowHistory;
