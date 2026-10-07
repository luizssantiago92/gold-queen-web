import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { App } from '@/App'
import { clearToken, readToken, storeToken } from '@/lib/api'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { installApiMock, type MockResult } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'

describe('stored session shell', () => {
  let restore: (() => void) | undefined

  beforeAll(() => {
    if (!('ResizeObserver' in globalThis)) {
      class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    }
  })

  afterEach(() => {
    restore?.()
    clearToken()
    localStorage.removeItem('gold-queen.demo-banner-dismissed')
  })

  it('shows dashboard skeletons while the profile request is in flight, then the sign-in form if the token is rejected', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    localStorage.setItem('gold-queen.demo-banner-dismissed', '1')
    storeToken('pending-token')

    const calls: string[] = []
    let releaseProfile: (result: MockResult) => void = () => {}
    const profile = new Promise<MockResult>((resolve) => {
      releaseProfile = resolve
    })

    restore = installApiMock((config) => {
      const url = config.url ?? ''
      calls.push(url)
      if (url === '/v1/auth/me') return profile
      return new Promise<MockResult>(() => {})
    })

    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )

    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    expect(screen.queryByText('Opening the royal treasury...')).not.toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Account balance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Learn to manage your wealth' })).toBeInTheDocument()
    expect(calls).toContain('/v1/auth/me')
    expect(calls).toContain('/v1/dashboard/overview')

    await act(async () => {
      releaseProfile({ status: 401, data: { detail: 'Token expired' } })
    })

    expect(await screen.findByLabelText('Email')).toBeInTheDocument()
    expect(readToken()).toBeNull()
  })
})
