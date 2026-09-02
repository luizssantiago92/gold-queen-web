import { cn } from '@/components/ui/cn'

interface Props {
  className?: string
  size?: number
}

/** Ornate royal crown — richer than a single lucide stroke icon. */
export function RoyalCrown({ className, size = 24 }: Props) {
  return (
    <svg
      viewBox="0 0 64 48"
      width={size}
      height={(size * 48) / 64}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="crownGold" x1="8" y1="4" x2="56" y2="44">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="crownVelvet" x1="32" y1="28" x2="32" y2="46">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <filter id="crownGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#crownGlow)">
        {/* Velvet band */}
        <path
          d="M6 36h52v8c0 2-1.5 4-4 4H10c-2.5 0-4-2-4-4v-8z"
          fill="url(#crownVelvet)"
        />
        <path d="M6 36h52" stroke="#FFD70055" strokeWidth="1" />

        {/* Main body with five peaks */}
        <path
          d="M8 36 L14 14 L22 26 L32 8 L42 26 L50 14 L56 36 Z"
          fill="url(#crownGold)"
          stroke="#8B6914"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Filigree arches between peaks */}
        <path
          d="M14 14 Q22 22 22 26 M42 26 Q50 22 50 14"
          stroke="#FFF8DC55"
          strokeWidth="0.8"
          fill="none"
        />
        <path d="M22 26 Q27 30 32 28 Q37 30 42 26" stroke="#FFF8DC44" strokeWidth="0.7" fill="none" />

        {/* Jewels on peaks */}
        <circle cx="14" cy="14" r="3" fill="#A855F7" stroke="#E9D5FF" strokeWidth="0.8" />
        <circle cx="32" cy="8" r="3.5" fill="#EF4444" stroke="#FECACA" strokeWidth="0.8" />
        <circle cx="50" cy="14" r="3" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="0.8" />
        <circle cx="22" cy="26" r="2.2" fill="#34D399" stroke="#A7F3D0" strokeWidth="0.6" />
        <circle cx="42" cy="26" r="2.2" fill="#34D399" stroke="#A7F3D0" strokeWidth="0.6" />

        {/* Band gems */}
        <circle cx="18" cy="40" r="2" fill="#FFD700" stroke="#FFF8DC" strokeWidth="0.5" />
        <circle cx="32" cy="40" r="2.5" fill="#FFD700" stroke="#FFF8DC" strokeWidth="0.5" />
        <circle cx="46" cy="40" r="2" fill="#FFD700" stroke="#FFF8DC" strokeWidth="0.5" />

        {/* Cross on central peak */}
        <path
          d="M32 4v4 M30 6h4"
          stroke="#FFF8DC"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
