import { ScrollText } from 'lucide-react'

import { ConnectBankButton } from '@/components/ConnectBankButton'
import { BalanceCard } from '@/components/home/BalanceCard'
import { CashFlowRow } from '@/components/home/CashFlowRow'
import { CategoriesCard } from '@/components/home/CategoriesCard'
import { HomeHeader } from '@/components/home/HomeHeader'
import { MonthChartCard } from '@/components/home/MonthChartCard'
import { TransactionFeed } from '@/components/home/TransactionFeed'
import { useI18n } from '@/i18n/context'
import { formatReferenceMonth } from '@/lib/localeFormat'
import { useCategories, useMonthlySeries, useOverview, useTransactions } from '@/lib/queries'

interface Props {
  onOpenTips: () => void
}

export function HomeScreen({ onOpenTips }: Props) {
  const { locale, t } = useI18n()
  const overview = useOverview()
  const series = useMonthlySeries()
  const categories = useCategories()
  const transactions = useTransactions(1, 20)

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

        <CashFlowRow overview={overview.data} loading={overview.isLoading} />
        <BalanceCard overview={overview.data} loading={overview.isLoading} />
        <MonthChartCard series={series.data} loading={series.isLoading} />
        <CategoriesCard categories={categories.data} loading={categories.isLoading} />
        <TransactionFeed page={transactions.data} loading={transactions.isLoading} />

        <ConnectBankButton />
      </div>
    </div>
  )
}
