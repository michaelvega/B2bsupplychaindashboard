/**
 * OpenRouter chat client for dataset-learning-v2 (self-contained).
 *
 * OpenAI-compatible chat-completions over global `fetch` (no SDK). Endpoint,
 * model, and API key come from env with the Qwen3-VL-8B defaults baked in:
 *   - LLM_BASE_URL        (default https://openrouter.ai/api/v1)
 *   - LLM_MODEL           (default qwen/qwen3.8-flash)
 *   - LLM_MAX_TOKENS      (default 100000; lower it for models with a smaller
 *                          max-completion limit, e.g. Gemini Flash-Lite 65535)
 *   - OPENROUTER_API_KEY  (required, from env / .env)
 *
 * The wire body maps snake_case -> camelCase on the response. Transient
 * failures (network errors and 5xx / 429 / 408) are retried with exponential
 * backoff.
 */

// CLI convenience: load OPENROUTER_API_KEY / LLM_MODEL / LLM_BASE_URL from a
// local .env when a developer runs one of the Node scripts. The browser build
// aliases this module to llm.browser.js and never imports dotenv.
import 'dotenv/config'

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = 'qwen/qwen3.8-flash'
const DEFAULT_PROVIDER = 'openai'

const DEFAULT_MAX_TOKENS =
  Number(process.env.LLM_MAX_TOKENS) > 0 ? Number(process.env.LLM_MAX_TOKENS) : 100000
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_TIMEOUT_MS = 120_000
const MAX_RETRIES = 5
const RETRY_BASE_DELAY_MS = 5000

const RETRYABLE_CODES = new Set([
  'ECONNRESET',
  'EPIPE',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'ECONNABORTED',
  'UND_ERR_SOCKET',
  'UND_ERR_CLOSED',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_BODY_TIMEOUT',
  'ERR_SOCKET_CONNECTION_TIMEOUT',
])

function resolveBaseUrl() {
  return (process.env.LLM_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

function resolveModel(model) {
  return model ?? process.env.LLM_MODEL ?? DEFAULT_MODEL
}

function resolveAuthHeaders() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not set — add it to .env (see README) and restart.');
  }
  return {
    Authorization: `Bearer ${key}`,
  }
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
  // Undici surfaces connection resets as `TypeError: fetch failed` with the
  // real code/message on `.cause`.
  if (err.name === 'TypeError' && /fetch failed/i.test(err.message)) return true
  if (/other side closed|terminated/i.test(err.message)) return true
  const cause = err.cause
  if (cause instanceof Error) {
    if (cause.code && RETRYABLE_CODES.has(cause.code)) return true
    if (cause.message && /socket hang up|other side closed|terminated|fetch failed/i.test(cause.message)) {
      return true
    }
  }
  return false
}

async function httpPostJson(url, payload, headers, timeoutMs) {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
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
          if (attempt < maxRetries) {
            console.warn(`[llm] retry ${attempt + 1}/${maxRetries} after HTTP ${res.status}`)
          }
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
      if (attempt < maxRetries) {
        const code = err.code || err.cause?.code || err.name
        console.warn(`[llm] retry ${attempt + 1}/${maxRetries} after ${code}: ${err.message}`)
      }
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

  const startMs = Date.now()
  const startedAt = new Date(startMs).toISOString()

  const response = await withTimeout(
    chatCompletion(messages, config),
    guardMs,
    `LLM call exceeded ${guardMs}ms and was aborted`,
  )

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
