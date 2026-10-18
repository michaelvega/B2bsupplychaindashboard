import React from 'react';
import { Button, Callout } from '../../ui/index.js';
import '../../styles/run.css';

/**
 * Props:
 *  - isRunning, keyReady, hasRows (bool, default true), numEpochs, onNumEpochs(n)
 *  - epochCount: epochs already completed (status.epochs.length)
 *  - interrupted: bool (phase.key === 'interrupted')
 *  - onStart(), onResume(), onOpenKeyGate()
 *  numEpochs = additional epochs to run now (engine runAll semantics).
 */
export function RunControls({ isRunning, keyReady, hasRows = true, numEpochs = 2, onNumEpochs, epochCount = 0, interrupted = false, onStart, onResume, onOpenKeyGate }) {
  const resume = epochCount > 0;
  let reason = '';
  if (isRunning) reason = 'A run is in progress in this tab.';
  else if (!keyReady) reason = 'Add your OpenRouter key first.';
  else if (!hasRows) reason = 'Upload data first.';
  const disabled = !!reason;
  const set = (n) => onNumEpochs?.(Math.min(50, Math.max(1, n)));
  return (
    <div className="pf-stack">
      {interrupted && !isRunning && (
        <Callout tone="warn" title="Run was interrupted">
          The last session stopped mid-epoch (tab closed or reloaded). The unfinished epoch is discarded and redone. Your accepted rules are kept.
        </Callout>
      )}
      <div className="pf-run-controls">
        <div>
          <span className="pf-label" id="pf-run-ep-label">{resume ? 'More epochs' : 'Epochs'}</span>
          <div className="pf-count" role="group" aria-labelledby="pf-run-ep-label">
            <button type="button" aria-label="Fewer epochs" disabled={isRunning || numEpochs <= 1} onClick={() => set(numEpochs - 1)}>−</button>
            <output aria-live="polite">{numEpochs}</output>
            <button type="button" aria-label="More epochs" disabled={isRunning || numEpochs >= 50} onClick={() => set(numEpochs + 1)}>+</button>
          </div>
        </div>
        {isRunning ? (
          <Button variant="primary" size="lg" loading disabled>Running</Button>
        ) : (
          <Button variant="primary" filled size="lg" icon="play" disabled={disabled} onClick={resume ? onResume : onStart}>
            {resume ? `Continue from epoch ${epochCount + 1}` : 'Start'}
          </Button>
        )}
      </div>
      {!resume && !isRunning && <p className="pf-help" style={{ margin: 0 }}>2 epochs is a quick try. Use 3 to 5 for real use.</p>}
      {reason && !isRunning && (
        <p className="pf-help" style={{ margin: 0 }} role="status">
          {reason} {!keyReady && onOpenKeyGate && <Button size="sm" variant="ghost" onClick={onOpenKeyGate}>Add key</Button>}
        </p>
      )}
    </div>
  );
}
export default RunControls;
