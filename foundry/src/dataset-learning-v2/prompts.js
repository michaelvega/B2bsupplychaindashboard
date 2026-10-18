/**
 * Template rendering + every agent prompt builder for dataset-learning-v2.
 *
 * Pure string builders: no I/O, no llm import, no db import. Callers (agents.js,
 * engine.js) own the round trips; this module only produces text.
 */

/**
 * Render a `{{field}}` template against a row payload.
 *
 * Every `{{name}}` whose `name` is a key of `payload` is replaced with
 * `String(payload[name] ?? '')`. Placeholders whose name is NOT a key are left
 * untouched (the literal `{{name}}` survives). Only mentioned vars appear;
 * unmentioned columns never appear.
 *
 * @param {string} systemPrompt
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
export function renderTemplate(systemPrompt, payload) {
  let rendered = systemPrompt ?? ''
  for (const [key, value] of Object.entries(payload ?? {})) {
    rendered = rendered.replaceAll(`{{${key}}}`, value == null ? '' : String(value))
  }
  return rendered
}

/**
 * Build the full student system prompt.
 *
 * Layout:
 *   <rendered base prompt>
 *   (if taxonomyText non-empty) "\n\nGeneralizable inductive rules (cite these by number):\n" + taxonomyText
 *   "\n\n" + outputFormatText
 *   "\n\n" + citationInstruction
 *
 * @param {Object} args
 * @param {string} args.basePrompt          Already template-rendered base prompt.
 * @param {string} args.taxonomyText
 * @param {string} args.outputFormatText
 * @param {string} args.citationInstruction
 * @returns {string}
 */
export function buildStudentSystemPrompt({ basePrompt, taxonomyText, outputFormatText, citationInstruction }) {
  let prompt = basePrompt ?? ''
  if (taxonomyText) {
    prompt += '\n\nGeneralizable inductive rules (cite these by number):\n' + taxonomyText
  }
  if (outputFormatText) {
    prompt += '\n\n' + outputFormatText
  }
  if (citationInstruction) {
    prompt += '\n\n' + citationInstruction
  }
  return prompt
}

/**
 * Wrap the per-row user text as a chat message.
 * @param {string} rowText  Rendered template, or the whole payload as key: value lines.
 * @returns {{role: 'user', content: string}}
 */
export function buildStudentUserPrompt(rowText) {
  return { role: 'user', content: rowText == null ? '' : String(rowText) }
}

/**
 * Render taxonomy rules as a numbered list, one per line, numbered by rule_id.
 * @param {Array<{rule_id: number, text: string}>} rules
 * @returns {string}
 */
export function buildTaxonomyText(rules) {
  if (!rules || rules.length === 0) return ''
  return rules.map((rule) => `${rule.rule_id}. ${rule.text}`).join('\n')
}

/**
 * Describe the required answer format from the project's output_format.
 * @param {string|Object|null|undefined} outputFormat  JSON object string, or object.
 * @returns {string} '' when outputFormat is empty/null.
 */
export function buildOutputFormatText(outputFormat) {
  if (outputFormat == null || outputFormat === '') return ''
  let value = outputFormat
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    try {
      value = JSON.parse(trimmed)
    } catch {
      return 'You must answer in exactly this JSON format, filling the value(s) to match each description:\n' + trimmed
    }
  }
  return 'You must answer in exactly this JSON format, filling the value(s) to match each description:\n' + JSON.stringify(value, null, 2)
}

/**
 * The fixed instruction that makes the student self-report cited rules.
 * @returns {string}
 */
export function buildCitationInstruction() {
  return 'After answering, include a "cited_rules" array of the rule number(s) you used (e.g. {"cited_rules":[1,3]}). If you used none, use [].'
}

// ---------------------------------------------------------------------------
// Overseer (rubric standardization) — open-ended only
// ---------------------------------------------------------------------------

/**
 * @returns {string}
 */
