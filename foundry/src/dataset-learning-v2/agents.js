/**
 * Agent functions for dataset-learning-v2.
 *
 * Turns llm.js + prompts.js into the six callable agents the engine drives:
 * the one-time rubric overseer, the student, its grader, the blind
 * diagnostician, the rewriter, and the meta overseer.
 *
 * Parsing stance: every function that consumes model output parses defensively.
 * Malformed output degrades to an empty/neutral result ([] / '' / score 0)
 * rather than throwing — the engine decides what a failed parse means. Parse
 * callbacks are total, so `runJsonLLM` can only throw on transport failures
 * (network, timeout, non-2xx), and those are allowed to propagate.
 */

import { guardedChatCompletion, runJsonLLM, stripFences } from './llm.js'
import {
  buildCitationInstruction,
  buildDiagnosisSystemPrompt,
  buildDiagnosisUserContent,
  buildHoldoutMetricsText,
  buildMetaSystemPrompt,
  buildMetaUserContent,
  buildOutputFormatText,
  buildOverseerSystemPrompt,
  buildOverseerUserContent,
  buildProposerSystemPrompt,
  buildProposerUserContent,
  buildRootCausesText,
  buildRubricGraderSystemPrompt,
  buildRubricGraderUserContent,
  buildStudentSystemPrompt,
  buildStudentUserPrompt,
  buildTaxonomyText,
  buildWrongRowsText,
  renderTemplate,
} from './prompts.js'

export const VALID_OPS = new Set(['append', 'edit', 'combine', 'delete'])

/**
 * Render a project system_prompt against one row payload.
 * @param {string} systemPrompt
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
export function renderRowPrompt(systemPrompt, payload) {
  return renderTemplate(systemPrompt, payload)
}

// ---------------------------------------------------------------------------
// Overseer — normalize any rubric text into [{criterion, max}]
// ---------------------------------------------------------------------------

/**
 * Convert an arbitrary rubric into a normalized criteria array.
 * @param {string} rawRubric
 * @returns {Promise<Array<{criterion: string, max: number}>>} [] when unparseable
 */
export async function overseerStandardizeRubric(rawRubric) {
  const { parsed } = await runJsonLLM({
    systemPrompt: buildOverseerSystemPrompt(),
    userContent: buildOverseerUserContent(rawRubric),
    parse: (json) => normalizeRubric(json),
  })
  return parsed
}

// ---------------------------------------------------------------------------
// Student
// ---------------------------------------------------------------------------

/**
 * Answer one row with the current taxonomy.
 * @param {Object} args
 * @param {string} args.renderedBasePrompt
 * @param {Array<{rule_id: number, text: string}>} args.taxonomyRules
 * @param {string|Object} args.outputFormat
 * @param {string} args.rowText
 * @param {boolean|number} args.openEnded
 * @returns {Promise<{answer: string, citedRuleIds: number[], predictedLabel: string}>}
 */
export async function runStudent({ renderedBasePrompt, taxonomyRules, outputFormat, rowText, openEnded }) {
  const taxonomyText = buildTaxonomyText(taxonomyRules)
  const hasTaxonomy = (renderedBasePrompt ?? '').includes('{{taxonomy}}')
  const basePrompt = hasTaxonomy
    ? renderedBasePrompt.replaceAll('{{taxonomy}}', taxonomyText || '(no rules yet)')
    : renderedBasePrompt
  const userContent = hasTaxonomy
    ? (rowText ?? '').replaceAll('{{taxonomy}}', taxonomyText || '(no rules yet)')
    : rowText

  const systemPrompt = buildStudentSystemPrompt({
    basePrompt,
    taxonomyText: hasTaxonomy ? '' : taxonomyText,
    outputFormatText: buildOutputFormatText(outputFormat),
    citationInstruction: buildCitationInstruction(),
  })

  const { response } = await guardedChatCompletion([
    { role: 'system', content: systemPrompt },
    buildStudentUserPrompt(userContent),
  ])

  const answer = response?.content ?? ''
  const parsed = parseJsonObject(answer)
  const labelKey = firstOutputKey(outputFormat)

  let predictedLabel = answer
  if (parsed && labelKey && parsed[labelKey] != null) {
    predictedLabel = String(parsed[labelKey])
  }

  return {
    answer,
    citedRuleIds: toRuleIds(parsed?.cited_rules),
    predictedLabel,
  }
}

// ---------------------------------------------------------------------------
// Grader
// ---------------------------------------------------------------------------

/**
 * Grade a student answer against the golden answer (closed) or the rubric (open).
 * @param {Object} args
 * @returns {Promise<{correct: boolean|null, continuousCorrect: boolean, score: number, total: number, dock: Array|null}>}
 */
