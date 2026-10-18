/**
 * Generate "perfect" sample answers for the research-rubric dataset.
 *
 * For each prompt, run an iterative write → grade → fix loop: an LLM writes an
 * answer, a judge grades it against the rubric, and if it isn't full marks the
 * writer revises against the deductions. The best answer (highest score) is kept.
 *
 * Usage: node generate-sample-answers.js --from 0 --to 10 --out /tmp/slice.jsonl
 * Writes one JSON object per row: { ...source fields..., sample_answer, score, total }.
 */

import { readFileSync, appendFileSync, existsSync, rmSync } from 'node:fs'
import { chatCompletion } from './llm.js'
import { bundledData, envPath } from './cli-paths.js'

const MAX_ITERS = 4
const JSON_PATH = envPath('DL_JSON_PATH', bundledData('sample-rows.jsonl'))
const COMPLETE_PATH = envPath('DL_OUT_PATH', 'sample-answers.generated.jsonl')

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag) => {
    const i = args.indexOf(flag)
    return i >= 0 ? args[i + 1] : undefined
  }
  return {
    from: Number(get('--from') ?? 0),
    to: Number(get('--to') ?? Infinity),
    out: get('--out') ?? '/tmp/sample-slice.jsonl',
  }
}

function rubricTotal(rubrics) {
  return rubrics.filter((r) => (r.weight ?? r.max) > 0).reduce((s, r) => s + (r.weight ?? r.max), 0)
}

function extractJson(text) {
  if (!text) return null
  const s = text.trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(s.slice(start, end + 1))
  } catch {
    return null
  }
}

async function generate(prompt, domain) {
  const r = await chatCompletion(
    [
      {
        role: 'system',
        content:
          'You are an expert assistant writing a complete reference answer. Address EVERY part of the prompt thoroughly and substantively. Use clear structure (sections, headings, numbered lists) when the prompt implies a report, brief, list, or comparison. Never refuse or hedge with "no established answer" — give the best concrete answer possible. Do NOT mention that you are an AI.',
      },
      { role: 'user', content: `Domain: ${domain ?? ''}\n\n${prompt}` },
    ],
    { maxTokens: 6000 },
  )
  return r.content || ''
}

async function judge(prompt, answer, rubrics) {
  const total = rubricTotal(rubrics)
  const r = await chatCompletion(
    [
      {
        role: 'system',
        content:
          `You are a strict, consistent grader. Grade the answer against the rubric. Each criterion has "criterion", "weight", "axis". POSITIVE weight = award up to that many points when satisfied. NEGATIVE weight = deduct its absolute value only when violated (do NOT award points for it). "total" is EXACTLY ${total} (the sum of POSITIVE weights only — do not sum negative weights as positives). "score" = (awarded positive points) minus (violated negative penalties), clamped to [0, ${total}]. Return ONLY JSON: {"score":<0..${total}>,"total":${total},"dock":[{"criterion":"...","points":<number>,"reason":"..."}]}.`,
      },
      {
        role: 'user',
        content: `Prompt:\n${prompt}\n\nAnswer:\n${answer}\n\nRubric:\n${JSON.stringify(rubrics)}`,
      },
    ],
    { maxTokens: 2500 },
  )
  const parsed = extractJson(r.content)
  if (!parsed || typeof parsed.score !== 'number') {
    return { score: 0, total, dock: [] }
  }
  const score = Math.max(0, Math.min(parsed.score, total))
  return {
    score,
    total,
    dock: Array.isArray(parsed.dock) ? parsed.dock : [],
  }
}

async function rewrite(prompt, answer, rubrics, dock) {
  const dockText = (dock || [])
    .map((d) => `- MISSING: ${d.criterion} (deducted ${d.points}; reason: ${d.reason ?? ''})`)
    .join('\n')
  const r = await chatCompletion(
    [
      {
        role: 'system',
        content:
          'You are an expert assistant revising an answer to reach full marks. Fix EVERY deduction listed below while keeping everything already correct. Output the COMPLETE revised answer (not just the additions). Never refuse or hedge.',
      },
      {
        role: 'user',
        content: `Prompt:\n${prompt}\n\nCurrent answer:\n${answer}\n\nDeductions to fix:\n${dockText}\n\nRubric (for reference):\n${JSON.stringify(rubrics)}`,
      },
    ],
    { maxTokens: 6000 },
  )
  return r.content || ''
}

async function main() {
  const { from, to, out } = parseArgs()
  if (existsSync(out)) rmSync(out, { force: true })

  const rows = []
  for (const line of readFileSync(JSON_PATH, 'utf8').split('\n')) {
    const t = line.trim()
    if (t) rows.push(JSON.parse(t))
  }

  // Resume: skip rows already completed (keyed by sample_id).
  const done = new Set()
  if (existsSync(COMPLETE_PATH)) {
    for (const line of readFileSync(COMPLETE_PATH, 'utf8').split('\n')) {
      const t = line.trim()
      if (!t) continue
      try {
        done.add(JSON.parse(t).sample_id)
      } catch {
        // skip malformed line
      }
    }
  }

  const slice = rows.slice(from, to)
  let skipped = 0
  for (let i = 0; i < slice.length; i++) {
    const row = slice[i]
    if (done.has(row.sample_id)) {
      skipped++
      continue
    }
    const rubrics = row.rubrics
    const total = rubricTotal(rubrics)

    let answer = await generate(row.prompt, row.domain)
    let best = { answer, score: -Infinity }

    for (let iter = 0; iter < MAX_ITERS; iter++) {
      const grade = await judge(row.prompt, answer, rubrics)
      if (grade.score > best.score) best = { answer, score: grade.score }
      if (grade.score >= grade.total) break
      if (iter === MAX_ITERS - 1) break
      answer = await rewrite(row.prompt, answer, rubrics, grade.dock)
    }

    const record = { ...row, sample_answer: best.answer, score: best.score, total }
    appendFileSync(out, JSON.stringify(record) + '\n')
    appendFileSync(COMPLETE_PATH, JSON.stringify(record) + '\n')
    process.stdout.write(`[${from + i}] ${row.sample_id} score=${best.score}/${total}\n`)
  }
  console.log(`done: ${slice.length - skipped} rows (${skipped} skipped) -> ${out}`)
}

main().catch((err) => {
  console.error('FATAL:', err)
  process.exit(1)
})