export function buildOverseerSystemPrompt() {
  return `You are a rubric standardization module.

You will be given a rubric in any form — plain prose, a bulleted list, a markdown table, a scoring guide, or already-structured JSON. Convert it into a single normalized JSON array of criteria.

Rules:
- Every criterion gets a short label (a few words, not a sentence) and a maximum point value.
- "max" must be a positive number. Integers are preferred; 0.5 steps are allowed when the source rubric uses them.
- Preserve the source rubric's relative weighting: a criterion worth twice as much must keep twice the max.
- If the source rubric gives no explicit point values, distribute points evenly across criteria.
- Do not invent criteria that the source rubric does not contain, and do not drop any it does contain.
- Merge duplicate or near-duplicate criteria into one.

Return ONLY the JSON array, no preamble, no markdown fences, no trailing text:
[{"criterion":"<short label>","max":<number>}]`
}

/**
 * @param {string} rawRubric
 * @returns {string}
 */
export function buildOverseerUserContent(rawRubric) {
  return `Convert the following rubric into the normalized JSON array of criteria.

<rubric>
${rawRubric ?? ''}
</rubric>

Return ONLY the JSON array.`
}

// ---------------------------------------------------------------------------
// Rubric grader (open-ended)
// ---------------------------------------------------------------------------

/**
 * @returns {string}
 */
export function buildRubricGraderSystemPrompt() {
  return `You are a strict, consistent grader for open-ended answers.

You will be given a question, a student answer, and a rubric of criteria. Each criterion has:
- "criterion": what the answer must satisfy (or must NOT do).
- "weight": the points for that criterion. POSITIVE weight = award up to that many points when satisfied (partial credit allowed). NEGATIVE weight = a penalty: deduct that many points when the answer violates it.
- "axis": a category label (informational only).

Your job:
1. Evaluate the student answer against every criterion independently.
2. For each POSITIVE-weight criterion, award from 0 up to its weight, with partial credit for partial satisfaction.
3. For each NEGATIVE-weight criterion, deduct its absolute weight ONLY if the answer violates it (otherwise 0).
4. "score" = (sum of awarded positive points) minus (sum of violated negative penalties), clamped to [0, total].
5. "total" = sum of every POSITIVE weight only.
6. List every deduction in "dock": the criterion, the points docked (a positive number), and a one-sentence reason.

Be consistent: identical answers must receive identical scores. Do not reward length or verbosity by itself. Do not penalize an answer for omitting something the rubric does not ask for.

Return ONLY a JSON object in exactly this shape, no preamble and no markdown fences:
{"score":<number>,"total":<number>,"dock":[{"criterion":"...","points":<number>,"reason":"..."}]}

where "points" in each dock entry is the amount deducted (positive).`
}

/**
 * @param {Object} args
 * @param {string} args.question
 * @param {string} args.studentAnswer
 * @param {string} args.rubric
 * @param {string} [args.outputFormatText]
 * @returns {string}
 */
export function buildRubricGraderUserContent({ question, studentAnswer, rubric, outputFormatText }) {
  const parts = []

  parts.push('<question>')
  parts.push(question ?? '')
  parts.push('</question>')

  parts.push('')
  parts.push('<student-answer>')
  parts.push(studentAnswer ?? '')
  parts.push('</student-answer>')

  parts.push('')
  parts.push('<rubric>')
  parts.push(formatJson(rubric, '(no rubric)'))
  parts.push('</rubric>')

  if (outputFormatText) {
    parts.push('')
    parts.push('<expected-output-format>')
    parts.push(outputFormatText)
    parts.push('</expected-output-format>')
  }

  parts.push('')
  parts.push('Return ONLY the JSON grading object.')

  return parts.join('\n')
}

// ---------------------------------------------------------------------------
// Diagnostician — BLIND: dataset-wide, unsupervised, no score / rubric / answer
// ---------------------------------------------------------------------------

/**
 * @returns {string}
 */