export async function gradeStudent({
  openEnded,
  predictedLabel,
  goldenAnswer,
  rubric,
  outputFormatText,
  question,
  studentAnswer,
}) {
  if (!openEnded) {
    const correct = normalizeLabel(predictedLabel) === normalizeLabel(goldenAnswer)
    return { correct, continuousCorrect: correct, score: correct ? 1 : 0, total: 1, dock: null }
  }

  const rubricTotal = rubricTotalFromText(rubric)
  const { parsed } = await runJsonLLM({
    systemPrompt: buildRubricGraderSystemPrompt(),
    userContent: buildRubricGraderUserContent({ question, studentAnswer: predictedLabel, rubric, outputFormatText }),
    parse: (json) => parseGrading(json, rubricTotal),
  })

  const { score, total, dock } = parsed
  const continuousCorrect = total > 0 && score / total >= 0.8
  return { correct: null, continuousCorrect, score, total, dock }
}

// ---------------------------------------------------------------------------
// Diagnostician (blind) and rewriter
// ---------------------------------------------------------------------------

/**
 * Group all wrong rows this epoch into at most 3 dataset-wide root causes.
 * Blind to score, rubric, and the correct answer.
 * @param {Object} args
 * @param {Array<{rule_id: number, text: string}>} args.taxonomyRules
 * @param {Array<{row_id: string|number, problem: string, studentAnswer: string}>} args.wrongRows
 * @returns {Promise<{rootCauses: Array<{root_cause: string, problem_ids: Array<string|number>}>}>} [] when unparseable
 */
export async function diagnose({ taxonomyRules, wrongRows, taxonomyHistoryText }) {
  const { parsed } = await runJsonLLM({
    systemPrompt: buildDiagnosisSystemPrompt(),
    userContent: buildDiagnosisUserContent({
      taxonomyText: buildTaxonomyText(taxonomyRules),
      wrongRowsText: buildWrongRowsText(wrongRows),
      taxonomyHistoryText,
    }),
    parse: parseDiagnosis,
  })
  return parsed
}

/**
 * Rewrite the taxonomy to address the diagnostician's root causes. By default
 * sees the wrong rows (with score / maxScore / plain sample answer) and the
 * root causes; blind to the rubric, per-criterion dock, prior history, and
 * scorecards. With `showDock`, the rows carry the rubric dock (criterion,
 * points, reason) instead; the full rubric is still withheld.
 * @param {Object} args
 * @param {boolean} [args.showDock=false]
 * @returns {Promise<{reasoning: string, edits: Array<Object>}>}
 */
export async function rewrite({ taxonomyRules, wrongRows, rootCauses, editBudget, taxonomyHistoryText, showDock = false }) {
  const { parsed } = await runJsonLLM({
    systemPrompt: buildProposerSystemPrompt(showDock),
    userContent: buildProposerUserContent({
      taxonomyText: buildTaxonomyText(taxonomyRules),
      wrongRowsText: buildWrongRowsText(wrongRows),
      rootCausesText: buildRootCausesText(rootCauses),
      editBudget,
      taxonomyHistoryText,
      showDock,
    }),
    parse: parseReasoningEdits,
  })
  return parsed
}

// ---------------------------------------------------------------------------
// Meta overseer
// ---------------------------------------------------------------------------

/**
 * Automatic eyes over the whole taxonomy: read the scorecards and holdout
 * metrics and act only on clear catastrophes (delete an egregious rule, or
 * delete/edit an obviously over-fitted one). Normally returns no edits.
 * @param {Object} args
 * @param {Array<{rule_id: number, text: string}>} args.taxonomyRules
 * @param {Array<{rule_id: number, shrinkage_association: number}>} args.scorecards
 * @param {Object|null} args.holdoutMetrics
 * @param {number} args.attempt  Consecutive-rejection count (>0 means: retry differently).
 * @returns {Promise<{reasoning: string, edits: Array<Object>}>}
 */
export async function runMeta({ taxonomyRules, holdoutMetrics, attempt }) {
  const { parsed } = await runJsonLLM({
    systemPrompt: buildMetaSystemPrompt(),
    userContent: buildMetaUserContent({
      taxonomyText: buildTaxonomyText(taxonomyRules),
      holdoutMetricsText: buildHoldoutMetricsText(holdoutMetrics),
      attempt,
    }),
    parse: parseReasoningEdits,
  })
  return parsed
}

// ---------------------------------------------------------------------------
// Edit parsing
// ---------------------------------------------------------------------------

/**
 * Extract the valid edit list from a model response. Never throws.
 * @param {string} text
 * @returns {Array<{op: string, text?: string, rule_id?: number, rule_ids?: number[]}>}
 */
export function parseEdits(text) {
  const obj = parseJsonObject(text)
  if (!obj || Array.isArray(obj) || !Array.isArray(obj.edits)) return []

  const edits = []
  for (const entry of obj.edits) {
    const edit = normalizeEdit(entry)
    if (edit) edits.push(edit)
  }
  return edits
}

