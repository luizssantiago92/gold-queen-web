import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { api } from '@/lib/api'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { QueenTipsResponse } from '@/types/api'

import { QueenTipsModal } from './QueenTipsModal'

const tips: QueenTipsResponse = {
  critical_expense: 'Cut the feast budget.',
  management_status: 'The vault is steady.',
  smart_guidance: 'Keep one month of coin aside.',
  is_guarded: true,
  from_cache: true,
}

function renderTips(open: boolean) {
  localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  return render(
    <AppProviders>
      <QueenTipsModal open={open} onClose={() => {}} />
    </AppProviders>,
  )
}

describe('QueenTipsModal', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('renders nothing until the modal opens', () => {
    renderTips(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the three scrolls and the guarded footer', async () => {
    restore = installApiMock((config) => {
      if (String(config.url).includes('/v1/advisor/queen-tips')) return { status: 200, data: tips }
      return { status: 404, data: { detail: 'missing' } }
    })
    renderTips(true)

    const dialog = await screen.findByRole('dialog', { name: 'Wealth guidance' })
    expect(await screen.findByText('Cut the feast budget.')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Critical spending cut')
    expect(dialog).toHaveTextContent('Cut the feast budget.')
    expect(dialog).toHaveTextContent('Treasury management')
    expect(dialog).toHaveTextContent('The vault is steady.')
    expect(dialog).toHaveTextContent('Smart direction')
    expect(dialog).toHaveTextContent('Keep one month of coin aside.')
    expect(dialog).toHaveTextContent('Response validated by guardrails')
    expect(dialog).toHaveTextContent("recovered from today's scroll")
  })

  it('shows three scroll skeletons and a retry control while tips are still loading', async () => {
    const user = userEvent.setup()
    let calls = 0
    const previous = api.defaults.adapter
    api.defaults.adapter = () => {
      calls += 1
      return new Promise(() => {})
    }
    restore = () => {
      api.defaults.adapter = previous
    }
    renderTips(true)

    expect(await screen.findByText('The Queen is reading the scrolls...')).toBeInTheDocument()
    expect(document.querySelectorAll('.animate-shimmer')).toHaveLength(3)
    const region = screen.getByText('The Queen is reading the scrolls...').parentElement
    expect(region).toHaveAttribute('aria-busy', 'true')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(calls).toBeGreaterThan(1)
  })

  it('keeps a localized retry when the tips request fails', async () => {
    const user = userEvent.setup()
    let calls = 0
    restore = installApiMock(() => {
      calls += 1
      if (calls === 1) {
        return { status: 503, data: { detail: 'The advisors are away.' } }
      }
      return { status: 200, data: tips }
    })
    renderTips(true)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('The royal advisors are unavailable right now.')
    expect(alert).not.toHaveTextContent('The advisors are away.')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Cut the feast budget.')).toBeInTheDocument()
  })
})