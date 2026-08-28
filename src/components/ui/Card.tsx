import type { ReactNode } from 'react'

import { cn } from './cn'

interface CardProps {
  title?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Card({ title, action, className, children }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-gold/10 bg-surface/80 p-4 shadow-card backdrop-blur-sm',
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          {title && (
            <h2 className="font-royal text-sm font-semibold tracking-wide text-parchment/80">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
