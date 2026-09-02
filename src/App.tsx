import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '@/auth/context'
import { BottomNav } from '@/components/BottomNav'
import type { Tab } from '@/components/BottomNav'
import { ChatModal } from '@/components/ChatModal'
import { MobileShell } from '@/components/MobileShell'
import type { SceneId } from '@/components/SceneBackdrop'
import { QueenTipsModal } from '@/components/QueenTipsModal'
import { HomeScreen } from '@/screens/HomeScreen'
import { LoginScreen } from '@/screens/LoginScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'

export function App() {
  const { status } = useAuth()
  const [tab, setTab] = useState<Tab>('home')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  let scene: SceneId = 'home'
  if (status === 'anonymous') scene = 'login'
  else if (tab === 'profile') scene = 'profile'

  if (status === 'loading') {
    return (
      <MobileShell scene="home">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin text-gold" size={26} />
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

      <QueenTipsModal open={tipsOpen} onClose={() => setTipsOpen(false)} />
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </MobileShell>
  )
}
