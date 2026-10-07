import { ScrollText } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import { ConnectBankButton } from '@/components/ConnectBankButton'
import { BalanceCard } from '@/components/home/BalanceCard'
import { CashFlowRow } from '@/components/home/CashFlowRow'
import { CategoriesCard } from '@/components/home/CategoriesCard'
import { FigureDetailSheet } from '@/components/home/FigureDetailSheet'
import { describeSync, type FigureSelection } from '@/components/home/figureDetail'
import { HomeHeader } from '@/components/home/HomeHeader'
import { TransactionFeed } from '@/components/home/TransactionFeed'
import { ChartCardFallback } from '@/components/SuspenseFallback'
import { useI18n } from '@/i18n/useI18n'
import { formatReferenceMonth } from '@/lib/localeFormat'
import {
  useCategories,
  useConnections,
  useMonthlySeries,
  useOverview,
  useTransactions,
} from '@/lib/queries'

const MonthChartCard = lazy(() =>
  import('@/components/home/MonthChartCard').then((module) => ({
    default: module.MonthChartCard,
  })),
)

interface Props {
  onOpenTips: () => void
}

export function HomeScreen({ onOpenTips }: Props) {
  const { locale, t } = useI18n()
  const overview = useOverview()
  const series = useMonthlySeries()
  const categories = useCategories()
  const transactions = useTransactions(1, 20)
  const connections = useConnections()
  const [selection, setSelection] = useState<FigureSelection | null>(null)

  const noBanks = overview.data?.banks.length === 0
  const syncedAtByConnection = connections.data
    ? Object.fromEntries(connections.data.map((item) => [item.id, item.last_synced_at]))
    : undefined

  function syncLabel(connectionId: number): string | null {
    if (!syncedAtByConnection) return null
    return describeSync(
      syncedAtByConnection[connectionId],
      locale,
      (date) => t('updatedAt', { date }),
      t('notSyncedYet'),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <HomeHeader
        referenceMonth={
          overview.data
            ? formatReferenceMonth(overview.data.reference_month, locale)
            : undefined
        }
      />

      <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto px-4 pb-28">
        <button
          type="button"
          onClick={onOpenTips}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-void shadow-gold-glow transition hover:brightness-105"
        >
          <ScrollText size={16} />
          {t('learnWealth')}
        </button>

        {noBanks && <ConnectBankButton />}

        <CashFlowRow
          overview={overview.data}
          loading={overview.isLoading}
          onOpenIncome={() => setSelection({ kind: 'income' })}
          onOpenExpenses={() => setSelection({ kind: 'expenses' })}
        />
        <BalanceCard
          overview={overview.data}
          loading={overview.isLoading}
          syncedAtByConnection={syncedAtByConnection}
          onOpenBalance={() => setSelection({ kind: 'balance' })}
          onOpenBank={setSelection}
        />
        <Suspense fallback={<ChartCardFallback />}>
          <MonthChartCard
            series={series.data}
            loading={series.isLoading}
            onOpenDay={(date) => setSelection({ kind: 'day', date })}
          />
        </Suspense>
        <CategoriesCard
          categories={categories.data}
          loading={categories.isLoading}
          onOpenCategory={setSelection}
        />
        <TransactionFeed page={transactions.data} loading={transactions.isLoading} />

        {!noBanks && <ConnectBankButton />}
      </div>

      <FigureDetailSheet
        selection={selection}
        transactions={transactions.data?.items ?? []}
        transactionsReady={!transactions.isLoading}
        partial={(transactions.data?.total ?? 0) > (transactions.data?.items.length ?? 0)}
        banks={(overview.data?.banks ?? []).map((bank) => ({
          ...bank,
          syncedLabel: syncLabel(bank.connection_id),
        }))}
        onClose={() => setSelection(null)}
        onSelect={setSelection}
      />
    </div>
  )
}
