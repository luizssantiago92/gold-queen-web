import { CreditCard, Crown, Landmark, LogOut, Sparkles } from 'lucide-react'

import { useAuth } from '@/auth/context'
import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useConnections } from '@/lib/queries'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const connections = useConnections()

  return (
    <div className="scrollbar-none h-full space-y-3 overflow-y-auto px-5 pt-6 pb-28">
      <div className="mb-2 flex flex-col items-center text-center">
        <div className="mb-3 flex size-20 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-mystic/60 to-void shadow-gold-glow">
          <Crown className="text-gold" size={32} />
        </div>
        <h1 className="font-royal text-xl font-semibold text-parchment">
          {user?.display_name}
        </h1>
        <p className="text-xs text-parchment/45">{user?.email}</p>
      </div>

      <Card title="Bancos do reino">
        {connections.isLoading ? (
          <Skeleton className="h-14 w-full" />
        ) : connections.data && connections.data.length > 0 ? (
          <ul className="space-y-2.5">
            {connections.data.map((connection) => (
              <li key={connection.id} className="flex items-center gap-2.5 text-sm">
                <Landmark size={15} className="shrink-0 text-gold/70" />
                <span className="truncate text-parchment/85">
                  {connection.institution_name}
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-emerald-coin/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-coin">
                  {connection.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Nenhum banco conectado ao tesouro." />
        )}
      </Card>

      {/* Roadmap surface: the API has no card or investment endpoints yet. */}
      <Card title="Galeria de Cartoes">
        <div className="grid grid-cols-2 gap-3">
          <RoadmapCard
            label="Standard"
            tone="from-surface-raised to-surface border-gold-aged/40"
          />
          <RoadmapCard label="Platinum" tone="from-gold-aged/40 to-surface border-gold/50" />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-parchment/40">
          <Sparkles size={12} className="text-gold/60" />
          Artes medievais e cartoes Full Art chegam na proxima estacao.
        </p>
      </Card>

      <Card title="Investimentos">
        <EmptyState message="A Rainha ainda forja os conselhos de investimento. Em breve." />
      </Card>

      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blood/30 bg-blood/10 py-3 text-sm font-medium text-red-300 transition hover:bg-blood/20"
      >
        <LogOut size={15} />
        Deixar o reino
      </button>
    </div>
  )
}

function RoadmapCard({ label, tone }: { label: string; tone: string }) {
  return (
    <div
      className={`flex aspect-[1.6] flex-col justify-between rounded-xl border bg-gradient-to-br p-3 ${tone}`}
    >
      <CreditCard size={16} className="text-gold/70" />
      <div>
        <p className="font-royal text-xs font-semibold text-parchment/85">{label}</p>
        <p className="text-[10px] text-parchment/35">Em breve</p>
      </div>
    </div>
  )
}
