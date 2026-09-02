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
      AutoDebit: 'Debito automatico',
      CreditCard: 'Cartao de credito',
      Food: 'Alimentacao',
      Housing: 'Moradia',
      Transport: 'Transporte',
      Health: 'Saude',
      Shopping: 'Compras',
      Income: 'Rendas',
      Transfer: 'Transferencias',
      Other: 'Outros',
      Education: 'Educacao',
      Entertainment: 'Lazer',
    },
  }
  return labels[locale][category] ?? category
}
