import { Crown, Home, User } from 'lucide-react'

import { cn } from '@/components/ui/cn'

export type Tab = 'home' | 'profile'

interface Props {
  active: Tab
  onNavigate: (tab: Tab) => void
  onAskQueen: () => void
}

export function BottomNav({ active, onNavigate, onAskQueen }: Props) {
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-5 pb-5">
      <div className="pointer-events-auto flex items-center justify-between rounded-full border border-gold/15 bg-surface/90 px-6 py-2.5 shadow-card backdrop-blur-md">
        <TabButton
          label="Inicio"
          icon={<Home size={20} />}
          active={active === 'home'}
          onClick={() => onNavigate('home')}
        />

        <button
          type="button"
          onClick={onAskQueen}
          className="-my-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-aged via-gold to-gold-aged px-5 py-3 font-royal text-xs font-bold text-void shadow-gold-glow transition hover:brightness-110"
        >
          <Crown size={16} />
          Consulte a Queen
        </button>

        <TabButton
          label="Perfil"
          icon={<User size={20} />}
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
        'rounded-full p-2 transition',
        active ? 'text-gold' : 'text-parchment/40 hover:text-parchment/70',
      )}
    >
      {icon}
    </button>
  )
}
