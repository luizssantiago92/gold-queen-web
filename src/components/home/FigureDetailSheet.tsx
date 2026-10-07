import { lazy, Suspense, useState } from 'react'

import { ModalChunkFallback } from '@/components/SuspenseFallback'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { formatDay } from '@/lib/localeFormat'
import { formatMoney, toNumber } from '@/lib/format'
import { bankColor, categoryLabel } from '@/lib/palette'
import type { Transaction } from '@/types/api'

import { matchingTransactions, type FigureSelection } from './figureDetail'

const TransactionDetailModal = lazy(() =>
  import('@/components/TransactionDetailModal').then((module) => ({
    default: module.TransactionDetailModal,
  })),
)

interface BankLine {
  connection_id: number
  institution_name: string
  balance: string
  share_percentage: number
  syncedLabel: string | null
}

interface Props {
  selection: FigureSelection | null
  transactions: readonly Transaction[]
  transactionsReady: boolean
  partial: boolean
  banks: readonly BankLine[]
  onClose: () => void
  onSelect: (selection: FigureSelection) => void
}

export function FigureDetailSheet({
  selection,
  transactions,
  transactionsReady,
  partial,
  banks,
  onClose,
  onSelect,
}: Props) {
  const { locale, t } = useI18n()
  const [transactionId, setTransactionId] = useState<number | null>(null)
  const matches = selection ? matchingTransactions(transactions, selection) : []

  const title = sheetTitle(selection, locale, t)
  const subtitle = sheetSubtitle(selection, locale)

  return (
    <>
      <Modal open={selection !== null} title={title} subtitle={subtitle} onClose={onClose}>
        {selection?.kind === 'balance' &&
          (banks.length === 0 ? (
            <EmptyState message={t('noBanksYet')} />
          ) : (
            <ul className="space-y-1">
              {banks.map((bank, index) => (
                <li key={bank.connection_id}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelect({
                        kind: 'bank',
                        institutionName: bank.institution_name,
                        balance: bank.balance,
                        share: bank.share_percentage,
                        syncedLabel: bank.syncedLabel,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-2xl px-1 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                  >
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-void"
                      style={{ backgroundColor: bankColor(bank.institution_name, index) }}
                    >
                      {bank.institution_name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-parchment">
                      {bank.institution_name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-parchment">
                      {formatMoney(bank.balance, locale)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ))}

        {selection && selection.kind !== 'balance' && !transactionsReady && (
          <p className="text-sm text-muted">{t('figureDetailLoading')}</p>
        )}

        {selection && selection.kind !== 'balance' && transactionsReady && matches.length === 0 && (
          <p className="text-sm text-muted">{t('figureDetailNone')}</p>
        )}

        {selection && selection.kind !== 'balance' && matches.length > 0 && (
          <ul className="space-y-1">
            {matches.map((transaction) => {
              const amount = toNumber(transaction.amount)
              return (
                <li key={transaction.id}>
                  <button
                    type="button"
                    onClick={() => setTransactionId(transaction.id)}
                    className="flex w-full items-center gap-3 rounded-2xl px-1 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-parchment">
                        {transaction.description}
                      </span>
                      <span className="block truncate text-[11px] text-muted">
                        {formatDay(transaction.transaction_date, locale)} · {transaction.account_name}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-sm font-bold ${
                        amount >= 0 ? 'text-emerald-coin' : 'text-debit'
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

        {selection && selection.kind !== 'balance' && partial && transactionsReady && (
          <p className="mt-3 text-xs text-muted">{t('figureDetailRecent')}</p>
        )}
      </Modal>

      {transactionId !== null && (
        <Suspense fallback={<ModalChunkFallback />}>
          <TransactionDetailModal
            transactionId={transactionId}
            onClose={() => setTransactionId(null)}
          />
        </Suspense>
      )}
    </>
  )
}

function sheetTitle(
  selection: FigureSelection | null,
  locale: ReturnType<typeof useI18n>['locale'],
  t: ReturnType<typeof useI18n>['t'],
): string {
  if (!selection) return ''
  switch (selection.kind) {
    case 'income':
      return t('monthIncome')
    case 'expenses':
      return t('monthExpenses')
    case 'balance':
      return t('balanceTitle')
    case 'bank':
      return selection.institutionName
    case 'category':
      return categoryLabel(selection.category, locale)
    case 'day':
      return formatDay(selection.date, locale)
  }
}

function sheetSubtitle(
  selection: FigureSelection | null,
  locale: ReturnType<typeof useI18n>['locale'],
): string | undefined {
  if (!selection) return undefined
  switch (selection.kind) {
    case 'bank':
      return [formatMoney(selection.balance, locale), selection.syncedLabel]
        .filter(Boolean)
        .join(' · ')
    case 'category':
      return formatMoney(selection.total, locale)
    default:
      return undefined
  }
}
