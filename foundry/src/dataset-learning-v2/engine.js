/**
 * Training loop for dataset-learning-v2.
 *
 * Owns the epoch machinery: CSV ingest + holdout/pool split, baseline taxonomy,
 * the per-epoch train evaluation (student + grade), dataset-wide diagnosis and
 * rewriting of the wrong rows, the meta overseer, candidate construction
 * (append/edit/combine/delete with stable rule ids), holdout validation, the
 * accept/reject gate, and the restart-from-scratch path taken after rejections.
 *
 * Depends on db.js (state), metrics.js (gates), prompts.js (templates) and
 * agents.js (LLM calls). No other module imports this one except smoke-test.js.
 */

import {
  createProject as dbCreateProject,
  getProject,
  updateProject,
  insertRows,
  getRows,
  getRowById,
  getRowIdsBySplit,
  getLatestAcceptedVersion,
  insertTaxonomyVersion,
  insertEpoch,
  getEpoch,
  listEpochs,
  insertRowHistory,
  getRowHistoryForEpoch,
  countWrongBefore,
  insertScorecard,
  getScorecard,
  insertMetaHistory,
  appendLog,
  getLog,
  resetProjectData,
} from './db.js'
import {
  computeClosedAccuracy,
  computeContinuousAccuracy,
  computeRepairsRegressions,
  evaluateGate,
} from './metrics.js'
import { renderTemplate, buildOutputFormatText, buildTaxonomyHistoryText } from './prompts.js'
import { runStudent, gradeStudent, diagnose, rewrite, runMeta } from './agents.js'

// Concurrency for the per-row LLM fan-out. Default 15; override with
// DL_CONCURRENCY for a slower, gentler run on a rate-limited shared pool.
// Optional chaining keeps this safe in the browser build, where process is
// undefined.
const CONCURRENCY = Number(globalThis.process?.env?.DL_CONCURRENCY) > 0
  ? Number(globalThis.process.env.DL_CONCURRENCY)
  : 15

// Consecutive-rejection count handed to the meta agent. runEpoch has no attempt
// parameter in the contract, so runAll publishes it here before each call.
let metaAttempt = 0

// --- small utilities --------------------------------------------------------

/**
 * Deterministic PRNG so a given epoch always samples the same training rows.
 * @param {number} seed
 * @returns {() => number} float in [0, 1)
 */
