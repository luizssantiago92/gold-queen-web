import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { useI18n } from '@/i18n/useI18n'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

const dismissStack: Array<() => void> = []

/**
 * Rendered inside the phone shell rather than in a portal on `body`, so on
 * desktop the sheet stays within the simulated device instead of covering the
 * whole page.
 */
export function Modal({ open, title, subtitle, onClose, children }: ModalProps) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return

    restoreFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()

    const dismiss = () => onCloseRef.current()
    dismissStack.push(dismiss)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (dismissStack[dismissStack.length - 1] !== dismiss) return
      event.preventDefault()
      dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      const index = dismissStack.lastIndexOf(dismiss)
      if (index >= 0) dismissStack.splice(index, 1)
      restoreFocus.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label={t('closeModal')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[88%] flex-col rounded-t-3xl border-t border-gold/25 bg-surface shadow-gold-glow focus:outline-none"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gold/10 px-5 py-4">
          <div>
            <h2 className="font-royal text-lg font-semibold text-gold-gradient">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-parchment/50">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeModal')}
            className="rounded-full p-1.5 text-parchment/60 transition hover:bg-parchment/10 hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
