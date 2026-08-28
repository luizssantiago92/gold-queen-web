import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { api, clearToken, readToken, storeToken, UNAUTHORIZED_EVENT } from '@/lib/api'
import type { TokenResponse, User } from '@/types/api'

import { AuthContext } from './context'
import type { AuthState } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  // Without a stored token there is nothing to validate, so the anonymous state
  // is known during the first render instead of after an effect.
  const [status, setStatus] = useState<AuthState['status']>(() =>
    readToken() ? 'loading' : 'anonymous',
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('anonymous')
    queryClient.clear()
  }, [queryClient])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<TokenResponse>('/v1/auth/login', { email, password })
    storeToken(data.access_token)

    const profile = await api.get<User>('/v1/auth/me')
    setUser(profile.data)
    setStatus('authenticated')
  }, [])

  // A stored token may have expired while the tab was closed, so it is only
  // trusted after /v1/auth/me confirms it.
  useEffect(() => {
    if (!readToken()) return

    let active = true
    api
      .get<User>('/v1/auth/me')
      .then(({ data }) => {
        if (!active) return
        setUser(data)
        setStatus('authenticated')
      })
      .catch(() => {
        if (!active) return
        clearToken()
        setStatus('anonymous')
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const value = useMemo<AuthState>(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
