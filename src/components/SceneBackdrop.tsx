import { useEffect, useState } from 'react'

import { cn } from '@/components/ui/cn'
import { SLIDE_INTERVAL_MS } from '@/lib/slideshow'

export const SCENES = {
  login: '/scenes/scene-dawn-lake.webp',
  home: '/scenes/scene-castle-sunset.webp',
  profile: '/scenes/scene-treasury.webp',
} as const

/** Home wallpaper rotates through these every few seconds. */
export const HOME_SLIDESHOW = [
  '/scenes/scene-castle-sunset.webp',
  '/scenes/scene-council.webp',
  '/scenes/scene-throne.webp',
  '/scenes/scene-vault.webp',
  '/scenes/scene-treasury.webp',
] as const

const SLIDE_MS = SLIDE_INTERVAL_MS

export type SceneId = keyof typeof SCENES

interface Props {
  scene: SceneId
  className?: string
}

export function SceneBackdrop({ scene, className }: Props) {
  const [slideIndex, setSlideIndex] = useState(0)
  // Index of the furthest slide that may be requested. Starts at the first
  // frame so the home page does not download the whole rotation up front.
  const [loadedThrough, setLoadedThrough] = useState(0)

  useEffect(() => {
    if (scene !== 'home') return

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % HOME_SLIDESHOW.length)
    }, SLIDE_MS)

    return () => window.clearInterval(timer)
  }, [scene])

  const primary = SCENES[scene]

  function preloadUpcoming(index: number) {
    const upcoming = index + 1
    if (upcoming >= HOME_SLIDESHOW.length) return
    setLoadedThrough((loaded) => (upcoming > loaded ? upcoming : loaded))
  }

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {scene === 'home' ? (
        HOME_SLIDESHOW.map((src, index) => {
          if (index > loadedThrough && index !== slideIndex) return null
          const eager = index === 0
          return (
            <img
              key={src}
              src={src}
              alt=""
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'low'}
              decoding="async"
              onLoad={() => {
                if (index === slideIndex) preloadUpcoming(index)
              }}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000"
              style={{ opacity: index === slideIndex ? 1 : 0 }}
            />
          )
        })
      ) : (
        <img
          key={primary}
          src={primary}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/75 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
    </div>
  )
}
