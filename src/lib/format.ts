const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const compactDay = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

/** API decimals travel as strings; only widen to float at the render boundary. */
export function toNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatMoney(value: string | number): string {
  return currency.format(typeof value === 'string' ? toNumber(value) : value)
}

/** Parsed as local time: `new Date('2026-08-01')` would shift a day backwards. */
export function parseApiDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function formatDay(value: string): string {
  return compactDay.format(parseApiDate(value)).replace('.', '')
}

export function formatReferenceMonth(value: string): string {
  const [year, month] = value.split('-').map(Number)
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
    new Date(year, (month ?? 1) - 1, 1),
  )
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} de ${year}`
}
