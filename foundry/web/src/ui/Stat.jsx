import React from 'react';

/** delta: number|string|null. deltaTone: 'up'|'down'|undefined (auto from a numeric delta). */
export function Stat({ label, value, delta, deltaTone, className = '' }) {
  const tone = deltaTone || (typeof delta === 'number' ? (delta > 0 ? 'up' : delta < 0 ? 'down' : '') : '');
  return (
    <div className={`pf-stat ${className}`.trim()}>
      <span className="pf-stat-label">{label}</span>
      <span className="pf-stat-value">{value}</span>
      {delta != null && delta !== '' ? <span className={`pf-stat-delta${tone ? ` is-${tone}` : ''}`}>{typeof delta === 'number' && delta > 0 ? '+' : ''}{delta}</span> : null}
    </div>
  );
}
export default Stat;
