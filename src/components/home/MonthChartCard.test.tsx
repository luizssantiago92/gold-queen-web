import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'

import { MonthChartCard } from './MonthChartCard'

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
})