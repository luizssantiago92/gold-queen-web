import { lazy, Suspense, useState } from 'react'

import { useAuth } from '@/auth/context'
import { BottomNav } from '@/components/BottomNav'
import type { Tab } from '@/components/BottomNav'
import { MobileShell } from '@/components/MobileShell'
import type { SceneId } from '@/components/scenes'
import { ModalChunkFallback } from '@/components/SuspenseFallback'
import { HomeScreen } from '@/screens/HomeScreen'
import { LoginScreen } from '@/screens/LoginScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'

const ChatModal = lazy(() =>
  import('@/components/ChatModal').then((module) => ({ default: module.ChatModal })),
)
const QueenTipsModal = lazy(() =>
  import('@/components/QueenTipsModal').then((module) => ({ default: module.QueenTipsModal })),
)

export function App() {
  const { status } = useAuth()
  const [tab, setTab] = useState<Tab>('home')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  let scene: SceneId = 'home'
  if (status === 'anonymous') scene = 'login'
  else if (tab === 'profile') scene = 'profile'

  if (status === 'anonymous') {
    return (
      <MobileShell scene="login">
        <LoginScreen />
      </MobileShell>
    )
  }

  return (
    <MobileShell scene={scene}>
      {tab === 'home' ? (
        <HomeScreen onOpenTips={() => setTipsOpen(true)} />
      ) : (
        <ProfileScreen />
      )}

      <BottomNav active={tab} onNavigate={setTab} onAskQueen={() => setChatOpen(true)} />

      {tipsOpen && (
        <Suspense fallback={<ModalChunkFallback />}>
          <QueenTipsModal open onClose={() => setTipsOpen(false)} />
        </Suspense>
      )}
      {chatOpen && (
        <Suspense fallback={<ModalChunkFallback />}>
          <ChatModal open onClose={() => setChatOpen(false)} />
        </Suspense>
      )}
    </MobileShell>
  )
}
