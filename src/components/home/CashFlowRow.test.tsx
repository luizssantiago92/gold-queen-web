import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'

import { CashFlowRow } from './CashFlowRow'

const idle = {
  onOpenIncome: () => {},
  onOpenExpenses: () => {},
}

describe('CashFlowRow', () => {
  it('keeps the card and offers retry when the overview fails', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <CashFlowRow loading={false} error onRetry={onRetry} {...idle} />
      </I18nProvider>,
    )

    expect(screen.getByText('Monthly income')).toBeInTheDocument()
    expect(screen.getByText('This card could not load.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
