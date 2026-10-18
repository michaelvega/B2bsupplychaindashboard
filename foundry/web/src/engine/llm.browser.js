/**
 * Browser OpenRouter chat client for dataset-learning-v2.
 *
 * Same OpenAI-compatible wire protocol and retry behavior as llm.js, but the
 * endpoint, model, and key come from localStorage instead of process.env.
 * In a static deployment there is no server to hold a secret, so the demo is
 * BYOK: the user pastes their own OpenRouter key in the UI. The key is sent
 * only to the configured base URL (OpenRouter by default).
 *
 * The wire body maps snake_case -> camelCase on the response. Transient
 * failures (network errors and 5xx / 429 / 408) are retried with exponential
 * backoff.
 */

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = 'qwen/qwen3.8-flash'
const DEFAULT_PROVIDER = 'openai'

const DEFAULT_MAX_TOKENS = 100000
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_TIMEOUT_MS = 120_000
const MAX_RETRIES = 5
const RETRY_BASE_DELAY_MS = 5000

const STORAGE_KEYS = {
  apiKey: 'procept-foundry.openrouter-key',
  model: 'procept-foundry.model',
  baseUrl: 'procept-foundry.base-url',
}

const RETRYABLE_CODES = new Set([
  'ECONNRESET',
  'EPIPE',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
])

function readSetting(key, fallback = '') {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function writeSetting(key, value) {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch {
    // Private mode / storage disabled: keep the in-memory value for this session.
  }
}

export function getApiKey() {
  return readSetting(STORAGE_KEYS.apiKey, '')
}

export function setApiKey(key) {
  writeSetting(STORAGE_KEYS.apiKey, String(key ?? '').trim())
}

export function hasApiKey() {
  return getApiKey().length > 0
}

export function getModel() {
  return readSetting(STORAGE_KEYS.model, DEFAULT_MODEL)
}

export function setModel(model) {
  writeSetting(STORAGE_KEYS.model, String(model ?? '').trim())
}

export function getBaseUrl() {
  return readSetting(STORAGE_KEYS.baseUrl, DEFAULT_BASE_URL)
}

export function setBaseUrl(url) {
  writeSetting(STORAGE_KEYS.baseUrl, String(url ?? '').trim())
}

function resolveBaseUrl() {
  return getBaseUrl().replace(/\/+$/, '')
}

function resolveModel(model) {
  return model ?? getModel() ?? DEFAULT_MODEL
}

function resolveAuthHeaders() {
  const key = getApiKey()
  if (!key) {
    throw new Error('OpenRouter API key is not set — paste one in the Dataset Learning page.')
  }
  return {
    Authorization: `Bearer ${key}`,
    'X-Title': 'Procept Foundry Demo',
  }
}

// ---------------------------------------------------------------------------
// Run control (pause / stop). One run per tab, so a single module-level state.
// Pause lets in-flight calls finish and holds back the next ones; stop aborts
// in-flight calls and makes every further call throw RunStoppedError.
// ---------------------------------------------------------------------------

export class RunStoppedError extends Error {
  constructor() {
    super('Run stopped by user')
    this.name = 'RunStoppedError'
  }
}

const control = { state: 'running', inFlight: 0, waiters: [], controller: new AbortController() }

function wakeWaiters() {
  const waiters = control.waiters
  control.waiters = []
  for (const wake of waiters) wake()
}

/** -> { state: 'running'|'paused'|'stopped', inFlight: number } */
export function getRunControl() {
  return { state: control.state, inFlight: control.inFlight }
}

export function pauseRun() {
  if (control.state === 'running') control.state = 'paused'
}

export function resumeRun() {
  if (control.state !== 'paused') return
  control.state = 'running'
  wakeWaiters()
}

export function stopRun() {
  control.state = 'stopped'
  control.controller.abort()
  wakeWaiters()
}

/** Call at the start of every run so a previous stop or pause does not leak in. */
export function resetRunControl() {
  control.state = 'running'
  control.controller = new AbortController()
  wakeWaiters()
}

function throwIfStopped() {
  if (control.state === 'stopped') throw new RunStoppedError()
}

/** Blocks while paused; throws once stopped. */
async function runGate() {
  for (;;) {
    throwIfStopped()
    if (control.state === 'running') return
    await new Promise((resolve) => control.waiters.push(resolve))
  }
}

function requestSignal(timeoutMs) {
  const timeout = AbortSignal.timeout(timeoutMs)
  return typeof AbortSignal.any === 'function' ? AbortSignal.any([timeout, control.controller.signal]) : timeout
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableStatus(status) {
  return status >= 500 || status === 429 || status === 408
}

function isRetryableNetworkError(err) {
  if (!(err instanceof Error)) return false
  if (err.name === 'AbortError' || err.name === 'TimeoutError') return true
  if (err.code && RETRYABLE_CODES.has(err.code)) return true
  if (err.message === 'socket hang up') return true
  // fetch wraps the underlying system error in a TypeError with `.cause`.
  const cause = err.cause
  if (cause instanceof Error) {
    if (cause.code && RETRYABLE_CODES.has(cause.code)) return true
    if (cause.message === 'socket hang up') return true
  }
  return false
}

async function httpPostJson(url, payload, headers, timeoutMs) {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: requestSignal(timeoutMs),
  })
  const body = await res.text()
  return { status: res.status, body }
}

