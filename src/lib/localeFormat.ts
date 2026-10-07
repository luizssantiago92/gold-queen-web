import type { Locale } from '@/i18n/types'

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

/** Naive API timestamps are UTC. A zone suffix on the string is left as-is. */
export function formatSyncedAt(value: string, locale: Locale): string {
  const hasZone = /(?:z|Z|[+-]\d{2}:?\d{2})$/.test(value)
  const date = new Date(hasZone ? value : `${value}Z`)
  if (Number.isNaN(date.getTime())) return value
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(tag, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hourCycle: 'h23',
  })
    .format(date)
    .replace('.', '')
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
      Subscriptions: 'Subscriptions',
      Bills: 'Bills & utilities',
      AutoDebit: 'Auto debit',
      CreditCard: 'Credit card',
      Food: 'Food & dining',
      Housing: 'Housing',
      Transport: 'Transport',
      Health: 'Health',
      Shopping: 'Shopping',
      Income: 'Income',
      Transfer: 'Transfers',
      Other: 'Other',
      Education: 'Education',
      Entertainment: 'Entertainment',
    },
    pt: {
      Subscriptions: 'Assinaturas',
      Bills: 'Boletos e contas',
      AutoDebit: 'Débito automático',
      CreditCard: 'Cartão de crédito',
      Food: 'Alimentação',
      Housing: 'Moradia',
      Transport: 'Transporte',
      Health: 'Saúde',
      Shopping: 'Compras',
      Income: 'Rendas',
      Transfer: 'Transferências',
      Other: 'Outros',
      Education: 'Educação',
      Entertainment: 'Lazer',
    },
  }
  return labels[locale][category] ?? category
}
