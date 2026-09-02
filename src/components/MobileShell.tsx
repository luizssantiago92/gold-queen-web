import type { ReactNode } from 'react'

import { SceneBackdrop, type SceneId } from '@/components/SceneBackdrop'

/**
 * On desktop the app is framed as a phone to read as a product test-drive; on
 * real phones the frame disappears and the app takes the whole viewport.
 */
export function MobileShell({
  children,
  scene = 'home',
  scrollProgress = 0,
}: {
  children: ReactNode
  scene?: SceneId
  scrollProgress?: number
}) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-void sm:bg-black">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-void sm:h-[860px] sm:max-h-[92dvh] sm:w-[412px] sm:rounded-shell sm:border-[6px] sm:border-[#1a1a1a] sm:shadow-2xl">
        <SceneBackdrop scene={scene} scrollProgress={scrollProgress} />
        <div className="relative z-10 flex h-full flex-col">{children}</div>
      </div>
    </div>
  )
}
