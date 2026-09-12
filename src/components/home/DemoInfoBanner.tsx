import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/components/ui/cn'
import { useI18n } from '@/i18n/context'
import type { MessageKey } from '@/i18n/en'
import { SLIDE_INTERVAL_MS } from '@/lib/slideshow'

const SLIDE_KEYS = [
  'demoBannerProduct',
  'demoBannerOpenFinance',
  'demoBannerLimits',
  'demoBannerQueen',
  'demoBannerPlan',
] as const satisfies readonly MessageKey[]

const DISMISS_KEY = 'gold-queen.demo-banner-dismissed'

interface Props {
  className?: string
}

export function DemoInfoBanner({ className }: Props) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === '1',
  )

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }, [])

  useEffect(() => {
    if (dismissed || paused) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_KEYS.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [dismissed, paused])

  if (dismissed) return null

  return (
    <div
      className={cn(
        'relative flex min-h-12 min-w-0 flex-1 flex-col justify-between rounded-2xl border border-gold/20 bg-black/45 px-3 py-2 backdrop-blur-sm',
        className,
      )}
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t('demoBannerDismiss')}
        className="absolute top-1.5 right-1.5 rounded-full p-0.5 text-muted transition hover:bg-white/10 hover:text-parchment"
      >
        <X size={12} />
      </button>

      <p className="pr-5 text-[11px] leading-snug text-parchment/85 transition-opacity duration-700">
        {t(SLIDE_KEYS[index])}
      </p>

      <div className="mt-1.5 flex justify-end gap-1">
        {SLIDE_KEYS.map((key, dotIndex) => (
          <button
            key={key}
            type="button"
            aria-label={`${dotIndex + 1} / ${SLIDE_KEYS.length}`}
            aria-current={dotIndex === index ? 'true' : undefined}
            onClick={() => setIndex(dotIndex)}
            className={cn(
              'size-1.5 rounded-full transition-colors',
              dotIndex === index ? 'bg-gold' : 'bg-white/25 hover:bg-white/40',
            )}
          />
        ))}
      </div>
    </div>
  )
}
