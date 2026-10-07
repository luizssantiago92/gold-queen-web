import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HomeHeader } from '@/components/home/HomeHeader'
import { en } from '@/i18n/en'
import { I18nProvider } from '@/i18n/context'
import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { pt } from '@/i18n/pt'

import { DemoInfoBanner } from './DemoInfoBanner'

const DISMISS_KEY = 'gold-queen.demo-banner-dismissed'

function renderBanner(locale: 'en' | 'pt' = 'en') {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  return render(
    <I18nProvider>
      <DemoInfoBanner />
    </I18nProvider>,
  )
}

describe('DemoInfoBanner', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISS_KEY)
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.removeItem(DISMISS_KEY)
  })

  it('shows one short line and keeps it still while time passes', () => {
    vi.useFakeTimers()
    renderBanner()

    expect(screen.getByRole('button', { name: en.demoBannerShortProduct })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByText(en.demoBannerProduct)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '1 / 5' })).not.toBeInTheDocument()

    vi.advanceTimersByTime(30_000)

    expect(screen.getByRole('button', { name: en.demoBannerShortProduct })).toBeInTheDocument()
    expect(screen.queryByText(en.demoBannerOpenFinance)).not.toBeInTheDocument()
  })

  it('reveals the longer remark on click and moves on without dots', async () => {
    const user = userEvent.setup()
    renderBanner()

    await user.click(screen.getByRole('button', { name: en.demoBannerShortProduct }))

    const rest = screen.getByText(en.demoBannerProduct)
    expect(rest).toBeVisible()
    expect(rest.className).toContain('motion-safe:transition-opacity')
    expect(screen.getByRole('button', { name: en.demoBannerShortProduct })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.queryByRole('button', { name: /\/ 5/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: en.demoBannerNext }))

    expect(screen.getByRole('button', { name: en.demoBannerShortOpenFinance })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByText(en.demoBannerProduct)).not.toBeInTheDocument()
    expect(screen.queryByText(en.demoBannerOpenFinance)).not.toBeInTheDocument()
  })

  it('opens the longer remark from the keyboard', async () => {
    const user = userEvent.setup()
    renderBanner()

    const speech = screen.getByRole('button', { name: en.demoBannerShortProduct })
    speech.focus()
    await user.keyboard('{Enter}')

    expect(screen.getByText(en.demoBannerProduct)).toBeVisible()
    expect(speech).toHaveAttribute('aria-expanded', 'true')
  })

  it('dismisses the bubble and stays dismissed', async () => {
    const user = userEvent.setup()
    const { unmount } = renderBanner()

    await user.click(screen.getByRole('button', { name: en.demoBannerDismiss }))

    expect(screen.queryByRole('region', { name: en.demoBannerSpeak })).not.toBeInTheDocument()
    expect(localStorage.getItem(DISMISS_KEY)).toBe('1')

    unmount()
    renderBanner()

    expect(screen.queryByRole('region', { name: en.demoBannerSpeak })).not.toBeInTheDocument()
  })

  it('speaks Portuguese with the same controls', () => {
    renderBanner('pt')

    expect(screen.getByRole('region', { name: pt.demoBannerSpeak })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: pt.demoBannerShortProduct })).toBeInTheDocument()
    expect(pt.demoBannerShortQueen).toMatch(/Não/)
    expect(en.demoBannerShortQueen).toMatch(/gold/i)
  })
})

describe('HomeHeader speech bubble', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISS_KEY)
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  })

  it('aims the tail at the portrait', () => {
    const { container } = render(
      <I18nProvider>
        <HomeHeader />
      </I18nProvider>,
    )

    const portrait = container.querySelector('img[src="/queen-logo.webp"]')
    const region = screen.getByRole('region', { name: en.demoBannerSpeak })
    const tail = region.querySelector('[data-speech-tail]')

    expect(portrait).not.toBeNull()
    expect(tail).not.toBeNull()
    expect(tail).toHaveAttribute('aria-hidden', 'true')
    expect(tail!.className).toMatch(/-left-/)
    expect(tail!.className).toContain('border-r-8')
    expect(tail!.className).not.toContain('rotate-45')
    expect(portrait!.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(region.className).toContain('min-w-0')
  })
})
