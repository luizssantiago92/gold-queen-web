import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { TransactionDetail, TransactionPage } from '@/types/api'

import { TransactionFeed } from './TransactionFeed'

const page: TransactionPage = {
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
  total: 2,
}

const detail: TransactionDetail = {
  ...page.items[0],
  account_type: 'CHECKING',
  created_at: '2026-09-12T12:00:00Z',
}

function renderFeed(
  props: {
    page?: TransactionPage
    loading: boolean
    loadingMore?: boolean
    hasMore?: boolean
    error?: boolean
    onLoadMore?: () => void
    onRetry?: () => void
  },
) {
  localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  return render(
    <AppProviders>
      <TransactionFeed {...props} />
    </AppProviders>,
  )
}

describe('TransactionFeed', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('keeps the rows hidden while the page is loading', () => {
    renderFeed({ loading: true, page })

    expect(screen.getByText('Recent transactions')).toBeInTheDocument()
    expect(screen.queryByText('Padaria Real')).not.toBeInTheDocument()
    expect(screen.queryByText('2 total')).not.toBeInTheDocument()
  })

  it('shows the empty scroll when there are no transactions', () => {
    renderFeed({
      loading: false,
      page: { items: [], page: 1, limit: 20, total: 0 },
    })

    expect(screen.getByText('The transaction scroll is empty.')).toBeInTheDocument()
    expect(screen.getByText('0 total')).toBeInTheDocument()
  })

  it('lists debits and credits and opens the guarded detail', async () => {
    const user = userEvent.setup()
    restore = installApiMock((config) => {
      if (String(config.url).includes('/v1/dashboard/transactions/7')) {
        return { status: 200, data: detail }
      }
      return { status: 404, data: { detail: 'missing' } }
    })
    renderFeed({ loading: false, page })

    expect(screen.getByText('Padaria Real')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText(/-R\$\s*42\.00/)).toHaveClass('text-debit')
    expect(screen.getByText(/R\$\s*4,000\.00/)).toHaveClass('text-emerald-coin')
    expect(screen.getByLabelText('Guarded by the Queen')).toBeInTheDocument()
    expect(screen.getByText(/Sep 12/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Padaria Real/ }))

    const dialog = await screen.findByRole('dialog', { name: 'Transaction details' })
    expect(await within(dialog).findByText('Padaria Real')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Amount')
    expect(dialog).toHaveTextContent(/-R\$\s*42\.00/)
    expect(dialog).toHaveTextContent('Food & dining')
    expect(dialog).toHaveTextContent('Nubank')
    expect(dialog).toHaveTextContent('Checking')
    expect(dialog).toHaveTextContent('CHECKING')
    expect(dialog).toHaveTextContent("Category validated by the Queen's guardrails")

    await user.click(screen.getAllByRole('button', { name: 'Close' })[0])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers the next page while the scroll is shorter than the total', async () => {
    const user = userEvent.setup()
    const onLoadMore = vi.fn()
    renderFeed({
      loading: false,
      page: { ...page, total: 34 },
      hasMore: true,
      onLoadMore,
    })

    expect(screen.getByText('34 total')).toBeInTheDocument()
    expect(screen.getByText('Padaria Real')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  it('hides the next page once every transaction is on screen', () => {
    renderFeed({ loading: false, page, hasMore: false })

    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()
  })

  it('keeps a failed card and asks the query to run again', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderFeed({ loading: false, error: true, onRetry })

    expect(screen.getByText('Recent transactions')).toBeInTheDocument()
    expect(screen.getByText('This card could not load.')).toBeInTheDocument()
    expect(screen.queryByText('Padaria Real')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('keeps loaded rows when a later page fails and retries that page', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderFeed({
      loading: false,
      page: { ...page, total: 34 },
      error: true,
      hasMore: false,
      onRetry,
    })

    expect(screen.getByText('Padaria Real')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows an error inside the detail sheet when the lookup fails', async () => {
    const user = userEvent.setup()
    restore = installApiMock(() => ({
      status: 500,
      data: { detail: 'The scroll tore' },
    }))
    renderFeed({ loading: false, page })

    await user.click(screen.getByRole('button', { name: /Padaria Real/ }))

    expect(
      await screen.findByText("Could not load this transaction's details."),
    ).toBeInTheDocument()
  })
})
