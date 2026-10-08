import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { pt } from '@/i18n/pt'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type {
  CategoriesResponse,
  MonthlySeriesResponse,
  OverviewResponse,
  TransactionDetail,
  TransactionPage,
} from '@/types/api'
import { HomeScreen } from '@/screens/HomeScreen'

const overview: OverviewResponse = {
  total_balance: '2500.00',
  currency: 'BRL',
  banks: [
    {
      connection_id: 1,
      institution_name: 'Nubank',
      balance: '2500.00',
      share_percentage: 100,
    },
  ],
  month_expenses: '42.00',
  month_income: '4000.00',
  reference_month: '2026-09',
}

const series: MonthlySeriesResponse = {
  reference_month: '2026-09',
  total_expenses: '42.00',
  points: [{ date: '2026-09-12', cumulative_expenses: '42.00' }],
}

const categories: CategoriesResponse = {
  reference_month: '2026-09',
  total_expenses: '42.00',
  categories: [
    {
      category: 'Food',
      total: '42.00',
      share_percentage: 100,
      transaction_count: 1,
    },
  ],
}

const transactions: TransactionPage = {
  items: [
    {
      id: 7,
      description: 'Padaria Real',
      amount: '-42.00',
      transaction_date: '2026-09-12',
      category: 'Food',
      display_category: 'Food',
      is_guarded: false,
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
  ],
  page: 1,
  limit: 20,
  total: 34,
}

const detail: TransactionDetail = {
  ...transactions.items[1],
  account_type: 'CHECKING',
  created_at: '2026-09-01T12:00:00Z',
}

function renderHome() {
  localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  localStorage.setItem('gold-queen.demo-banner-dismissed', '1')
  const restore = installApiMock((config) => {
    const url = config.url ?? ''
    if (url === '/v1/dashboard/overview') return { status: 200, data: overview }
    if (url === '/v1/dashboard/monthly-series') return { status: 200, data: series }
    if (url === '/v1/dashboard/categories') return { status: 200, data: categories }
    if (url === '/v1/dashboard/transactions') return { status: 200, data: transactions }
    if (url === '/v1/dashboard/transactions/8') return { status: 200, data: detail }
    if (url === '/v1/connections') {
      return {
        status: 200,
        data: [
          {
            id: 1,
            pluggy_item_id: 'item',
            institution_name: 'Nubank',
            status: 'UPDATED',
            last_synced_at: '2026-08-28T07:25:54',
          },
        ],
      }
    }
    return { status: 404, data: { detail: `unexpected ${url}` } }
  })
  render(
    <AppProviders>
      <HomeScreen onOpenTips={vi.fn()} />
    </AppProviders>,
  )
  return restore
}

describe('FigureDetailSheet', () => {
  let restore: (() => void) | undefined

  beforeAll(() => {
    if (!('ResizeObserver' in globalThis)) {
      class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    }
  })

  afterEach(() => {
    restore?.()
  })

  it('opens income from a key press and reuses the transaction sheet', async () => {
    const user = userEvent.setup()
    restore = renderHome()

    const income = await screen.findByRole('button', { name: /Monthly income/ })
    income.focus()
    await user.keyboard('{Enter}')

    const dialog = await screen.findByRole('dialog', { name: 'Monthly income' })
    expect(dialog).toHaveFocus()
    expect(within(dialog).getByRole('button', { name: /Salary/ })).toBeInTheDocument()
    expect(within(dialog).queryByText('Padaria Real')).not.toBeInTheDocument()
    expect(within(dialog).getByText('From the recent transactions on this screen.')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /Salary/ }))
    const detailDialog = await screen.findByRole('dialog', { name: 'Transaction details' })
    expect(await within(detailDialog).findByText('CHECKING')).toBeInTheDocument()
  })

  it('opens spending, the balance breakdown, a bank, and a category without day buttons', async () => {
    const user = userEvent.setup()
    restore = renderHome()

    await screen.findByRole('button', { name: /Monthly income/ })
    expect(screen.getByText(/Updated/)).toHaveTextContent(/2026/)
    expect(screen.queryByText('Updated just now')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Monthly spending/ }))
    let dialog = await screen.findByRole('dialog', { name: 'Monthly spending' })
    expect(within(dialog).getByRole('button', { name: /Padaria Real/ })).toBeInTheDocument()
    expect(within(dialog).queryByText('Salary')).not.toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Account balance' }))
    dialog = await screen.findByRole('dialog', { name: 'Account balance' })
    await user.click(within(dialog).getByRole('button', { name: /Nubank/ }))
    dialog = await screen.findByRole('dialog', { name: 'Nubank' })
    expect(within(dialog).getByRole('button', { name: /Padaria Real/ })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: /Salary/ })).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Checking')
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: /^Food & dining/ }))
    dialog = await screen.findByRole('dialog', { name: 'Food & dining' })
    expect(within(dialog).getByRole('button', { name: /Padaria Real/ })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('button', { name: /^Sep 12$/ })).not.toBeInTheDocument()
    expect(pt.figureDetailNone).toMatch(/Nenhuma/)
  })
})
