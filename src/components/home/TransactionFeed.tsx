import { CreditCard, ShieldCheck } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import { ModalChunkFallback } from '@/components/SuspenseFallback'
import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { formatDay } from '@/lib/localeFormat'
import { formatMoney, toNumber } from '@/lib/format'
import { bankColor, categoryLabel } from '@/lib/palette'
import type { Transaction, TransactionPage } from '@/types/api'

import { QueryError } from './QueryError'

const TransactionDetailModal = lazy(() =>
  import('@/components/TransactionDetailModal').then((module) => ({
    default: module.TransactionDetailModal,
  })),
)

interface Props {
  page?: TransactionPage
  loading: boolean
  loadingMore?: boolean
  hasMore?: boolean
  error?: boolean
  onLoadMore?: () => void
  onRetry?: () => void
}

export function TransactionFeed({
  page,
  loading,
  loadingMore = false,
  hasMore = false,
  error = false,
  onLoadMore,
  onRetry,
}: Props) {
  const { locale, t } = useI18n()
  const [selected, setSelected] = useState<Transaction | null>(null)

  if (loading) {
    return (
      <Card title={t('transactionsTitle')}>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </Card>
    )
  }

  if (!page) {
    if (error && onRetry) {
      return <QueryError title={t('transactionsTitle')} onRetry={onRetry} />
    }
    return null
  }

  return (
    <>
      <Card
        title={t('transactionsTitle')}
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
              const label = categoryLabel(
                transaction.display_category ?? transaction.category,
                locale,
              )

              return (
                <li key={transaction.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(transaction)}
                    className="flex w-full items-center gap-3 rounded-2xl px-1 py-2.5 text-left transition hover:bg-white/3"
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
                        {formatDay(transaction.transaction_date, locale)} · {label} ·{' '}
                        {transaction.institution_name}
                        {transaction.is_guarded && (
                          <ShieldCheck
                            size={11}
                            className="shrink-0 text-gold"
                            aria-label={t('transactionGuardedBadge')}
                          />
                        )}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-sm font-bold ${
                        isCredit ? 'text-emerald-coin' : 'text-debit'
                      }`}
                    >
                      {formatMoney(amount, locale)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {loadingMore && (
          <div className="mt-3 space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        )}
        {error && onRetry && (
          <div className="mt-3">
            <p className="text-sm text-parchment/85">{t('cardLoadFailed')}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-2xl bg-gold px-4 py-2 text-xs font-bold text-void shadow-gold-glow transition hover:brightness-105"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}
        {hasMore && onLoadMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            aria-busy={loadingMore || undefined}
            className="mt-3 w-full rounded-2xl border border-gold/30 bg-gold/10 py-2.5 text-xs font-bold text-gold transition hover:bg-gold/20 disabled:opacity-60"
          >
            {t('transactionsNext')}
          </button>
        )}
      </Card>

      {selected && (
        <Suspense fallback={<ModalChunkFallback />}>
          <TransactionDetailModal
            transactionId={selected.id}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      )}
    </>
  )
}
