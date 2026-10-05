import { Loader2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import { useAuth } from '@/auth/context'
import { BottomNav } from '@/components/BottomNav'
import type { Tab } from '@/components/BottomNav'
import { MobileShell } from '@/components/MobileShell'
import type { SceneId } from '@/components/scenes'
import { ModalChunkFallback } from '@/components/SuspenseFallback'
import { useI18n } from '@/i18n/useI18n'
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
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('home')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  let scene: SceneId = 'home'
  if (status === 'anonymous') scene = 'login'
  else if (tab === 'profile') scene = 'profile'

  if (status === 'loading') {
    return (
      <MobileShell scene="home">
        <div
          className="flex h-full flex-col items-center justify-center gap-3"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader2 className="animate-spin text-gold" size={26} aria-hidden />
          <p className="text-sm text-muted">{t('appLoading')}</p>
        </div>
      </MobileShell>
    )
  }

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
