import { Crown, LogOut } from 'lucide-react'

import { useAuth } from '@/auth/context'

export function HomeHeader({ referenceMonth }: { referenceMonth?: string }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center gap-3 px-5 pt-6 pb-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-mystic/60 to-void shadow-gold-glow">
        <Crown className="text-gold" size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-royal text-base font-semibold text-parchment">
          Salve, {user?.display_name ?? 'nobre'}
        </p>
        {referenceMonth && (
          <p className="truncate text-[11px] text-parchment/45">{referenceMonth}</p>
        )}
      </div>

      <span className="shrink-0 rounded-full border border-gold/35 bg-gold/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-gold">
        QUEEN&apos;S COURT
      </span>

      <button
        type="button"
        onClick={logout}
        aria-label="Sair do reino"
        className="shrink-0 rounded-full p-1.5 text-parchment/40 transition hover:bg-parchment/10 hover:text-gold"
      >
        <LogOut size={16} />
      </button>
    </header>
  )
}
