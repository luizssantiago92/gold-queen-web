import { Landmark } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/format'
import { bankColor } from '@/lib/palette'
import type { OverviewResponse } from '@/types/api'

interface Props {
  overview?: OverviewResponse
  loading: boolean
}

export function BalanceCard({ overview, loading }: Props) {
  if (loading) {
    return (
      <Card title="Saldo em contas">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="mt-4 h-2 w-full" />
      </Card>
    )
  }

  if (!overview) return null

  const banks = overview.banks

  return (
    <Card title="Saldo em contas">
      <p className="font-royal text-3xl font-bold text-gold-gradient">
        {formatMoney(overview.total_balance)}
      </p>

      {banks.length === 0 ? (
        <EmptyState message="Nenhum banco no tesouro real ainda." />
      ) : (
        <>
          <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-parchment/10">
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

          <ul className="mt-3 space-y-2">
            {banks.map((bank, index) => (
              <li key={bank.connection_id} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: bankColor(bank.institution_name, index) }}
                />
                <Landmark size={13} className="shrink-0 text-parchment/35" />
                <span className="truncate text-parchment/75">{bank.institution_name}</span>
                <span className="ml-auto shrink-0 font-medium text-parchment/90">
                  {formatMoney(bank.balance)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
