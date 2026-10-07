import { CreditCard, Globe, Landmark, Loader2, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { LanguageToggle } from '@/components/LanguageToggle'
import { RoyalCrown } from '@/components/RoyalCrown'
import { useAuth } from '@/auth/context'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { errorMessage } from '@/lib/api'
import { useConnections, useDeleteConnection, useSyncConnection } from '@/lib/queries'
import type { BankConnection } from '@/types/api'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const connections = useConnections()
  const sync = useSyncConnection()
  const remove = useDeleteConnection()
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<'plan' | 'banks' | 'cards' | 'investments' | null>(null)
  const bankCount = connections.data?.length ?? 0
  const actionPending = sync.isPending || remove.isPending
  const syncingItem = sync.isPending ? sync.variables?.itemId : undefined
  const removingId = remove.isPending ? remove.variables : undefined

  async function onSync(connection: BankConnection) {
    setActionError(null)
    try {
      await sync.mutateAsync({
        itemId: connection.pluggy_item_id,
        institutionName: connection.institution_name,
      })
    } catch (cause) {
      setActionError(errorMessage(cause, t('syncError')))
    }
  }

  async function onRemove(connection: BankConnection) {
    setActionError(null)
    try {
      await remove.mutateAsync(connection.id)
    } catch (cause) {
      setActionError(errorMessage(cause, t('removeError')))
    }
  }

  return (
    <div className="scrollbar-none h-full overflow-y-auto pb-28">
      <div className="mb-5 flex flex-col items-center px-5 pt-8 text-center">
        <div className="mb-3 size-24 overflow-hidden rounded-full border-2 border-gold/30 shadow-gold-glow">
          <RoyalCrown />
        </div>
        <h1 className="text-lg font-bold leading-snug text-parchment">{user?.display_name}</h1>
        <p className="mt-1 text-xs text-muted">{user?.email}</p>
      </div>

      <div className="space-y-3 px-4">
        <Card title={t('profileLanguage')} variant="flat">
          <LanguageToggle />
        </Card>

        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-gold/20 bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative z-10 max-w-[65%]">
            <p className="text-xs font-bold tracking-wider text-gold">{t('profileBannerTitle')}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{t('profileBannerBody')}</p>
          </div>
          <Globe size={56} className="absolute -right-1 -bottom-1 text-gold/15" aria-hidden />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card variant="flat" className="!p-0">
            <button
              type="button"
              onClick={() => setNotice('plan')}
              className="w-full rounded-[var(--radius-card)] p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
            >
              <Sparkles size={16} className="text-gold/70" />
              <p className="mt-3 text-base font-bold text-parchment">{t('profilePlan')}</p>
              <p className="text-[11px] text-muted">{t('profilePlanLabel')}</p>
            </button>
          </Card>

          <Card variant="flat" className="!p-0">
            <button
              type="button"
              onClick={() => setNotice('banks')}
              className="w-full rounded-[var(--radius-card)] p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
            >
              <Landmark size={16} className="text-gold/70" />
              <p className="mt-3 text-base font-bold text-parchment">
                {connections.isLoading
                  ? '—'
                  : bankCount === 1
                    ? t('profileBanks', { count: bankCount })
                    : t('profileBanksPlural', { count: bankCount })}
              </p>
              <p className="text-[11px] text-muted">{t('profileConnections')}</p>
            </button>
          </Card>
        </div>

        <Card title={t('profileBanksTitle')}>
          {connections.isLoading ? (
            <Skeleton className="h-14 w-full rounded-2xl" />
          ) : connections.data && connections.data.length > 0 ? (
            <ul className="space-y-2">
              {connections.data.map((connection) => {
                const syncing = syncingItem === connection.pluggy_item_id
                const removing = removingId === connection.id
                return (
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
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => void onSync(connection)}
                    aria-busy={syncing || undefined}
                    aria-label={
                      syncing
                        ? t('syncing')
                        : `${t('syncConnection')} ${connection.institution_name}`
                    }
                    className="flex shrink-0 items-center justify-center text-[10px] font-semibold text-gold disabled:opacity-60"
                  >
                    {syncing ? (
                      <Loader2 className="motion-safe:animate-spin" size={12} aria-hidden />
                    ) : (
                      t('syncConnection')
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => void onRemove(connection)}
                    aria-busy={removing || undefined}
                    aria-label={
                      removing
                        ? t('removePending')
                        : `${t('removeConnection')} ${connection.institution_name}`
                    }
                    className="flex shrink-0 items-center justify-center text-[10px] font-semibold text-debit disabled:opacity-60"
                  >
                    {removing ? (
                      <Loader2 className="motion-safe:animate-spin" size={12} aria-hidden />
                    ) : (
                      t('removeConnection')
                    )}
                  </button>
                  <span className="shrink-0 rounded-full bg-emerald-coin/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-coin">
                    {connection.status}
                  </span>
                </li>
                )
              })}
            </ul>
          ) : (
            <EmptyState message={t('noBanksConnected')} />
          )}
          {actionError && (
            <p role="alert" className="mt-3 rounded-2xl bg-blood/15 px-3 py-2.5 text-xs text-debit">
              {actionError}
            </p>
          )}
        </Card>

        <Card title={t('profileCardsTitle')}>
          <div className="grid grid-cols-2 gap-3">
            <RoadmapCard
              label={t('profileStandard')}
              tone="from-surface-raised to-surface border-white/8"
              onOpen={() => setNotice('cards')}
            />
            <RoadmapCard
              label={t('profilePlatinum')}
              tone="from-gold-aged/30 to-surface border-gold/30"
              onOpen={() => setNotice('cards')}
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <Sparkles size={12} className="text-gold/60" />
            {t('profileCardsSoon')}
          </p>
        </Card>

        <Card title={t('profileInvestTitle')}>
          <button
            type="button"
            onClick={() => setNotice('investments')}
            className="w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
          >
            <EmptyState message={t('profileInvestSoon')} />
          </button>
        </Card>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blood/25 bg-blood/10 py-3.5 text-sm font-medium text-debit transition hover:bg-blood/15"
        >
          <LogOut size={15} />
          {t('profileLeave')}
        </button>
      </div>

      <Modal open={notice !== null} title={t('notInDemoTitle')} onClose={() => setNotice(null)}>
        <p className="text-sm text-parchment/80">{t('notInDemoBody')}</p>
      </Modal>
    </div>
  )
}

function RoadmapCard({
  label,
  tone,
  onOpen,
}: {
  label: string
  tone: string
  onOpen: () => void
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex aspect-[1.6] flex-col justify-between rounded-2xl border bg-gradient-to-br p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${tone}`}
    >
      <CreditCard size={16} className="text-gold/70" />
      <div>
        <p className="text-xs font-semibold text-parchment/90">{label}</p>
        <p className="text-[10px] text-muted">{t('profileSoon')}</p>
      </div>
    </button>
  )
}
