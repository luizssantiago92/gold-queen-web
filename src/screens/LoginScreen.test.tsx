import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { useAuth } from '@/auth/context'
import { readToken } from '@/lib/api'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { User } from '@/types/api'

import { LoginScreen } from './LoginScreen'

const queen: User = {
  id: 1,
  email: 'queen@goldqueen.dev',
  display_name: 'Gold Queen',
  created_at: '2026-01-01T00:00:00Z',
}

function SessionEmail() {
  const { user } = useAuth()
  return <p>{user ? `signed-in:${user.email}` : 'signed-out'}</p>
}

describe('LoginScreen', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('shows the API error when the credentials are rejected', async () => {
    const user = userEvent.setup()
    restore = installApiMock(() => ({
      status: 400,
      data: { detail: 'Invalid credentials' },
    }))

    render(
      <AppProviders>
        <LoginScreen />
      </AppProviders>,
    )

    expect(screen.getByLabelText('Email')).toHaveValue('queen@goldqueen.dev')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
    expect(readToken()).toBeNull()
  })

  it('signs in with the prefilled demo account', async () => {
    const user = userEvent.setup()
    restore = installApiMock((config) => {
      if (config.url === '/v1/auth/login') {
        return {
          status: 200,
          data: { access_token: 'demo-token', token_type: 'bearer', expires_in_minutes: 60 },
        }
      }
      return { status: 200, data: queen }
    })

    render(
      <AppProviders>
        <LoginScreen />
        <SessionEmail />
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('signed-in:queen@goldqueen.dev')).toBeInTheDocument()
    expect(readToken()).toBe('demo-token')
  })
})
