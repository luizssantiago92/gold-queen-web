import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { MobileShell } from '@/components/MobileShell'
import { RoyalCrown } from '@/components/RoyalCrown'
import { useI18n } from '@/i18n/useI18n'
import {
  probeHealth,
  WAKE_BUDGET_MS,
  WAKE_REVEAL_MS,
  wakeApi,
  wakeProgressPercent,
} from '@/lib/wakeApi'

type Phase = 'probing' | 'waiting' | 'ready' | 'failed'

/**
 * Wakes the free-tier API on boot. A fast `/health` never paints this screen.
 * Past ~1.5s the court-themed status covers the shell until the probe succeeds
 * or the 90s budget ends. `motion-safe:` keeps the spinner and bar still when
 * the visitor prefers reduced motion; the bar width still tracks elapsed time.
 */
export function ApiWakeGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('probing')
  const [runId, setRunId] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const started = Date.now()
    let cancelled = false

    const revealTimer = window.setTimeout(() => {
      if (cancelled) return
      setStartedAt(started)
      setPhase((current) => (current === 'probing' ? 'waiting' : current))
    }, WAKE_REVEAL_MS)

    void wakeApi({
      probe: (timeoutMs, signal) => probeHealth(timeoutMs, signal),
      signal: controller.signal,
    }).then((result) => {
      if (cancelled) return
      window.clearTimeout(revealTimer)
      if (!result.ok) {
        if (!result.aborted) setPhase('failed')
        return
      }
      setPhase('ready')
    })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(revealTimer)
    }
  }, [runId])

  const blocked = phase === 'waiting' || phase === 'failed'

  return (
    <div className="h-full">
      <div className="h-full" inert={blocked || undefined} aria-hidden={blocked || undefined}>
        {children}
      </div>
      {blocked && startedAt !== null ? (
        <WakeScreen
          phase={phase === 'failed' ? 'failed' : 'waiting'}
          startedAt={startedAt}
          onRetry={() => {
            setStartedAt(null)
            setPhase('probing')
            setRunId((current) => current + 1)
          }}
        />
      ) : null}
    </div>
  )
}

function WakeScreen({
  phase,
  startedAt,
  onRetry,
}: {
  phase: 'waiting' | 'failed'
  startedAt: number
  onRetry: () => void
}) {
  const { t } = useI18n()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const retryRef = useRef<HTMLButtonElement>(null)
  const waiting = phase === 'waiting'
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAt)
  const progress = wakeProgressPercent(elapsedMs, WAKE_BUDGET_MS)

  useEffect(() => {
    if (!waiting) return
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt)
    }, 200)
    return () => window.clearInterval(timer)
  }, [startedAt, waiting])

  useEffect(() => {
    if (waiting) headingRef.current?.focus()
    else retryRef.current?.focus()
  }, [waiting])

  return (
    <div className="fixed inset-0 z-50">
      <MobileShell scene="login">
        <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
          <div className="size-20 overflow-hidden rounded-full border border-gold/35 shadow-gold-glow">
            <RoyalCrown />
          </div>
          <div role="status" aria-live="polite" aria-busy={waiting || undefined}>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-royal text-2xl font-bold text-gold-gradient outline-none"
            >
              {waiting ? t('wakeTitle') : t('wakeFailed')}
            </h1>
            {waiting ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">{t('wakeBody')}</p>
            ) : null}
          </div>

          {waiting ? (
            <div className="flex w-full max-w-[240px] flex-col items-center gap-3">
              <Loader2 className="text-gold motion-safe:animate-spin" size={22} aria-hidden />
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={t('wakeProgress')}
              >
                <div
                  className="h-full bg-gold motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              ref={retryRef}
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-void shadow-gold-glow transition hover:brightness-105"
            >
              {t('wakeRetry')}
            </button>
          )}
        </div>
      </MobileShell>
    </div>
  )
}