function mulberry32(seed) {
  let state = seed >>> 0
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Fisher-Yates copy of `items`.
 * @param {Array} items
 * @param {() => number} rand
 * @returns {Array}
 */
function shuffle(items, rand) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

/**
 * Run `fn` over `items` with at most `limit` calls in flight.
 * @param {Array} items
 * @param {number} limit
 * @param {(item: any, index: number) => Promise<any>} fn
 * @returns {Promise<Array>}
 */
async function mapConcurrent(items, limit, fn) {
  const results = new Array(items.length)
  let cursor = 0
  const workerCount = Math.min(limit, items.length)
  const workers = Array.from({ length: workerCount }, async () => {
    for (;;) {
      const index = cursor++
      if (index >= items.length) return
      results[index] = await fn(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

/**
 * RFC4180-ish CSV parse: quoted fields, escaped quotes, embedded commas and
 * newlines, CRLF and a leading BOM.
 * @param {string} text
 * @returns {string[][]}
 */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }
    if (ch === '"') inQuotes = true
    else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/**
 * Drop a leading UTF-8 byte-order mark from the first CSV header cell.
 * @param {string} cell
 * @returns {string}
 */
function stripBom(cell) {
  return cell.charCodeAt(0) === 0xfeff ? cell.slice(1) : cell
}

/**
 * `key: value` lines for the whole payload — used when the project's system
 * prompt carries no `{{placeholder}}` for the row.
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
function payloadToLines(payload) {
  return Object.entries(payload ?? {})
    .map(([key, value]) => `${key}: ${value ?? ''}`)
    .join('\n')
}

/**
 * The student's user message: the rendered template when the system prompt
 * actually consumed the row, otherwise the payload as key: value lines.
 */
function rowTextFor(systemPrompt, rendered, payload) {
  if (rendered && rendered !== (systemPrompt ?? '')) return rendered
  return payloadToLines(payload)
}

/**
 * Resolve the rubric text used to grade one row (open-ended only). Per-row mode
 * reads the rubric from the row's own rubric_column; global mode uses the
 * project's standardized rubric. Returns '' for closed-scale.
 * @param {object} project
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
function resolveRubricText(project, payload) {
  if (Number(project.open_ended) !== 1) return ''
  if (project.rubric_mode === 'per_row') {
    const col = project.rubric_column
    if (col && payload && payload[col] != null) return String(payload[col])
    return ''
  }
  if (typeof project.rubric_json === 'string') return project.rubric_json
  return project.rubric_json != null ? JSON.stringify(project.rubric_json) : ''
}

/**
 * Dedup edits by operation identity, preserving first-seen order.
 * @param {Array<object>} edits
 * @returns {Array<object>}
 */
function dedupeEdits(edits) {
  const seen = new Set()
  const out = []
  for (const edit of edits ?? []) {
    if (!edit || typeof edit !== 'object') continue
    let key
    if (edit.op === 'append') key = `append|${edit.text}`
    else if (edit.op === 'edit') key = `edit|${edit.rule_id}|${edit.text}`
    else if (edit.op === 'combine') key = `combine|${(edit.rule_ids ?? []).join(',')}|${edit.text}`
    else if (edit.op === 'delete') key = `delete|${edit.rule_id}`
    else continue
    if (seen.has(key)) continue
    seen.add(key)
    out.push(edit)
  }
  return out
}

/**
 * Apply append/edit/combine/delete edits to a copy of the rule list. Existing
 * rules keep their rule_id; every new rule gets a fresh, never-reused id.
 * `delete` deactivates a rule by dropping it from the working list — remaining
 * rules keep their ids and `nextId` never moves back, so the deleted id is not
 * handed to a new rule.
 * @param {Array<{rule_id: number, text: string}>} rules
 * @param {Array<object>} edits
 * @param {number} nextRuleId
 * @returns {Array<{rule_id: number, text: string}>}
 */
function applyEdits(rules, edits, nextRuleId) {
  let working = rules.map((rule) => ({ rule_id: rule.rule_id, text: rule.text }))
  let nextId = nextRuleId

  for (const edit of edits) {
    if (edit.op === 'append') {
      if (typeof edit.text !== 'string' || edit.text.trim() === '') continue
      working.push({ rule_id: nextId++, text: edit.text })
    } else if (edit.op === 'edit') {
      const target = working.find((rule) => rule.rule_id === edit.rule_id)
      if (!target) continue
      if (typeof edit.text !== 'string' || edit.text.trim() === '') continue
      target.text = edit.text
    } else if (edit.op === 'combine') {
      const ids = Array.isArray(edit.rule_ids) ? edit.rule_ids : []
      const present = ids.filter((id) => working.some((rule) => rule.rule_id === id))
      if (present.length === 0) continue
      if (typeof edit.text !== 'string' || edit.text.trim() === '') continue
      working = working.filter((rule) => !present.includes(rule.rule_id))
      working.push({ rule_id: nextId++, text: edit.text })
    } else if (edit.op === 'delete') {
      working = working.filter((rule) => rule.rule_id !== edit.rule_id)
    }
  }

  return working
}

/**
 * Per-rule holdout scorecard rows. Only the shrinkage association is stored
 * (the citation counts are held in memory to compute it): rules cited anywhere
 * in the holdout, plus every rule surviving in the candidate.
 * @returns {Array<object>} fields ready for db.insertScorecard
 */
function buildScorecards(projectId, epoch, openEnded, holdoutResults, rules) {
  const ruleIds = new Set(rules.map((rule) => rule.rule_id))
  for (const result of holdoutResults) {
    for (const ruleId of result.citedRuleIds) ruleIds.add(ruleId)
  }

  const cards = []
  for (const ruleId of [...ruleIds].sort((a, b) => a - b)) {
    let timesCited = 0
    let correctWhenCited = 0

    for (const result of holdoutResults) {
      if (!result.citedRuleIds.includes(ruleId)) continue
      timesCited++
      const isCorrect = openEnded ? result.continuousCorrect === true : result.correct === true
      if (isCorrect) correctWhenCited++
    }

    cards.push({
      project_id: projectId,
      epoch,
      rule_id: ruleId,
      shrinkage_association: (correctWhenCited + 1) / (timesCited + 2),
    })
  }
  return cards
}

/**
 * Holdout results recorded at `roundEpoch`, aligned by position to `holdoutIds`.
 * null when that round did not evaluate every holdout row.
 */
function holdoutResultsAt(projectId, roundEpoch, holdoutIds) {
  if (!roundEpoch || holdoutIds.length === 0) return null
  const byRow = new Map(
    getRowHistoryForEpoch(projectId, roundEpoch).map((row) => [row.row_id, row])
  )
  const results = []
  for (const rowId of holdoutIds) {
    const history = byRow.get(rowId)
    if (!history) return null
    results.push({
      correct: history.correct === 1,
      continuousCorrect: history.continuous_correct === 1,
      score: history.rubric_score,
      total: history.rubric_total,
    })
  }
  return results
}

/**
 * The evaluation round this epoch is gated against: the last accepted version's
 * holdout round when one exists, else the previous epoch's. Returns null only
 * before any holdout round has been recorded (epoch 1), where the first-epoch
 * fix accepts the candidate outright — there is nothing to have repaired.
 */
function resolvePrevRound(projectId, epoch, baselineEpoch, holdoutIds) {
  for (const candidate of [baselineEpoch, epoch - 1]) {
    if (!candidate || candidate <= 0) continue
    const results = holdoutResultsAt(projectId, candidate, holdoutIds)
    if (results) return { epoch: candidate, results }
  }
  return null
}

// --- project + data ---------------------------------------------------------

/**
 * Create a project row. Does NOT split data or seed a taxonomy.
 * @param {object} fields
 * @returns {Promise<object>}
 */
export async function createProject(fields) {
  return dbCreateProject(fields)
}

/**
 * Ingest CSV text: parse, dedup, split holdout/pool, persist rows and columns.
 * @param {string} projectId
 * @param {string} csvText
 * @returns {Promise<{totalRows: number, columns: string[], holdoutCount: number, poolCount: number}>}
 */
export async function uploadCsv(projectId, csvText) {
  const project = getProject(projectId)
  if (!project) throw new Error(`uploadCsv: unknown project ${projectId}`)

  const table = parseCsv(String(csvText ?? ''))
  if (table.length === 0) throw new Error('uploadCsv: CSV has no header row')

  const columns = table[0].map((cell, index) => (index === 0 ? stripBom(cell) : cell).trim())
  const openEnded = Number(project.open_ended) === 1

  if (!openEnded && project.golden_column && !columns.includes(project.golden_column)) {
    throw new Error(
      `uploadCsv: golden_column "${project.golden_column}" is not among the CSV columns (${columns.join(', ')})`
    )
  }

  if (openEnded && project.rubric_mode === 'per_row' && project.rubric_column && !columns.includes(project.rubric_column)) {
    throw new Error(
      `uploadCsv: rubric_column "${project.rubric_column}" is not among the CSV columns (${columns.join(', ')})`
    )
  }

  const payloads = []
  const seen = new Set()
  for (const cells of table.slice(1)) {
    if (cells.every((cell) => cell === '')) continue
    const payload = {}
    columns.forEach((column, index) => {
      payload[column] = cells[index] ?? ''
    })
    const fingerprint = JSON.stringify(payload)
    if (seen.has(fingerprint)) continue
    seen.add(fingerprint)
    payloads.push(payload)
  }

  const totalRows = payloads.length
  const holdoutPct = typeof project.holdout_pct === 'number' ? project.holdout_pct : 0.2
  const order = shuffle(
    payloads.map((_, index) => index),
    mulberry32(0x5eed)
  )
  const holdoutCount = Math.min(totalRows, Math.round(totalRows * holdoutPct))

  const rows = order.map((originalIndex, position) => ({
    project_id: projectId,
    source_index: originalIndex,
    payload: payloads[originalIndex],
    split: position < holdoutCount ? 'holdout' : 'pool',
  }))
  insertRows(rows)
  updateProject(projectId, { columns_json: columns })

  appendLog(projectId, 0, `upload: ${totalRows} row(s), ${holdoutCount} holdout / ${totalRows - holdoutCount} pool`)

  return { totalRows, columns, holdoutCount, poolCount: totalRows - holdoutCount }
}

/**
 * Insert an empty accepted taxonomy version at epoch 0 so every run has a
 * baseline. No-op when an accepted version already exists.
 * @param {string} projectId
 * @returns {Promise<object>}
 */
export async function seedInitialTaxonomy(projectId) {
  const existing = getLatestAcceptedVersion(projectId)
  if (existing) return existing
  return insertTaxonomyVersion({
    project_id: projectId,
    epoch: 0,
    rules_json: [],
    is_candidate: 0,
    accepted: 1,
  })
}

// --- epoch ------------------------------------------------------------------

/**
 * Evaluate one row with one rule set (student + grade only).
 */
async function evaluateRow(project, openEnded, outputFormatText, rowId, rules) {
  const row = getRowById(rowId)
  const payload = row?.payload ?? {}
  const rendered = renderTemplate(project.system_prompt, payload)
  const rowText = rowTextFor(project.system_prompt, rendered, payload)
  const rubricText = resolveRubricText(project, payload)

  const student = await runStudent({
    renderedBasePrompt: rendered,
    taxonomyRules: rules,
    outputFormat: project.output_format,
    rowText,
    openEnded,
  })

  const golden = project.golden_column ? payload[project.golden_column] : undefined
  const goldenAnswer = golden === undefined || golden === null ? '' : String(golden)
  const grade = await gradeStudent({
    openEnded,
    predictedLabel: student.predictedLabel,
    goldenAnswer,
    rubric: rubricText,
    outputFormatText,
    question: rowText,
    studentAnswer: student.answer,
  })

  return { rowId, rowText, goldenAnswer, rubricText, student, grade, payload }
}

/**
 * The plain (unlabeled) reference answer for one row: the project's
 * sample_answer_column when set, else the golden value for a closed-scale
 * project, else null (open-ended with no sample column). Never the rubric.
 * @param {object} project
 * @param {Record<string, unknown>} payload
 * @param {string} goldenAnswer
 * @returns {string|null}
 */
function sampleAnswerFor(project, payload, goldenAnswer) {
  if (project.sample_answer_column) {
    const value = payload ? payload[project.sample_answer_column] : undefined
    return value === undefined || value === null ? null : String(value)
  }
  if (Number(project.open_ended) !== 1) return goldenAnswer ?? null
  return null
}

/**
 * One epoch of the training loop. See CONTRACT-V3.md section 5.
 * @param {string} projectId
 * @param {number} epoch
 * @param {object} [opts]
 * @param {boolean} [opts.showDockToRewriter=false] Give the rewriter the
 *   grader's per-criterion dock for wrong rows (never the full rubric or the
 *   sample answer). Default behavior is unchanged.
 * @returns {Promise<object>} epoch summary
 */
export async function runEpoch(projectId, epoch, opts = {}) {
  const project = getProject(projectId)
  if (!project) throw new Error(`runEpoch: unknown project ${projectId}`)

  const openEnded = Number(project.open_ended) === 1
  const editBudget = project.edit_budget ?? 3
  const outputFormatText = buildOutputFormatText(project.output_format)

  const baseline = getLatestAcceptedVersion(projectId)
  const baselineRules = baseline
    ? baseline.rules_json.map((rule) => ({ rule_id: rule.rule_id, text: rule.text }))
    : []
  const baselineVersionId = baseline?.id ?? null
  const baselineEpoch = baseline?.epoch ?? 0

  appendLog(
    projectId,
    epoch,
    `epoch ${epoch}: baseline ${baselineVersionId ?? 'none'} (${baselineRules.length} rule(s))`
  )

  // 2. Sample half the pool, reproducibly.
  const poolIds = getRowIdsBySplit(projectId, 'pool')
  const holdoutIds = getRowIdsBySplit(projectId, 'holdout')
  const shuffled = shuffle(poolIds, mulberry32(epoch * 2654435761 + 1))
  const trainIds = shuffled.slice(0, Math.round(poolIds.length * 0.5))

  // 3. Evaluate every train row (student + grade), collecting the rows the
  // dataset-wide agents work from. Row histories are written as we go.
  const rows = await mapConcurrent(trainIds, CONCURRENCY, async (rowId) => {
    const evaluation = await evaluateRow(project, openEnded, outputFormatText, rowId, baselineRules)
    const { grade, student, rowText, goldenAnswer, payload } = evaluation

    insertRowHistory({
      project_id: projectId,
      row_id: rowId,
      epoch,
      taxonomy_version_id: baselineVersionId,
      answer: student.answer,
      predicted_label: student.predictedLabel,
      cited_rule_ids: student.citedRuleIds,
      rubric_score: grade.score,
      rubric_total: grade.total,
      rubric_dock: grade.dock,
      correct: grade.correct,
      continuous_correct: grade.continuousCorrect,
      diagnosis: null,
      wrong_count_before: countWrongBefore(projectId, rowId),
    })

    return {
      row_id: rowId,
      problem: rowText,
      studentAnswer: student.answer,
      score: grade.score,
      maxScore: grade.total,
      sampleAnswer: sampleAnswerFor(project, payload, goldenAnswer),
      dock: grade.dock,
      isCorrect: openEnded ? grade.continuousCorrect === true : grade.correct === true,
    }
  })

  // 4. Dataset-wide: the diagnostician groups the wrong rows, the rewriter turns
  // those groups into edits. Fewer than 2 wrong rows leaves nothing to group.
  const wrongRows = rows.filter((row) => !row.isCorrect)
  const trainMetric = openEnded
    ? computeContinuousAccuracy(rows.map((row) => ({ score: row.score, total: row.maxScore })))
    : computeClosedAccuracy(rows.map((row) => ({ correct: row.isCorrect })))
  let rewriterEdits = []
  if (wrongRows.length >= 2) {
    // The diagnostician is blind to score, dock, and sample answer, so it gets
    // only the row id, the problem, and the student's wrong answer. The rewriter
    // gets the full rows by default (score / maxScore / plain sample answer);
    // in dock-only mode it gets the rubric dock instead of the sample answer.
    const diagnosableRows = wrongRows.map((row) => ({
      row_id: row.row_id,
      problem: row.problem,
      studentAnswer: row.studentAnswer,
    }))
    const taxonomyHistoryText = buildTaxonomyHistoryText(listEpochs(projectId))
    const diagnosis = await diagnose({ taxonomyRules: baselineRules, wrongRows: diagnosableRows, taxonomyHistoryText })
    const rootCauses = diagnosis?.rootCauses ?? []
    const showDock = opts.showDockToRewriter === true
    // In dock-only mode the rewriter must receive the dock and nothing else
    // rubric-derived: no full rubric, no sample answer, no correctness flag.
    const rewriterRows = showDock
      ? wrongRows.map((row) => ({
          row_id: row.row_id,
          problem: row.problem,
          studentAnswer: row.studentAnswer,
          score: row.score,
          maxScore: row.maxScore,
          dock: row.dock,
        }))
      : wrongRows.map((row) => ({
          row_id: row.row_id,
          problem: row.problem,
          studentAnswer: row.studentAnswer,
          score: row.score,
          maxScore: row.maxScore,
          sampleAnswer: row.sampleAnswer,
          isCorrect: row.isCorrect,
        }))
    const rewritten = await rewrite({
      taxonomyRules: baselineRules,
      wrongRows: rewriterRows,
      rootCauses,
      editBudget,
      taxonomyHistoryText,
      showDock,
    })
    rewriterEdits = rewritten?.edits ?? []
  }
  appendLog(
    projectId,
    epoch,
    `train: ${trainIds.length} row(s), ${wrongRows.length} wrong, ${rewriterEdits.length} rewriter edit(s)`
  )

  // 5. Meta reads the round this epoch is gated against: its shrinkage-only
  // scorecards and its holdout metrics. It is blind to the rubric.
  const prevRound = resolvePrevRound(projectId, epoch, baselineEpoch, holdoutIds)
  const priorScorecards = prevRound ? getScorecard(projectId, prevRound.epoch) : []
  const priorEpochRow = prevRound ? getEpoch(projectId, prevRound.epoch) : undefined
  const priorMetrics =
    priorEpochRow && Object.keys(priorEpochRow.metrics_json ?? {}).length > 0
      ? priorEpochRow.metrics_json
      : null

  const meta = await runMeta({
    taxonomyRules: baselineRules,
    holdoutMetrics: priorMetrics,
    attempt: metaAttempt,
  })
  const metaEdits = dedupeEdits(meta?.edits ?? [])

  // 6. Candidate = baseline + (rewriter edits ++ meta edits). New rules are
  // numbered above every id in play, so an existing rule keeps its id forever
  // and a deleted rule's id is not handed to a new rule this epoch.
  const allEdits = dedupeEdits([...rewriterEdits, ...metaEdits])
  const highestRuleId = [...baselineRules, ...priorScorecards].reduce(
    (max, rule) => Math.max(max, Number(rule.rule_id) || 0),
    0
  )
  const candidateRules = applyEdits(baselineRules, allEdits, highestRuleId + 1)

  // 7. Candidate version.
  const candidateVersion = insertTaxonomyVersion({
    project_id: projectId,
    epoch,
    rules_json: candidateRules,
    is_candidate: 1,
    accepted: 0,
  })

  // 8. Gate eval set = a random 50% of the just-trained batch ∪ the validation
  // holdout, evaluated with the CANDIDATE rules. The 50% subset's baseline is the
  // train pass (already graded with the baseline); the holdout baseline is the
  // previous accepted round. The holdout is read only by the grader here.
  const gateTrainIds = shuffle(trainIds, mulberry32(epoch * 2654435761 + 2)).slice(
    0,
    Math.round(trainIds.length * 0.5)
  )
  const trainCandidateEvaluations = await mapConcurrent(gateTrainIds, CONCURRENCY, (rowId) =>
    evaluateRow(project, openEnded, outputFormatText, rowId, candidateRules)
  )
  const holdoutEvaluations = await mapConcurrent(holdoutIds, CONCURRENCY, (rowId) =>
    evaluateRow(project, openEnded, outputFormatText, rowId, candidateRules)
  )
  const holdoutResults = holdoutEvaluations.map((evaluation) => ({
    rowId: evaluation.rowId,
    citedRuleIds: evaluation.student.citedRuleIds,
    correct: evaluation.grade.correct,
    continuousCorrect: evaluation.grade.continuousCorrect,
    score: evaluation.grade.score,
    total: evaluation.grade.total,
  }))
  const currResults = holdoutResults.map((result) => ({
    correct: result.correct === true,
    continuousCorrect: result.continuousCorrect === true,
    score: result.score,
    total: result.total,
  }))
  const trainCandidateResults = trainCandidateEvaluations.map((evaluation) => ({
    correct: evaluation.grade.correct === true,
    continuousCorrect: evaluation.grade.continuousCorrect === true,
    score: evaluation.grade.score,
    total: evaluation.grade.total,
  }))

  // Baseline for the gate train subset, looked up from the train pass by row id.
  const rowBaseline = new Map(rows.map((row) => [row.row_id, row]))
  const trainBaselineResults = gateTrainIds.map((rowId) => {
    const row = rowBaseline.get(rowId)
    return { correct: row.isCorrect, continuousCorrect: row.isCorrect, score: row.score, total: row.maxScore }
  })
  const prevResults = prevRound ? prevRound.results : null

  // Repairs / regressions across the whole union (train + holdout).
  const trainRR = computeRepairsRegressions(trainBaselineResults, trainCandidateResults, openEnded)
  const holdoutRR = computeRepairsRegressions(prevResults, currResults, openEnded)
  const repairs = trainRR.repairs + holdoutRR.repairs
  const regressions = trainRR.regressions + holdoutRR.regressions

  // Union metric (accuracy / continuous accuracy), candidate vs baseline.
  const unionCurr = [...trainCandidateResults, ...currResults]
  const unionPrev = prevResults ? [...trainBaselineResults, ...prevResults] : trainBaselineResults
  const accuracy = computeClosedAccuracy(unionCurr)
  const continuousAccuracy = computeContinuousAccuracy(unionCurr)
  const currMetric = openEnded ? continuousAccuracy : accuracy
  const prevMetric =
    prevRound == null
      ? currMetric
      : openEnded
        ? computeContinuousAccuracy(unionPrev)
        : computeClosedAccuracy(unionPrev)

  // 9. Gate — the original APO formula on the union: repairs >= 2 AND the metric
  // drops by no more than 0.05.
  const gate =
    prevRound == null
      ? { passed: true, reason: 'Gate PASSED: first ruleset (no prior holdout round)' }
      : evaluateGate({ repairs, prevMetric, currMetric })
  const gatePassed = gate.passed
  appendLog(
    projectId,
    epoch,
    `gate-set: metric=${currMetric.toFixed(3)} prev=${prevMetric.toFixed(3)} repairs=${repairs} regressions=${regressions}`
  )
  appendLog(projectId, epoch, gate.reason)

  // 10. Record the holdout round and its scorecards. The round is recorded
  // whichever way the gate goes: a rejected candidate's results are the "before"
  // measurement the next epoch is compared against, and without them no later
  // epoch could ever show a repair.
  for (const evaluation of holdoutEvaluations) {
    const grade = evaluation.grade
    insertRowHistory({
      project_id: projectId,
      row_id: evaluation.rowId,
      epoch,
      taxonomy_version_id: candidateVersion.id,
      answer: evaluation.student.answer,
      predicted_label: evaluation.student.predictedLabel,
      cited_rule_ids: evaluation.student.citedRuleIds,
      rubric_score: grade.score,
      rubric_total: grade.total,
      rubric_dock: grade.dock,
      correct: grade.correct,
      continuous_correct: grade.continuousCorrect,
      diagnosis: null,
      wrong_count_before: countWrongBefore(projectId, evaluation.rowId),
    })
  }
  for (const card of buildScorecards(projectId, epoch, openEnded, holdoutResults, candidateRules)) {
    insertScorecard(card)
  }

  // Accept the candidate when the gate passes. On rejection the candidate is
  // left unaccepted (rejected candidate discarded; baseline unchanged): the
  // baseline for the next epoch is always the latest *accepted* version, so the
  // rejected edits never accumulate and the accepted baseline stays accepted.
  if (gatePassed) {
    insertTaxonomyVersion({
      project_id: projectId,
      epoch,
      rules_json: candidateRules,
      is_candidate: 0,
      accepted: 1,
    })
  }
  insertMetaHistory({
    project_id: projectId,
    epoch,
    reasoning: meta?.reasoning ?? '',
    edits: metaEdits,
    applied: gatePassed ? 1 : 0,
  })

  // 11. Epoch row.
  const metrics = { accuracy, continuousAccuracy, repairs, regressions, gatePassed, trainMetric }
  insertEpoch({
    project_id: projectId,
    epoch,
    status: gatePassed ? 'accepted' : 'rejected',
    train_row_ids_json: trainIds,
    baseline_version_id: baselineVersionId,
    candidate_version_id: candidateVersion.id,
    gate_passed: gatePassed ? 1 : 0,
    metrics_json: metrics,
    meta_reasoning: meta?.reasoning ?? null,
    meta_edits_json: metaEdits,
  })

  appendLog(
    projectId,
    epoch,
    `epoch ${epoch}: ${gatePassed ? 'ACCEPTED' : 'REJECTED'} (rules ${baselineRules.length} -> ${candidateRules.length})`
  )

  // 12. Summary.
  return {
    epoch,
    status: gatePassed ? 'accepted' : 'rejected',
    metric: currMetric,
    prevMetric,
    repairs,
    regressions,
    gatePassed,
    gateReason: gate.reason,
    trainRows: trainIds.length,
    holdoutRows: holdoutIds.length,
    ruleCountBefore: baselineRules.length,
    ruleCountAfter: candidateRules.length,
    editsApplied: allEdits.length,
  }
}

/**
 * Delete every row belonging to the project, then re-seed the empty baseline
 * taxonomy. The dataset itself is restored afterwards: `resetProjectData` drops
 * dataset_row too, and a restart with no rows left would have nothing left to
 * learn from.
 */
function restartRun(projectId) {
  const rows = getRows(projectId)
  resetProjectData(projectId)
  if (rows.length > 0) {
    insertRows(
      rows.map((row) => ({
        id: row.id,
        project_id: row.project_id,
        source_index: row.source_index,
        payload: row.payload,
        split: row.split,
      }))
    )
  }
  seedInitialTaxonomy(projectId)
}

/**
 * Run `numEpochs` epochs, restarting from scratch (reset + reseed, escalating
 * `attempt`) after `opts.restartThreshold` consecutive rejections.
 * @param {string} projectId
 * @param {number} numEpochs
 * @param {{restartThreshold?: number, attempt?: number, showDockToRewriter?: boolean, consecutiveRejections?: number}} [opts]
 *   `consecutiveRejections` lets a resumed run carry the previous epoch's
 *   rejection streak so the 3-strike restart can still trigger.
 * @returns {Promise<{epochs: object[], log: object[]}>}
 */
export async function runAll(projectId, numEpochs, opts = {}) {
  const project = getProject(projectId)
  if (!project) throw new Error(`runAll: unknown project ${projectId}`)

  const restartThreshold = opts.restartThreshold ?? 3
  const totalEpochs = Number(numEpochs) || 1

  const existing = listEpochs(projectId)
  let epochNumber = existing.length > 0 ? existing[existing.length - 1].epoch + 1 : 1

  let consecutiveRejections =
    Number.isInteger(opts.consecutiveRejections) && opts.consecutiveRejections >= 0
      ? opts.consecutiveRejections
      : 0
  let restarts = opts.attempt ?? 0

  const epochs = []
  for (let i = 0; i < totalEpochs; i++) {
    const epoch = epochNumber++
    // Rejections since the last restart, plus one for every restart already
    // taken: the meta agent sees a growing "you already tried, try differently".
    metaAttempt = consecutiveRejections + restarts

    const summary = await runEpoch(projectId, epoch, opts)
    epochs.push(summary)

    if (summary.gatePassed) {
      consecutiveRejections = 0
      continue
    }

    consecutiveRejections++
    if (consecutiveRejections >= restartThreshold) {
      restarts++
      consecutiveRejections = 0
      restartRun(projectId)
      appendLog(
        projectId,
        epoch,
        `RESTART — resetting taxonomy, attempt ${restarts} (${restartThreshold} consecutive rejections)`
      )
    }
  }

  return { epochs, log: getLog(projectId) }
}
