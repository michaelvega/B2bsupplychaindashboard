/**
 * Run the frontier-science dataset through dataset-learning-v2 (5 epochs).
 *
 * Per-row rubric mode: each row's `answer` column is its grading rubric. The
 * system prompt places the learned taxonomy at `{{taxonomy}}` and the problem
 * at `{{problem}}`. Prints per-epoch progress and any errors; exits non-zero if
 * any epoch crashes.
 */

import { rmSync, readFileSync } from 'node:fs'
import { DB_PATH, bundledData, envPath } from './cli-paths.js'

const CSV_PATH = envPath('DL_CSV_PATH', bundledData('frontier-sample.csv'))
const PROJECT_ID = 'frontier-test'
const NUM_EPOCHS = 5

const SYSTEM_PROMPT =
  '{{taxonomy}}, solve this problem with the taxonomy of relevant rules: {{problem}}.'

const OUTPUT_FORMAT = {
  answer: 'the final answer to the problem',
  cited_rules: 'list of taxonomy rule numbers you used (e.g. [1,2])',
  explanation: 'a two-sentence explanation of the answer',
}

rmSync(DB_PATH, { force: true })

try {
  const db = await import('./db.js')
  const engine = await import('./engine.js')

  const csvText = readFileSync(CSV_PATH, 'utf8')
  console.log('[frontier] CSV loaded:', csvText.length, 'chars')

  const project = await engine.createProject({
    id: PROJECT_ID,
    title: 'frontier-test',
    system_prompt: SYSTEM_PROMPT,
    output_format: OUTPUT_FORMAT,
    golden_column: null,
    rubric_mode: 'per_row',
    rubric_column: 'answer',
    sample_answer_column: 'answer',
    open_ended: 1,
    holdout_pct: 0.2,
    edit_budget: 3,
    max_new_meta: 2,
    max_edits_meta: 3,
    min_citations: 5,
  })
  console.log(
    `[frontier] project created: ${project.id} | open_ended=${project.open_ended} | rubric=${project.rubric_mode}:${project.rubric_column}`
  )

  const upload = await engine.uploadCsv(PROJECT_ID, csvText)
  console.log(
    `[frontier] uploaded: ${upload.totalRows} rows | columns=${upload.columns.join(',')} | holdout=${upload.holdoutCount} pool=${upload.poolCount}`
  )

  await engine.seedInitialTaxonomy(PROJECT_ID)

  let failures = 0
  for (let epoch = 1; epoch <= NUM_EPOCHS; epoch++) {
    const t0 = Date.now()
    console.log(`\n[frontier] === epoch ${epoch}/${NUM_EPOCHS} starting ===`)
    try {
      const s = await engine.runEpoch(PROJECT_ID, epoch)
      const secs = ((Date.now() - t0) / 1000).toFixed(1)
      console.log(
        `[frontier] epoch ${epoch} DONE (${secs}s): status=${s.status} metric=${s.metric.toFixed(3)} ` +
          `prev=${s.prevMetric.toFixed(3)} repairs=${s.repairs} regressions=${s.regressions} ` +
          `rules ${s.ruleCountBefore}->${s.ruleCountAfter} edits=${s.editsApplied}`
      )
      console.log(`[frontier]   ${s.gateReason}`)
    } catch (err) {
      failures++
      console.error(`[frontier] epoch ${epoch} ERROR: ${err instanceof Error ? err.message : err}`)
      if (err instanceof Error && err.stack) console.error(err.stack)
    }
  }

  const accepted = db.getLatestAcceptedVersion(PROJECT_ID)
  console.log('\n[frontier] === FINAL ===')
  console.log(
    `[frontier] accepted taxonomy: epoch ${accepted?.epoch ?? 0}, ${accepted?.rules_json?.length ?? 0} rule(s)`
  )
  for (const r of accepted?.rules_json ?? []) console.log(`  ${r.rule_id}. ${r.text}`)
  const verdict =
    failures > 0 ? `FAILED — ${failures} epoch(s) errored` : 'COMPLETED — all 5 epochs ran'
  console.log(`[frontier] ${verdict}`)
  process.exit(failures > 0 ? 1 : 0)
} catch (err) {
  console.error('[frontier] FATAL:', err instanceof Error ? err.stack || err.message : err)
  process.exit(1)
}
