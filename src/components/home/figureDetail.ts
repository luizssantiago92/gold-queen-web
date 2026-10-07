import type { Locale } from '@/i18n/types'
import { toNumber } from '@/lib/format'
import { formatSyncedAt } from '@/lib/localeFormat'
import type { Transaction } from '@/types/api'

/** `undefined` means the sync time is still unknown. `null` means the bank has none. */
export function describeSync(
  syncedAt: string | null | undefined,
  locale: Locale,
  updatedAt: (date: string) => string,
  notSyncedYet: string,
): string | null {
  if (syncedAt === undefined) return null
  if (syncedAt === null) return notSyncedYet
  return updatedAt(formatSyncedAt(syncedAt, locale))
}

export type FigureSelection =
  | { kind: 'income' }
  | { kind: 'expenses' }
  | { kind: 'balance' }
  | {
      kind: 'bank'
      institutionName: string
      balance: string
      share: number
      syncedLabel: string | null
    }
  | { kind: 'category'; category: string; total: string; count: number }
  | { kind: 'day'; date: string }

export function matchingTransactions(
  items: readonly Transaction[],
  selection: FigureSelection,
): Transaction[] {
  switch (selection.kind) {
    case 'income':
      return items.filter((item) => toNumber(item.amount) >= 0)
    case 'expenses':
      return items.filter((item) => toNumber(item.amount) < 0)
    case 'bank':
      return items.filter((item) => item.institution_name === selection.institutionName)
    case 'category':
      return items.filter(
        (item) => (item.display_category || item.category) === selection.category,
      )
    case 'day':
      return items.filter((item) => item.transaction_date === selection.date)
    case 'balance':
      return []
  }
}
