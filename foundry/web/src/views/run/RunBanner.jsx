import React from 'react';
import { Button, StatusChip } from '../../ui/index.js';
import '../../styles/run.css';

/**
 * Slim "a run is in progress" strip shown under the header on every step except
 * Run, so a running job is visible (and controllable) from anywhere in the app.
 * Props: label (string), paused, onView(), onPause(), onUnpause(), onStop()
 */
export function RunBanner({ label, paused = false, onView, onPause, onUnpause, onStop }) {
  return (
    <div className="pf-run-banner" role="status" aria-live="polite">
      <StatusChip tone={paused ? 'warn' : 'live'}>{paused ? 'Paused' : 'Running'}</StatusChip>
      <span className="pf-run-banner-label">{label}</span>
      <span className="pf-run-banner-actions">
        <Button size="sm" onClick={onView}>View run</Button>
        {paused
          ? <Button size="sm" icon="play" onClick={onUnpause}>Resume</Button>
          : <Button size="sm" icon="pause" onClick={onPause}>Pause</Button>}
        <Button size="sm" icon="stop" onClick={onStop}>Stop</Button>
      </span>
    </div>
  );
}
export default RunBanner;
