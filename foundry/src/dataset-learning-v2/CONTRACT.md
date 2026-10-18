# dataset-learning-v2 — build contract (source of truth)

> Historical v2 contract. `CONTRACT-V3.md` describes the current agent
> boundaries, scorecards, and gate changes; where the two differ, the code in
> `engine.js` / `metrics.js` is authoritative.

Read this fully before writing any file. Every file here implements EXACTLY the
exports and data shapes below. Do NOT rename exports, change signatures, or
invent extra files. This is ESM JavaScript (package.json has `"type":"module"`),
Node >= 22. No TypeScript. No external npm deps — use `node:sqlite`, `node:crypto`,
`node:fs`, global `fetch`.

## Paths

- Module root: `src/dataset-learning-v2/`
- SQLite file: `./dataset-learning-v2.db` (current directory; override with `DL_DB_PATH`)

## Files to write (one per agent)

1. `llm.js`      — bonsai chat client
2. `db.js`       — SQLite layer (schema + query helpers)
3. `metrics.js`  — accuracy / continuous-accuracy / repair-regression / gate
4. `prompts.js`  — template rendering + all agent prompt builders (pure strings)
5. `agents.js`   — orchestrates llm+prompts+metrics into callable agent fns
6. `engine.js`   — the training loop (depends on db/metrics/agents/prompts)
7. `smoke-test.js` — standalone script (depends on db + engine)

---

## 1. llm.js

Export exactly:

```js
export async function chatCompletion(messages, config) // -> { content, finishReason, model, provider, usage? }
export async function guardedChatCompletion(messages, config = {}) // -> { response, durationMs, startedAt }
export async function runJsonLLM({ systemPrompt, userContent, parse, timeoutMs, maxRetries }) // -> { parsed, trace, usage? }
export function stripFences(content) // -> string
```

- `chatCompletion(messages, config)`: POST `${baseUrl}/chat/completions` via
  global `fetch`. baseUrl default `https://testingpace.procept.tech/v1`
  (strip trailing slash; override via `process.env.LLM_BASE_URL`). model default
  `bonsai` (override via `process.env.LLM_MODEL` or `config.model`).
- Headers:
  ```
  Content-Type: application/json
  CF-Access-Client-Id:    process.env.CF_ACCESS_CLIENT_ID    || '<CF_ACCESS_CLIENT_ID>'
  CF-Access-Client-Secret: process.env.CF_ACCESS_CLIENT_SECRET || '<CF_ACCESS_CLIENT_SECRET>'
  ```
  (NO `Authorization` header.)
- Body: `{ model, messages, stream:false, max_tokens, temperature, chat_template_kwargs:{enable_thinking:false} }`.
  `max_tokens` = `config.maxTokens ?? 4096`. `temperature` = `config.temperature ?? 0.7`.
- Retry transient errors (network codes / status>=500 / 429 / 408) up to 3 times with
  exponential backoff (base 500ms). Timeout each request at `config.timeoutMs ?? 120000`
  via `AbortSignal.timeout`.
- Parse response JSON; return `content = choices[0].message.content ?? ''`,
  `finishReason = choices[0].finish_reason`, `model = data.model ?? model`,
  `provider = 'openai'`, and `usage` mapped from `data.usage`
  (`promptTokens/completionTokens/totalTokens` from snake_case keys, if present).
  Throw `Error('LLM returned <status>: <first 500 chars of body>')` on non-2xx.
- `guardedChatCompletion`: wrap `chatCompletion` in a timeout equal to
  (timeoutMs * (maxRetries+1) + backoff + 15000); return `{ response, durationMs, startedAt }`.
- `runJsonLLM`: build `[{role:'system',...},{role:'user',content:userContent}]`, call
  `guardedChatCompletion`, then `parse(stripFences(content), content)`. Throw
  `Error('LLM response parse failed: ' + detail)` if parse returns null or
  `{kind:'json_syntax'|'validation'}`. Return `{ parsed, trace, usage }` where
  `trace = { messages, config:{provider,model,temperature,maxTokens}, response:{content,finishReason}, durationMs, startedAt, usage }`.
