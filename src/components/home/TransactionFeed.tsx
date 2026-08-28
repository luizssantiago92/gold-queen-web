import { ShieldCheck } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { formatDay, formatMoney, toNumber } from '@/lib/format'
import { bankColor, categoryLabel } from '@/lib/palette'
import type { TransactionPage } from '@/types/api'

interface Props {
  page?: TransactionPage
  loading: boolean
}

export function TransactionFeed({ page, loading }: Props) {
  if (loading) {
    return (
      <Card title="Movimentacoes recentes">
        <div className="space-y-3">
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} className="h-11 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (!page) return null

  return (
    <Card
      title="Movimentacoes recentes"
      action={<span className="text-xs text-parchment/45">{page.total} no total</span>}
    >
      {page.items.length === 0 ? (
        <EmptyState message="O pergaminho de movimentacoes esta vazio." />
      ) : (
        <ul className="divide-y divide-parchment/5">
          {page.items.map((transaction) => {
            const amount = toNumber(transaction.amount)
            const isCredit = amount >= 0

            return (
              <li key={transaction.id} className="flex items-center gap-3 py-2.5">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-void"
                  style={{ backgroundColor: bankColor(transaction.institution_name, 0) }}
                  aria-hidden="true"
                >
                  {transaction.institution_name.slice(0, 2).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-parchment/90">
                    {transaction.description}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-parchment/45">
                    {formatDay(transaction.transaction_date)} ·{' '}
                    {categoryLabel(transaction.category)}
                    {transaction.is_guarded && (
                      <ShieldCheck
                        size={12}
                        className="text-gold"
                        aria-label="Categoria validada pelos guardrails"
                      />
                    )}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-semibold ${
                    isCredit ? 'text-emerald-coin' : 'text-parchment/85'
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
