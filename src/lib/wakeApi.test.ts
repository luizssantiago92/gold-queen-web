import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  healthUrl,
  isAwakeHealth,
  probeHealth,
  WAKE_ATTEMPT_TIMEOUT_MS,
  WAKE_BUDGET_MS,
  wakeApi,
  wakeBackoffMs,
  wakeProgressPercent,
} from '@/lib/wakeApi'

const awake = { status: 'ok', pluggy_live: false, ai_live: true }

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

describe('healthUrl', () => {
  it('joins the configured base with /health', () => {
    expect(healthUrl('https://gold-queen-api.onrender.com')).toBe(
      'https://gold-queen-api.onrender.com/health',
    )
    expect(healthUrl('http://127.0.0.1:8000/')).toBe('http://127.0.0.1:8000/health')
  })
})

describe('isAwakeHealth', () => {
  it('accepts the live health payload even when a dependency is down', () => {
    expect(isAwakeHealth(awake)).toBe(true)
    expect(isAwakeHealth({ status: 'ok', pluggy_live: false, ai_live: false })).toBe(true)
  })

  it('rejects bodies that are not the health endpoint', () => {
    expect(isAwakeHealth(null)).toBe(false)
    expect(isAwakeHealth({ status: 'ok' })).toBe(false)
    expect(isAwakeHealth({ status: '', pluggy_live: true, ai_live: true })).toBe(false)
    expect(isAwakeHealth('ok')).toBe(false)
  })
})

describe('wake schedule', () => {
  it('backs off exponentially and caps the wait', () => {
    expect(wakeBackoffMs(0)).toBe(0)
    expect(wakeBackoffMs(1)).toBe(1_000)
    expect(wakeBackoffMs(2)).toBe(2_000)
    expect(wakeBackoffMs(3)).toBe(4_000)
    expect(wakeBackoffMs(4)).toBe(8_000)
    expect(wakeBackoffMs(8)).toBe(8_000)
  })

  it('fills the budget as a percentage', () => {
    expect(wakeProgressPercent(0)).toBe(0)
    expect(wakeProgressPercent(1_500)).toBe(2)
    expect(wakeProgressPercent(WAKE_BUDGET_MS)).toBe(100)
    expect(wakeProgressPercent(WAKE_BUDGET_MS + 5_000)).toBe(100)
  })
})

describe('wakeApi', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns on the first healthy probe without waiting', async () => {
    vi.useFakeTimers()
    const probe = vi.fn(async () => ({ ok: true as const, health: awake }))
    const pending = wakeApi({ probe, sleep })

    await vi.runAllTimersAsync()
    await expect(pending).resolves.toEqual({ ok: true, health: awake })
    expect(probe).toHaveBeenCalledTimes(1)
    expect(probe).toHaveBeenCalledWith(WAKE_ATTEMPT_TIMEOUT_MS, undefined)
  })

  it('retries a fast failure with backoff and then succeeds', async () => {
    vi.useFakeTimers()
    const timeouts: number[] = []
    const probe = vi.fn(async (timeoutMs: number) => {
      timeouts.push(timeoutMs)
      if (timeouts.length < 3) return { ok: false as const }
      return { ok: true as const, health: awake }
    })

    const pending = wakeApi({ probe, sleep, budgetMs: 20_000 })
    await vi.runAllTimersAsync()

    await expect(pending).resolves.toEqual({ ok: true, health: awake })
    expect(timeouts).toEqual([20_000, 19_000, 17_000])
  })

  it('stops when a hanging cold start uses up the budget', async () => {
    vi.useFakeTimers()
    const timeouts: number[] = []
    const probe = vi.fn(async (timeoutMs: number, signal?: AbortSignal) => {
      timeouts.push(timeoutMs)
      await sleep(timeoutMs, signal)
      return { ok: false as const }
    })

    const pending = wakeApi({ probe, sleep, budgetMs: WAKE_BUDGET_MS })
    await vi.runAllTimersAsync()

    await expect(pending).resolves.toEqual({ ok: false })
    expect(timeouts).toEqual([WAKE_ATTEMPT_TIMEOUT_MS, WAKE_BUDGET_MS - WAKE_ATTEMPT_TIMEOUT_MS - 1_000])
  })

  it('does not report failure when the probe is aborted', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const probe = vi.fn(async (_timeoutMs: number, signal?: AbortSignal) => {
      await sleep(5_000, signal)
      return { ok: false as const }
    })

    const pending = wakeApi({ probe, sleep, signal: controller.signal, budgetMs: 30_000 })
    const running = vi.advanceTimersByTimeAsync(1_000).then(() => controller.abort())
    await running
    await vi.runAllTimersAsync()

    await expect(pending).resolves.toEqual({ ok: false, aborted: true })
  })
})

describe('probeHealth', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('treats the health JSON as awake', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => awake,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(probeHealth(5_000, undefined, 'https://gold-queen-api.onrender.com')).resolves.toEqual({
      ok: true,
      health: awake,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://gold-queen-api.onrender.com/health',
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    )
  })

  it('retries later when the response is not the health payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ detail: 'not found' }),
      }),
    )

    await expect(probeHealth(1_000)).resolves.toEqual({ ok: false })
  })

  it('returns not awake when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(probeHealth(1_000)).resolves.toEqual({ ok: false })
  })
})
