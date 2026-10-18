import React, { useState, useId } from 'react';
import Icon from './Icon.jsx';

/** Disclosure. Uncontrolled via defaultOpen, or controlled via open + onToggle(next). */
export function Accordion({ title, defaultOpen = false, open: openProp, onToggle, className = '', children }) {
  const [inner, setInner] = useState(defaultOpen);
  const id = useId();
  const open = openProp ?? inner;
  const toggle = () => { const next = !open; if (openProp === undefined) setInner(next); onToggle?.(next); };
  return (
    <div className={`pf-accordion${open ? ' is-open' : ''} ${className}`.trim()}>
      <button type="button" className="pf-accordion-trigger" aria-expanded={open} aria-controls={id} onClick={toggle}>
        <span>{title}</span><Icon name="chevron-down" size={14} />
      </button>
      {open ? <div className="pf-accordion-panel" id={id}>{children}</div> : null}
    </div>
  );
}
export default Accordion;
