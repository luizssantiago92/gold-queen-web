import { useI18n } from '@/i18n/context'

interface Props {
  className?: string
}

export function LanguageToggle({ className }: Props) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className={className ?? 'flex gap-2'}>
      <LangButton
        active={locale === 'en'}
        label={t('profileLanguageEn')}
        onClick={() => setLocale('en')}
      />
      <LangButton
        active={locale === 'pt'}
        label={t('profileLanguagePt')}
        onClick={() => setLocale('pt')}
      />
    </div>
  )
}

function LangButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
        active
          ? 'bg-gold text-void shadow-gold-glow'
          : 'bg-white/5 text-muted hover:bg-white/10 hover:text-parchment'
      }`}
    >
      {label}
    </button>
  )
}
