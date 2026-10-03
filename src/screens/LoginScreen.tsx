import { Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { LanguageToggle } from '@/components/LanguageToggle'
import { RoyalCrown } from '@/components/RoyalCrown'
import { useAuth } from '@/auth/context'
import { useI18n } from '@/i18n/context'
import { api, errorMessage } from '@/lib/api'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demoAccount'
import { greetingKey } from '@/lib/greeting'

export function LoginScreen() {
  const { login } = useAuth()
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => setSlow(true), 6_000)
    return () => clearTimeout(timer)
  }, [pending])

  function showLogin() {
    setMode('login')
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError(null)
    setSlow(false)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSlow(false)
    setPending(true)
    try {
      if (mode === 'signup') {
        await api.post('/v1/auth/register', {
          email,
          password,
          display_name: displayName,
        })
      }
      await login(email, password)
    } catch (cause) {
      setError(errorMessage(cause, mode === 'signup' ? t('signupError') : t('loginError')))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-center overflow-y-auto px-7 py-10">
      <div className="absolute top-6 right-6 left-6">
        <LanguageToggle />
      </div>

      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 size-20 overflow-hidden rounded-full border border-gold/35 shadow-gold-glow">
          <RoyalCrown />
        </div>
        <h1 className="font-royal text-3xl font-bold text-gold-gradient">{t('loginTitle')}</h1>
        <p className="mt-3 flex items-center justify-center gap-2 text-lg font-semibold text-parchment">
          <span>{t(greetingKey())}</span>
          <span
            className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold"
          >
            {t('demoBadge')}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted">{t('loginSubtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'signup' && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
              {t('signupName')}
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-parchment outline-none backdrop-blur-sm transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
            {t('loginEmail')}
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-parchment outline-none backdrop-blur-sm transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
            {t('loginPassword')}
          </span>
          <input
            type="password"
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={mode === 'signup' ? 8 : undefined}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-parchment outline-none backdrop-blur-sm transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-2xl bg-blood/15 px-3 py-2.5 text-xs text-debit">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-void shadow-gold-glow transition hover:brightness-105 disabled:opacity-60"
        >
          {pending ? <Loader2 className="animate-spin" size={16} /> : null}
          {pending
            ? t(mode === 'signup' ? 'signupPending' : 'loginPending')
            : t(mode === 'signup' ? 'signupSubmit' : 'loginSubmit')}
        </button>

        {mode === 'login' ? (
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setEmail('')
              setPassword('')
              setError(null)
              setSlow(false)
            }}
            className="w-full text-center text-xs font-medium text-gold/80 transition hover:text-gold"
          >
            {t('signupToggle')}
          </button>
        ) : (
          <button
            type="button"
            onClick={showLogin}
            className="w-full text-center text-xs font-medium text-gold/80 transition hover:text-gold"
          >
            {t('signupBack')}
          </button>
        )}

        {slow && mode === 'login' && (
          <p className="text-center text-[11px] leading-relaxed text-muted">{t('loginSlow')}</p>
        )}
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
        <ShieldCheck size={13} className="text-gold/60" />
        {t('loginDemoNote')}
      </p>
    </div>
  )
}