function normalizeEdit(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null
  if (!VALID_OPS.has(entry.op)) return null

  if (entry.op === 'delete') {
    const ruleId = toRuleId(entry.rule_id)
    if (ruleId === null) return null
    return { op: 'delete', rule_id: ruleId }
  }

  if (typeof entry.text !== 'string' || entry.text.trim() === '') return null

  if (entry.op === 'append') return { op: 'append', text: entry.text }

  if (entry.op === 'edit') {
    const ruleId = toRuleId(entry.rule_id)
    if (ruleId === null) return null
    return { op: 'edit', rule_id: ruleId, text: entry.text }
  }

  const ruleIds = toRuleIds(entry.rule_ids)
  if (ruleIds.length === 0) return null
  return { op: 'combine', rule_ids: ruleIds, text: entry.text }
}

// ---------------------------------------------------------------------------
// Parse helpers
// ---------------------------------------------------------------------------

function parseReasoningEdits(json) {
  const obj = parseJsonObject(json)
  return {
    reasoning: firstString(obj?.reasoning),
    edits: parseEdits(json),
  }
}

function parseDiagnosis(json) {
  const obj = parseJsonObject(json)
  return { rootCauses: toRootCauses(obj?.root_causes) }
}

function toRootCauses(value) {
  if (!Array.isArray(value)) return []
  const causes = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const rootCause = firstString(entry.root_cause)
    if (!rootCause) continue
    const problemIds = Array.isArray(entry.problem_ids) ? entry.problem_ids : []
    causes.push({ root_cause: rootCause, problem_ids: problemIds })
  }
  return causes
}

export function parseGrading(json, fallbackTotal) {
  const obj = parseJsonObject(json)
  const trueTotal = fallbackTotal > 0 ? fallbackTotal : 0
  if (!obj || Array.isArray(obj)) {
    return { score: 0, total: trueTotal, dock: [] }
  }

  // The rubric's positive-weight sum is the true denominator. The grader's
  // reported total is only a fallback when the rubric has no usable weights, so
  // a grader that under-reports 56 for a 71-point rubric cannot shrink the total.
  const total = trueTotal > 0 ? trueTotal : positiveNumber(obj.total, 0)
  const score = total > 0 ? Math.min(Math.max(Number(obj.score) || 0, 0), total) : 0
  return { score, total, dock: toDock(obj.dock) }
}

/**
 * Recover the rubric's total points from its text, so a grader that omits or
 * zeroes `total` still gets the correct denominator. Handles the standardized
 * JSON form ([{criterion,max}]) and the frontier "Points: X, Item: ..." form.
 * @param {string|undefined} rubric
 * @returns {number}
 */
export function rubricTotalFromText(rubric) {
  if (!rubric || typeof rubric !== 'string') return 0
  try {
    const parsed = JSON.parse(rubric)
    if (Array.isArray(parsed)) {
      let total = 0
      for (const item of parsed) {
        const w = Number(item?.weight ?? item?.max) || 0
        if (w > 0) total += w
      }
      if (total > 0) return total
    }
  } catch {
    // not JSON — fall through to "Points:" extraction
  }
  let total = 0
  for (const m of rubric.matchAll(/Points:\s*([0-9.]+)/gi)) total += parseFloat(m[1]) || 0
  return total
}

/**
 * Normalize a rubric from a JSON string, an array, or an object wrapping one.
 * @param {string|Array|Object|null|undefined} value
 * @returns {Array<{criterion: string, max: number}>}
 */
function normalizeRubric(value) {
  let list = typeof value === 'string' ? safeParseJson(value) : value

  if (!Array.isArray(list)) {
    if (list && typeof list === 'object') {
      const nested = list.criteria ?? list.rubric
      list = Array.isArray(nested) ? nested : []
    } else {
      list = []
    }
  }

  const criteria = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const criterion = typeof item.criterion === 'string' ? item.criterion.trim() : ''
    const max = Number(item.max)
    if (!criterion || !Number.isFinite(max) || max <= 0) continue
    criteria.push({ criterion, max })
  }
  return criteria
}

function parseJsonObject(text) {
  const parsed = safeParseJson(text)
  if (!parsed || typeof parsed !== 'object') return null
  return parsed
}

function safeParseJson(text) {
  if (typeof text !== 'string') return null
  const candidate = stripFences(text)
  if (!candidate) return null
  try {
    return JSON.parse(candidate)
  } catch {
    return null
  }
}

function toDock(value) {
  if (!Array.isArray(value)) return []
  const dock = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const points = Number(entry.points)
    if (!Number.isFinite(points)) continue
    dock.push({
      criterion: firstString(entry.criterion),
      points,
      reason: firstString(entry.reason),
    })
  }
  return dock
}

/** First non-empty key of the project's output_format, or null. */
function firstOutputKey(outputFormat) {
  let value = outputFormat
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value.trim())
    } catch {
      return null
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const keys = Object.keys(value)
  return keys.length > 0 ? keys[0] : null
}

function normalizeLabel(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/["'“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toRuleId(value) {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) return Number(value.trim())
  return null
}

function toRuleIds(value) {
  if (!Array.isArray(value)) return []
  const ids = []
  for (const entry of value) {
    const id = toRuleId(entry)
    if (id !== null) ids.push(id)
  }
  return ids
}

function positiveNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === 'string') return value
  }
  return ''
}
