import type { Locale } from '@/i18n/types'

/** Time-of-day salutation key for i18n. */
export function greetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'greetingMorning'
  if (hour < 18) return 'greetingAfternoon'
  return 'greetingEvening'
}

export function formatReferenceMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-').map(Number)
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  const label = new Intl.DateTimeFormat(tag, { month: 'long' }).format(
    new Date(year, (month ?? 1) - 1, 1),
  )
  return locale === 'pt'
    ? `${label.charAt(0).toUpperCase()}${label.slice(1)} de ${year}`
    : `${label.charAt(0).toUpperCase()}${label.slice(1)} ${year}`
}

export function formatDay(value: string, locale: Locale): string {
  const [year, month, day] = value.split('-').map(Number)
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(tag, { day: '2-digit', month: 'short' })
    .format(new Date(year, (month ?? 1) - 1, day ?? 1))
    .replace('.', '')
}

export function categoryLabel(category: string, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    en: {
      Food: 'Feasts',
      Transport: 'Carriages',
      Housing: 'Castle',
      Health: 'Apothecary',
      Education: 'Scrolls',
      Entertainment: 'Festivals',
      Shopping: 'Market',
      Bills: 'Tributes',
      Income: 'Income',
      Transfer: 'Transfers',
      Other: 'Other',
    },
    pt: {
      Food: 'Banquetes',
      Transport: 'Montarias',
      Housing: 'Castelo',
      Health: 'Boticario',
      Education: 'Escrituras',
      Entertainment: 'Festins',
      Shopping: 'Mercadorias',
      Bills: 'Tributos',
      Income: 'Rendas',
      Transfer: 'Transferencias',
      Other: 'Outros',
    },
  }
  return labels[locale][category] ?? category
}
