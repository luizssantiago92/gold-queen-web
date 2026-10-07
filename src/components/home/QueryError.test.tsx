import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'

import { QueryError } from './QueryError'

describe('QueryError', () => {
  it('keeps the card and asks to try again', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <I18nProvider>
        <QueryError title="Account balance" onRetry={onRetry} />
      </I18nProvider>,
    )

    expect(screen.getByText('Account balance')).toBeInTheDocument()
    expect(screen.getByText('This card could not load.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('uses the Portuguese retry label', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
    render(
      <I18nProvider>
        <QueryError title="Saldo" onRetry={() => {}} />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
    expect(screen.getByText('Este cartão não carregou.')).toBeInTheDocument()
  })
})
