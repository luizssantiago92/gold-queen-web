import type { Locale } from '@/i18n/types'

/** API decimals travel as strings; only widen to float at the render boundary. */
export function toNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatMoney(value: string | number, locale: Locale = 'pt'): string {
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  const formatter = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'BRL',
  })
  return formatter.format(typeof value === 'string' ? toNumber(value) : value)
}

/** Parsed as local time: `new Date('2026-08-01')` would shift a day backwards. */
export function parseApiDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}
