/**
 * Metric computation for the dataset-learning-v2 training loop.
 *
 * Pure functions: no I/O, no imports. Two flavors of scoring coexist —
 * closed-scale (a predicted label is right or wrong) and open-ended
 * (a rubric score / total, where continuousCorrect means >= 0.8).
 */

// Gate thresholds (shared by evaluateGate).
const MIN_REPAIRS = 2
const MAX_METRIC_DROP = 0.05

/**
 * Fraction of results that were classified correctly.
 *
 * @param {{correct: boolean}[]} results
 * @returns {number} 0..1 (0 when there are no results)
 */
export function computeClosedAccuracy(results) {
  if (!results || results.length === 0) return 0
  let correct = 0
  for (const row of results) {
    if (row && row.correct) correct++
  }
  return correct / results.length
}

/**
 * Mean rubric score ratio, skipping rows with no possible points.
 *
 * @param {{score: number, total: number}[]} results
 * @returns {number} 0..1 (0 when there are no scoreable results)
 */
export function computeContinuousAccuracy(results) {
  if (!results || results.length === 0) return 0
  let sum = 0
  let count = 0
  for (const row of results) {
    if (!row || !(row.total > 0)) continue
    sum += row.score / row.total
    count++
  }
  if (count === 0) return 0
  return sum / count
}

/** Ratio score/total for a row, 0 when there are no possible points.
 * @param {{score: number, total: number}} row
 * @returns {number}
 */
function continuousScore(row) {
  if (!row || !(row.total > 0)) return 0
  return row.score / row.total
}

/**
 * Repairs / regressions between two evaluation rounds, ALIGNED BY POSITION
 * (the holdout set is a fixed subsample, so index i is the same row in both).
 *
 * Closed: a repair is a previously-wrong row now right; a regression is a
 * previously-right row now wrong.
 * Continuous (relative +/-20%): a repair is a not-yet-perfect row that gained
 * at least 20%; a regression is a non-zero row that lost at least 20%.
 *
 * @param {{correct: boolean, continuousCorrect: boolean, score: number, total: number}[]|null} prev
 * @param {{correct: boolean, continuousCorrect: boolean, score: number, total: number}[]} curr
 * @param {boolean|number} openEnded
 * @returns {{repairs: number, regressions: number}}
 */
export function computeRepairsRegressions(prev, curr, openEnded) {
  if (!prev || prev.length === 0 || !curr || curr.length === 0) {
    return { repairs: 0, regressions: 0 }
  }

  let repairs = 0
  let regressions = 0
  const limit = Math.min(prev.length, curr.length)

  for (let i = 0; i < limit; i++) {
    const prevRow = prev[i]
    const currRow = curr[i]

    if (openEnded) {
      const prevScore = continuousScore(prevRow)
      const currScore = continuousScore(currRow)
      if (prevScore < 1.0 && currScore >= prevScore * 1.2) repairs++
      else if (prevScore > 0 && currScore <= prevScore * 0.8) regressions++
    } else {
      const prevCorrect = prevRow ? prevRow.correct === true : false
      const currCorrect = currRow ? currRow.correct === true : false
      if (!prevCorrect && currCorrect) repairs++
      else if (prevCorrect && !currCorrect) regressions++
    }
  }

  return { repairs, regressions }
}

/**
 * Decide whether a candidate taxonomy is accepted over the current baseline.
 * The original APO formula, unified across closed and open scoring:
 * at least 2 repairs AND the metric (accuracy / continuous accuracy) drops by
 * no more than 0.05.
 *
 * @param {Object} input
 * @param {number} input.repairs
 * @param {number} input.prevMetric
 * @param {number} input.currMetric
 * @returns {{passed: boolean, reason: string}}
 */
export function evaluateGate({ repairs, prevMetric, currMetric }) {
  const drop = prevMetric - currMetric
  const passed = repairs >= MIN_REPAIRS && drop <= MAX_METRIC_DROP
  if (passed) {
    return {
      passed: true,
      reason: `Gate PASSED: repairs=${repairs}, accuracy_drop=${drop.toFixed(4)}`,
    }
  }
  const reasons = []
  if (repairs < MIN_REPAIRS) reasons.push(`repairs=${repairs} < ${MIN_REPAIRS}`)
  if (drop > MAX_METRIC_DROP) reasons.push(`accuracy_drop=${drop.toFixed(4)} > ${MAX_METRIC_DROP}`)
  return { passed: false, reason: 'Gate REJECTED: ' + reasons.join(', ') }
}
