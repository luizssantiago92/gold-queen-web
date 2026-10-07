import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'

import { ChatModal } from './ChatModal'

const greeting =
  "Speak, noble one. The Master of Coin hears your questions about the realm's gold."

function renderChat(open: boolean, onClose = () => {}) {
  localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  return render(
    <AppProviders>
      <ChatModal open={open} onClose={onClose} />
    </AppProviders>,
  )
}

describe('ChatModal', () => {
  let restore: (() => void) | undefined

  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {}
  })

  afterEach(() => {
    restore?.()
  })

  it('shows the greeting only while the modal is open', () => {
    const { rerender } = renderChat(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(
      <AppProviders>
        <ChatModal open onClose={() => {}} />
      </AppProviders>,
    )

    expect(screen.getByRole('dialog', { name: 'Ask Gold Queen' })).toHaveTextContent(greeting)
    expect(screen.getByText('Sovereign and Master of Coin')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send question' })).toBeDisabled()
  })

  it('sends a question and shows the answer with the remaining quota', async () => {
    const user = userEvent.setup()
    restore = installApiMock((config) => {
      if (config.url === '/v1/chat/query') {
        return {
          status: 200,
          data: {
            answer: 'The treasury can spare a feast.',
            from_cache: false,
            remaining_requests: 2,
            daily_limit: 5,
          },
        }
      }
      return { status: 404, data: { detail: 'missing' } }
    })
    renderChat(true)

    const input = screen.getByPlaceholderText('Ask about your gold...')
    await user.type(input, 'hi')
    expect(screen.getByRole('button', { name: 'Send question' })).toBeDisabled()

    await user.type(input, ' there')
    await user.click(screen.getByRole('button', { name: 'Send question' }))

    expect(await screen.findByText('The treasury can spare a feast.')).toBeInTheDocument()
    expect(screen.getByText('hi there')).toBeInTheDocument()
    expect(screen.getByText('2 questions left today')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('retires the composer after the daily limit', async () => {
    const user = userEvent.setup()
    restore = installApiMock(() => ({
      status: 429,
      data: { detail: 'The Queen has heard enough for today.' },
    }))
    renderChat(true)

    await user.type(screen.getByPlaceholderText('Ask about your gold...'), 'One more coin?')
    await user.click(screen.getByRole('button', { name: 'Send question' }))

    expect(await screen.findByText('The court is silent. Try again in a moment.')).toBeInTheDocument()
    expect(screen.queryByText('The Queen has heard enough for today.')).not.toBeInTheDocument()
    expect(screen.getByText('0 questions left today')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('The Queen has retired')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Send question' })).toBeDisabled()
  })

  it('starts from the greeting again after the modal is closed', async () => {
    const user = userEvent.setup()
    restore = installApiMock(() => ({
      status: 200,
      data: {
        answer: 'A short reply.',
        from_cache: false,
        remaining_requests: 4,
        daily_limit: 5,
      },
    }))

    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Reopen
          </button>
          <ChatModal open={open} onClose={() => setOpen(false)} />
        </>
      )
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <AppProviders>
        <Harness />
      </AppProviders>,
    )

    await user.type(screen.getByPlaceholderText('Ask about your gold...'), 'Where is the gold?')
    await user.click(screen.getByRole('button', { name: 'Send question' }))
    expect(await screen.findByText('A short reply.')).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Close' })[0])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reopen' }))
    expect(screen.getByText(greeting)).toBeInTheDocument()
    expect(screen.queryByText('Where is the gold?')).not.toBeInTheDocument()
    expect(screen.queryByText('A short reply.')).not.toBeInTheDocument()
  })
})
