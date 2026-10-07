import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'

import { CategoriesCard } from './CategoriesCard'

describe('CategoriesCard', () => {
  it('keeps the card and offers retry when categories fail', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <CategoriesCard loading={false} error onRetry={onRetry} onOpenCategory={() => {}} />
      </I18nProvider>,
    )

    expect(screen.getByText('Spending by category')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
