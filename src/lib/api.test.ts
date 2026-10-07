import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it } from 'vitest'

import { en } from '@/i18n/en'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { demoReadOnlyMessage, signupClosedMessage } from '@/lib/demoAccount'
import {
  UNAUTHORIZED_EVENT,
  api,
  clearToken,
  errorMessage,
  readToken,
  storeToken,
} from '@/lib/api'

import { headerValue, installApiMock } from '@/test/mockApi'

describe('token storage', () => {
  it('stores, reads, and clears the JWT in localStorage', () => {
    expect(readToken()).toBeNull()

    storeToken('session-token')
    expect(readToken()).toBe('session-token')
    expect(localStorage.getItem('gold-queen.token')).toBe('session-token')

    clearToken()
    expect(readToken()).toBeNull()
  })
})

describe('request auth headers', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('sends the bearer token and the active locale', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
    storeToken('abc')

    let authorization: string | undefined
    let acceptLanguage: string | undefined
    restore = installApiMock((config) => {
      authorization = headerValue(config, 'Authorization')
      acceptLanguage = headerValue(config, 'Accept-Language')
      return { status: 200, data: { ok: true } }
    })

    await api.get('/v1/auth/me')

    expect(authorization).toBe('Bearer abc')
    expect(acceptLanguage).toBe('pt-BR,pt;q=0.9,en;q=0.8')
  })

  it('omits Authorization when no token is stored', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')

    let authorization: string | undefined
    restore = installApiMock((config) => {
      authorization = headerValue(config, 'Authorization')
      return { status: 200, data: { ok: true } }
    })

    await api.get('/v1/dashboard/overview')

    expect(authorization).toBeUndefined()
  })
})

describe('401 handling', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('clears the token and notifies the session on 401', async () => {
    storeToken('expired')
    const events: Event[] = []
    const onUnauthorized = (event: Event) => events.push(event)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)

    restore = installApiMock(() => ({
      status: 401,
      data: { detail: 'Token expired' },
    }))

    await expect(api.get('/v1/auth/me')).rejects.toBeInstanceOf(AxiosError)
    expect(readToken()).toBeNull()
    expect(events).toHaveLength(1)

    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  })

  it('keeps the token when the API returns another error', async () => {
    storeToken('still-valid')
    restore = installApiMock(() => ({
      status: 500,
      data: { detail: 'The court is closed' },
    }))

    await expect(api.get('/v1/dashboard/overview')).rejects.toBeInstanceOf(AxiosError)
    expect(readToken()).toBe('still-valid')
  })
})

describe('errorMessage', () => {
  it('keeps an uncoded detail off the screen', () => {
    const error = new AxiosError('bad request')
    error.response = {
      status: 400,
      data: { detail: 'Invalid credentials' },
      statusText: 'Bad Request',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    }

    expect(errorMessage(error, 'fallback')).toBe('fallback')
  })

  it('explains a missing response as a cold start', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    const error = new AxiosError('Network Error', 'ERR_NETWORK')

    expect(errorMessage(error, 'fallback')).toBe(en.coldStart)
  })

  it('uses the fallback for unknown errors', () => {
    expect(errorMessage(new Error('nope'), 'fallback')).toBe('fallback')
  })

  it('follows the active locale for a closed sign-up and points at the demo account', () => {
    const error = new AxiosError('forbidden')
    error.response = {
      status: 403,
      data: { detail: 'Registration is disabled.', code: 'registration_disabled' },
      statusText: 'Forbidden',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(errorMessage(error, 'fallback')).toBe(signupClosedMessage())
    expect(signupClosedMessage()).toContain('queen@goldqueen.dev')
    expect(signupClosedMessage()).toContain('QueenDemo123!')
    expect(signupClosedMessage()).not.toContain('Registration is disabled')

    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
    expect(errorMessage(error, 'fallback')).toContain('cadastro está fechado')
    expect(errorMessage(error, 'fallback')).not.toContain('Registration is disabled')
  })

  it('follows the active locale for a read-only demo account', () => {
    const error = new AxiosError('forbidden')
    error.response = {
      status: 403,
      data: { detail: 'The public demo account is read-only.', code: 'demo_read_only' },
      statusText: 'Forbidden',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(errorMessage(error, 'fallback')).toBe('The demo account is read-only.')
    expect(errorMessage(error, 'fallback')).not.toContain('The public demo account is read-only')

    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
    expect(errorMessage(error, 'fallback')).toBe(demoReadOnlyMessage())
    expect(demoReadOnlyMessage()).toBe('A conta demo é somente leitura.')
  })

  it('uses the locale limit copy for a coded connection limit', () => {
    const error = new AxiosError('forbidden')
    error.response = {
      status: 403,
      data: { detail: 'Connection limit reached', code: 'connection_limit_reached' },
      statusText: 'Forbidden',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(errorMessage(error, 'fallback')).toBe(en.connectLimit)
    expect(errorMessage(error, 'fallback')).not.toBe('Connection limit reached')
  })
})
