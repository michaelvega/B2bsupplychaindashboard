import React from 'react';
import '../../styles/run.css';

/**
 * SVG line chart, axis 0-100%.
 * Props:
 *  - epochs: [{epoch, status, gate_passed, metrics}]  (status.epochs)
 *  - openEnded: boolean  (metric = continuousAccuracy when true, else accuracy)
 */
const W = 640, H = 240, L = 44, R = 56, T = 16, B = 32;

export function MetricChart({ epochs = [], openEnded = false }) {
  const name = openEnded ? 'continuousAccuracy' : 'accuracy';
  const pts = (epochs || []).map((e) => ({
    epoch: e.epoch,
    value: Number(e.metrics?.[name] ?? 0),
    ok: e.status === 'accepted' || (e.status !== 'rejected' && e.gate_passed === true),
  }));
  if (pts.length === 0) {
    return <p className="pf-help">No epochs yet. The metric line appears once the first epoch finishes.</p>;
  }
  const x = (i) => (pts.length > 1 ? L + (i * (W - L - R)) / (pts.length - 1) : (L + W - R) / 2);
  const y = (v) => T + (1 - Math.min(1, Math.max(0, v))) * (H - T - B);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const prev = pts.length > 1 ? pts[pts.length - 2] : null;
  const delta = prev ? (last.value - prev.value) * 100 : null;
  const pct = (v) => `${(v * 100).toFixed(0)}%`;
  const desc = pts.map((p) => `epoch ${p.epoch} ${pct(p.value)} ${p.ok ? 'accepted' : 'rejected'}`).join(', ');
  return (
    <div>
      <div className="pf-row" style={{ alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 300 }}>{(last.value * 100).toFixed(1)}%</span>
        {delta !== null && (
          <span className="pf-mono" style={{ fontSize: 12, color: delta >= 0 ? 'var(--term-400)' : 'var(--text-2)' }}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts vs epoch {prev.epoch}
          </span>
        )}
        <span className="pf-help">{openEnded ? 'rubric score (continuous accuracy)' : 'accuracy'}</span>
      </div>
      <div className="pf-run-chart-scroll" tabIndex={0} role="group" aria-label="Metric chart, scrolls sideways on small screens">
      <svg className="pf-run-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${name} by epoch: ${desc}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line className="grid" x1={L} x2={W - R} y1={y(g)} y2={y(g)} />
            <text x={L - 8} y={y(g) + 3} textAnchor="end">{pct(g)}</text>
          </g>
        ))}
        <line className="axis" x1={L} x2={L} y1={T} y2={H - B} />
        <line className="axis" x1={L} x2={W - R} y1={H - B} y2={H - B} />
        {pts.map((p, i) => (pts.length <= 10 || i % Math.ceil(pts.length / 10) === 0 || i === pts.length - 1) && (
          <text key={p.epoch} x={x(i)} y={H - B + 16} textAnchor="middle">{p.epoch}</text>
        ))}
        <text x={(L + W - R) / 2} y={H - 2} textAnchor="middle">epoch</text>
        {pts.length > 1 && <path className="line" d={d} />}
        {pts.map((p, i) => (
          <circle key={p.epoch} className={p.ok ? 'pt-ok' : 'pt-bad'} cx={x(i)} cy={y(p.value)} r="4.5">
            <title>{`Epoch ${p.epoch}: ${pct(p.value)} (${p.ok ? 'accepted' : 'rejected'})`}</title>
          </circle>
        ))}
        <text className="endlab" x={x(pts.length - 1) + 10} y={y(last.value) + 3}>{pct(last.value)}</text>
      </svg>
      </div>
      <div className="pf-run-legend">
        <span><i style={{ background: 'var(--term-400)' }} />accepted epoch</span>
        <span><i style={{ border: '1.5px solid var(--text-2)' }} />rejected epoch</span>
      </div>
    </div>
  );
}
export default MetricChart;
