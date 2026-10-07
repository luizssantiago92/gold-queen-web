import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import type { OverviewResponse } from '@/types/api'

import { BalanceCard } from './BalanceCard'

const idle = {
  onOpenBalance: () => {},
  onOpenBank: () => {},
}

const emptyOverview: OverviewResponse = {
  total_balance: '0.00',
  currency: 'BRL',
  banks: [],
  month_expenses: '0.00',
  month_income: '0.00',
  reference_month: '2026-09',
}

describe('BalanceCard', () => {
  it('shows the empty treasury when no banks are linked', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <BalanceCard loading={false} overview={emptyOverview} {...idle} />
      </I18nProvider>,
    )

    expect(screen.getByText('Account balance')).toBeInTheDocument()
    expect(screen.getByText('No banks linked to the royal treasury yet.')).toBeInTheDocument()
  })

  it('renders each bank share and balance', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <BalanceCard
          loading={false}
          {...idle}
          syncedAtByConnection={{ 7: '2026-08-28T07:25:54' }}
          overview={{
            ...emptyOverview,
            total_balance: '1500.50',
            banks: [
              {
                connection_id: 7,
                institution_name: 'Nubank',
                balance: '1500.50',
                share_percentage: 100,
              },
            ],
          }}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: /Nubank/ })).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getAllByText(/1,500\.50/)).toHaveLength(2)
    expect(screen.getByText(/Updated/)).toHaveTextContent(/2026/)
    expect(screen.getByText(/Updated/)).toHaveTextContent(/07:25/)
    expect(screen.queryByText('Updated just now')).not.toBeInTheDocument()
  })

  it('keeps the balance hidden while the overview is loading', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <BalanceCard loading overview={emptyOverview} {...idle} />
      </I18nProvider>,
    )

    expect(screen.getByText('Account balance')).toBeInTheDocument()
    expect(screen.queryByText('No banks linked to the royal treasury yet.')).not.toBeInTheDocument()
    expect(screen.queryByText(/0\.00/)).not.toBeInTheDocument()
  })
})
