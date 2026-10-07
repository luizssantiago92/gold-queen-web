import { useQueryClient } from '@tanstack/react-query'
import { ScrollText, ShieldCheck, Swords } from 'lucide-react'
import type { ReactNode } from 'react'

import { RoyalCrown } from '@/components/RoyalCrown'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { errorMessage } from '@/lib/api'
import { useQueenTips } from '@/lib/queries'

interface Props {
  open: boolean
  onClose: () => void
}

export function QueenTipsModal({ open, onClose }: Props) {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { data, isFetching, error, refetch } = useQueenTips(open)
  const waiting = isFetching && !data

  function retryTips() {
    return queryClient.cancelQueries({ queryKey: ['queen-tips'] }).then(() => refetch())
  }

  return (
    <Modal
      open={open}
      title={t('tipsTitle')}
      subtitle={t('tipsSubtitle')}
      onClose={onClose}
    >
      {waiting && (
        <div aria-busy="true" aria-live="polite">
          <p className="mb-3 text-center text-sm text-muted">{t('tipsLoading')}</p>
          <div className="space-y-3">
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <button
            type="button"
            onClick={() => retryTips()}
            className="mt-4 w-full rounded-2xl bg-gold px-4 py-2.5 text-xs font-bold text-void shadow-gold-glow transition hover:brightness-105"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}

      {error && !waiting && (
        <div role="alert" className="py-6 text-center">
          <p className="text-sm text-debit">{errorMessage(error, t('tipsError'))}</p>
          <button
            type="button"
            onClick={() => retryTips()}
            className="mt-4 rounded-2xl bg-gold px-4 py-2.5 text-xs font-bold text-void shadow-gold-glow transition hover:brightness-105"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}

      {data && (
        <div className="space-y-3 pb-2">
          <Scroll
            icon={<Swords size={15} />}
            title={t('tipsCritical')}
            body={data.critical_expense}
          />
          <Scroll
            icon={<ScrollText size={15} />}
            title={t('tipsManagement')}
            body={data.management_status}
          />
          <Scroll
            icon={<RoyalCrown size={15} />}
            title={t('tipsGuidance')}
            body={data.smart_guidance}
          />

          {data.is_guarded && (
            <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted">
              <ShieldCheck size={13} className="text-gold/70" />
              {t('tipsGuarded')}
              {data.from_cache && t('tipsCached')}
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}

function Scroll({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-gold-aged/30 bg-black/40 p-4 backdrop-blur-sm">
      <h3 className="mb-1.5 flex items-center gap-2 font-royal text-sm font-semibold text-gold">
        {icon}
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-parchment/75">{body}</p>
    </article>
  )
}
