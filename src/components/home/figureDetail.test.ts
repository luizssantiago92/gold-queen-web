import { describe, expect, it } from 'vitest'

import type { Transaction } from '@/types/api'

import { describeSync, matchingTransactions } from './figureDetail'

const items: Transaction[] = [
  {
    id: 7,
    description: 'Padaria Real',
    amount: '-42.00',
    transaction_date: '2026-09-12',
    category: 'Food',
    display_category: 'Food',
    is_guarded: true,
    institution_name: 'Nubank',
    account_name: 'Checking',
  },
  {
    id: 8,
    description: 'Salary',
    amount: '4000.00',
    transaction_date: '2026-09-01',
    category: 'Income',
    display_category: 'Income',
    is_guarded: false,
    institution_name: 'Nubank',
    account_name: 'Checking',
  },
]

describe('matchingTransactions', () => {
  it('keeps credits, debits, one bank, one category, and one day', () => {
    expect(matchingTransactions(items, { kind: 'income' }).map((item) => item.id)).toEqual([8])
    expect(matchingTransactions(items, { kind: 'expenses' }).map((item) => item.id)).toEqual([7])
    expect(
      matchingTransactions(items, {
        kind: 'bank',
        institutionName: 'Nubank',
        balance: '1',
        share: 100,
        syncedLabel: null,
      }).map((item) => item.id),
    ).toEqual([7, 8])
    expect(
      matchingTransactions(items, {
        kind: 'category',
        category: 'Food',
        total: '42.00',
        count: 1,
      }).map((item) => item.id),
    ).toEqual([7])
    expect(matchingTransactions(items, { kind: 'day', date: '2026-09-12' }).map((item) => item.id)).toEqual([
      7,
    ])
    expect(matchingTransactions(items, { kind: 'balance' })).toEqual([])
  })
})

describe('describeSync', () => {
  it('formats a known sync time and stays quiet while the lookup is missing', () => {
    expect(describeSync(undefined, 'en', (date) => `Updated ${date}`, 'Not synced yet')).toBeNull()
    expect(describeSync(null, 'en', (date) => `Updated ${date}`, 'Not synced yet')).toBe(
      'Not synced yet',
    )
    expect(describeSync('2026-08-28T07:25:54', 'en', (date) => `Updated ${date}`, 'Not synced yet')).toMatch(
      /Updated .*2026.*07:25/,
    )
  })
})
