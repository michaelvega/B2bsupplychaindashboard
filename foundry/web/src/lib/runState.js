/**
 * Pure helpers over api.js status data.
 * log: [{epoch, message}], epochs: [{epoch, status:'accepted'|'rejected'|..., gate_passed, metrics}].
 */

/** Latest "run error: ..." message after the most recent non-error line? Returns the last error string or null. */
export function lastErrorFromLog(log) {
  if (!Array.isArray(log)) return null;
  for (let i = log.length - 1; i >= 0; i--) {
    const m = String(log[i]?.message ?? '');
    if (m.startsWith('run error:')) return m.replace(/^run error:\s*/, '');
  }
  return null;
}

/** True if the newest log entry is the run error (i.e. nothing happened since it). */
export function errorIsLatest(log) {
  const last = Array.isArray(log) && log.length ? String(log[log.length - 1]?.message ?? '') : '';
  return last.startsWith('run error:');
}

/** -> { title, hint, kind: 'auth'|'credits'|'rate'|'network'|'other' } */
export function friendlyError(message) {
  const m = String(message ?? '');
  if (/\b401\b|unauthori[sz]ed|invalid.*(api )?key|key is not set|no auth/i.test(m)) {
    return { kind: 'auth', title: 'Your OpenRouter key was rejected.', hint: 'Check the key in the header, use "Test key", or paste a fresh one from openrouter.ai/keys.' };
  }
  if (/\b402\b|insufficient|credit|payment/i.test(m)) {
    return { kind: 'credits', title: 'Out of OpenRouter credits.', hint: 'Add credits at openrouter.ai/credits, then continue the run.' };
  }
  if (/\b429\b|rate.?limit|too many requests/i.test(m)) {
    return { kind: 'rate', title: 'Rate limited by the model provider.', hint: 'Wait a minute and continue, or switch to a different model under Advanced.' };
  }
  if (/failed to fetch|network|load failed|ECONN|timeout|timed out|ENOTFOUND/i.test(m)) {
    return { kind: 'network', title: 'Network problem reaching OpenRouter.', hint: 'Check your connection (or any ad/VPN blocker) and continue the run.' };
  }
  return { kind: 'other', title: 'The run stopped with an error.', hint: 'Details below. Continuing usually works for transient failures.' };
}

/** Number of consecutive 'rejected' epochs at the end of the list (carry into resume as consecutiveRejections). */
export function trailingRejections(epochs) {
  if (!Array.isArray(epochs)) return 0;
  const sorted = [...epochs].sort((a, b) => a.epoch - b.epoch);
  let n = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const s = sorted[i];
    if (s.status === 'rejected' || (s.status !== 'accepted' && s.gate_passed === false && s.status)) n++;
    else break;
  }
  return n;
}

/**
 * -> { key, label, epoch }  key: 'idle'|'starting'|'baseline'|'training'|'gating'|'decided'|'restart'|'error'|'interrupted'|'done'
 * Uses the newest log line. `interrupted` = not running, but the newest epoch line is mid-epoch (no ACCEPTED/REJECTED yet).
 */
export function deriveRunPhase(log, epochs, isRunning) {
  const entries = Array.isArray(log) ? log : [];
  const last = entries.length ? entries[entries.length - 1] : null;
  const msg = String(last?.message ?? '');
  const epoch = last?.epoch ?? 0;
  if (msg.startsWith('run error:')) return { key: 'error', label: 'Stopped with an error', epoch };
  if (msg.startsWith('run stopped')) return { key: 'stopped', label: 'Stopped by you', epoch };
  let key = 'idle'; let label = 'Not started';
  if (!last || /^upload:/.test(msg)) { key = 'idle'; label = 'Ready'; }
  else if (/RESTART/.test(msg)) { key = 'restart'; label = 'Restarting after repeated rejections'; }
  else if (/ACCEPTED|REJECTED/.test(msg)) { key = 'decided'; label = /ACCEPTED/.test(msg) ? 'Epoch accepted' : 'Epoch rejected'; }
  else if (/^Gate /.test(msg)) { key = 'gating'; label = 'Gate decision'; }
  else if (/^gate-set:/.test(msg)) { key = 'gating'; label = 'Scoring holdout'; }
  else if (/^train:/.test(msg)) { key = 'training'; label = 'Learning rules from mistakes'; }
  else if (/^epoch \d+: baseline/.test(msg)) { key = 'baseline'; label = 'Starting epoch'; }
  else { key = 'training'; label = 'Working'; }
  if (!isRunning) {
    const midEpoch = key === 'baseline' || key === 'training' || key === 'gating';
    if (midEpoch) return { key: 'interrupted', label: 'Run was interrupted', epoch };
    if (key === 'decided' || key === 'restart') return { key: 'done', label: 'Idle', epoch };
    return { key: 'idle', label: 'Ready', epoch };
  }
  return { key, label, epoch };
}

/** Best metric across epochs: continuousAccuracy when openEnded else accuracy. -> { value, epoch } | null */
export function bestMetric(epochs, openEnded) {
  const name = openEnded ? 'continuousAccuracy' : 'accuracy';
  let best = null;
  for (const e of epochs || []) {
    const v = Number(e?.metrics?.[name]);
    if (Number.isFinite(v) && (best === null || v > best.value)) best = { value: v, epoch: e.epoch };
  }
  return best;
}
