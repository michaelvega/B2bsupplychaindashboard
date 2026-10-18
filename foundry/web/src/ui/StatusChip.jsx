import React from 'react';

/** tone: live|ok|warn|error|idle. pulse defaults true for 'live'. */
export function StatusChip({ tone = 'idle', pulse, children, className = '', ...rest }) {
  const p = pulse ?? tone === 'live';
  return (
    <span className={`pf-chip pf-chip-${tone} ${className}`.trim()} {...rest}>
      <span className={`pf-dot${p ? ' pf-dot-pulse' : ''}`} aria-hidden="true" />
      {children}
    </span>
  );
}
export default StatusChip;
