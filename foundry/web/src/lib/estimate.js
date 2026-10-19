/**
 * Rough, purely numeric run estimate. Presentation only; label it "estimate" in the UI.
 * Assumptions (all approximate):
 *  - holdout rows = round(rowCount * holdoutPct); pool = the rest.
 *  - each epoch trains on half the pool (pool * 0.5) and evaluates the whole holdout.
 *  - each evaluated row = 1 student call, + 1 grader call when open-ended.
 *  - ~6 extra agent calls per epoch (rewriter, meta, overseer, etc.).
 *  - ~2.5 s average per call, run with ~4 concurrent => seconds = calls * 2.5 / 4.
 */
const AGENT_CALLS_PER_EPOCH = 6;
const SECONDS_PER_CALL = 2.5;
const CONCURRENCY = 4;

/** -> { trainRows, holdoutRows, approxCalls, approxMinutes } (per whole run, all epochs). */
export function estimateRun({ rowCount = 0, holdoutPct = 0.2, openEnded = false, epochs = 1 } = {}) {
  const total = Math.max(0, Math.floor(Number(rowCount) || 0));
  const pct = Number.isFinite(Number(holdoutPct)) ? Math.min(Math.max(Number(holdoutPct), 0), 0.9) : 0.2;
  const e = Math.max(1, Math.floor(Number(epochs) || 1));
  const holdoutRows = Math.round(total * pct);
  const pool = total - holdoutRows;
  const trainRows = Math.round(pool * 0.5);
  const perRow = openEnded ? 2 : 1;
  const perEpoch = (trainRows + holdoutRows) * perRow + AGENT_CALLS_PER_EPOCH;
  const approxCalls = perEpoch * e;
  const approxMinutes = Math.max(1, Math.round((approxCalls * SECONDS_PER_CALL) / CONCURRENCY / 60));
  return { trainRows, holdoutRows, approxCalls, approxMinutes };
}
