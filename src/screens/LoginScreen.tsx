import { Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { RoyalCrown } from '@/components/RoyalCrown'
import { useAuth } from '@/auth/context'
import { useI18n } from '@/i18n/context'
import { errorMessage } from '@/lib/api'
import { greetingKey } from '@/lib/greeting'

const DEMO_EMAIL = 'queen@goldqueen.dev'
const DEMO_PASSWORD = 'QueenDemo123!'

export function LoginScreen() {
  const { login } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => setSlow(true), 6_000)
    return () => clearTimeout(timer)
  }, [pending])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSlow(false)
    setPending(true)
    try {
      await login(email, password)
    } catch (cause) {
      setError(errorMessage(cause, t('loginError')))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-center overflow-y-auto px-7 py-10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 size-20 overflow-hidden rounded-full border border-gold/35 shadow-gold-glow">
          <RoyalCrown />
        </div>
        <h1 className="font-royal text-3xl font-bold text-gold-gradient">{t('loginTitle')}</h1>
        <p className="mt-3 text-lg font-semibold text-parchment">
          {t(greetingKey())}{' '}
          <span className="text-gold-gradient">{t('greetingDemoVisitor')}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{t('loginSubtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
            autoComplete="current-password"
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
          {pending ? t('loginPending') : t('loginSubmit')}
        </button>

        {slow && (
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
