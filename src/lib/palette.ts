import { categoryLabel as labelForLocale } from '@/lib/localeFormat'
import type { Locale } from '@/i18n/types'

/** Brand-ish hues so each bank keeps the same colour across bar and legend. */
const BANK_COLORS: Record<string, string> = {
  'pluggy bank': '#6B21A8',
  nubank: '#8A05BE',
  'banco itau': '#EC7000',
  itau: '#EC7000',
  bradesco: '#CC092F',
  'banco do brasil': '#F9DD16',
  santander: '#EC0000',
  caixa: '#1C5FA8',
  inter: '#FF7A00',
}

const FALLBACK_COLORS = ['#FFD700', '#6B21A8', '#34D399', '#38BDF8', '#F472B6', '#8B6914']

export function bankColor(institutionName: string, index: number): string {
  return (
    BANK_COLORS[institutionName.trim().toLowerCase()] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  )
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Transport: '#38BDF8',
  Housing: '#A855F7',
  Health: '#34D399',
  Education: '#60A5FA',
  Entertainment: '#F472B6',
  Shopping: '#FB7185',
  Bills: '#94A3B8',
  Income: '#22C55E',
  Transfer: '#818CF8',
  Other: '#8B6914',
}

export function categoryColor(category: string, index: number): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export function categoryLabel(category: string, locale: Locale): string {
  return labelForLocale(category, locale)
}
