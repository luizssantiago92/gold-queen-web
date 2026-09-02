import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { en, type MessageKey, type Messages } from './en'
import { pt } from './pt'
import type { Locale } from './types'

const STORAGE_KEY = 'gold-queen.locale'

const catalogs: Record<Locale, Messages> = { en, pt }

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  messages: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'pt') return stored
  const lang = navigator.language.toLowerCase()
  return lang.startsWith('pt') ? 'pt' : 'en'
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ''))
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const messages = catalogs[locale]

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      interpolate(messages[key], vars),
    [messages],
  )

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
    document.title = messages.pageTitle
  }, [locale, messages.pageTitle])

  const value = useMemo(
    () => ({ locale, setLocale, t, messages }),
    [locale, setLocale, t, messages],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
