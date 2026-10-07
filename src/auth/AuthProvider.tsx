import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  // Bumped on logout so a profile request already in flight cannot sign the
  // visitor back in after the token was rejected.
  const generation = useRef(0)

  const confirmSession = useCallback(() => {
    const ticket = ++generation.current
    return api.get<User>('/v1/auth/me').then(
      ({ data }) => {
        if (ticket !== generation.current) return
        setUser(data)
        setStatus('authenticated')
      },
      () => {
        if (ticket !== generation.current) return
        // A 401 also clears the token through the client interceptor, which
        // logs out and bumps the generation. This path covers a rejection
        // that did not already do that.
        clearToken()
        setUser(null)
        setStatus('anonymous')
      },
    )
  }, [])

  const logout = useCallback(() => {
    generation.current += 1
    clearToken()
    setUser(null)
    setStatus('anonymous')
    queryClient.clear()
  }, [queryClient])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<TokenResponse>('/v1/auth/login', { email, password })
      storeToken(data.access_token)
      setUser(null)
      // The shell can paint now. Profile confirmation and the dashboard
      // queries share the same token and do not wait on each other.
      setStatus('loading')
      void confirmSession()
    },
    [confirmSession],
  )

  // A stored token may have expired while the tab was closed, so it is only
  // trusted after /v1/auth/me confirms it. The shell renders during this request.
  useEffect(() => {
    if (!readToken()) return
    void confirmSession()
  }, [confirmSession])

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
