import type { ReactNode } from 'react'

/**
 * On desktop the app is framed as a phone to read as a product test-drive; on
 * real phones the frame disappears and the app takes the whole viewport.
 * `dvh` is used instead of `vh` so mobile browser chrome does not clip the
 * floating bottom bar.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-void sm:bg-[radial-gradient(circle_at_50%_0%,#1a1420_0%,#000_70%)]">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-void sm:h-[860px] sm:max-h-[92dvh] sm:w-[412px] sm:rounded-shell sm:border-[6px] sm:border-[#1a1a1a] sm:shadow-2xl">
        {children}
      </div>
    </div>
  )
}
