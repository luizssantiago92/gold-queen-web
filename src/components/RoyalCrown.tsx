import { cn } from '@/components/ui/cn'

interface Props {
  className?: string
  size?: number
}

/** Renaissance portrait used as the app mark across headers and modals. */
export function RoyalCrown({ className, size = 24 }: Props) {
  return (
    <img
      src="/queen-logo.jpg"
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 rounded-full object-cover ring-1 ring-gold/30', className)}
      style={{ width: size, height: size }}
    />
  )
}
