import { CreditCard, ShieldCheck } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/context'
import { formatDay } from '@/lib/localeFormat'
import { formatMoney, toNumber } from '@/lib/format'
import { bankColor, categoryLabel } from '@/lib/palette'
import type { TransactionPage } from '@/types/api'

interface Props {
  page?: TransactionPage
  loading: boolean
}

export function TransactionFeed({ page, loading }: Props) {
  const { locale, t } = useI18n()

  if (loading) {
    return (
      <Card title={t('transactionsTitle')} showChevron>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </Card>
    )
  }

  if (!page) return null

  return (
    <Card
      title={t('transactionsTitle')}
      showChevron
      action={
        <span className="text-[11px] text-muted">
          {t('transactionsTotal', { count: page.total })}
        </span>
      }
    >
      {page.items.length === 0 ? (
        <EmptyState message={t('transactionsEmpty')} />
      ) : (
        <ul className="space-y-1">
          {page.items.map((transaction) => {
            const amount = toNumber(transaction.amount)
            const isCredit = amount >= 0
            const bankHue = bankColor(transaction.institution_name, 0)

            return (
              <li
                key={transaction.id}
                className="flex items-center gap-3 rounded-2xl px-1 py-2.5 transition hover:bg-white/3"
              >
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-raised">
                  <CreditCard size={16} className="text-muted" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full text-[7px] font-bold text-void ring-2 ring-surface-raised"
                    style={{ backgroundColor: bankHue }}
                  >
                    {transaction.institution_name.slice(0, 2).toUpperCase()}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-parchment">
                    {transaction.description}
                  </p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-muted">
                    {formatDay(transaction.transaction_date, locale)} ·{' '}
                    {categoryLabel(transaction.category, locale)} ·{' '}
                    {transaction.institution_name}
                    {transaction.is_guarded && (
                      <ShieldCheck
                        size={11}
                        className="shrink-0 text-gold"
                        aria-label="Guarded"
                      />
                    )}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-bold ${
                    isCredit ? 'text-emerald-coin' : 'text-debit'
                  }`}
                >
                  {formatMoney(amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
