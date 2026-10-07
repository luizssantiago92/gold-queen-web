import { X } from 'lucide-react'
import { useCallback, useId, useState } from 'react'

import { cn } from '@/components/ui/cn'
import { useI18n } from '@/i18n/useI18n'
import type { MessageKey } from '@/i18n/en'

const LINES = [
  { short: 'demoBannerShortProduct', rest: 'demoBannerProduct' },
  { short: 'demoBannerShortOpenFinance', rest: 'demoBannerOpenFinance' },
  { short: 'demoBannerShortLimits', rest: 'demoBannerLimits' },
  { short: 'demoBannerShortQueen', rest: 'demoBannerQueen' },
  { short: 'demoBannerShortPlan', rest: 'demoBannerPlan' },
] as const satisfies readonly { short: MessageKey; rest: MessageKey }[]

const DISMISS_KEY = 'gold-queen.demo-banner-dismissed'

interface Props {
  className?: string
}

export function DemoInfoBanner({ className }: Props) {
  const { t } = useI18n()
  const detailId = useId()
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }, [])

  if (dismissed) return null

  const line = LINES[index]

  function showRest() {
    setExpanded((open) => !open)
  }

  function nextLine() {
    setIndex((current) => (current + 1) % LINES.length)
    setExpanded(false)
  }

  return (
    <section aria-label={t('demoBannerSpeak')} className={cn('relative min-w-0 flex-1', className)}>
      <div className="relative rounded-2xl border border-gold/25 bg-black/55 px-3 py-2 pr-6 shadow-gold-glow backdrop-blur-sm">
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-[10px] -translate-y-1/2 border-y-[8px] border-r-[9px] border-y-transparent border-r-gold/40"
        />
        <span
          data-speech-tail=""
          aria-hidden="true"
          className="absolute top-1/2 -left-2 -translate-y-1/2 border-y-[7px] border-r-8 border-y-transparent border-r-[#16130c]"
        />

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={expanded ? detailId : undefined}
          onClick={showRest}
          className="block w-full rounded-md text-left text-[13px] leading-snug text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
        >
          {t(line.short)}
        </button>

        {expanded && (
          <p
            id={detailId}
            className="mt-1.5 text-xs leading-relaxed text-parchment/80 motion-safe:transition-opacity"
          >
            {t(line.rest)}
          </p>
        )}

        {expanded && (
          <button
            type="button"
            onClick={nextLine}
            className="mt-1.5 rounded-md text-xs font-semibold text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
          >
            {t('demoBannerNext')}
          </button>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label={t('demoBannerDismiss')}
          className="absolute top-1.5 right-1.5 rounded-full p-0.5 text-muted hover:bg-white/10 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 motion-safe:transition"
        >
          <X size={12} />
        </button>
      </div>
    </section>
  )
}
