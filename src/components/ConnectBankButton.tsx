import { CheckCircle2, Info, Landmark, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { useI18n } from '@/i18n/useI18n'
import { errorMessage } from '@/lib/api'
import { useConnections, useConnectToken } from '@/lib/queries'

export function ConnectBankButton() {
  const { t } = useI18n()
  const connections = useConnections()
  const connectToken = useConnectToken()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectedBank = connections.data?.[0]?.institution_name
  const pending = connectToken.isPending

  async function onConnect() {
    setError(null)
    setOpen(true)
    try {
      await connectToken.mutateAsync()
    } catch (cause) {
      setError(errorMessage(cause, t('connectError')))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void onConnect()}
        disabled={pending}
        aria-busy={pending || undefined}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/3 py-3.5 text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="motion-safe:animate-spin" size={15} aria-hidden />
        ) : (
          <Landmark size={15} />
        )}
        {pending ? t('connectPending') : t('connectBank')}
      </button>

      <Modal
        open={open}
        title={t('demoConnectTitle')}
        subtitle={t('demoConnectSubtitle')}
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4 text-sm text-parchment/80" aria-live="polite" aria-busy={pending || undefined}>
          {pending && (
            <p className="flex items-center gap-2 text-gold">
              <Loader2 className="motion-safe:animate-spin" size={16} aria-hidden />
              {t('connectPending')}
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-2xl bg-blood/15 px-3 py-2.5 text-xs text-debit">
              {error}
            </p>
          )}
          <p className="flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0 text-gold" />
            {t('demoConnectBody')}
          </p>

          <div className="rounded-2xl border border-gold/15 bg-white/3 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{t('demoConnectLimit')}</p>
            <p className="mt-1 font-medium text-parchment">{t('demoConnectOneBank')}</p>
          </div>

          {connectedBank && (
            <p className="flex items-center gap-2 rounded-2xl border border-emerald-coin/20 bg-emerald-coin/5 px-4 py-3 text-emerald-coin">
              <CheckCircle2 size={16} className="shrink-0" />
              {t('demoConnectAlready', { bank: connectedBank })}
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}
