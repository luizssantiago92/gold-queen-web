import { API_BASE_URL } from '@/lib/api'

/** Hide the wake screen unless the probe is still running after this long. */
export const WAKE_REVEAL_MS = 1_500

/** Stop retrying and show the manual retry action after this wall-clock budget. */
export const WAKE_BUDGET_MS = 90_000

/**
 * One Render cold start often holds the socket for 30–60s. Capping a single
 * attempt here leaves the rest of the budget for a backoff retry.
 */
export const WAKE_ATTEMPT_TIMEOUT_MS = 60_000

const BACKOFF_BASE_MS = 1_000
const BACKOFF_CAP_MS = 8_000

export interface HealthStatus {
  status: string
  pluggy_live: boolean
  ai_live: boolean
}

export type ProbeResult = { ok: true; health: HealthStatus } | { ok: false }

export type WakeResult = { ok: true; health: HealthStatus } | { ok: false; aborted?: boolean }

export interface WakeOptions {
  probe: (timeoutMs: number, signal?: AbortSignal) => Promise<ProbeResult>
  budgetMs?: number
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>
  now?: () => number
  signal?: AbortSignal
}

/** `GET {API_BASE_URL}/health`, ignoring a trailing slash on the base. */
export function healthUrl(baseUrl: string = API_BASE_URL): string {
  return `${baseUrl.replace(/\/+$/, '')}/health`
}

/** A 2xx body with the live health shape means the free instance is up. */
export function isAwakeHealth(value: unknown): value is HealthStatus {
  if (!value || typeof value !== 'object') return false
  const body = value as Record<string, unknown>
  return (
    typeof body.status === 'string' &&
    body.status.length > 0 &&
    typeof body.pluggy_live === 'boolean' &&
    typeof body.ai_live === 'boolean'
  )
}

/** Delay before the attempt that follows `failureCount` failed probes (1-based). */
export function wakeBackoffMs(failureCount: number): number {
  if (failureCount < 1) return 0
  return Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** (failureCount - 1))
}

/** Linear fill of the 90s budget, clamped to 0–100. */
export function wakeProgressPercent(elapsedMs: number, budgetMs: number = WAKE_BUDGET_MS): number {
  if (budgetMs <= 0) return 100
  const ratio = Math.min(1, Math.max(0, elapsedMs / budgetMs))
  return Math.round(ratio * 100)
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const timer = setTimeout(finish, ms)
    const onAbort = () => {
      clearTimeout(timer)
      reject(abortError())
    }

    function finish() {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function abortError(): Error {
  const error = new Error('Wake aborted')
  error.name = 'AbortError'
  return error
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * Probe `/health` until it answers or the budget runs out.
 * Fast failures wait with exponential backoff; a hanging cold start is allowed
 * to occupy one attempt timeout before the next try.
 */
export async function wakeApi(options: WakeOptions): Promise<WakeResult> {
  const budgetMs = options.budgetMs ?? WAKE_BUDGET_MS
  const sleep = options.sleep ?? delay
  const now = options.now ?? Date.now
  const started = now()
  let failures = 0

  try {
    while (!options.signal?.aborted) {
      if (now() - started >= budgetMs) break

      if (failures > 0) {
        const wait = Math.min(wakeBackoffMs(failures), budgetMs - (now() - started))
        if (wait <= 0) break
        await sleep(wait, options.signal)
      }

      if (options.signal?.aborted) break
      const remaining = budgetMs - (now() - started)
      if (remaining <= 0) break

      const timeoutMs = Math.min(WAKE_ATTEMPT_TIMEOUT_MS, remaining)
      const result = await options.probe(timeoutMs, options.signal)
      if (options.signal?.aborted) break
      if (result.ok) return result
      failures += 1
    }
  } catch (error) {
    if (isAbortError(error) || options.signal?.aborted) {
      return { ok: false, aborted: true }
    }
    throw error
  }

  if (options.signal?.aborted) return { ok: false, aborted: true }
  return { ok: false }
}

/** Browser probe used by the gate. Kept off the shared Axios client so the JWT retry interceptor does not spend the wake budget. */
export async function probeHealth(
  timeoutMs: number,
  signal?: AbortSignal,
  baseUrl: string = API_BASE_URL,
): Promise<ProbeResult> {
  if (signal?.aborted) return { ok: false }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const onParentAbort = () => controller.abort()
  signal?.addEventListener('abort', onParentAbort)

  try {
    const response = await fetch(healthUrl(baseUrl), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) return { ok: false }
    const body: unknown = await response.json()
    return isAwakeHealth(body) ? { ok: true, health: body } : { ok: false }
  } catch {
    return { ok: false }
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onParentAbort)
  }
}
