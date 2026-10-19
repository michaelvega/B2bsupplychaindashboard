import React, { useState } from 'react';

/**
 * Text clamped to `limit` chars with a show more/less toggle.
 * Props: { text: any, limit?: number (default 240), empty?: string }
 */
export function Truncated({ text, limit = 240, empty = '(none)' }) {
  const [open, setOpen] = useState(false);
  const s = String(text ?? '');
  if (!s) return <>{empty}</>;
  if (s.length <= limit) return <>{s}</>;
  return (
    <>
      {open ? s : s.slice(0, limit) + '…'}
      <button type="button" className="ex-more" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'show less' : 'show more'}
      </button>
    </>
  );
}
export default Truncated;
