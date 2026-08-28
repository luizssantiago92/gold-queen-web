import { Landmark, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { PluggyConnect } from 'react-pluggy-connect'

import { errorMessage, statusOf } from '@/lib/api'
import { useConnectToken, useSyncConnection } from '@/lib/queries'

/**
 * Full Open Finance handshake: the backend mints a short-lived connect token,
 * the Pluggy widget takes over, and the returned item id is synced back.
 * `includeSandbox` exposes the mock institutions used by the demo.
 */
export function ConnectBankButton() {
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
          ? errorMessage(cause, 'O plano livre permite apenas 3 bancos no tesouro.')
          : errorMessage(cause, 'Nao foi possivel abrir o portal do Open Finance.'),
      )
    }
  }

  async function onWidgetSuccess(itemId: string) {
    setToken(null)
    try {
      await sync.mutateAsync(itemId)
    } catch (cause) {
      setError(errorMessage(cause, 'O banco respondeu, mas a sincronizacao falhou.'))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openWidget}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/30 bg-surface/60 py-3 text-sm font-medium text-parchment/75 transition hover:border-gold/60 hover:text-gold disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={15} /> : <Landmark size={15} />}
        {sync.isPending ? 'Recolhendo o extrato real...' : 'Conectar um banco ao tesouro'}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-red-300">
          {error}
        </p>
      )}

      {sync.isSuccess && !error && (
        <p className="mt-2 text-center text-xs text-emerald-coin">
          {sync.data.connection.institution_name} juntou-se ao reino com{' '}
          {sync.data.transactions_synced} movimentacoes.
        </p>
      )}

      {token && (
        <PluggyConnect
          connectToken={token}
          includeSandbox
          onSuccess={(itemData) => void onWidgetSuccess(itemData.item.id)}
          onError={() => {
            setToken(null)
            setError('O portal do Open Finance foi interrompido. Tente novamente.')
          }}
          onClose={() => setToken(null)}
        />
      )}
    </>
  )
}
