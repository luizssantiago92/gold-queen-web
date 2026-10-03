import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { pt } from '@/i18n/pt'

import { ApiWakeGate } from './ApiWakeGate'

const awake = { status: 'ok', pluggy_live: true, ai_live: false }

function renderGate() {
  localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
  return render(
    <I18nProvider>
      <ApiWakeGate>
        <p>treasury</p>
      </ApiWakeGate>
    </I18nProvider>,
  )
}

function hangUntilAbort(init?: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    const signal = init?.signal
    const abort = () => reject(new DOMException('Aborted', 'AbortError'))
    if (signal?.aborted) {
      abort()
      return
    }
    signal?.addEventListener('abort', abort, { once: true })
  })
}

describe('ApiWakeGate', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('leaves the app alone when health answers before the reveal delay', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => awake,
      }),
    )

    renderGate()

    expect(screen.getByText('treasury')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(screen.getByText('treasury')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('shows an accessible wake screen only after the probe stays quiet', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_input: RequestInfo, init?: RequestInit) => hangUntilAbort(init)))

    renderGate()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_499)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('treasury')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent(pt.wakeTitle)
    expect(status).toHaveTextContent(pt.wakeBody)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
    expect(screen.getByText('treasury').closest('[aria-hidden="true"]')).not.toBeNull()
    expect(screen.getByText('treasury').closest('[inert]')).not.toBeNull()
  })

  it('offers a retry after the budget and clears the screen when health recovers', async () => {
    vi.useFakeTimers()
    let awakeNow = false
    const fetchMock = vi.fn(async () => {
      if (!awakeNow) throw new TypeError('Failed to fetch')
      return { ok: true, json: async () => awake }
    })
    vi.stubGlobal('fetch', fetchMock)

    renderGate()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(90_000)
    })

    expect(screen.getByRole('status')).toHaveTextContent(pt.wakeFailed)
    const retry = screen.getByRole('button', { name: pt.wakeRetry })
    expect(retry).toHaveTextContent('Tentar de novo')

    awakeNow = true
    await act(async () => {
      fireEvent.click(retry)
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('treasury')).toBeInTheDocument()
    expect(fetchMock.mock.calls.length).toBeGreaterThan(1)
  })
})
