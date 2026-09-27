import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { useAuth } from '@/auth/context'
import { readToken, storeToken } from '@/lib/api'
import { headerValue, installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { User } from '@/types/api'

const queen: User = {
  id: 1,
  email: 'queen@goldqueen.dev',
  display_name: 'Gold Queen',
  created_at: '2026-01-01T00:00:00Z',
}

function SessionProbe() {
  const { status, user, login, logout } = useAuth()
  return (
    <div>
      <p>
        {status}:{user?.email ?? ''}
      </p>
      <button type="button" onClick={() => void login(queen.email, 'QueenDemo123!')}>
        Sign in probe
      </button>
      <button type="button" onClick={logout}>
        Sign out probe
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('starts anonymous when nothing is stored', () => {
    restore = installApiMock(() => ({ status: 500, data: {} }))
    render(
      <AppProviders>
        <SessionProbe />
      </AppProviders>,
    )

    expect(screen.getByText('anonymous:')).toBeInTheDocument()
  })

  it('trusts a stored token only after /v1/auth/me succeeds', async () => {
    storeToken('stored-token')
    restore = installApiMock((config) => {
      expect(config.url).toBe('/v1/auth/me')
      expect(headerValue(config, 'Authorization')).toBe('Bearer stored-token')
      return { status: 200, data: queen }
    })

    render(
      <AppProviders>
        <SessionProbe />
      </AppProviders>,
    )

    expect(await screen.findByText('authenticated:queen@goldqueen.dev')).toBeInTheDocument()
  })

  it('drops an expired stored token', async () => {
    storeToken('expired-token')
    restore = installApiMock(() => ({ status: 401, data: { detail: 'Token expired' } }))

    render(
      <AppProviders>
        <SessionProbe />
      </AppProviders>,
    )

    expect(await screen.findByText('anonymous:')).toBeInTheDocument()
    expect(readToken()).toBeNull()
  })

  it('stores the access token on login and clears it on logout', async () => {
    const user = userEvent.setup()
    const calls: string[] = []
    restore = installApiMock((config) => {
      calls.push(`${config.method ?? 'get'} ${config.url}`)
      if (config.url === '/v1/auth/login') {
        expect(headerValue(config, 'Authorization')).toBeUndefined()
        return {
          status: 200,
          data: { access_token: 'fresh-token', token_type: 'bearer', expires_in_minutes: 60 },
        }
      }
      expect(headerValue(config, 'Authorization')).toBe('Bearer fresh-token')
      return { status: 200, data: queen }
    })

    render(
      <AppProviders>
        <SessionProbe />
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Sign in probe' }))
    expect(await screen.findByText('authenticated:queen@goldqueen.dev')).toBeInTheDocument()
    expect(readToken()).toBe('fresh-token')
    expect(calls).toEqual(['post /v1/auth/login', 'get /v1/auth/me'])

    await user.click(screen.getByRole('button', { name: 'Sign out probe' }))
    expect(screen.getByText('anonymous:')).toBeInTheDocument()
    expect(readToken()).toBeNull()
  })
})
