import { Crown, Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { useAuth } from '@/auth/context'
import { errorMessage } from '@/lib/api'

const DEMO_EMAIL = 'queen@goldqueen.dev'
const DEMO_PASSWORD = 'QueenDemo123!'

export function LoginScreen() {
  const { login } = useAuth()
  // Prefilled so a recruiter can open the portfolio and get straight in.
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [slow, setSlow] = useState(false)

  // A cold free-tier instance takes close to a minute to boot. Without a word on
  // screen that wait reads as a frozen app.
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
      setError(errorMessage(cause, 'Os guardas do reino nao reconheceram estas credenciais.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="hero-backdrop flex h-full flex-col justify-center overflow-y-auto px-7 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-white/5 shadow-gold-glow backdrop-blur-sm">
          <Crown className="text-gold" size={30} />
        </div>
        <h1 className="font-royal text-3xl font-bold text-gold-gradient">Gold Queen</h1>
        <p className="mt-2 text-sm text-muted">
          A Mestre da Moeda aguarda para zelar pelo seu tesouro.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
            Selo real (e-mail)
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-parchment outline-none backdrop-blur-sm transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
            Palavra secreta
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-parchment outline-none backdrop-blur-sm transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
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
          {pending ? <Loader2 className="animate-spin" size={16} /> : <Crown size={16} />}
          {pending ? 'Abrindo os portoes...' : 'Entrar no Reino'}
        </button>

        {slow && (
          <p className="text-center text-[11px] leading-relaxed text-muted">
            O servidor gratuito hiberna quando ocioso e pode levar ate um minuto
            para despertar. Aguardai — a Rainha ja foi chamada.
          </p>
        )}
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
        <ShieldCheck size={13} className="text-gold/60" />
        Conta de demonstracao ja preenchida — dados do Pluggy Sandbox.
      </p>
    </div>
  )
}
