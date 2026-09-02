import { Landmark } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/context'
import { formatMoney } from '@/lib/format'
import { bankColor } from '@/lib/palette'
import type { OverviewResponse } from '@/types/api'

interface Props {
  overview?: OverviewResponse
  loading: boolean
}

export function BalanceCard({ overview, loading }: Props) {
  const { t } = useI18n()

  if (loading) {
    return (
      <Card title={t('balanceTitle')} variant="glass" showChevron>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-2 w-full rounded-full" />
        <Skeleton className="mt-4 h-14 w-full" />
      </Card>
    )
  }

  if (!overview) return null

  const banks = overview.banks

  return (
    <Card title={t('balanceTitle')} variant="glass" showChevron>
      <p className="text-[32px] font-bold leading-none tracking-tight text-parchment">
        {formatMoney(overview.total_balance)}
      </p>

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
                title={`${bank.institution_name}: ${bank.share_percentage}%`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-3">
            {banks.map((bank, index) => (
              <li key={bank.connection_id} className="flex items-center gap-3">
                <span
                  className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-void"
                  style={{ backgroundColor: bankColor(bank.institution_name, index) }}
                >
                  {bank.institution_name.slice(0, 2).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-surface-raised ring-2 ring-void">
                    <Landmark size={8} className="text-gold/80" />
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-parchment">
                    {bank.institution_name}
                  </p>
                  <p className="text-[11px] text-muted">{t('updatedNow')}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-parchment">
                    {formatMoney(bank.balance)}
                  </p>
                  <p className="text-[11px] text-muted">
                    {bank.share_percentage.toFixed(0)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
