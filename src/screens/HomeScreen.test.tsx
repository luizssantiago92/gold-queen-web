import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { CategoriesResponse, MonthlySeriesResponse, OverviewResponse, TransactionPage } from '@/types/api'

import { HomeScreen } from './HomeScreen'

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
  month_expenses: '320.50',
  month_income: '4000.00',
  reference_month: '2026-09',
}

const series: MonthlySeriesResponse = {
  reference_month: '2026-09',
  total_expenses: '320.50',
  points: [{ date: '2026-09-12', cumulative_expenses: '320.50' }],
}

const categories: CategoriesResponse = {
  reference_month: '2026-09',
  total_expenses: '320.50',
  categories: [
    {
      category: 'Food',
      total: '320.50',
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
      is_guarded: true,
      institution_name: 'Nubank',
      account_name: 'Checking',
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
}

function dashboardMock(overrides?: {
  overview?: OverviewResponse
  transactions?: TransactionPage
}) {
  return installApiMock((config) => {
    const url = config.url ?? ''
    if (url === '/v1/dashboard/overview') {
      return { status: 200, data: overrides?.overview ?? overview }
    }
    if (url === '/v1/dashboard/monthly-series') return { status: 200, data: series }
    if (url === '/v1/dashboard/categories') return { status: 200, data: categories }
    if (url === '/v1/dashboard/transactions') {
      return { status: 200, data: overrides?.transactions ?? transactions }
    }
    if (url === '/v1/connections') return { status: 200, data: [] }
    return { status: 404, data: { detail: `unexpected ${url}` } }
  })
}

describe('HomeScreen', () => {
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

  function renderHome(onOpenTips = vi.fn()) {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    localStorage.setItem('gold-queen.demo-banner-dismissed', '1')
    render(
      <AppProviders>
        <HomeScreen onOpenTips={onOpenTips} />
      </AppProviders>,
    )
    return onOpenTips
  }

  it('shows the treasury figures, category, and a guarded transaction', async () => {
    restore = dashboardMock()
    renderHome()

    expect(await screen.findByText('September 2026')).toBeInTheDocument()
    expect(screen.getByText('Nubank')).toBeInTheDocument()
    expect(screen.getAllByText(/2,500\.00/).length).toBeGreaterThan(0)
    expect(screen.getByText(/4,000\.00/)).toBeInTheDocument()
    expect(screen.getAllByText(/320\.50/).length).toBeGreaterThan(0)
    expect(screen.getByText('Food & dining')).toBeInTheDocument()
    expect(screen.getByText('Padaria Real')).toBeInTheDocument()
    expect(screen.getByLabelText('Guarded by the Queen')).toBeInTheDocument()
    expect(screen.getByText('1 total')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect a bank to the treasury' })).toBeInTheDocument()
  })

  it('puts the connect prompt first and opens tips when no banks are linked', async () => {
    const user = userEvent.setup()
    restore = dashboardMock({
      overview: { ...overview, total_balance: '0.00', banks: [] },
    })
    const onOpenTips = renderHome()

    expect(await screen.findByText('No banks linked to the royal treasury yet.')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    const connect = screen.getByRole('button', { name: 'Connect a bank to the treasury' })
    const tips = screen.getByRole('button', { name: 'Learn to manage your wealth' })
    expect(buttons.indexOf(tips)).toBeLessThan(buttons.indexOf(connect))

    await user.click(tips)
    expect(onOpenTips).toHaveBeenCalledOnce()
  })

  it('shows the empty transaction scroll when the page has no rows', async () => {
    restore = dashboardMock({
      transactions: { items: [], page: 1, limit: 20, total: 0 },
    })
    renderHome()

    expect(await screen.findByText('The transaction scroll is empty.')).toBeInTheDocument()
    expect(screen.getByText('0 total')).toBeInTheDocument()
  })
})
