import { Loader2 } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'

/** Overlay placeholder while a modal chunk loads. Absolute, so the page does not shift. */
export function ModalChunkFallback() {
  const { t } = useI18n()

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="flex items-center gap-2 rounded-full border border-gold/20 bg-surface px-4 py-2 text-sm text-muted">
        <Loader2 className="animate-spin text-gold" size={16} aria-hidden />
        {t('appLoading')}
      </p>
    </div>
  )
}

/**
 * Same chrome as `MonthChartCard` while its data is loading, so the dashboard
 * does not jump when the chart chunk arrives.
 */
export function ChartCardFallback() {
  const { t } = useI18n()

  return (
    <div aria-busy="true" aria-live="polite">
      <Card title={t('monthExpensesTitle')}>
        <Skeleton className="h-36 w-full rounded-2xl" />
      </Card>
    </div>
  )
}
