import { ChevronRight, CreditCard, Globe, Landmark, LogOut, Sparkles, Star } from 'lucide-react'

import { RoyalCrown } from '@/components/RoyalCrown'
import { useAuth } from '@/auth/context'
import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/context'
import { useConnections } from '@/lib/queries'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const { locale, setLocale, t } = useI18n()
  const connections = useConnections()
  const bankCount = connections.data?.length ?? 0

  return (
    <div className="scrollbar-none h-full overflow-y-auto pb-28">
      <div className="mb-5 flex flex-col items-center px-5 pt-8 text-center">
        <div className="mb-3 flex size-24 items-center justify-center rounded-full border-2 border-gold/30 bg-black/40 shadow-gold-glow backdrop-blur-sm">
          <RoyalCrown size={52} />
        </div>
        <h1 className="text-lg font-bold leading-snug text-parchment">{user?.display_name}</h1>
        <p className="mt-1 text-xs text-muted">{user?.email}</p>
      </div>

      <div className="space-y-3 px-4">
        <Card title={t('profileLanguage')} variant="flat">
          <div className="flex gap-2">
            <LangButton
              active={locale === 'pt'}
              label={t('profileLanguagePt')}
              onClick={() => setLocale('pt')}
            />
            <LangButton
              active={locale === 'en'}
              label={t('profileLanguageEn')}
              onClick={() => setLocale('en')}
            />
          </div>
        </Card>

        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-gold/20 bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative z-10 max-w-[65%]">
            <p className="text-xs font-bold tracking-wider text-gold">{t('profileBannerTitle')}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{t('profileBannerBody')}</p>
          </div>
          <Globe size={56} className="absolute -right-1 -bottom-1 text-gold/15" aria-hidden />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card variant="flat" className="!p-4">
            <Sparkles size={16} className="text-gold/70" />
            <p className="mt-3 text-base font-bold text-parchment">{t('profilePlan')}</p>
            <p className="text-[11px] text-muted">{t('profilePlanLabel')}</p>
          </Card>

          <Card variant="flat" className="!p-4">
            <Landmark size={16} className="text-gold/70" />
            <p className="mt-3 text-base font-bold text-parchment">
              {connections.isLoading
                ? '—'
                : bankCount === 1
                  ? t('profileBanks', { count: bankCount })
                  : t('profileBanksPlural', { count: bankCount })}
            </p>
            <p className="text-[11px] text-muted">{t('profileConnections')}</p>
          </Card>
        </div>

        <Card title={t('profileBanksTitle')} showChevron>
          {connections.isLoading ? (
            <Skeleton className="h-14 w-full rounded-2xl" />
          ) : connections.data && connections.data.length > 0 ? (
            <ul className="space-y-2">
              {connections.data.map((connection) => (
                <li
                  key={connection.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/3 px-2 py-2"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-mystic/40">
                    <Landmark size={14} className="text-gold" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-parchment">
                    {connection.institution_name}
                  </span>
                  <span className="shrink-0 rounded-full bg-emerald-coin/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-coin">
                    {connection.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message={t('noBanksConnected')} />
          )}
        </Card>

        <Card title={t('profileCardsTitle')}>
          <div className="grid grid-cols-2 gap-3">
            <RoadmapCard label={t('profileStandard')} tone="from-surface-raised to-surface border-white/8" />
            <RoadmapCard label={t('profilePlatinum')} tone="from-gold-aged/30 to-surface border-gold/30" />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <Sparkles size={12} className="text-gold/60" />
            {t('profileCardsSoon')}
          </p>
        </Card>

        <Card title={t('profileInvestTitle')}>
          <EmptyState message={t('profileInvestSoon')} />
        </Card>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] bg-black/50 px-4 py-3.5 text-sm text-parchment backdrop-blur-sm transition hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <Star size={16} className="text-gold" />
            {t('profileRate')}
          </span>
          <ChevronRight size={16} className="text-muted" />
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blood/25 bg-blood/10 py-3.5 text-sm font-medium text-debit transition hover:bg-blood/15"
        >
          <LogOut size={15} />
          {t('profileLeave')}
        </button>
      </div>
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

function RoadmapCard({ label, tone }: { label: string; tone: string }) {
  const { t } = useI18n()
  return (
    <div
      className={`flex aspect-[1.6] flex-col justify-between rounded-2xl border bg-gradient-to-br p-3 ${tone}`}
    >
      <CreditCard size={16} className="text-gold/70" />
      <div>
        <p className="text-xs font-semibold text-parchment/90">{label}</p>
        <p className="text-[10px] text-muted">{t('profileSoon')}</p>
      </div>
    </div>
  )
}
