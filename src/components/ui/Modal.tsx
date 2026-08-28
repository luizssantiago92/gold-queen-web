import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

/**
 * Rendered inside the phone shell rather than in a portal on `body`, so on
 * desktop the sheet stays within the simulated device instead of covering the
 * whole page.
 */
export function Modal({ open, title, subtitle, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[88%] flex-col rounded-t-3xl border-t border-gold/25 bg-surface shadow-gold-glow"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gold/10 px-5 py-4">
          <div>
            <h2 className="font-royal text-lg font-semibold text-gold-gradient">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-parchment/50">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
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