/**
 * One OpenAI-compatible chat-completions request (with retries).
 * @param {Array<{role: string, content: string}>} messages
 * @param {{model?: string, maxTokens?: number, temperature?: number, timeoutMs?: number, maxRetries?: number}} [config]
 * @returns {Promise<{content: string, finishReason: string, model: string, provider: string, usage?: {promptTokens: number, completionTokens: number, totalTokens: number}}>}
 */
export async function chatCompletion(messages, config) {
  const model = resolveModel(config?.model)
  const maxTokens = config?.maxTokens ?? DEFAULT_MAX_TOKENS
  const temperature = config?.temperature ?? DEFAULT_TEMPERATURE
  const timeoutMs = config?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const maxRetries = config?.maxRetries ?? MAX_RETRIES

  const url = `${resolveBaseUrl()}/chat/completions`
  const headers = {
    'Content-Type': 'application/json',
    ...resolveAuthHeaders(),
  }

  let lastErr

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    throwIfStopped()
    if (attempt > 0) {
      await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
    }

    try {
      const payload = {
        model,
        messages,
        stream: false,
        max_tokens: maxTokens,
        temperature,
        reasoning: { enabled: false },
      }

      const res = await httpPostJson(url, payload, headers, timeoutMs)

      if (res.status < 200 || res.status >= 300) {
        const err = new Error(`LLM returned ${res.status}: ${res.body.slice(0, 500)}`)
        if (isRetryableStatus(res.status)) {
          lastErr = err
          continue
        }
        throw err
      }

      let data
      try {
        data = JSON.parse(res.body)
      } catch {
        throw new Error(`LLM returned unparseable response: ${res.body.slice(0, 300)}`)
      }

      const choice = data.choices?.[0]
      const usage = data.usage
        ? {
            promptTokens: data.usage.prompt_tokens ?? 0,
            completionTokens: data.usage.completion_tokens ?? 0,
            totalTokens: data.usage.total_tokens ?? 0,
          }
        : undefined

      return {
        content: choice?.message?.content ?? '',
        finishReason: choice?.finish_reason,
        model: data.model ?? model,
        provider: DEFAULT_PROVIDER,
        usage,
      }
    } catch (err) {
      lastErr = err
      if (!isRetryableNetworkError(err)) throw err
      // fall through and retry
    }
  }

  throw lastErr
}

