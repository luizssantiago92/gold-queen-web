import { CheckCircle2, Info, Landmark } from 'lucide-react'
import { useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { useI18n } from '@/i18n/context'
import { useConnections } from '@/lib/queries'

export function ConnectBankButton() {
  const { t } = useI18n()
  const connections = useConnections()
  const [open, setOpen] = useState(false)

  const connectedBank = connections.data?.[0]?.institution_name

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/3 py-3.5 text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold"
      >
        <Landmark size={15} />
        {t('connectBank')}
      </button>

      <Modal
        open={open}
        title={t('demoConnectTitle')}
        subtitle={t('demoConnectSubtitle')}
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4 text-sm text-parchment/80">
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
