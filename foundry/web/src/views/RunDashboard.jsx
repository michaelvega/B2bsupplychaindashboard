import React, { useMemo } from 'react';
import { SectionHeading } from '../ui/index.js';
import ProjectPicker from './run/ProjectPicker.jsx';
import ProgressPanel from './run/ProgressPanel.jsx';
import TaxonomyPanel from './run/TaxonomyPanel.jsx';
import RunControls from './run/RunControls.jsx';
import LiveLog from './run/LiveLog.jsx';
import { deriveRunPhase } from '../lib/runState.js';
import { Panel } from '../ui/index.js';
import '../styles/run.css';

/**
 * RunDashboard props (see RunDashboard.PROPS.md):
 *  status, isRunning, numEpochs, onNumEpochs, onStart, onResume, keyReady,
 *  onOpenKeyGate, projects, projectId, onSelectProject, onNewProject,
 *  epochCounts?, runTarget?, prevRuleIds?, paused?, pausing?, onPause?, onUnpause?, onStop?
 */
export function RunDashboard({ status, isRunning, numEpochs, onNumEpochs, onStart, onResume, keyReady, onOpenKeyGate, projects, projectId, onSelectProject, onNewProject, epochCounts, runTarget, prevRuleIds, paused, pausing, onPause, onUnpause, onStop, onRenameProject, onTrashProject }) {
  const epochs = status?.epochs || [];
  const phase = useMemo(() => deriveRunPhase(status?.log, epochs, isRunning), [status, isRunning]); // eslint-disable-line react-hooks/exhaustive-deps
  const counts = useMemo(() => {
    const c = { ...(epochCounts || {}) };
    if (projectId != null && c[projectId] == null && status) c[projectId] = epochs.length;
    return c;
  }, [epochCounts, projectId, status]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <SectionHeading num="03" label="Run" title={<>Watch it <em>learn</em></>} sub="Each epoch finds mistakes, proposes rules, and keeps them only if they hold up on a holdout." small />
      <div className="pf-run-top">
        <ProjectPicker projects={projects} projectId={projectId} epochCounts={counts} onSelectProject={onSelectProject} onNewProject={onNewProject} onRenameProject={onRenameProject} onTrashProject={onTrashProject} />
      </div>
      <div className="pf-run-cols">
        <div className="pf-stack">
          <Panel title="Run">
            <RunControls isRunning={isRunning} keyReady={keyReady} hasRows={(status?.rows?.length ?? 1) > 0} numEpochs={numEpochs} onNumEpochs={onNumEpochs} epochCount={epochs.length} interrupted={phase.key === 'interrupted'} onStart={() => onStart?.()} onResume={() => onResume?.()} onOpenKeyGate={onOpenKeyGate} paused={paused} pausing={pausing} onPause={onPause} onUnpause={onUnpause} onStop={onStop} />
          </Panel>
          <ProgressPanel status={status} isRunning={isRunning} runTarget={runTarget} onFixKey={onOpenKeyGate} paused={paused} />
        </div>
        <div className="pf-stack">
          <TaxonomyPanel key={projectId || 'none'} taxonomy={status?.taxonomy} taxonomyEpoch={status?.taxonomyEpoch} prevRuleIds={prevRuleIds} />
          <LiveLog log={status?.log} />
        </div>
      </div>
    </div>
  );
}
export default RunDashboard;
