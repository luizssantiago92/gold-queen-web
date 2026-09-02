import { Crown, LogOut } from 'lucide-react'

import { useAuth } from '@/auth/context'
import { greetingByTime } from '@/lib/greeting'

export function HomeHeader({ referenceMonth }: { referenceMonth?: string }) {
  const { user, logout } = useAuth()
  const firstName = user?.display_name.trim().split(/\s+/)[0] ?? 'nobre'

  return (
    <header className="hero-backdrop shrink-0 px-5 pt-6 pb-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-mystic/70 to-void shadow-gold-glow">
          <Crown className="text-gold" size={20} />
        </div>

        <div className="min-w-0 flex-1" />

        <span className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold tracking-wide text-void">
          QUEEN&apos;S COURT
        </span>

        <button
          type="button"
          onClick={logout}
          aria-label="Sair do reino"
          className="shrink-0 rounded-full bg-white/5 p-2 text-muted transition hover:bg-white/10 hover:text-parchment"
        >
          <LogOut size={16} />
        </button>
      </div>

      <h1 className="font-sans text-[26px] font-bold leading-tight tracking-tight text-parchment">
        {greetingByTime()}, {firstName}
      </h1>
      {referenceMonth && (
        <p className="mt-1 text-sm text-muted">{referenceMonth}</p>
      )}
    </header>
  )
}
