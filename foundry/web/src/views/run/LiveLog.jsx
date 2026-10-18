import React, { useEffect, useRef, useState } from 'react';
import { Panel, Button } from '../../ui/index.js';
import '../../styles/run.css';

/**
 * Props: log: [{epoch, message}] (status.log). Collapsible; autoscrolls to newest line.
 */
export function LiveLog({ log = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const n = Array.isArray(log) ? log.length : 0;
  useEffect(() => {
    if (open && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [open, n]);
  return (
    <Panel
      title={`Live log · ${n} line${n === 1 ? '' : 's'}`}
      bare
      actions={<Button size="sm" aria-expanded={open} aria-controls="pf-run-log-body" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>}
    >
      {open && (
        <div id="pf-run-log-body" ref={ref} className="pf-run-log" role="log" aria-live="off" tabIndex={0}>
          {n === 0 ? <div>(no log yet)</div> : log.map((l, i) => {
            const m = String(l.message ?? '');
            return <div key={i} className={m.startsWith('run error:') ? 'is-err' : undefined}>[{l.epoch}] {m}</div>;
          })}
        </div>
      )}
    </Panel>
  );
}
export default LiveLog;
