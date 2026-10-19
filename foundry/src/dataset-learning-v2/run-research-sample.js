/**
 * Run the research-rubric dataset with PERFECT SAMPLE ANSWERS (5 epochs).
 *
 * Experiment 2: only the grader sees the rubric (`rubrics` column). The rewriter
 * sees the generated perfect sample answer (`sample_answer` column) instead of
 * the rubric. Open-ended, per-row rubric, 50%-train ∪ holdout gate.
 */

import { rmSync, readFileSync } from 'node:fs'
import { DB_PATH, bundledData, envPath } from './cli-paths.js'

const CSV_PATH = envPath('DL_CSV_PATH', bundledData('research-with-samples.csv'))
const PROJECT_ID = 'research-sample'
const NUM_EPOCHS = 5
const startEpochIdx = process.argv.indexOf('--start-epoch')
const START_EPOCH = startEpochIdx >= 0 ? Number(process.argv[startEpochIdx + 1]) || 1 : 1

const SYSTEM_PROMPT =
  'Domain: {{domain}}. {{taxonomy}}, solve this problem with the taxonomy of relevant rules: {{prompt}}.'

const OUTPUT_FORMAT = {
  answer: 'a complete, detailed answer addressing every part of the prompt',
  cited_rules: 'list of taxonomy rule numbers you used (e.g. [1,2])',
  explanation: 'a brief explanation of the answer (for a human reader)',
}

if (START_EPOCH <= 1) rmSync(DB_PATH, { force: true })

try {
  const db = await import('./db.js')
  const engine = await import('./engine.js')

  if (START_EPOCH <= 1) {
    const csvText = readFileSync(CSV_PATH, 'utf8')
    console.log('[sample] CSV loaded:', csvText.length, 'chars')

    const project = await engine.createProject({
      id: PROJECT_ID,
      title: 'research-sample',
      system_prompt: SYSTEM_PROMPT,
      output_format: OUTPUT_FORMAT,
      golden_column: null,
      rubric_mode: 'per_row',
      rubric_column: 'rubrics',
      sample_answer_column: 'sample_answer',
      open_ended: 1,
      holdout_pct: 0.2,
      edit_budget: 3,
      max_new_meta: 2,
      max_edits_meta: 3,
      min_citations: 5,
    })
    console.log(
      `[sample] project created: ${project.id} | rubric=${project.rubric_column} | sample_answer=${project.sample_answer_column}`
    )

    const upload = await engine.uploadCsv(PROJECT_ID, csvText)
    console.log(
      `[sample] uploaded: ${upload.totalRows} rows | columns=${upload.columns.join(',')} | holdout=${upload.holdoutCount} pool=${upload.poolCount}`
    )

    await engine.seedInitialTaxonomy(PROJECT_ID)
  } else {
    console.log(`[sample] resuming from epoch ${START_EPOCH} (existing project ${PROJECT_ID})`)
  }

  let failures = 0
  for (let epoch = START_EPOCH; epoch <= NUM_EPOCHS; epoch++) {
    const t0 = Date.now()
    console.log(`\n[sample] === epoch ${epoch}/${NUM_EPOCHS} starting ===`)
    try {
      const s = await engine.runEpoch(PROJECT_ID, epoch)
      const secs = ((Date.now() - t0) / 1000).toFixed(1)
      console.log(
        `[sample] epoch ${epoch} DONE (${secs}s): status=${s.status} metric=${s.metric.toFixed(3)} ` +
          `prev=${s.prevMetric.toFixed(3)} repairs=${s.repairs} regressions=${s.regressions} ` +
          `rules ${s.ruleCountBefore}->${s.ruleCountAfter} edits=${s.editsApplied}`
      )
      console.log(`[sample]   ${s.gateReason}`)
    } catch (err) {
      failures++
      console.error(`[sample] epoch ${epoch} ERROR: ${err instanceof Error ? err.message : err}`)
      if (err instanceof Error && err.stack) console.error(err.stack)
    }
  }

  const accepted = db.getLatestAcceptedVersion(PROJECT_ID)
  console.log('\n[sample] === FINAL ===')
  console.log(
    `[sample] accepted taxonomy: epoch ${accepted?.epoch ?? 0}, ${accepted?.rules_json?.length ?? 0} rule(s)`
  )
  for (const r of accepted?.rules_json ?? []) console.log(`  ${r.rule_id}. ${r.text}`)
  const verdict =
    failures > 0 ? `FAILED — ${failures} epoch(s) errored` : `COMPLETED — all ${NUM_EPOCHS} epochs ran`
  console.log(`[sample] ${verdict}`)
  process.exit(failures > 0 ? 1 : 0)
} catch (err) {
  console.error('[sample] FATAL:', err instanceof Error ? err.stack || err.message : err)
  process.exit(1)
}