async function withTimeout(promise, timeoutMs, message) {
  let timeoutId = null
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

/**
 * Chat completion wrapped in an outer timeout budget derived from the
 * per-request timeout and retry count.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{model?: string, maxTokens?: number, temperature?: number, timeoutMs?: number, maxRetries?: number}} [config]
 * @returns {Promise<{response: object, durationMs: number, startedAt: string}>}
 */
export async function guardedChatCompletion(messages, config = {}) {
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const maxRetries = config.maxRetries ?? MAX_RETRIES
  const backoffMs = RETRY_BASE_DELAY_MS * (2 ** maxRetries - 1)
  const guardMs = timeoutMs * (maxRetries + 1) + backoffMs + 15_000

  // The gate sits outside the timeout budget so time spent paused is not counted.
  await runGate()
  const startMs = Date.now()
  const startedAt = new Date(startMs).toISOString()
  control.inFlight++
  let response
  try {
    response = await withTimeout(
      chatCompletion(messages, config),
      guardMs,
      `LLM call exceeded ${guardMs}ms and was aborted`,
    )
  } catch (err) {
    // An abort caused by Stop surfaces as a network error; report it as the stop it is.
    throwIfStopped()
    throw err
  } finally {
    control.inFlight--
  }

  return { response, durationMs: Date.now() - startMs, startedAt }
}

/**
 * Strip common markdown code-fence wrappers that LLMs insert around JSON, then
 * return the first balanced JSON object or array substring if present.
 * @param {string} content
 * @returns {string}
 */
export function stripFences(content) {
  const stripped = content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()

  const objStart = stripped.indexOf('{')
  const arrStart = stripped.indexOf('[')
  let start
  if (objStart === -1) start = arrStart
  else if (arrStart === -1) start = objStart
  else start = Math.min(objStart, arrStart)
  if (start === -1) return stripped

  const openChar = stripped[start]
  const closeChar = openChar === '{' ? '}' : ']'
  let depth = 0
  let inString = false
  let escape = false

  for (let i = start; i < stripped.length; i++) {
    const ch = stripped[i]
    if (escape) {
      escape = false
      continue
    }
    if (ch === '\\' && inString) {
      escape = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (ch === openChar) depth++
    else if (ch === closeChar) {
      depth--
      if (depth === 0) return stripped.slice(start, i + 1)
    }
  }

  return stripped
}

function isParseFailure(val) {
  return (
    val !== null &&
    typeof val === 'object' &&
    'kind' in val &&
    (val.kind === 'json_syntax' || val.kind === 'validation')
  )
}

/**
 * Call the LLM for a JSON response and parse it, throwing on failure.
 * @param {{systemPrompt: string, userContent: string, parse: (json: string, raw: string) => any, timeoutMs?: number, maxRetries?: number}} input
 * @returns {Promise<{parsed: any, trace: object, usage?: object}>}
 */
export async function runJsonLLM({ systemPrompt, userContent, parse, timeoutMs, maxRetries }) {
  const config = {}
  if (timeoutMs !== undefined) config.timeoutMs = timeoutMs
  if (maxRetries !== undefined) config.maxRetries = maxRetries

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  const { response, durationMs, startedAt } = await guardedChatCompletion(messages, config)

  const trace = {
    messages,
    config: {
      provider: response.provider,
      model: response.model,
      temperature: config.temperature ?? DEFAULT_TEMPERATURE,
      maxTokens: config.maxTokens ?? DEFAULT_MAX_TOKENS,
    },
    response: { content: response.content, finishReason: response.finishReason },
    durationMs,
    startedAt,
    usage: response.usage,
  }

  const result = parse(stripFences(response.content), response.content)

  if (result === null || isParseFailure(result)) {
    const detail = isParseFailure(result)
      ? `${result.kind}: ${result.message}`
      : `finishReason=${response.finishReason}, responseLength=${response.content.length}`
    throw new Error('LLM response parse failed: ' + detail)
  }

  return { parsed: result, trace, usage: response.usage }
}
