import type { Locale } from '@/i18n/types'

/** API decimals travel as strings; only widen to float at the render boundary. */
export function toNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatMoney(value: string | number, locale: Locale = 'en'): string {
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  const formatter = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'BRL',
  })
  return formatter.format(typeof value === 'string' ? toNumber(value) : value)
}
