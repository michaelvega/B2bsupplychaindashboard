/**
 * No-LLM unit test: the rubric's positive-weight sum is the grading
 * denominator, not the grader-reported total.
 *
 * Run with: node src/dataset-learning-v2/rubric-total.test.js
 */

import assert from 'node:assert/strict'

import { parseGrading, rubricTotalFromText } from './agents.js'

// Weights [5, 5, -4, 2]: only positive weights count -> 5 + 5 + 2 = 12.
const rubric = JSON.stringify([
  { criterion: 'covers the main point', weight: 5 },
  { criterion: 'provides evidence', weight: 5 },
  { criterion: 'violates a constraint', weight: -4 },
  { criterion: 'is clear', weight: 2 },
])

const trueTotal = rubricTotalFromText(rubric)
assert.equal(trueTotal, 12, 'rubric total must sum positive weights only')

// The grader under-reports the true total (8 instead of 12).
const graded = parseGrading(JSON.stringify({ score: 8, total: 8, dock: [] }), trueTotal)
assert.equal(graded.total, 12, 'rubric total must win over the grader-reported total')
assert.equal(graded.score, 8, 'a score below the true total is preserved')

// The score is clamped to the rubric total, never above it.
const over = parseGrading(JSON.stringify({ score: 20, total: 8, dock: [] }), trueTotal)
assert.equal(over.score, 12, 'score must clamp to the rubric total')

// With no usable rubric weights, the grader-reported total is the fallback.
const fallback = parseGrading(JSON.stringify({ score: 6, total: 8, dock: [] }), 0)
assert.equal(fallback.total, 8, 'grader total is the fallback with no rubric weights')
assert.equal(fallback.score, 6)

console.log('ok - rubric total metric (weights [5,5,-4,2] -> 12, grader said 8)')
