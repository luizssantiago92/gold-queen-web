import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { LOCALE_STORAGE_KEY } from '@/i18n/locale'
import { api } from '@/lib/api'
import { demoReadOnlyMessage } from '@/lib/demoAccount'
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

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    await user.click(await screen.findByRole('button', { name: 'Sync Pluggy Bank' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(demoReadOnlyMessage())
    expect(screen.getByRole('alert')).not.toHaveTextContent('The public demo account is read-only')

    await user.click(screen.getByRole('button', { name: 'Remove Pluggy Bank' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(demoReadOnlyMessage())
    expect(calls).toEqual(['sync', 'delete'])
  })

  it('shows a busy spinner while sync and remove are pending', async () => {
    const user = userEvent.setup()
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')

    function hangMutations() {
      const previous = api.defaults.adapter
      api.defaults.adapter = (config) => {
        const method = (config.method ?? 'get').toLowerCase()
        const url = config.url ?? ''
        if (method === 'get' && url === '/v1/connections') {
          return Promise.resolve({
            data: [pluggy],
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          })
        }
        return new Promise(() => {})
      }
      return () => {
        api.defaults.adapter = previous
      }
    }

    restore = hangMutations()
    render(
      <AppProviders>
        <ProfileScreen />
      </AppProviders>,
    )
    await user.click(await screen.findByRole('button', { name: 'Sync Pluggy Bank' }))
    expect(
      await screen.findByRole('button', { name: 'Collecting the real statement...' }),
    ).toHaveAttribute('aria-busy', 'true')

    cleanup()
    restore()
    restore = hangMutations()
    render(
      <AppProviders>
        <ProfileScreen />
      </AppProviders>,
    )
    await user.click(await screen.findByRole('button', { name: 'Remove Pluggy Bank' }))
    expect(await screen.findByRole('button', { name: 'Unlinking...' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  })

  it('opens a not-in-this-demo sheet from plan, bank count, card art, and investments', async () => {
    const user = userEvent.setup()
    restore = installApiMock(() => ({ status: 200, data: [] }))
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <AppProviders>
        <ProfileScreen />
      </AppProviders>,
    )

    await user.click(await screen.findByRole('button', { name: /Free/ }))
    expect(await screen.findByRole('dialog', { name: 'Not in this demo' })).toHaveTextContent(
      'This part of the treasury is not part of this demonstration.',
    )
    await user.click(screen.getAllByRole('button', { name: 'Close' })[0])

    await user.click(screen.getByRole('button', { name: /Connections/ }))
    expect(await screen.findByRole('dialog', { name: 'Not in this demo' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Close' })[0])

    await user.click(screen.getByRole('button', { name: /Standard/ }))
    expect(await screen.findByRole('dialog', { name: 'Not in this demo' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Close' })[0])

    await user.click(screen.getByRole('button', { name: /forging investment/ }))
    expect(await screen.findByRole('dialog', { name: 'Not in this demo' })).toBeInTheDocument()
  })

  it('keeps the language control in settings', async () => {
    restore = installApiMock(() => ({ status: 200, data: [] }))
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    render(
      <AppProviders>
        <ProfileScreen />
      </AppProviders>,
    )

    expect(await screen.findByRole('button', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Portuguese' })).toBeInTheDocument()
  })
})
