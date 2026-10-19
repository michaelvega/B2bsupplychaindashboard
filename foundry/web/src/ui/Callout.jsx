import React from 'react';
import Icon from './Icon.jsx';

const ICONS = { info: 'info', warn: 'alert', error: 'alert', ok: 'check' };

/** tone: info|warn|error|ok. error/warn use role=alert; others role=status. */
export function Callout({ tone = 'info', title, children, actions, className = '' }) {
  return (
    <div className={`pf-callout pf-callout-${tone} ${className}`.trim()} role={tone === 'error' || tone === 'warn' ? 'alert' : 'status'}>
      <Icon name={ICONS[tone] || 'info'} className="pf-callout-icon" />
      <div className="pf-callout-body">
        {title ? <strong className="pf-callout-title">{title}</strong> : null}
        {children}
        {actions ? <div className="pf-row" style={{ marginTop: 8 }}>{actions}</div> : null}
      </div>
    </div>
  );
}
export default Callout;