export function buildDiagnosisSystemPrompt() {
  return `You are a failure diagnostician for an unsupervised taxonomy-learning loop.

A student model classifies rows using a taxonomy of numbered inductive rules. You are shown the whole taxonomy, EVERY row the student got wrong this epoch, and the history of past taxonomy changes (whether each epoch's edits were ACCEPTED or REJECTED by the gate). You do NOT see the score, the grading rubric, or the correct answer — only that these answers were wrong.

Your job: group the wrong rows into at most 3 ROOT CAUSES of the taxonomy. A root cause is a generalizable defect in the taxonomy that explains a GROUP of failures, not a fact about one row.

Look for the most likely defects:
- The taxonomy has no rule covering this case.
- The taxonomy has a rule, but it is ambiguous, over-broad, or contradicted by another rule.
- The problem contains a signal that no rule keys on.
- The taxonomy's rules over-fit the surface wording of the problem rather than its underlying pattern.

Guidelines:
- Each root cause must reference at least 2 distinct problem_ids.
- One problem may appear in more than one root cause when several defects overlap.
- Diagnose the taxonomy, not the student. Do not guess the correct answers.
- If a past taxonomy change was REJECTED, treat it as evidence: find the pattern in what failed and reflect it in your root causes.
- Be specific and generalizable: name the missing or faulty distinction in terms that would also cover other rows like these.

Return ONLY a short JSON object, no preamble and no markdown fences:
{"root_causes":[{"root_cause":"...","problem_ids":["...","..."]}]}

When there are fewer than 2 wrong rows there is nothing to group; return {"root_causes":[]}.`
}

/**
 * @param {Object} args
 * @param {string} args.taxonomyText
 * @param {string} args.wrongRowsText  Rendered wrong rows (row_id + problem + student answer; no score).
 * @returns {string}
 */
/**
 * Render the history of past taxonomy changes (one line per epoch), so the
 * diagnostician/rewriter can see what was tried and whether it survived the gate.
 * @param {Array<{epoch: number, status: string, metrics_json: Object}>} epochs
 * @returns {string}
 */
export function buildTaxonomyHistoryText(epochs) {
  if (!epochs || epochs.length === 0) return ''
  return epochs
    .map((e) => {
      const m = e.metrics_json ?? {}
      const rr = m.repairs != null ? ` (repairs ${m.repairs}, regressions ${m.regressions})` : ''
      return `Epoch ${e.epoch}: ${e.status}${rr}`
    })
    .join('\n')
}

export function buildDiagnosisUserContent({ taxonomyText, wrongRowsText, taxonomyHistoryText }) {
  const parts = []

  parts.push('<taxonomy>')
  parts.push(taxonomyText || '(empty taxonomy)')
  parts.push('</taxonomy>')

  if (taxonomyHistoryText) {
    parts.push('')
    parts.push('<taxonomy-change-history>')
    parts.push(taxonomyHistoryText)
    parts.push('</taxonomy-change-history>')
  }

  parts.push('')
  parts.push('<wrong-rows>')
  parts.push(wrongRowsText || '(no wrong rows)')
  parts.push('</wrong-rows>')

  parts.push('')
  parts.push('Group these wrong rows into at most 3 root causes. If the most recent taxonomy change was REJECTED, look for the pattern in what keeps failing and reflect it in your root causes. Return ONLY {"root_causes":[{"root_cause":"...","problem_ids":["...","..."]}]}.')

  return parts.join('\n')
}

// ---------------------------------------------------------------------------
// Rewriter (proposer) — sees wrong rows + score + sample answer + root causes
// ---------------------------------------------------------------------------

/**
 * @param {boolean} [showDock=false] Describe the rubric dock as the rewriter's
 *   signal instead of a sample answer. The full rubric stays hidden.
 * @returns {string}
 */
