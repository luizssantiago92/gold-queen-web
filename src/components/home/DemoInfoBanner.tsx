import { useEffect, useState } from 'react'

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

interface Props {
  className?: string
}

export function DemoInfoBanner({ className }: Props) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_KEYS.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className={cn(
        'flex min-h-12 min-w-0 flex-1 flex-col justify-between rounded-2xl border border-gold/20 bg-black/45 px-3 py-2 backdrop-blur-sm',
        className,
      )}
      aria-live="polite"
    >
      <p className="text-[11px] leading-snug text-parchment/85 transition-opacity duration-700">
        {t(SLIDE_KEYS[index])}
      </p>

      <div className="mt-1.5 flex justify-end gap-1">
        {SLIDE_KEYS.map((key, dotIndex) => (
          <span
            key={key}
            className={cn(
              'size-1 rounded-full transition-colors',
              dotIndex === index ? 'bg-gold' : 'bg-white/25',
            )}
          />
        ))}
      </div>
    </div>
  )
}
