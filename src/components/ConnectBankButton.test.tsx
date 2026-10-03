import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { DEMO_READ_ONLY_MESSAGE } from '@/lib/demoAccount'
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

    expect(await screen.findByRole('alert')).toHaveTextContent(DEMO_READ_ONLY_MESSAGE)
  })
})
