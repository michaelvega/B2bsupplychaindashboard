import React, { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Portal modal. Traps focus, closes on Esc and backdrop click (unless dismissible=false), restores focus. */
export function Modal({ open = true, onClose, title, footer, wide = false, dismissible = true, children }) {
  const ref = useRef(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const node = ref.current;
    const first = node && node.querySelector(FOCUSABLE);
    (first || node)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape' && dismissible) { e.stopPropagation(); closeRef.current?.(); return; }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll(FOCUSABLE));
      if (items.length === 0) { e.preventDefault(); return; }
      const a = items[0]; const z = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === node)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (prev && prev.focus) prev.focus();
    };
  }, [open, dismissible]);

  if (!open) return null;
  return createPortal(
    <div className="pf-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && dismissible) onClose?.(); }}>
      <div ref={ref} className={`pf-modal${wide ? ' pf-modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} tabIndex={-1}>
        <div className="pf-panel-head">
          <h2 className="pf-panel-title" id={titleId}>{title}</h2>
          {dismissible ? <button type="button" className="pf-btn pf-btn-ghost pf-btn-sm" onClick={onClose} aria-label="Close"><Icon name="x" size={14} /></button> : null}
        </div>
        <div className="pf-modal-body">{children}</div>
        {footer ? <div className="pf-modal-foot">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
export default Modal;
