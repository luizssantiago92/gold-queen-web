import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/auth/context'
import { ApiWakeGate } from '@/components/ApiWakeGate'
import { en } from '@/i18n/en'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { pt } from '@/i18n/pt'
import { readToken } from '@/lib/api'
import { signupClosedMessage } from '@/lib/demoAccount'
import { installApiMock, type MockResult } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { User } from '@/types/api'

import { LOGIN_SLOW_AFTER_MS, LoginScreen } from './LoginScreen'

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
    vi.unstubAllGlobals()
    vi.useRealTimers()
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
    expect(screen.queryByRole('button', { name: 'English' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Portuguese' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The realm guards did not recognize these credentials.',
    )
    expect(screen.getByRole('alert')).not.toHaveTextContent('Invalid credentials')
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

  it('tells a closed demo that sign-up is unavailable and how to use the demo account', async () => {
    const user = userEvent.setup()
    restore = installApiMock((config) => {
      if (config.url === '/v1/auth/register') {
        return {
          status: 403,
          data: { detail: 'Registration is disabled.', code: 'registration_disabled' },
        }
      }
      return { status: 500, data: { detail: 'unexpected' } }
    })

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <AppProviders>
        <LoginScreen />
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Create an account' }))
    await user.type(screen.getByLabelText('Name'), 'Visitor')
    await user.type(screen.getByLabelText('Email'), 'visitor@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-enough-password')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(signupClosedMessage())
    expect(screen.getByRole('alert')).not.toHaveTextContent('Registration is disabled')
    expect(readToken()).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Sign in with the demo account' }))
    expect(screen.getByLabelText('Email')).toHaveValue('queen@goldqueen.dev')
    expect(screen.getByLabelText('Password')).toHaveValue('QueenDemo123!')
  })

  it('keeps the form editable and starts a health warmup while the court is waking', async () => {
    vi.useFakeTimers()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const abort = () => reject(new DOMException('Aborted', 'AbortError'))
        if (init?.signal?.aborted) {
          abort()
          return
        }
        init?.signal?.addEventListener('abort', abort, { once: true })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <AppProviders>
        <ApiWakeGate>
          <LoginScreen />
        </ApiWakeGate>
      </AppProviders>,
    )

    const email = screen.getByLabelText('Email')
    expect(email).toBeEnabled()
    expect(email).toHaveValue('queen@goldqueen.dev')
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/health',
      expect.objectContaining({ method: 'GET' }),
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_500)
    })

    expect(screen.getByRole('status')).toHaveTextContent(en.wakeTitle)
    expect(screen.getByLabelText('Email')).toBeEnabled()
    expect(screen.getByLabelText('Password')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    expect(email.closest('[inert]')).toBeNull()

    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('explains a slow sign-in after two seconds, in the active language', async () => {
    vi.useFakeTimers()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    restore = installApiMock(() => new Promise<MockResult>(() => {}))

    render(
      <AppProviders>
        <LoginScreen />
      </AppProviders>,
    )

    fireEvent.submit(screen.getByLabelText('Email').closest('form')!)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(LOGIN_SLOW_AFTER_MS - 1)
    })
    expect(screen.queryByText(en.loginSlow)).not.toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    const submit = screen.getByRole('button', { name: 'Opening the gates...' })
    expect(submit).toBeDisabled()
    expect(submit).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(en.loginSlow)).toBeInTheDocument()
    expect(pt.loginSlow).toMatch(/formulário/i)
    expect(en.loginSlow).toMatch(/form/i)

    vi.useRealTimers()
  })
})
