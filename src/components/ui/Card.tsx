import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from './cn'

interface CardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'flat'
  showChevron?: boolean
  children: ReactNode
}

export function Card({
  title,
  subtitle,
  action,
  className,
  variant = 'default',
  showChevron = false,
  children,
}: CardProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-card)] p-4',
        variant === 'glass' && 'glass-card shadow-card',
        variant === 'default' &&
          'border border-white/6 bg-surface-raised/80 shadow-card backdrop-blur-md',
        variant === 'flat' && 'bg-surface-raised/60',
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-3 flex items-start justify-between gap-2">
          {title && (
            <div className="min-w-0">
              <h2 className="flex items-center gap-0.5 text-[13px] font-medium text-muted">
                {title}
                {showChevron && (
                  <ChevronRight size={14} className="shrink-0 text-muted/70" aria-hidden />
                )}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-[11px] text-muted/70">{subtitle}</p>
              )}
            </div>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
