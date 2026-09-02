import { TrendingDown, TrendingUp } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/context'
import { formatMoney } from '@/lib/format'
import type { OverviewResponse } from '@/types/api'

interface Props {
  overview?: OverviewResponse
  loading: boolean
}

export function CashFlowRow({ overview, loading }: Props) {
  const { locale, t } = useI18n()

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Card variant="flat" className="!p-3.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-24" />
        </Card>
        <Card variant="flat" className="!p-3.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-24" />
        </Card>
      </div>
    )
  }

  if (!overview) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card variant="flat" className="!p-3.5">
        <p className="flex items-center gap-1 text-[11px] font-medium text-muted">
          <TrendingUp size={12} className="text-emerald-coin" />
          {t('monthIncome')}
        </p>
        <p className="mt-1.5 text-lg font-bold tracking-tight text-parchment">
          {formatMoney(overview.month_income, locale)}
        </p>
      </Card>

      <Card variant="flat" className="!p-3.5">
        <p className="flex items-center gap-1 text-[11px] font-medium text-muted">
          <TrendingDown size={12} className="text-debit" />
          {t('monthExpenses')}
        </p>
        <p className="mt-1.5 text-lg font-bold tracking-tight text-parchment">
          {formatMoney(overview.month_expenses, locale)}
        </p>
      </Card>
    </div>
  )
}
