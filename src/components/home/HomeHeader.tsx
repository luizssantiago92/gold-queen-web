import { LogOut } from 'lucide-react'

import { DemoInfoBanner } from '@/components/home/DemoInfoBanner'
import { RoyalCrown } from '@/components/RoyalCrown'
import { useAuth } from '@/auth/context'
import { useI18n } from '@/i18n/context'
import { greetingKey } from '@/lib/greeting'

export function HomeHeader({ referenceMonth }: { referenceMonth?: string }) {
  const { logout } = useAuth()
  const { t } = useI18n()

  return (
    <header className="shrink-0 px-5 pt-6 pb-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-full border border-gold/35 shadow-gold-glow">
          <RoyalCrown />
        </div>

        <DemoInfoBanner />

        <button
          type="button"
          onClick={logout}
          aria-label={t('logoutAria')}
          className="shrink-0 rounded-full bg-black/40 p-2 text-muted backdrop-blur-sm transition hover:bg-white/10 hover:text-parchment"
        >
          <LogOut size={16} />
        </button>
      </div>

      <h1 className="font-sans text-[26px] font-bold leading-tight tracking-tight text-parchment">
        {t(greetingKey())}{' '}
        <span className="text-gold-gradient">{t('greetingDemoVisitor')}</span>
      </h1>
      {referenceMonth && (
        <p className="mt-1 text-sm text-muted">{referenceMonth}</p>
      )}
    </header>
  )
}