export function buildProposerSystemPrompt(showDock = false) {
  if (!showDock) {
    return `You are a taxonomy analyst who writes GENERALIZABLE INDUCTIVE RULES.

You are shown the current taxonomy, every row the student got wrong this epoch (the problem, the student's wrong answer, its score and maximum, and a plain reference sample answer), the diagnostician's root causes for those failures, and the history of past taxonomy changes (whether each epoch's edits were ACCEPTED or REJECTED by the gate). You do NOT see the grading rubric, any per-criterion deductions, or the scorecards.

Think of the taxonomy as a whole: which distinction is it missing, blurring, or over-committing to? Your edits must describe a general principle that holds for many rows, not a fact about one row.

Hard constraints:
- Prefer BROAD, generalizable rules over narrow ones.
- Never copy a sample answer verbatim, and never write a rule that embeds a specific sample, literal value, or the wording of a single row.
- Never write a rule that merely restates a row's answer.
- Never propose an edit identical to a rule already in the taxonomy.
- If a past change was REJECTED, do not repeat its logic: identify the pattern in what failed and propose a different approach this epoch.

When the wrong answers SURPRISE you — the taxonomy already seemed to cover them — do not patch the single case. Find the pattern behind the surprises, form an assumption about the meta-strategy the taxonomy is missing, and encode that higher-level principle. Well-chosen assumptions that generalize are exactly what is wanted.

You have three edit operations:
- append:  {"op":"append","text":"<new generalizable rule>"}
- edit:    {"op":"edit","rule_id":N,"text":"<replacement text for rule N>"}
- combine: {"op":"combine","rule_ids":[N,M],"text":"<single merged generalizable rule>"}

Return ONLY a JSON object in exactly this shape, no preamble and no markdown fences:
{"reasoning":"<why these edits address the root causes>","edits":[ ...edits... ]}`
  }
  return `You are a taxonomy analyst who writes GENERALIZABLE INDUCTIVE RULES.

You are shown the current taxonomy, every row the student got wrong this epoch (the problem, the student's wrong answer, its score and maximum, and the grader's rubric DOCK for that answer: each docked criterion, the points deducted, and the reason), the diagnostician's root causes for those failures, and the history of past taxonomy changes (whether each epoch's edits were ACCEPTED or REJECTED by the gate). You do NOT see the full grading rubric, a correct/sample answer, or the scorecards.

The dock tells you WHERE the answer lost points, not the full rubric. Use it to infer the general defect in the taxonomy. Think of the taxonomy as a whole: which distinction is it missing, blurring, or over-committing to? Your edits must describe a general principle that holds for many rows, not a fact about one row.

Hard constraints:
- Prefer BROAD, generalizable rules over narrow ones.
- Never copy rubric text, a criterion name, a deduction reason, or a row's wording verbatim into a rule.
- Never write a rule that embeds a specific row, literal value, entity name, or number.
- Never write a rule that merely restates a row's answer.
- Never propose an edit identical to a rule already in the taxonomy.
- If a past change was REJECTED, do not repeat its logic: identify the pattern in what failed and propose a different approach this epoch.

When the docked criteria SURPRISE you — the taxonomy already seemed to cover them — do not patch the single case. Find the pattern behind the surprises, form an assumption about the meta-strategy the taxonomy is missing, and encode that higher-level principle. Well-chosen assumptions that generalize are exactly what is wanted.

You have three edit operations:
- append:  {"op":"append","text":"<new generalizable rule>"}
- edit:    {"op":"edit","rule_id":N,"text":"<replacement text for rule N>"}
- combine: {"op":"combine","rule_ids":[N,M],"text":"<single merged generalizable rule>"}

Return ONLY a JSON object in exactly this shape, no preamble and no markdown fences:
{"reasoning":"<why these edits address the root causes>","edits":[ ...edits... ]}`
}

/**
 * Build the rewriter's user content.
 * @param {Object} args
 * @param {string} args.taxonomyText
 * @param {string} args.wrongRowsText   Rendered wrong rows, including score / maxScore / sampleAnswer.
 * @param {string} args.rootCausesText  Rendered diagnostician root causes.
 * @param {number} args.editBudget      Max edits to propose (default 3).
 * @param {boolean} [args.showDock=false] The wrong rows carry rubric dock
 *   entries; the closing instruction forbids quoting rubric/row text.
 * @returns {string}
 */
