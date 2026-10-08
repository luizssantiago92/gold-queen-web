import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import type { MonthlySeriesResponse } from '@/types/api'

import { MonthChartCard } from './MonthChartCard'

const series: MonthlySeriesResponse = {
  reference_month: '2026-09',
  total_expenses: '42.00',
  points: [
    { date: '2026-09-01', cumulative_expenses: '10.00' },
    { date: '2026-09-12', cumulative_expenses: '42.00' },
  ],
}

describe('MonthChartCard', () => {
  it('keeps the card and offers retry when the series fails', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <MonthChartCard loading={false} error onRetry={onRetry} onOpenDay={() => {}} />
      </I18nProvider>,
    )

    expect(screen.getByText('Monthly spending')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('draws the series without a button for each day', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <MonthChartCard loading={false} series={series} onOpenDay={() => {}} />
      </I18nProvider>,
    )

    expect(screen.getByText('Monthly spending')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sep/ })).not.toBeInTheDocument()
  })
})