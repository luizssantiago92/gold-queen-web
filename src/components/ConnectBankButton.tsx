import { Landmark, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { PluggyConnect } from 'react-pluggy-connect'

import { useI18n } from '@/i18n/context'
import { errorMessage, statusOf } from '@/lib/api'
import { useConnectToken, useSyncConnection } from '@/lib/queries'

export function ConnectBankButton() {
  const { t } = useI18n()
  const connectToken = useConnectToken()
  const sync = useSyncConnection()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = connectToken.isPending || sync.isPending

  async function openWidget() {
    setError(null)
    try {
      const { connect_token } = await connectToken.mutateAsync()
      setToken(connect_token)
    } catch (cause) {
      setError(
        statusOf(cause) === 403
          ? errorMessage(cause, t('connectLimit'))
          : errorMessage(cause, t('connectError')),
      )
    }
  }

  async function onWidgetSuccess(itemId: string) {
    setToken(null)
    try {
      await sync.mutateAsync(itemId)
    } catch (cause) {
      setError(errorMessage(cause, t('syncError')))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openWidget}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/3 py-3.5 text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={15} /> : <Landmark size={15} />}
        {sync.isPending ? t('syncing') : t('connectBank')}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-debit">
          {error}
        </p>
      )}

      {sync.isSuccess && !error && (
        <p className="mt-2 text-center text-xs text-emerald-coin">
          {t('syncSuccess', {
            bank: sync.data.connection.institution_name,
            count: sync.data.transactions_synced,
          })}
        </p>
      )}

      {token && (
        <PluggyConnect
          connectToken={token}
          includeSandbox
          onSuccess={(itemData) => void onWidgetSuccess(itemData.item.id)}
          onError={() => {
            setToken(null)
            setError(t('portalInterrupted'))
          }}
          onClose={() => setToken(null)}
        />
      )}
    </>
  )
}
