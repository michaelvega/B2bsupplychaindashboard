# dataset-learning-v2 — v3 redesign contract

Unsupervised taxonomy learning. The grader is the ONLY agent that sees the rubric.
Every other agent (diagnostician, rewriter, meta) is blind to the rubric and to the
per-criterion dock — it sees only score feedback (right/wrong or a numeric score).

## Agent information boundaries (final)

| Agent | Sees | Blind to |
|---|---|---|
| Student | taxonomy + problem + output-format + citation instruction | rubric, correct answer |
| Grader | question + student answer + rubric | — (it IS the objective) |
| Diagnostician | taxonomy + ALL wrong rows (problem + student wrong answer) | score, rubric, correct answer |
| Rewriter | ALL wrong rows (problem + student wrong answer + score + max score + plain sample answer) + diagnostician root causes | rubric, dock, per-row failure history, scorecards |
| Meta | taxonomy + scorecards (shrinkage only) + holdout metrics | rubric |

All of these operate on the **per-epoch TRAIN SAMPLE** (50% of pool), never the holdout.

## 1. Scorecard — shrinkage only

Drop `times_cited` and the correct/incorrect breakdown columns. The scorecard table
stores ONLY: `rule_id`, `shrinkage_association`. Compute it in the engine from the
holdout round, holding counts in memory:

```
for each rule_id cited anywhere in holdout (or in candidate rules):
  times_cited = # holdout rows whose cited_rules includes rule_id
  correct_when_cited = # of those that are correct (open: continuous_correct, closed: correct)
  shrinkage_association = (correct_when_cited + 1) / (times_cited + 2)   // Beta(1,1) posterior
store { rule_id, shrinkage_association }
```

## 2. Diagnostician (dataset-wide, unsupervised)

- Input: `{ taxonomyText, wrongRows: [{row_id, problem, studentAnswer}] }`  (wrong rows only, NO score)
- Output JSON: `{"root_causes":[{"root_cause":"...","problem_ids":["...","..."]}]}`
  - at most 3 root causes (user-choosable budget, default 3)
  - each root cause must reference >= 2 distinct problem_ids (a rule may apply to just 2)
  - one problem may appear in MULTIPLE root causes
  - if `wrongRows.length < 2`: the agent returns `{"root_causes":[]}` — "we're done", skip rewriter

## 3. Rewriter (dataset-wide, unsupervised)

- Input: `{ taxonomyText, wrongRows: [{row_id, problem, studentAnswer, score, maxScore, sampleAnswer}], rootCauses }`
  - `sampleAnswer` = the plain (unlabeled) correct/reference answer: value of
    `project.sample_answer_column` if set, else (closed) the golden value, else null.
    It is NOT the rubric — it carries no grading criteria.
- Output JSON: `{"reasoning":"...","edits":[...]}` — at most `edit_budget` (default 3) edits.
- Edit ops (unchanged): `append`, `edit {rule_id,text}`, `combine {rule_ids,text}`.
- Prompt must: prefer broad/generalizable rules; encourage a meta-strategy when the
  wrongs are surprising; find patterns across the group; NEVER copy the sample answer
  verbatim or encode one specific row.

## 4. Meta agent (neutered — automatic eyes only)

- Input: `{ taxonomyText, scorecards: [{rule_id, shrinkage_association}], holdoutMetrics, attempt }`
- Output JSON: `{"reasoning":"...","edits":[...]}` — normally EMPTY (`edits: []`).
- It acts ONLY on clear catastrophes:
  1. **Egregious rule** → `{"op":"delete","rule_id":N}` when `shrinkage_association < 0.40`.
  2. **Obvious overfit** → `delete` or `edit` a rule whose text repeats a concrete
     artifact (a number, name, or quoted string) **>= 6 times**.
- New op: `delete` (deactivate the rule; keep its id for traceability).
- Otherwise it reads and returns `[]`. It must NOT invent new rules or fix ordinary
  weak rules.

## 5. Engine loop (per epoch) — changes

1. baseline = last ACCEPTED taxonomy version.
2. Sample TRAIN = 50% of pool (reshuffled per epoch, as before).
3. Evaluate every train row (student + grade). Collect `rows` with
   `{row_id, problem, studentAnswer, score, maxScore, sampleAnswer, isCorrect}`.
4. `wrongRows = rows.filter(!isCorrect)`.
   - If `wrongRows.length >= 2`: run diagnostician -> rootCauses, then rewriter -> `rewriterEdits`.
   - Else: `rewriterEdits = []` (no edits; the taxonomy is already good enough).
5. Run meta -> `metaEdits` (mostly `[]`, delete/edit only on catastrophe).
6. `candidate = applyEdits(baseline, dedupe(rewriterEdits ++ metaEdits))`.
7. Validate candidate on the fixed holdout (student + grade), compute metric +
   repairs/regressions vs the last-accepted holdout round.
8. **GATE — first-epoch fix:** if there is NO prior accepted holdout round
   (`prevRound == null`), `gatePassed = true` (accept the first ruleset as the
   baseline; never reject into nothing). Otherwise:
   - closed: `repairs>=2 && (prevMetric - metric) <= 0.05`
   - open:   `repairs>=2 && (regressions/totalRows) <= 0.05`
9. accept -> candidate becomes the new accepted version; reject -> baseline unchanged
   (roll back delta automatically).
10. Scorecard (shrinkage only) from the holdout round.
11. `runAll`: restart after 3 consecutive rejections (unchanged).

## 6. db.js changes

- `scorecard` table: drop `times_cited`, `correct_when_cited`, `incorrect_when_cited`,
  `correct_when_not_cited`, `incorrect_when_not_cited`; keep `rule_id`,
  `shrinkage_association`.
- `project` table: add `sample_answer_column TEXT`.
- `updateRule` already supports `active` (used by `delete`). `applyEdits` in engine must
  handle the new `delete` op (deactivate; do NOT renumber; keep the id).

## 7. Removed

- Per-row escalation (`wrong_count` logic for the rewriter) is removed.
- Rubric/dock threading into diagnostician, rewriter, and meta is removed (grader only).
- `times_cited`-based pruning and the old `pruneRules` (replaced by meta `delete`).

## Unchanged

Student, grader, overseer (global rubric standardization), the holdout split, gate
thresholds (other than the first-epoch fix), restart threshold, concurrency (15),
LLM client (qwen3.8-flash, reasoning disabled, 100k max tokens, retries).
