import { cn } from '@/components/ui/cn'

export const SCENES = {
  login: '/scenes/scene-dawn-lake.jpg',
  home: '/scenes/scene-castle-sunset.jpg',
  profile: '/scenes/scene-treasury.jpg',
} as const

export type SceneId = keyof typeof SCENES

interface Props {
  scene: SceneId
  /** 0–1 scroll progress on home crossfades into the treasury scene. */
  scrollProgress?: number
  className?: string
}

export function SceneBackdrop({ scene, scrollProgress = 0, className }: Props) {
  const primary = SCENES[scene]
  const secondary = SCENES.profile

  const blendOpacity =
    scene === 'home' ? Math.min(Math.max(scrollProgress, 0), 1) * 0.7 : 0

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <img
        key={primary}
        src={primary}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700"
      />

      {scene === 'home' && (
        <img
          src={secondary}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
          style={{ opacity: blendOpacity }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/75 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
    </div>
  )
}
