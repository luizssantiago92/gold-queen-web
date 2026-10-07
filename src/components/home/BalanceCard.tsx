import { ChevronRight, Landmark } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { formatMoney } from '@/lib/format'
import { bankColor } from '@/lib/palette'
import type { OverviewResponse } from '@/types/api'

import { describeSync, type FigureSelection } from './figureDetail'

interface Props {
  overview?: OverviewResponse
  loading: boolean
  syncedAtByConnection?: Record<number, string | null>
  onOpenBalance: () => void
  onOpenBank: (selection: Extract<FigureSelection, { kind: 'bank' }>) => void
}

export function BalanceCard({
  overview,
  loading,
  syncedAtByConnection,
  onOpenBalance,
  onOpenBank,
}: Props) {
  const { locale, t } = useI18n()

  if (loading) {
    return (
      <Card title={t('balanceTitle')} variant="glass">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-2 w-full rounded-full" />
        <Skeleton className="mt-4 h-14 w-full" />
      </Card>
    )
  }

  if (!overview) return null

  const banks = overview.banks

  function labelFor(connectionId: number): string | null {
    if (!syncedAtByConnection) return null
    return describeSync(
      syncedAtByConnection[connectionId],
      locale,
      (date) => t('updatedAt', { date }),
      t('notSyncedYet'),
    )
  }

  return (
    <Card title={t('balanceTitle')} variant="glass" showChevron>
      <button
        type="button"
        onClick={onOpenBalance}
        aria-label={t('balanceTitle')}
        className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
      >
        <span className="text-[32px] font-bold leading-none tracking-tight text-parchment">
          {formatMoney(overview.total_balance, locale)}
        </span>
      </button>

      {banks.length === 0 ? (
        <EmptyState message={t('noBanksYet')} />
      ) : (
        <>
          <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            {banks.map((bank, index) => (
              <div
                key={bank.connection_id}
                style={{
                  width: `${bank.share_percentage}%`,
                  backgroundColor: bankColor(bank.institution_name, index),
                }}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-1">
            {banks.map((bank, index) => {
              const synced = labelFor(bank.connection_id)
              return (
                <li key={bank.connection_id}>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenBank({
                        kind: 'bank',
                        institutionName: bank.institution_name,
                        balance: bank.balance,
                        share: bank.share_percentage,
                        syncedLabel: synced,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-2xl py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                  >
                    <span
                      className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-void"
                      style={{ backgroundColor: bankColor(bank.institution_name, index) }}
                    >
                      {bank.institution_name.slice(0, 2).toUpperCase()}
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-surface-raised ring-2 ring-void">
                        <Landmark size={8} className="text-gold/80" />
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-parchment">
                        {bank.institution_name}
                      </span>
                      {synced && <span className="block text-[11px] text-muted">{synced}</span>}
                    </span>

                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-semibold text-parchment">
                        {formatMoney(bank.balance, locale)}
                      </span>
                      <span className="block text-[11px] text-muted">
                        {bank.share_percentage.toFixed(0)}%
                      </span>
                    </span>
                    <ChevronRight size={14} className="shrink-0 text-muted/70" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Card>
  )
}