- `stripFences`: strip ```json / ``` fences and return the first balanced JSON
  object or array substring if present, else the trimmed text.

## 2. db.js

Use `import { DatabaseSync } from 'node:sqlite'` and `randomUUID` from `node:crypto`.
Open the DB at the path above (mkdir parent if needed — parent already exists).
All exported functions are SYNCHRONOUS (callers may `await` them; that's fine).

Schema (create with `CREATE TABLE IF NOT EXISTS`, snake_case columns, JSON fields
stored with `JSON.stringify` / read with `JSON.parse` + fallback):

```sql
project(id TEXT PRIMARY KEY, title TEXT, description TEXT, system_prompt TEXT,
  output_format TEXT, golden_column TEXT, rubric_json TEXT, open_ended INTEGER,
  columns_json TEXT, holdout_pct REAL, edit_budget INTEGER,
  max_new_meta INTEGER, max_edits_meta INTEGER, min_citations INTEGER,
  created_at TEXT, updated_at TEXT)

dataset_row(id TEXT PRIMARY KEY, project_id TEXT, source_index INTEGER,
  payload_json TEXT, split TEXT)   -- split in {'holdout','pool'}

taxonomy_rule(id TEXT PRIMARY KEY, project_id TEXT, rule_id INTEGER, text TEXT,
  active INTEGER, created_epoch INTEGER, created_at TEXT)

taxonomy_version(id TEXT PRIMARY KEY, project_id TEXT, epoch INTEGER,
  rules_json TEXT, is_candidate INTEGER, accepted INTEGER, created_at TEXT)
  -- rules_json = [{rule_id, text}] ordered by rule_id

epoch(id TEXT PRIMARY KEY, project_id TEXT, epoch INTEGER, status TEXT,
  train_row_ids_json TEXT, baseline_version_id TEXT, candidate_version_id TEXT,
  gate_passed INTEGER, metrics_json TEXT, meta_reasoning TEXT,
  meta_edits_json TEXT, created_at TEXT)

row_history(id TEXT PRIMARY KEY, project_id TEXT, row_id TEXT, epoch INTEGER,
  taxonomy_version_id TEXT, answer TEXT, predicted_label TEXT,
  cited_rule_ids_json TEXT, rubric_score REAL, rubric_total REAL,
  rubric_dock_json TEXT, correct INTEGER, continuous_correct INTEGER,
  diagnosis TEXT, wrong_count_before INTEGER, created_at TEXT)

scorecard(id TEXT PRIMARY KEY, project_id TEXT, epoch INTEGER, rule_id INTEGER,
  times_cited INTEGER, correct_when_cited INTEGER, incorrect_when_cited INTEGER,
  correct_when_not_cited INTEGER, incorrect_when_not_cited INTEGER,
  shrinkage_association REAL)

meta_history(id TEXT PRIMARY KEY, project_id TEXT, epoch INTEGER, reasoning TEXT,
  edits_json TEXT, applied INTEGER, created_at TEXT)

run_log(id TEXT PRIMARY KEY, project_id TEXT, epoch INTEGER, message TEXT, created_at TEXT)
```

Exports (all synchronous; every `*` is a specific function — implement each):

```js
// projects
export function createProject(fields)          // fields:{id?, title, description?, system_prompt?, output_format?, golden_column?, rubric_json?, open_ended?, columns_json?, holdout_pct?, edit_budget?, max_new_meta?, max_edits_meta?, min_citations?} -> row
export function getProject(id)                 // -> row | undefined
export function listProjects()                 // -> rows[]
export function updateProject(id, patch)       // -> row

// rows
export function insertRows(rows)               // rows:[{id?, project_id, source_index, payload, split}] bulk insert
export function getRows(projectId)             // -> rows[] (payload parsed to object)
export function getRowIdsBySplit(projectId, split) // -> id[]
export function getRowById(id)                 // -> row | undefined (payload parsed)

// taxonomy
export function insertRule({project_id, rule_id, text, active, created_epoch}) // -> row
export function updateRule(id, patch)          // patch:{text?, active?}
export function getActiveRules(projectId)      // -> [{rule_id, text}] ordered by rule_id
export function getNextRuleId(projectId)       // -> 1 + max(rule_id), or 1 if none
export function insertTaxonomyVersion({project_id, epoch, rules_json, is_candidate, accepted}) // -> row
export function getTaxonomyVersion(id)         // -> row (rules_json parsed to array)
export function getLatestAcceptedVersion(projectId) // -> row | undefined (highest epoch, accepted=1)

// epochs
export function insertEpoch(fields)            // -> row
export function getEpoch(projectId, epoch)     // -> row | undefined
export function updateEpoch(id, patch)
export function listEpochs(projectId)          // -> rows[] ordered by epoch asc

// row history
export function insertRowHistory(fields)
export function getRowHistory(projectId, rowId)      // -> rows[] ordered by epoch asc
export function getRowHistoryForEpoch(projectId, epoch) // -> rows[]
export function countWrongBefore(projectId, rowId)   // -> number of prior row_history rows that were wrong (open: continuous_correct=0; closed: correct=0)

// scorecard
export function insertScorecard(fields)
export function getScorecard(projectId, epoch)       // -> rows[]

// meta history
export function insertMetaHistory(fields)
export function getMetaHistory(projectId)            // -> rows[] ordered by epoch asc

// run log
export function appendLog(projectId, epoch, message)
export function getLog(projectId)                    // -> rows[] ordered by created_at asc

// reset
export function resetProjectData(projectId)          // delete all rows for the project EXCEPT the project row itself (dataset_row, taxonomy_rule, taxonomy_version, epoch, row_history, scorecard, meta_history, run_log)
```

All JSON helpers: when reading, if a stored JSON string fails to parse or is an
object already, return `{}` (for objects) or `[]` (for arrays) as appropriate.

## 3. metrics.js

Export exactly:

```js
export function computeClosedAccuracy(results)      // results:[{correct:boolean}] -> number (0..1)
export function computeContinuousAccuracy(results)  // results:[{score, total}] -> number (mean score/total, skip total<=0)
export function computeRepairsRegressions(prev, curr, openEnded)
  // prev/curr are arrays of per-row {correct, continuousCorrect, score, total} ALIGNED BY POSITION.
  // closed: repair = prev!correct && curr.correct; regression = prev.correct && curr!correct
  // continuous: repair = prevContinuousScore < 1.0 && currScore >= prevScore*1.2 (relative);
  //             regression = prevScore > 0 && currScore <= prevScore*0.8
  // prevContinuousScore = prev.score/prev.total (0 if total<=0), same for curr.
  // -> { repairs:number, regressions:number }
export function evaluateGate({ openEnded, repairs, regressions, totalRows, prevMetric, currMetric })
  // closed:   passed = repairs>=2 && (prevMetric - currMetric) <= 0.05
  // continuous: passed = repairs>=2 && (regressions/totalRows) <= 0.05   (totalRows guard: if 0 -> false)
  // -> { passed:boolean, reason:string }
```

## 4. prompts.js

Export exactly:

```js
export function renderTemplate(systemPrompt, payload)
  // Replace every `{{name}}` where `name` is a key in payload with String(payload[name] ?? '').
  // If `name` is NOT a key in payload, leave the literal `{{name}}` untouched.
  // Only mentioned vars appear; unmentioned columns never appear.

export function buildStudentSystemPrompt({ basePrompt, taxonomyText, outputFormatText, citationInstruction })
  // Returns the full system prompt:
  //   basePrompt (already template-rendered for the row? NO — see agents.js: rendering happens per row)
  // Actually: basePrompt here is the RAW project system_prompt. Rendering is done per-row in agents.js
  // via renderTemplate; this builder receives the already-rendered base prompt string.
  // Layout:
  //   <rendered base prompt>
  //   (if taxonomyText non-empty) "\n\nGeneralizable inductive rules (cite these by number):\n" + taxonomyText
  //   "\n\n" + outputFormatText
  //   "\n\n" + citationInstruction

export function buildStudentUserPrompt(rowText)   // -> { role:'user', content: rowText }  (rowText = rendered template, or the whole payload as key: value lines if no template)

export function buildTaxonomyText(rules)          // rules:[{rule_id, text}] -> "1. <text>\n2. <text>..." (one per line, numbered by rule_id)

export function buildOutputFormatText(outputFormat) // outputFormat is a JSON object string or object; returns:
  // "You must answer in exactly this JSON format, filling the value(s) to match each description:\n<pretty-printed JSON>"
  // If outputFormat is empty/null, return ''.

export function buildCitationInstruction()        // -> "After answering, include a \"cited_rules\" array of the rule number(s) you used (e.g. {\"cited_rules\":[1,3]}). If you used none, use []."

// Overseer (rubric standardization) — open-ended only
export function buildOverseerSystemPrompt()       // -> string
export function buildOverseerUserContent(rawRubric) // -> string
  // Ask the model to convert ANY rubric text into a JSON array:
  //   [{"criterion":"<short>","max":<number>}]   (max points each, integers or 0.5 steps allowed)
  // Return ONLY the JSON array.

// Student grader (open-ended)
export function buildRubricGraderSystemPrompt()   // -> string
export function buildRubricGraderUserContent({ question, studentAnswer, rubricJson, outputFormatText })
  // Ask for a JSON object: {"score":<number>,"total":<number>,"dock":[{"criterion":"...","points":<number>,"reason":"..."}]}
  // where score<=total=sum(max), dock lists what was deducted and why (points>0 means docked amount).

// Diagnostician (BLIND — knows it was wrong, does NOT know the answer)
export function buildDiagnosisSystemPrompt()      // -> string
export function buildDiagnosisUserContent({ question, studentAnswer, taxonomyText })
  // Instruct: you are diagnosing WHY a classification went wrong. You do NOT know the true
  // answer. Look at the taxonomy + the question + your own (wrong) answer and propose the most
  // likely root cause(s) of failure. Return ONLY a short JSON: {"root_cause":"..."} (a string).

// Proposer (rewriter — SEES the answer + rubric dock + wrong count)
export function buildProposerSystemPrompt()       // -> string
export function buildProposerUserContent({ taxonomyText, question, studentAnswer, diagnosis, goldenAnswer, rubricDockText, wrongCount, historyText, editBudget })
  // Proposes inductive/generalizable rule edits. Escalation is driven by wrongCount:
  //   wrongCount<=1: propose up to editBudget edits (append/edit/combine).
  //   wrongCount==2: escalation A — re-read taxonomy + prior history; inventory unexplained
  //     states; DO NOT repeat prior failed logic; propose a novel rule/logic.
  //   wrongCount>=3: escalation B — assume something is deeply wrong; enumerate states; look at
  //     history + current taxonomy; PREFER unseen/novel strategies; synthesize the "pattern of
  //     surprises" from prior diagnoses for THIS row (that pattern is what's missing).
  //   Also: if a row has been wrong multiple times, prefer editing/combining over pure append,
  //     and never propose an edit identical to one already in the taxonomy or history.
  // Return ONLY a JSON object: {"reasoning":"...","edits":[{"op":"append","text":"..."} | {"op":"edit","rule_id":N,"text":"..."} | {"op":"combine","rule_ids":[N,M],"text":"..."}]}

// Meta agent (sees everything; reasons over taxonomy; never answers a question itself)
export function buildMetaSystemPrompt()           // -> string
export function buildMetaUserContent({ taxonomyText, scorecardText, metaHistoryText, holdoutMetricsText, maxNew, maxEdits, attempt })
  // Instruct: you are the META overseer. Inspect the taxonomy + per-rule scorecards + your own
  // prior reasoning/edits + holdout metrics. (1) detect OVERFIT (repeated words, rules that only
  // match specific rows, rule text that embeds a specific sample). (2) propose at most `maxNew`
  // NEW rules and at most `maxEdits` edits/combines. Do NOT answer any question. If `attempt>0`,
  // you are retrying after rejections — try a DIFFERENT strategy than last time.
  // Return ONLY: {"reasoning":"...","edits":[...same edit shapes as proposer...]}

export function buildRubricDockText(dock)         // dock:[{criterion,points,reason}] -> "Criterion 'x': -2 — reason..." lines
export function buildHistoryText(history)         // history:[{epoch, answer, predicted_label, diagnosis, correct, wrong_count_before}] -> compact lines
export function buildScorecardText(scorecards)    // scorecards:[{rule_id,times_cited,correct_when_cited,incorrect_when_cited,shrinkage_association}] -> lines
export function buildMetaHistoryText(metaHistory) // metaHistory:[{epoch,reasoning,edits}] -> lines
export function buildHoldoutMetricsText(metrics)  // -> compact lines (accuracy/continuousAccuracy/repairs/regressions/gatePassed)
```

## 5. agents.js

Export exactly (each is async). Uses llm.js + prompts.js + metrics.js.

```js
export async function overseerStandardizeRubric(rawRubric)
  // -> rubricJson array [{criterion,max}] via runJsonLLM + buildOverseer*

export async function runStudent({ renderedBasePrompt, taxonomyRules, outputFormat, rowText, openEnded })
  // taxonomyRules:[{rule_id,text}], rowText = rendered per-row prompt text.
  // Build system prompt (student builder) + user msg (rowText). Call guardedChatCompletion.
  // Parse JSON out of the answer (stripFences). Return:
  //   { answer, citedRuleIds:number[], predictedLabel:string }
  // predictedLabel = value of the FIRST key of outputFormat in the parsed JSON, else the raw text.
  // citedRuleIds = parsed.cited_rules (array of ints) or [].

export async function gradeStudent({ openEnded, predictedLabel, goldenAnswer, rubricJson, outputFormatText, question, studentAnswer })
  // closed: correct = norm(predictedLabel) === norm(goldenAnswer); norm = trim+lowercase+strip quotes+collapse spaces.
  //   -> { correct, continuousCorrect: correct, score: correct?1:0, total:1, dock:null }
  // open: call rubric grader (runJsonLLM + buildRubricGrader*). -> { score, total, dock }
  //   continuousCorrect = (score/total) >= 0.8. Return { correct:null, continuousCorrect, score, total, dock }.

export async function diagnose({ taxonomyRules, question, studentAnswer })
  // -> { rootCause:string } (blind)

export async function propose({ taxonomyRules, question, studentAnswer, diagnosis, goldenAnswer, rubricDock, wrongCount, history, editBudget })
  // -> { reasoning, edits:[...] } (validated to VALID_OPS; empty if parse fails)

export async function runMeta({ taxonomyRules, scorecards, metaHistory, holdoutMetrics, maxNew, maxEdits, attempt })
  // -> { reasoning, edits:[...] }

export function parseEdits(text)
  // Parse JSON; extract .edits array; keep only {op,text} with op in {'append','edit','combine'} and
  //   append: text is non-empty string;
  //   edit: rule_id is a number AND text non-empty;
  //   combine: rule_ids is array of numbers AND text non-empty.
  // Return the filtered array (may be empty). Never throw.

export const VALID_OPS = new Set(['append','edit','combine'])
```

Note: `runStudent`'s `renderedBasePrompt` is computed in engine (renderTemplate per row). agents.js
also exports a helper `renderRowPrompt(systemPrompt, payload)` -> string = renderTemplate(systemPrompt, payload).

## 6. engine.js

Export exactly:

```js
export async function createProject(fields)     // create project via db, returns row (does NOT split/seed taxonomy)
export async function uploadCsv(projectId, csvText)
  // parse CSV (RFC4180-ish, header + rows), compute columns. Dedup on full-payload fingerprint (optional; skip if noisy).
  // golden_column must be in columns if provided and open_ended==0 (else throw).
  // Split: shuffle rows, first round(total*holdout_pct) -> 'holdout', rest -> 'pool'. Persist via db.insertRows.
  // Also update project.columns_json. Returns { totalRows, columns, holdoutCount, poolCount }.
export async function seedInitialTaxonomy(projectId)
  // insert an empty accepted taxonomy_version at epoch 0 (rules_json=[]), and set baseline. Idempotent-ish: if an accepted version exists, no-op.
export async function runAll(projectId, numEpochs, opts = {})
  // Main loop. Returns { epochs: [per-epoch summary], log: [...] }.
export async function runEpoch(projectId, epoch)
  // One epoch (see LOOP below). Returns epoch summary object.
```

**LOOP (runEpoch)** — implement exactly:

1. `baseline = db.getLatestAcceptedVersion(projectId)` (rules = its rules_json, or []).
2. Sample training: shuffle pool row ids, take `round(poolCount * 0.5)`. (Fisher-Yates with a seed derived from epoch so it's reproducible.)
3. For each train row (bounded concurrency, e.g. 4):
   a. `rendered = renderTemplate(project.system_prompt, row.payload)`.
   b. `{answer, citedRuleIds, predictedLabel} = runStudent(...)` with baseline rules.
   c. `grade = gradeStudent(...)`; if open, use rubric_json + question=rendered (or payload), studentAnswer=answer.
   d. `wrongCountBefore = db.countWrongBefore(projectId, rowId)` BEFORE inserting this history.
   e. If wrong (closed: !correct; open: !continuousCorrect): `diagnosis = diagnose(...)`; `proposal = propose(... wrongCount = wrongCountBefore+1 ...)`. Collect proposal edits per row. (For rows that are wrong ≥1 times, accumulate their edits; engine later dedups/caps.)
   f. `db.insertRowHistory({... row_id, epoch, answer, predicted_label, cited_rule_ids, rubric_score, rubric_total, rubric_dock, correct, continuous_correct, diagnosis, wrong_count_before: wrongCountBefore })`.
4. Aggregate proposed edits from ALL wrong rows (dedup by (op,text) / (op,rule_id,text)), cap at `project.edit_budget` (default 3). These are the "row edits".
5. Compute scorecards from the PREVIOUS epoch's holdout results (see scorecard step) — pass into meta. On epoch 1 there are none.
6. Run meta: `runMeta({ taxonomyRules: baseline rules, scorecards (from prior epoch), metaHistory, holdoutMetrics (prior epoch), maxNew, maxEdits, attempt })`. `attempt` = consecutive-rejection count passed in via opts.
7. Build candidate rules = apply(edits = rowEdits + metaEdits) to baseline rules:
   - append -> new rule with next rule_id (stable; do not renumber), text.
   - edit -> replace text of rule_id (must exist; else ignore).
   - combine -> deactivate listed rule_ids, append new rule.
   - Then prune: for each rule with times_cited>=min_citations and shrinkage_association<0.6 (from prior scorecard), deactivate. Log prunes.
8. Insert candidate taxonomy_version (is_candidate=1, accepted=0) with candidate rules.
9. Validate on holdout: run student+grade over ALL holdout rows with candidate rules. Compute closed accuracy / continuous accuracy, and repairs/regressions vs the PREVIOUS accepted holdout results (stored row_history for holdout rows at the last accepted epoch; on epoch 1 there is no prev, so repairs=0, regressions=0 and gate uses prevMetric = metric).
10. `gate = evaluateGate({...})`.
11. If gate.passed: mark candidate accepted=1, insert it as the accepted version (also mark prior candidate accepted=0 if any), persist holdout row_history rows (so they become the new "prev"), store scorecards for THIS epoch from holdout rows, meta_history (applied=1), epoch row (gate_passed=1).
    Else: candidate stays accepted=0 (do NOT make it baseline), meta_history applied=0, epoch gate_passed=0. The baseline for next epoch remains the previous accepted version (i.e., reject = roll back the delta, which is automatic since baseline is read from latest-accepted).
12. Insert `epoch` row + append run_log lines throughout.
13. Return summary: `{ epoch, status, metric, prevMetric, repairs, regressions, gatePassed, gateReason, trainRows, holdoutRows, ruleCountBefore, ruleCountAfter, editsApplied }`.

**Scorecard step (per epoch, on holdout):** given holdout row_history rows (with cited_rule_ids and a unified isCorrect = open? continuous_correct : correct), for each rule_id present in the candidate rules OR cited anywhere: times_cited = # holdout rows citing it; correct_when_cited / incorrect_when_cited split by isCorrect among those citing it; correct_when_not_cited / incorrect_when_not_cited = among holdout rows NOT citing it. shrinkage_association = (correct_when_cited + 1) / (times_cited + 2). Persist via insertScorecard.

**Restart-on-repeated-reject:** `runAll` tracks consecutive rejections. If `>= opts.restartThreshold ?? 3`, call `resetProjectData(projectId)`, `seedInitialTaxonomy(projectId)`, increment `attempt`, and continue epochs. Log a clear "RESTART — resetting taxonomy, attempt N" line. `attempt` is passed into meta so it "tries different shit".

Concurrency: use a small helper `mapConcurrent(items, limit, fn)` (no external deps).

## 7. smoke-test.js

Standalone: `node src/dataset-learning-v2/smoke-test.js`. Must:
1. Delete the db file if it exists (fresh) — via `node:fs` `rmSync(DB_PATH, {force:true})`, THEN import db.js and re-open. (Import db.js AFTER deleting so the schema re-creates.)
2. Create a closed-scale project:
   - title "smoke", system_prompt `"Classify the animal. Answer only A or B.\nQuestion: {{question}}"`,
   - output_format `{"answer":"one letter: A or B"}`,
   - golden_column `"answer"`, open_ended=0, holdout_pct=0.2, edit_budget=2, max_new_meta=1, max_edits_meta=2, min_citations=3.
3. Upload 5 rows (CSV header `question,answer`):
   1. "Is a dolphin a mammal? A) yes B) no","A"
   2. "Is a shark a mammal? A) yes B) no","B"
   3. "Is a whale a mammal? A) yes B) no","A"
   4. "Is a frog a mammal? A) yes B) no","B"
   5. "Is a bat a mammal? A) yes B) no","A"
4. `seedInitialTaxonomy`, then `runAll(projectId, 2)`.
5. Print a readable report to stdout: per-epoch metric + gatePassed + reason, the final taxonomy rules, the scorecards, and 2 sample row histories (answer evolution). Then `console.log('SMOKE OK')` and `process.exit(0)` on success; on any thrown error, print it and `process.exit(1)`.

## Conventions

- Match existing code style: 2-space indent, single quotes, no semicolons where the
  existing dataset-learning code omits them (it uses no semicolons — follow that).
- Log with `console.log` / `console.error` (no logger dependency in v2).
- Every file is ESM; use `import`/`export`.
- Keep it minimal — no speculative features, no dead code.
