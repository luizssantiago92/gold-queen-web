import { Card } from '@/components/ui/Card'
import { useI18n } from '@/i18n/useI18n'

interface Props {
  title: string
  onRetry: () => void
}

export function QueryError({ title, onRetry }: Props) {
  const { t } = useI18n()

  return (
    <Card title={title}>
      <p className="text-sm text-parchment/85">{t('cardLoadFailed')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-2xl bg-gold px-4 py-2 text-xs font-bold text-void shadow-gold-glow transition hover:brightness-105"
      >
        {t('tryAgain')}
      </button>
    </Card>
  )
}
