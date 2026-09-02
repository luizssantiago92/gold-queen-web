import { cn } from '@/components/ui/cn'

interface Props {
  className?: string
  /** Pixel size when not filling a parent container. */
  size?: number
}

/** Renaissance portrait used as the app mark across headers and modals. */
export function RoyalCrown({ className, size }: Props) {
  const fillParent = size === undefined

  return (
    <img
      src="/queen-logo.jpg"
      alt=""
      className={cn(
        'shrink-0 rounded-full object-cover object-[center_12%] ring-1 ring-gold/30',
        fillParent && 'size-full',
        className,
      )}
      style={fillParent ? undefined : { width: size, height: size }}
    />
  )
}
