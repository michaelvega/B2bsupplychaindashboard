/**
 * Path resolution for the Node CLI experiment scripts.
 *
 * The original scripts hard-coded absolute paths from the author's machine.
 * This module makes them portable:
 *
 *   DL_DB_PATH   where the SQLite file lives (default: ./dataset-learning-v2.db)
 *   DL_CSV_PATH  input CSV for run-frontier / run-research / run-research-sample
 *   DL_JSON_PATH source JSONL for generate-sample-answers
 *   DL_OUT_PATH  output JSONL for generate-sample-answers
 *
 * Values come from the environment or a local .env (loaded here once).
 */

import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(HERE, '../../data')

export const DB_PATH = process.env.DL_DB_PATH || path.join(process.cwd(), 'dataset-learning-v2.db')

/** A dataset that ships with the repo, so the CLI works from a fresh clone. */
export function bundledData(name) {
  return path.join(DATA_DIR, name)
}

export function envPath(name, fallback = null) {
  const value = process.env[name] || fallback
  if (!value) {
    console.error(`Missing ${name}. Set it in .env or the environment (see README).`)
    process.exit(1)
  }
  return path.resolve(value)
}
