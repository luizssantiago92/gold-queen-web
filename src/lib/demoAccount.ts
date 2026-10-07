import { en } from '@/i18n/en'
import { pt } from '@/i18n/pt'
import { readLocale } from '@/i18n/locale'

/** Public demo credentials, also printed in the README and prefilled on the login form. */
export const DEMO_EMAIL = 'queen@goldqueen.dev'
export const DEMO_PASSWORD = 'QueenDemo123!'

function catalog() {
  return readLocale() === 'en' ? en : pt
}

/**
 * The API answers these 403s in English (`detail`). Visitors see the catalog
 * for the active locale instead of that string.
 */
export function signupClosedMessage(): string {
  return catalog()
    .signupClosed.replaceAll('{{email}}', DEMO_EMAIL)
    .replaceAll('{{password}}', DEMO_PASSWORD)
}

export function demoReadOnlyMessage(): string {
  return catalog().demoReadOnly
}
