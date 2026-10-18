import React, { useRef, useEffect } from 'react';
import '../styles/explorer.css';
import { Accordion } from '../ui/index.js';
import RowHistory from './explorer/RowHistory.jsx';
import EpochMeta from './explorer/EpochMeta.jsx';

/**
 * "Under the hood" accordion (collapsed by default). Pure display.
 * Props: { status: object|null, isRunning?: boolean, openEnded?: boolean, onJumpToRun?: ()=>void }
 * See Explorer.PROPS.md.
 */
export function Explorer({ status, isRunning = false, openEnded = false, onJumpToRun }) {
  const logRef = useRef(null);
  const log = status?.log || [];
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log.length]);
  return (
    <Accordion title="Under the hood">
      <p className="pf-help">Raw engine history. Read-only.{isRunning ? ' Updating live.' : ''}{onJumpToRun && <> <button type="button" className="ex-more" onClick={onJumpToRun}>Back to run</button></>}</p>
      <div className="ex-section">
        <h3 className="pf-label">Row history</h3>
        <RowHistory status={status} />
      </div>
      <div className="ex-section">
        <h3 className="pf-label">Epoch + meta changes{openEnded ? ' (open-ended: contAcc is the main metric)' : ''}</h3>
        <EpochMeta status={status} />
      </div>
      <div className="ex-section">
        <h3 className="pf-label">Full log</h3>
        <div className="ex-box ex-log" ref={logRef} role="log">
          {log.length === 0 ? <span>(no log yet)</span> : log.map((e, i) => <div key={i}><span>[{e.epoch}]</span> {e.message}</div>)}
        </div>
      </div>
    </Accordion>
  );
}
export default Explorer;
