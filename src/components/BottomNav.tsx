import { Home, ScanLine, User } from 'lucide-react'

import { cn } from '@/components/ui/cn'

export type Tab = 'home' | 'profile'

interface Props {
  active: Tab
  onNavigate: (tab: Tab) => void
  onAskQueen: () => void
}

export function BottomNav({ active, onNavigate, onAskQueen }: Props) {
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-[28px] border border-white/8 bg-surface/95 px-3 py-2.5 shadow-float backdrop-blur-xl">
        <TabButton
          label="Inicio"
          icon={<Home size={22} strokeWidth={active === 'home' ? 2.5 : 2} />}
          active={active === 'home'}
          onClick={() => onNavigate('home')}
        />

        <button
          type="button"
          onClick={onAskQueen}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-white/6 px-4 py-2.5 text-left transition hover:bg-white/10"
        >
          <ScanLine size={16} className="shrink-0 text-muted" />
          <span className="truncate text-sm text-muted">Pergunte a Gold Queen</span>
        </button>

        <TabButton
          label="Perfil"
          icon={<User size={22} strokeWidth={active === 'profile' ? 2.5 : 2} />}
          active={active === 'profile'}
          onClick={() => onNavigate('profile')}
        />
      </div>
    </nav>
  )
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full transition',
        active
          ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
          : 'text-muted hover:bg-white/5 hover:text-parchment/70',
      )}
    >
      {icon}
    </button>
  )
}
