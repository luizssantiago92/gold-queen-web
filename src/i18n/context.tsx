import { useCallback, useEffect, useMemo, useState } from 'react'

import { en, type MessageKey, type Messages } from './en'
import { LOCALE_STORAGE_KEY, readLocale } from './locale'
import { pt } from './pt'
import type { Locale } from './types'
import { I18nContext } from './useI18n'

const catalogs: Record<Locale, Messages> = { en, pt }

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ''))
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
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
