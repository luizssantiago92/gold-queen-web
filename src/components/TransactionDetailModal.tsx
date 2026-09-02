import { ShieldCheck } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/context'
import { formatDay } from '@/lib/localeFormat'
import { formatMoney, toNumber } from '@/lib/format'
import { categoryLabel } from '@/lib/palette'
import { useTransactionDetail } from '@/lib/queries'

interface Props {
  transactionId: number | null
  onClose: () => void
}

export function TransactionDetailModal({ transactionId, onClose }: Props) {
  const { locale, t } = useI18n()
  const detail = useTransactionDetail(transactionId)

  return (
    <Modal
      open={transactionId !== null}
      title={t('transactionDetailTitle')}
      subtitle={detail.data?.description}
      onClose={onClose}
    >
      {detail.isLoading && <Skeleton className="h-40 w-full rounded-2xl" />}

      {detail.data && (
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionAmount')}</dt>
            <dd
              className={`font-bold ${
                toNumber(detail.data.amount) >= 0 ? 'text-emerald-coin' : 'text-debit'
              }`}
            >
              {formatMoney(toNumber(detail.data.amount), locale)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionDate')}</dt>
            <dd>{formatDay(detail.data.transaction_date, locale)}</dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionCategory')}</dt>
            <dd>
              {categoryLabel(
                detail.data.display_category ?? detail.data.category,
                locale,
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionBank')}</dt>
            <dd>{detail.data.institution_name}</dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionAccount')}</dt>
            <dd className="text-right">{detail.data.account_name}</dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">{t('transactionAccountType')}</dt>
            <dd>{detail.data.account_type}</dd>
          </div>

          {detail.data.is_guarded && (
            <p className="flex items-center gap-2 rounded-2xl border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-gold">
              <ShieldCheck size={14} />
              {t('transactionGuarded')}
            </p>
          )}
        </dl>
      )}

      {detail.isError && (
        <p className="text-sm text-debit">{t('transactionDetailError')}</p>
      )}
    </Modal>
  )
}
