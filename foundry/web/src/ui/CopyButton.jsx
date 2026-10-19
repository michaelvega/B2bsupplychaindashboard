import React, { useState, useRef, useEffect } from 'react';
import Button from './Button.jsx';

/** Copies `text` (string or () => string). Falls back to a hidden textarea + execCommand. */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

export function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied', size = 'md', variant = 'default', ...rest }) {
  const [state, setState] = useState('idle'); // idle|copied|failed
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);
  async function onClick() {
    const ok = await copyToClipboard(typeof text === 'function' ? text() : text);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(t.current);
    t.current = setTimeout(() => setState('idle'), 2000);
  }
  return (
    <Button size={size} variant={variant} icon={state === 'copied' ? 'check' : 'copy'} onClick={onClick} {...rest}>
      {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
      <span className="pf-sr-only" role="status" aria-live="polite">{state === 'copied' ? 'Copied to clipboard' : ''}</span>
    </Button>
  );
}
export default CopyButton;
