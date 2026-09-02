import { ChevronRight, CreditCard, Crown, Landmark, LogOut, Sparkles, Star } from 'lucide-react'

import { useAuth } from '@/auth/context'
import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useConnections } from '@/lib/queries'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const connections = useConnections()
  const bankCount = connections.data?.length ?? 0

  return (
    <div className="scrollbar-none h-full overflow-y-auto pb-28">
      <div className="mb-5 flex flex-col items-center px-5 pt-8 text-center">
        <div className="relative mb-3">
          <div className="flex size-24 items-center justify-center rounded-full border-2 border-gold/30 bg-gradient-to-br from-mystic/70 to-void shadow-gold-glow">
            <Crown className="text-gold" size={36} />
          </div>
        </div>
        <h1 className="text-lg font-bold leading-snug text-parchment">
          {user?.display_name}
        </h1>
        <p className="mt-1 text-xs text-muted">{user?.email}</p>
      </div>

      <div className="space-y-3 px-4">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-gold/20 bg-gradient-to-r from-mystic/30 to-surface-raised p-4">
          <div className="relative z-10 max-w-[65%]">
            <p className="text-xs font-bold tracking-wider text-gold">TESOURO REAL</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Conecte ate 3 bancos no plano gratuito e consulte a Rainha sobre o seu ouro.
            </p>
          </div>
          <Crown
            size={64}
            className="absolute -right-2 -bottom-2 text-gold/15"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card variant="flat" className="!p-4">
            <Sparkles size={16} className="text-gold/70" />
            <p className="mt-3 text-base font-bold text-parchment">Gratis</p>
            <p className="text-[11px] text-muted">Plano</p>
          </Card>

          <Card variant="flat" className="!p-4">
            <Landmark size={16} className="text-gold/70" />
            <p className="mt-3 text-base font-bold text-parchment">
              {connections.isLoading ? '—' : `${bankCount} ${bankCount === 1 ? 'Banco' : 'Bancos'}`}
            </p>
            <p className="text-[11px] text-muted">Conexoes</p>
          </Card>
        </div>

        <Card title="Bancos do reino" showChevron>
          {connections.isLoading ? (
            <Skeleton className="h-14 w-full rounded-2xl" />
          ) : connections.data && connections.data.length > 0 ? (
            <ul className="space-y-2">
              {connections.data.map((connection) => (
                <li
                  key={connection.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/3 px-2 py-2"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-mystic/40">
                    <Landmark size={14} className="text-gold" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-parchment">
                    {connection.institution_name}
                  </span>
                  <span className="shrink-0 rounded-full bg-emerald-coin/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-coin">
                    {connection.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Nenhum banco conectado ao tesouro." />
          )}
        </Card>

        <Card title="Galeria de Cartoes">
          <div className="grid grid-cols-2 gap-3">
            <RoadmapCard
              label="Standard"
              tone="from-surface-raised to-surface border-white/8"
            />
            <RoadmapCard label="Platinum" tone="from-gold-aged/30 to-surface border-gold/30" />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <Sparkles size={12} className="text-gold/60" />
            Artes medievais e cartoes Full Art chegam na proxima estacao.
          </p>
        </Card>

        <Card title="Investimentos">
          <EmptyState message="A Rainha ainda forja os conselhos de investimento. Em breve." />
        </Card>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] bg-surface-raised/80 px-4 py-3.5 text-sm text-parchment transition hover:bg-surface-raised"
        >
          <span className="flex items-center gap-2">
            <Star size={16} className="text-gold" />
            Avalie o Reino
          </span>
          <ChevronRight size={16} className="text-muted" />
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blood/25 bg-blood/10 py-3.5 text-sm font-medium text-debit transition hover:bg-blood/15"
        >
          <LogOut size={15} />
          Deixar o reino
        </button>
      </div>
    </div>
  )
}

function RoadmapCard({ label, tone }: { label: string; tone: string }) {
  return (
    <div
      className={`flex aspect-[1.6] flex-col justify-between rounded-2xl border bg-gradient-to-br p-3 ${tone}`}
    >
      <CreditCard size={16} className="text-gold/70" />
      <div>
        <p className="text-xs font-semibold text-parchment/90">{label}</p>
        <p className="text-[10px] text-muted">Em breve</p>
      </div>
    </div>
  )
}