export function buildProposerUserContent({ taxonomyText, wrongRowsText, rootCausesText, editBudget, taxonomyHistoryText, showDock = false }) {
  const budget = Number(editBudget) || 3
  const parts = []

  parts.push('<taxonomy>')
  parts.push(taxonomyText || '(empty taxonomy)')
  parts.push('</taxonomy>')

  if (taxonomyHistoryText) {
    parts.push('')
    parts.push('<taxonomy-change-history>')
    parts.push(taxonomyHistoryText)
    parts.push('</taxonomy-change-history>')
  }

  parts.push('')
  parts.push('<wrong-rows>')
  parts.push(wrongRowsText || '(no wrong rows)')
  parts.push('</wrong-rows>')

  parts.push('')
  parts.push('<root-causes>')
  parts.push(rootCausesText || '(no root causes)')
  parts.push('</root-causes>')

  parts.push('')
  if (showDock) {
    parts.push(
      'Propose at most ' + budget + " edit(s) that address the root causes and generalize to rows beyond these. If the most recent taxonomy change was REJECTED, identify the pattern in what failed and avoid repeating it. Prefer broad rules over narrow ones; when the wrongs surprise you, find the underlying pattern and encode a strategy rather than patching a single row. Use the rubric dock to identify the general defect, but never copy rubric text, a criterion name, a deduction reason, or a row's wording into a rule. Return ONLY the JSON object."
    )
  } else {
    parts.push('Propose at most ' + budget + ' edit(s) that address the root causes and generalize to rows beyond these. If the most recent taxonomy change was REJECTED, identify the pattern in what failed and avoid repeating it. Prefer broad rules over narrow ones; when the wrongs surprise you, find the underlying pattern and encode a strategy rather than patching a single row. Never copy a sample answer verbatim. Return ONLY the JSON object.')
  }

  return parts.join('\n')
}

// ---------------------------------------------------------------------------
// Meta agent — neutered: automatic eyes for clear catastrophes only
// ---------------------------------------------------------------------------

/**
 * @returns {string}
 */
export function buildMetaSystemPrompt() {
  return `You are the META agent of a taxonomy-learning loop — an automatic pair of eyes, not a strategist.

You never answer a question yourself and you never invent new rules. You read the taxonomy and the holdout metrics, and you act ONLY on clear catastrophes. Ordinary weak rules are not yours to fix; the rewriter handles those. When nothing is a clear catastrophe you return no edits.

You may take exactly one action:

DELETE or EDIT an obviously over-fitted rule. When a rule's text repeats a concrete artifact — a specific number, name, or quoted string — six (6) or more times, remove it with {"op":"delete","rule_id":N}, or generalize it in place with {"op":"edit","rule_id":N,"text":"<generalized replacement>"}.

Nothing else. Do NOT append or combine rules, do NOT touch merely weak rules, and do NOT edit a rule that does not show obvious over-fitting.

Return ONLY a JSON object in exactly this shape, no preamble and no markdown fences:
{"reasoning":"...","edits":[ ...deletes and edits... ]}`
}

/**
 * Build the meta agent's user content.
 * @param {Object} args
 * @param {string} args.taxonomyText
 * @param {string} args.holdoutMetricsText
 * @param {number} args.attempt  Consecutive-rejection count (>0 means: retry differently).
 * @returns {string}
 */
export function buildMetaUserContent({ taxonomyText, holdoutMetricsText, attempt }) {
  const tries = Number(attempt) || 0
  const parts = []

  parts.push('<taxonomy>')
  parts.push(taxonomyText || '(empty taxonomy)')
  parts.push('</taxonomy>')

  parts.push('')
  parts.push('<holdout-metrics>')
  parts.push(holdoutMetricsText || '(none)')
  parts.push('</holdout-metrics>')

  parts.push('')
  parts.push('Act only on a clear catastrophe: delete or generalize a rule whose text repeats a concrete artifact 6+ times. Otherwise return {"reasoning":"...","edits":[]}. Do not invent new rules.')

  if (tries > 0) {
    parts.push('')
    parts.push(`RETRY: your last ${tries} proposal(s) were REJECTED. Re-examine the metrics for a clear over-fit catastrophe, but do not invent new rules.`)
  }

  parts.push('')
  parts.push('Return ONLY {"reasoning":"...","edits":[...]}.')

  return parts.join('\n')
}

