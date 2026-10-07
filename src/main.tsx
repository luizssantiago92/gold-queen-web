import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { AuthProvider } from '@/auth/AuthProvider'
import { ApiWakeGate } from '@/components/ApiWakeGate'
import { I18nProvider } from '@/i18n/context'

import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        failureCount < 2 && !String(error).includes('401'),
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        {/* The health probe starts with the first paint, including the sign-in
            page, and does not cover the tree. */}
        <ApiWakeGate>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ApiWakeGate>
      </QueryClientProvider>
    </I18nProvider>
  </StrictMode>,
)
