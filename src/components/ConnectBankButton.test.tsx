import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { api } from '@/lib/api'
import { demoReadOnlyMessage } from '@/lib/demoAccount'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'

import { ConnectBankButton } from './ConnectBankButton'

describe('ConnectBankButton', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('shows the read-only demo notice when connect is rejected', async () => {
    const user = userEvent.setup()
    restore = installApiMock((config) => {
      const method = (config.method ?? 'get').toLowerCase()
      if (method === 'post' && config.url === '/v1/connections/connect') {
        return {
          status: 403,
          data: { detail: 'The public demo account is read-only.', code: 'demo_read_only' },
        }
      }
      return { status: 200, data: [] }
    })

    render(
      <AppProviders>
        <ConnectBankButton />
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Connect a bank to the treasury' }))

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(await screen.findByRole('alert')).toHaveTextContent(demoReadOnlyMessage())
    expect(screen.getByRole('alert')).not.toHaveTextContent('The public demo account is read-only')
  })

  it('shows a busy spinner while connect is pending', async () => {
    const user = userEvent.setup()
    const previous = api.defaults.adapter
    api.defaults.adapter = (config) => {
      if (config.url === '/v1/connections/connect') return new Promise(() => {})
      return Promise.resolve({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      })
    }
    restore = () => {
      api.defaults.adapter = previous
    }
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')

    render(
      <AppProviders>
        <ConnectBankButton />
      </AppProviders>,
    )

    await user.click(screen.getByRole('button', { name: 'Connect a bank to the treasury' }))

    const pending = await screen.findByRole('button', { name: 'Opening the portal...' })
    expect(pending).toHaveAttribute('aria-busy', 'true')
    expect(pending).toBeDisabled()
    expect(screen.getByRole('dialog')).toHaveTextContent('Opening the portal...')
  })
})