// ---------------------------------------------------------------------------
// Text builders for the data blocks the prompts above embed
// ---------------------------------------------------------------------------

/**
 * Render rubric deductions as lines.
 * @param {Array<{criterion: string, points: number, reason: string}>} dock
 * @returns {string}
 */
export function buildRubricDockText(dock) {
  if (!dock || dock.length === 0) return '(no deductions)'
  return dock
    .map((entry) => `Criterion '${entry.criterion}': -${entry.points} — ${entry.reason ?? ''}`)
    .join('\n')
}

/**
 * Render a row's prior attempts as compact lines.
 * @param {Array<{epoch: number, answer: string, predicted_label: string, diagnosis: string, correct: boolean, wrong_count_before: number}>} history
 * @returns {string}
 */
export function buildHistoryText(history) {
  if (!history || history.length === 0) return '(no prior attempts on this row)'
  return history
    .map((entry) => {
      const bits = [
        `epoch ${entry.epoch}`,
        `predicted=${JSON.stringify(entry.predicted_label ?? '')}`,
        `correct=${entry.correct === true ? 'yes' : entry.correct === false ? 'no' : 'n/a'}`,
        `wrong_count_before=${entry.wrong_count_before ?? 0}`,
      ]
      if (entry.answer != null && entry.answer !== '') bits.push(`answer=${JSON.stringify(entry.answer)}`)
      if (entry.diagnosis) bits.push(`diagnosis=${JSON.stringify(entry.diagnosis)}`)
      return bits.join(' | ')
    })
    .join('\n')
}

/**
 * Render the dataset-wide wrong rows for the diagnostician and rewriter.
 *
 * Only the fields present on each row are rendered, so callers enforce the
 * information boundary: rows handed to the diagnostician carry no `score` /
 * `maxScore` / `sampleAnswer`, while rows handed to the rewriter do.
 *
 * @param {Array<{row_id: string|number, problem: string, studentAnswer: string, score?: number, maxScore?: number, dock?: Array<{criterion?: string, points?: number, reason?: string}>, sampleAnswer?: string|null}>} wrongRows
 * @returns {string}
 */
// Hard cap the rendered wrong-row payload. ResearchRubrics prompts and
// open-ended student answers can be very long; sending all wrong rows
// verbatim pushed the epoch-5 diagnostician prompt past Gemini's 1M-token
// context. Keep a representative sample and truncate each field. The
// diagnostician only needs enough rows to group into root causes, and the
// rewriter only needs enough examples to design edits.
const MAX_WRONG_ROWS_RENDERED = 24
const MAX_ROW_FIELD_CHARS = 3000
const MAX_DOCK_ENTRIES = 8
const MAX_DOCK_FIELD_CHARS = 800

