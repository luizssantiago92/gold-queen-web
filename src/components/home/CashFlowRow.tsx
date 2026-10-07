import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { formatMoney } from '@/lib/format'
import type { OverviewResponse } from '@/types/api'

interface Props {
  overview?: OverviewResponse
  loading: boolean
  onOpenIncome: () => void
  onOpenExpenses: () => void
}

export function CashFlowRow({ overview, loading, onOpenIncome, onOpenExpenses }: Props) {
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
      <Card variant="flat" className="!p-0">
        <button
          type="button"
          onClick={onOpenIncome}
          className="flex w-full flex-col rounded-[var(--radius-card)] p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
        >
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <TrendingUp size={12} className="text-emerald-coin" />
            {t('monthIncome')}
            <ChevronRight size={12} className="ml-auto text-muted/70" aria-hidden />
          </span>
          <span className="mt-1.5 text-lg font-bold tracking-tight text-parchment">
            {formatMoney(overview.month_income, locale)}
          </span>
        </button>
      </Card>

      <Card variant="flat" className="!p-0">
        <button
          type="button"
          onClick={onOpenExpenses}
          className="flex w-full flex-col rounded-[var(--radius-card)] p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
        >
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <TrendingDown size={12} className="text-debit" />
            {t('monthExpenses')}
            <ChevronRight size={12} className="ml-auto text-muted/70" aria-hidden />
          </span>
          <span className="mt-1.5 text-lg font-bold tracking-tight text-parchment">
            {formatMoney(overview.month_expenses, locale)}
          </span>
        </button>
      </Card>
    </div>
  )
}
