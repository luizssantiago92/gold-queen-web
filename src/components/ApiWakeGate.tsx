import { Loader2 } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useI18n } from '@/i18n/useI18n'
import {
  probeHealth,
  WAKE_BUDGET_MS,
  WAKE_REVEAL_MS,
  wakeApi,
  wakeProgressPercent,
} from '@/lib/wakeApi'

type Phase = 'probing' | 'waiting' | 'ready' | 'failed'

interface WakeStatus {
  phase: Phase
  startedAt: number | null
  retry: () => void
}

const WakeContext = createContext<WakeStatus>({
  phase: 'ready',
  startedAt: null,
  retry: () => {},
})

function useWake(): WakeStatus {
  return useContext(WakeContext)
}

/**
 * Starts `GET /health` as soon as the app mounts, which is when the sign-in
 * page opens for a visitor without a session. The probe never covers or
 * disables the tree: a slow cold start is a notice on the form, and dashboard
 * requests run on their own.
 */
export function ApiWakeGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('probing')
  const [runId, setRunId] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  const retry = useCallback(() => {
    setStartedAt(null)
    setPhase('probing')
    setRunId((current) => current + 1)
  }, [])

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

  return <WakeContext value={{ phase, startedAt, retry }}>{children}</WakeContext>
}

/** Inline cold-start notice. Renders nothing once the probe is fast or finished. */
export function WakeNotice() {
  const wake = useWake()
  const { t } = useI18n()
  const waiting = wake.phase === 'waiting'
  const failed = wake.phase === 'failed'
  const [elapsedMs, setElapsedMs] = useState(() =>
    wake.startedAt == null ? 0 : Math.max(0, Date.now() - wake.startedAt),
  )

  useEffect(() => {
    if (!waiting || wake.startedAt == null) return
    const startedAt = wake.startedAt
    const tick = () => setElapsedMs(Date.now() - startedAt)
    tick()
    const timer = window.setInterval(tick, 200)
    return () => window.clearInterval(timer)
  }, [waiting, wake.startedAt])

  if (!waiting && !failed) return null

  const progress = wakeProgressPercent(elapsedMs, WAKE_BUDGET_MS)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={waiting || undefined}
      className="rounded-2xl border border-gold/25 bg-black/45 px-3 py-3 text-left backdrop-blur-sm"
    >
      <p className="font-royal text-sm font-semibold text-gold">
        {waiting ? t('wakeTitle') : t('wakeFailed')}
      </p>
      {waiting ? (
        <>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t('wakeBody')}</p>
          <div className="mt-2 flex items-center gap-2">
            <Loader2 className="shrink-0 text-gold motion-safe:animate-spin" size={14} aria-hidden />
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
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
        </>
      ) : (
        <button
          type="button"
          onClick={wake.retry}
          className="mt-2 rounded-2xl bg-gold px-4 py-2 text-xs font-bold text-void shadow-gold-glow transition hover:brightness-105"
        >
          {t('wakeRetry')}
        </button>
      )}
    </div>
  )
}
