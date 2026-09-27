import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'

import { BottomNav } from './BottomNav'

describe('BottomNav', () => {
  it('marks the active tab and routes home, profile, and the advisor', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onAskQueen = vi.fn()

    render(
      <I18nProvider>
        <BottomNav active="home" onNavigate={onNavigate} onAskQueen={onAskQueen} />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Profile' })).not.toHaveAttribute('aria-current')

    await user.click(screen.getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Advisor' }))

    expect(onNavigate).toHaveBeenCalledWith('profile')
    expect(onAskQueen).toHaveBeenCalledOnce()
  })
})
