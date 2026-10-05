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

export type SceneId = keyof typeof SCENES
