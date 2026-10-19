/**
 * Standalone smoke test for dataset-learning-v2.
 *
 * Run with `node src/dataset-learning-v2/smoke-test.js`. It deletes the SQLite
 * file so the schema is re-created from scratch, then ONLY after the delete
 * dynamically imports db.js and engine.js (a static import would open the db
 * before the file is removed). It builds a small open-ended project in
 * per-row rubric mode, ingests five question/rubric rows (frontier-science
 * shape), seeds the empty baseline taxonomy and runs two epochs,
 * then prints a readable report: per-epoch metric + gate, the final taxonomy,
 * the scorecards and two sample row histories. Exits 0 on success.
 */

import { rmSync } from 'node:fs'
import { DB_PATH } from './cli-paths.js'

const PROJECT_ID = 'smoke'
const NUM_EPOCHS = 2

const CSV = [
  'question,rubric',
  '"Explain what a mammal is.","Points: 1, Item: Definition - States mammals are warm-blooded vertebrates with hair or fur. Points: 1, Item: Milk - Mentions mammals nurse their young with milk."',
  '"What is photosynthesis?","Points: 1, Item: Process - Describes converting light energy into chemical energy. Points: 1, Item: Inputs - Mentions carbon dioxide and water."',
  '"Define gravity.","Points: 1, Item: Attraction - States that masses attract each other. Points: 1, Item: Force - Mentions it is a fundamental force."',
  '"Explain evaporation.","Points: 1, Item: Process - Describes liquid turning into gas. Points: 1, Item: Heat - Mentions heat causes it."',
].join('\n')

const PROJECT_FIELDS = {
  id: PROJECT_ID,
  title: 'smoke',
  system_prompt: 'Answer the question concisely and accurately.\nQuestion: {{question}}',
  output_format: { answer: 'a short free-form answer' },
  golden_column: null,
  rubric_mode: 'per_row',
  rubric_column: 'rubric',
  open_ended: 1,
  holdout_pct: 0.2,
  edit_budget: 2,
  max_new_meta: 1,
  max_edits_meta: 2,
  min_citations: 3,
}

function heading(text) {
  console.log(`\n=== ${text} ===`)
}

function printEpochSummary(summary) {
  console.log(
    `epoch ${summary.epoch}: status=${summary.status} metric=${summary.metric.toFixed(3)} ` +
      `prev=${summary.prevMetric.toFixed(3)} repairs=${summary.repairs} ` +
      `regressions=${summary.regressions} gatePassed=${summary.gatePassed} ` +
      `rules ${summary.ruleCountBefore} -> ${summary.ruleCountAfter}`
  )
  console.log(`  reason: ${summary.gateReason}`)
}

function printRules(rules) {
  if (rules.length === 0) {
    console.log('  (no rules)')
    return
  }
  for (const rule of rules) console.log(`  ${rule.rule_id}. ${rule.text}`)
}

function printScorecards(cards) {
  if (cards.length === 0) {
    console.log('  (no scorecards)')
    return
  }
  for (const card of cards) {
    console.log(
      `  rule ${card.rule_id}: shrinkage=${Number(card.shrinkage_association).toFixed(3)}`
    )
  }
}

function printRowHistory(row, history) {
  console.log(`  row: ${row.payload.question ?? row.payload.word}`)
  if (history.length === 0) {
    console.log('    (no history)')
    return
  }
  for (const entry of history) {
    const ok =
      entry.correct === true || entry.correct === false
        ? entry.correct
        : entry.continuous_correct === 1
          ? true
          : entry.continuous_correct === 0
            ? false
            : 'n/a'
    const score =
      entry.rubric_score != null ? `${entry.rubric_score}/${entry.rubric_total}` : 'n/a'
    console.log(
      `    epoch ${entry.epoch}: predicted=${JSON.stringify(entry.predicted_label)} ` +
        `ok=${ok} score=${score} cited=[${entry.cited_rule_ids_json.join(',')}] ` +
        `wrong_before=${entry.wrong_count_before}`
    )
    if (entry.diagnosis) console.log(`      diagnosis: ${entry.diagnosis}`)
  }
}

// Delete first, then import, so db.js opens a fresh file and re-creates the schema.
rmSync(DB_PATH, { force: true })

try {
  const db = await import('./db.js')
  const engine = await import('./engine.js')

  heading('SETUP')
  const project = await engine.createProject(PROJECT_FIELDS)
  console.log(`project ${project.id} created (open_ended=${project.open_ended})`)

  const upload = await engine.uploadCsv(PROJECT_ID, CSV)
  console.log(
    `uploaded ${upload.totalRows} row(s): columns=[${upload.columns.join(', ')}] ` +
      `${upload.holdoutCount} holdout / ${upload.poolCount} pool`
  )

  await engine.seedInitialTaxonomy(PROJECT_ID)
  const baseline = db.getLatestAcceptedVersion(PROJECT_ID)
  console.log(`seeded baseline taxonomy: version ${baseline.id} (epoch ${baseline.epoch})`)

  heading(`RUN ${NUM_EPOCHS} EPOCH(S)`)
  const run = await engine.runAll(PROJECT_ID, NUM_EPOCHS)
  for (const summary of run.epochs) printEpochSummary(summary)

  heading('FINAL TAXONOMY (latest accepted version)')
  const accepted = db.getLatestAcceptedVersion(PROJECT_ID)
  console.log(`accepted version: epoch ${accepted.epoch} (${accepted.rules_json.length} rule(s))`)
  printRules(accepted.rules_json)

  heading('SCORECARDS (last epoch)')
  const epochs = db.listEpochs(PROJECT_ID)
  printScorecards(db.getScorecard(PROJECT_ID, epochs[epochs.length - 1].epoch))

  heading('META + EDITS (per epoch)')
  for (const epochRow of epochs) {
    console.log(`  epoch ${epochRow.epoch}:`)
    console.log(`    meta reasoning: ${String(epochRow.meta_reasoning ?? '').slice(0, 240)}`)
    const edits = Array.isArray(epochRow.meta_edits_json) ? epochRow.meta_edits_json : []
    console.log(`    meta edits (${edits.length}):`)
    for (const edit of edits) console.log(`      ${JSON.stringify(edit)}`)
  }

  heading('SAMPLE ROW HISTORIES')
  const rows = db.getRows(PROJECT_ID).slice(0, 2)
  for (const row of rows) printRowHistory(row, db.getRowHistory(PROJECT_ID, row.id))

  heading('RUN LOG')
  for (const entry of run.log) console.log(`  [${entry.epoch}] ${entry.message}`)

  console.log('\nSMOKE OK')
  process.exit(0)
} catch (error) {
  console.error('SMOKE FAILED')
  console.error(error)
  process.exit(1)
}