function truncatePromptText(value, maxChars) {
  const text = String(value ?? '')
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars)} … [truncated ${text.length - maxChars} chars]`
}

export function buildWrongRowsText(wrongRows) {
  if (!wrongRows || wrongRows.length === 0) return '(no wrong rows)'
  const rows = wrongRows.slice(0, MAX_WRONG_ROWS_RENDERED)
  const omitted = wrongRows.length - rows.length
  const rendered = rows.map((row) => {
    const lines = [
      `[row ${row.row_id}]`,
      `problem: ${truncatePromptText(row.problem, MAX_ROW_FIELD_CHARS)}`,
      `student answer: ${truncatePromptText(row.studentAnswer, MAX_ROW_FIELD_CHARS)}`,
    ]
    if (row.score != null) {
      lines.push(`score: ${row.score} / ${row.maxScore ?? '?'}`)
    }
    if (Array.isArray(row.dock) && row.dock.length > 0) {
      lines.push('rubric dock:')
      for (const entry of row.dock.slice(0, MAX_DOCK_ENTRIES)) {
        lines.push(
          `  - ${truncatePromptText(entry.criterion, MAX_DOCK_FIELD_CHARS)} ` +
            `(-${entry.points ?? '?'}): ${truncatePromptText(entry.reason, MAX_DOCK_FIELD_CHARS)}`
        )
      }
      if (row.dock.length > MAX_DOCK_ENTRIES) {
        lines.push(`  - (+${row.dock.length - MAX_DOCK_ENTRIES} additional dock entries omitted)`)
      }
    }
    if (row.sampleAnswer != null && row.sampleAnswer !== '') {
      lines.push(`sample answer: ${truncatePromptText(row.sampleAnswer, MAX_ROW_FIELD_CHARS)}`)
    }
    return lines.join('\n')
  })
  if (omitted > 0) {
    rendered.push(`(${omitted} additional wrong row(s) omitted to fit the context window)`)
  }
  return rendered.join('\n\n')
}

/**
 * Render the diagnostician's root causes as lines.
 * @param {Array<{root_cause: string, problem_ids: Array<string|number>}>} rootCauses
 * @returns {string}
 */
export function buildRootCausesText(rootCauses) {
  if (!rootCauses || rootCauses.length === 0) return '(no root causes)'
  return rootCauses
    .map((entry) => {
      const ids = Array.isArray(entry.problem_ids) ? entry.problem_ids.join(', ') : ''
      return `root cause: ${entry.root_cause ?? ''} (problem_ids: ${ids})`
    })
    .join('\n')
}

/**
 * Render per-rule scorecards as lines (shrinkage only).
 * @param {Array<{rule_id: number, shrinkage_association: number}>} scorecards
 * @returns {string}
 */
export function buildScorecardText(scorecards) {
  if (!scorecards || scorecards.length === 0) return '(no scorecard data yet)'
  return scorecards
    .map((card) => {
      const shrinkage = typeof card.shrinkage_association === 'number' ? card.shrinkage_association.toFixed(3) : 'n/a'
      return `rule ${card.rule_id}: shrinkage ${shrinkage}`
    })
    .join('\n')
}

/**
 * Render the meta agent's own prior reasoning/edits as lines.
 * @param {Array<{epoch: number, reasoning: string, edits: Array<Object>}>} metaHistory
 * @returns {string}
 */
export function buildMetaHistoryText(metaHistory) {
  if (!metaHistory || metaHistory.length === 0) return '(no prior meta attempts)'
  return metaHistory
    .map((entry) => {
      const edits = Array.isArray(entry.edits) ? entry.edits : []
      const summary =
        edits.length === 0
          ? 'no edits'
          : edits.map((edit) => describeEdit(edit)).join(', ')
      return `epoch ${entry.epoch}: ${entry.reasoning ?? ''} [${summary}]`
    })
    .join('\n')
}

function describeEdit(edit) {
  if (!edit || typeof edit !== 'object') return 'invalid'
  if (edit.op === 'edit') return `edit #${edit.rule_id}`
  if (edit.op === 'combine') return `combine ${JSON.stringify(edit.rule_ids ?? [])}`
  if (edit.op === 'append') return `append ${JSON.stringify(edit.text ?? '')}`
  return 'invalid'
}

/**
 * Render holdout metrics as compact lines.
 * @param {Object|null|undefined} metrics
 * @returns {string}
 */
export function buildHoldoutMetricsText(metrics) {
  if (!metrics) return '(no holdout metrics yet)'
  return [
    `accuracy: ${formatMetric(metrics.accuracy)}`,
    `continuousAccuracy: ${formatMetric(metrics.continuousAccuracy)}`,
    `repairs: ${metrics.repairs ?? 0}`,
    `regressions: ${metrics.regressions ?? 0}`,
    `gatePassed: ${metrics.gatePassed === true ? 'yes' : metrics.gatePassed === false ? 'no' : 'n/a'}`,
  ].join('\n')
}

function formatMetric(value) {
  return typeof value === 'number' ? value.toFixed(3) : 'n/a'
}

function formatJson(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return fallback
    try {
      return JSON.stringify(JSON.parse(trimmed), null, 2)
    } catch {
      return trimmed
    }
  }
  return JSON.stringify(value, null, 2)
}
