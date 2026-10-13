import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'gold-queen.locale'

/** English unless Settings already saved `en` or `pt`. The browser language is ignored. */
export function readLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'pt') return stored
  return 'en'
}

export function acceptLanguageHeader(locale: Locale): string {
  return locale === 'pt' ? 'pt-BR,pt;q=0.9,en;q=0.8' : 'en-US,en;q=0.9'
}
