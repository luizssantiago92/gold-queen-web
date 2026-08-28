import { cn } from './cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-shimmer rounded-lg bg-parchment/10', className)}
      aria-hidden="true"
    />
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-6 text-center text-sm text-parchment/45">{message}</p>
  )
}
