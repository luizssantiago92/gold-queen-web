import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/i18n/useI18n'
import { formatDay } from '@/lib/localeFormat'
import { formatMoney, toNumber } from '@/lib/format'
import type { MonthlySeriesResponse } from '@/types/api'

interface Props {
  series?: MonthlySeriesResponse
  loading: boolean
  onOpenDay: (date: string) => void
}

export function MonthChartCard({ series, loading, onOpenDay }: Props) {
  const { locale, t } = useI18n()

  if (loading) {
    return (
      <Card title={t('monthExpensesTitle')}>
        <Skeleton className="h-36 w-full rounded-2xl" />
      </Card>
    )
  }

  if (!series) return null

  const data = series.points.map((point) => ({
    date: point.date,
    day: formatDay(point.date, locale),
    value: toNumber(point.cumulative_expenses),
  }))

  const spentNothing = data.every((point) => point.value === 0)

  return (
    <Card
      title={t('monthExpensesTitle')}
      showChevron
      action={
        <span className="flex items-center gap-1 text-sm font-bold text-gold">
          <TrendingUp size={14} />
          {formatMoney(series.total_expenses, locale)}
        </span>
      }
    >
      {spentNothing ? (
        <EmptyState message={t('treasuryUntouched')} />
      ) : (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
              onClick={(state) => {
                const date = state?.activePayload?.[0]?.payload?.date
                if (typeof date === 'string') onOpenDay(date)
              }}
            >
              <defs>
                <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity={0.65} />
                  <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#f5f0e650', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: '#FFD70030' }}
                contentStyle={{
                  background: '#111113',
                  border: '1px solid rgb(255 255 255 / 0.08)',
                  borderRadius: 14,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#f5f0e680' }}
                formatter={(value) => [formatMoney(Number(value), locale), '']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFD700"
                strokeWidth={2.5}
                fill="url(#goldFade)"
                dot={false}
                activeDot={{ r: 4, fill: '#FFD700', stroke: '#000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {!spentNothing && (
        <ul className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {series.points.map((point) => {
            const day = formatDay(point.date, locale)
            return (
              <li key={point.date} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenDay(point.date)}
                  aria-label={t('figureOpenDay', { day })}
                  className="min-h-11 rounded-full border border-gold/25 px-3 text-xs text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                >
                  {day}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
