import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { DEMO_READ_ONLY_MESSAGE } from '@/lib/demoAccount'
import { installApiMock } from '@/test/mockApi'
import { AppProviders } from '@/test/providers'
import type { BankConnection } from '@/types/api'

import { ProfileScreen } from './ProfileScreen'

const pluggy: BankConnection = {
  id: 2,
  pluggy_item_id: '70642699-0000-4000-8000-000000000001',
  institution_name: 'Pluggy Bank',
  status: 'UPDATED',
  last_synced_at: '2026-08-28T07:25:54',
}

function readOnly() {
  return {
    status: 403,
    data: { detail: 'The public demo account is read-only.', code: 'demo_read_only' },
  }
}

describe('ProfileScreen connection actions', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
  })

  it('shows the read-only demo notice when sync or unlink is rejected', async () => {
    const user = userEvent.setup()
    const calls: string[] = []
    restore = installApiMock((config) => {
      const method = (config.method ?? 'get').toLowerCase()
      const url = config.url ?? ''
      if (method === 'get' && url === '/v1/connections') {
        return { status: 200, data: [pluggy] }
      }
      if (method === 'post' && url === '/v1/connections/sync') {
        calls.push('sync')
        return readOnly()
      }
      if (method === 'delete' && url === '/v1/connections/2') {
        calls.push('delete')
        return readOnly()
      }
      return { status: 200, data: [] }
    })

    render(
      <AppProviders>
        <ProfileScreen />
      </AppProviders>,
    )

    await user.click(await screen.findByRole('button', { name: 'Sync Pluggy Bank' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(DEMO_READ_ONLY_MESSAGE)

    await user.click(screen.getByRole('button', { name: 'Remove Pluggy Bank' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(DEMO_READ_ONLY_MESSAGE)
    expect(calls).toEqual(['sync', 'delete'])
  })
})
