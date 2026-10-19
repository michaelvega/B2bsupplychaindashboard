import React from 'react';
import { Panel, StatusChip, Callout, Button, Stat } from '../../ui/index.js';
import MetricChart from './MetricChart.jsx';
import { deriveRunPhase, lastErrorFromLog, errorIsLatest, friendlyError, bestMetric } from '../../lib/runState.js';
import '../../styles/run.css';

/**
 * Props:
 *  - status: full object from fetchDatasetLearningV2Project
 *  - isRunning: bool
 *  - runTarget?: number  absolute last epoch of the current run (for "epoch X of N")
 *  - onFixKey?(): called by the "Fix key" action on auth errors
 */
export function ProgressPanel({ status, isRunning, runTarget, onFixKey, paused = false }) {
  const epochs = status?.epochs || [];
  const log = status?.log || [];
  const project = status?.project;
  const openEnded = !!project?.open_ended;
  const phase = deriveRunPhase(log, epochs, isRunning);
  const errMsg = errorIsLatest(log) ? lastErrorFromLog(log) : null;
  const fe = errMsg ? friendlyError(errMsg) : null;
  const accepted = epochs.filter((e) => e.status === 'accepted').length;
  const rejected = epochs.filter((e) => e.status === 'rejected').length;
  const best = bestMetric(epochs, openEnded);
  const current = Math.max(phase.epoch || 0, epochs.length ? epochs[epochs.length - 1].epoch : 0);
  const tone = isRunning ? (paused ? 'warn' : 'live') : phase.key === 'error' ? 'error' : phase.key === 'interrupted' ? 'warn' : 'idle';

  // repairs / regressions: from latest epoch metrics when the engine reports them
  const lm = epochs.length ? epochs[epochs.length - 1].metrics || {} : {};
  const fmt = (v) => (v === undefined || v === null ? '–' : String(v));

  return (
    <Panel title="Progress">
      <div className="pf-stack">
        <div className="pf-run-phase" aria-live="polite">
          <StatusChip tone={tone}>{isRunning ? (paused ? 'Paused' : 'Running') : phase.key === 'stopped' ? 'Stopped' : phase.key === 'error' ? 'Error' : phase.key === 'interrupted' ? 'Interrupted' : 'Idle'}</StatusChip>
          <span className="pf-run-phase-label">
            {current > 0 && <span className="pf-mono">Epoch {current}{runTarget ? ` of ${runTarget}` : ''} · </span>}
            {phase.label}
          </span>
        </div>

        {isRunning && (
          <Callout tone="info" title="Keep this tab open">
            The loop runs in your browser. Closing or reloading stops it. You can continue later from the last finished epoch.
          </Callout>
        )}

        {fe && (
          <Callout tone="error" title={fe.title} actions={fe.kind === 'auth' && onFixKey ? <Button size="sm" onClick={onFixKey}>Fix key</Button> : null}>
            {fe.hint}
            <div className="pf-mono" style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>{errMsg}</div>
          </Callout>
        )}

        <div className="pf-run-stats">
          <Stat label="Epochs done" value={epochs.length} />
          <Stat label="Accepted / rejected" value={`${accepted} / ${rejected}`} />
          <Stat label="Best score" value={best ? `${(best.value * 100).toFixed(1)}%` : '–'} />
          <Stat label="Repairs / regressions" value={`${fmt(lm.repairs)} / ${fmt(lm.regressions)}`} />
        </div>

        {epochs.length > 0 && (
          <ul className="pf-run-epochs" aria-label="Epoch results">
            {epochs.map((e) => {
              const ok = e.status === 'accepted';
              const why = ok ? 'Gate passed: holdout score improved, new rules kept.' : e.status === 'rejected' ? 'Gate failed: holdout did not improve enough, rules from this epoch discarded.' : `Status: ${e.status}`;
              return (
                <li key={e.epoch} className={`pf-run-epoch-chip ${ok ? 'is-ok' : 'is-bad'}`} title={why} tabIndex={0} aria-label={`Epoch ${e.epoch} ${e.status}. ${why}`}>
                  <span className="pf-dot" aria-hidden="true" style={{ width: 6, height: 6 }} />
                  {e.epoch} {ok ? 'accepted' : e.status === 'rejected' ? 'rejected' : e.status}
                </li>
              );
            })}
          </ul>
        )}

        <MetricChart epochs={epochs} openEnded={openEnded} />
      </div>
    </Panel>
  );
}
export default ProgressPanel;
