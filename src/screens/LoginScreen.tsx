import { Crown, Loader2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
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
    <div className="flex h-full flex-col justify-center overflow-y-auto px-7 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-surface shadow-gold-glow">
          <Crown className="text-gold" size={30} />
        </div>
        <h1 className="font-royal text-3xl font-bold text-gold-gradient">Gold Queen</h1>
        <p className="mt-2 text-sm text-parchment/55">
          A Mestre da Moeda aguarda para zelar pelo seu tesouro.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-parchment/60">
            Selo real (e-mail)
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-gold/15 bg-surface px-4 py-3 text-sm text-parchment outline-none transition focus:border-gold/60 focus:shadow-gold-glow"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-parchment/60">
            Palavra secreta
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gold/15 bg-surface px-4 py-3 text-sm text-parchment outline-none transition focus:border-gold/60 focus:shadow-gold-glow"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-blood/15 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-aged via-gold to-gold-aged py-3 font-royal text-sm font-bold text-void transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? <Loader2 className="animate-spin" size={16} /> : <Crown size={16} />}
          {pending ? 'Abrindo os portoes...' : 'Entrar no Reino'}
        </button>
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-parchment/40">
        <ShieldCheck size={13} className="text-gold/60" />
        Conta de demonstracao ja preenchida — dados do Pluggy Sandbox.
      </p>
    </div>
  )
}
