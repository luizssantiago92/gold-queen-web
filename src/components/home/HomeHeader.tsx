import { DemoInfoBanner } from '@/components/home/DemoInfoBanner'
import { RoyalCrown } from '@/components/RoyalCrown'
import { useI18n } from '@/i18n/context'
import { greetingKey } from '@/lib/greeting'

export function HomeHeader({ referenceMonth }: { referenceMonth?: string }) {
  const { t } = useI18n()

  return (
    <header className="shrink-0 px-5 pt-6 pb-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-full border border-gold/35 shadow-gold-glow">
          <RoyalCrown />
        </div>

        <DemoInfoBanner />
      </div>

      <h1 className="flex flex-wrap items-center gap-2 font-sans text-[26px] font-bold leading-tight tracking-tight text-parchment">
        <span>{t(greetingKey())}</span>
        <span
          className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-gold"
        >
          {t('demoBadge')}
        </span>
      </h1>
      {referenceMonth && (
        <p className="mt-1 text-sm text-muted">{referenceMonth}</p>
      )}
    </header>
  )
}
