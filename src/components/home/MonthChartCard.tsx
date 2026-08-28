import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { formatDay, formatMoney, toNumber } from '@/lib/format'
import type { MonthlySeriesResponse } from '@/types/api'

interface Props {
  series?: MonthlySeriesResponse
  loading: boolean
}

export function MonthChartCard({ series, loading }: Props) {
  if (loading) {
    return (
      <Card title="Gastos do mes">
        <Skeleton className="h-32 w-full" />
      </Card>
    )
  }

  if (!series) return null

  const data = series.points.map((point) => ({
    day: formatDay(point.date),
    value: toNumber(point.cumulative_expenses),
  }))

  const spentNothing = data.every((point) => point.value === 0)

  return (
    <Card
      title="Gastos do mes"
      action={
        <span className="flex items-center gap-1 text-xs font-semibold text-gold">
          <TrendingUp size={13} />
          {formatMoney(series.total_expenses)}
        </span>
      }
    >
      {spentNothing ? (
        <EmptyState message="O tesouro permanece intocado neste mes." />
      ) : (
        // A fixed height keeps Recharts from collapsing inside the 412px shell.
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#e8dcc060', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#e8dcc060', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(value: number) => `${Math.round(value / 100) / 10}k`}
              />
              <Tooltip
                cursor={{ stroke: '#FFD70040' }}
                contentStyle={{
                  background: '#161618',
                  border: '1px solid #8B691455',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#e8dcc099' }}
                formatter={(value) => [formatMoney(Number(value)), 'Acumulado']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFD700"
                strokeWidth={2}
                fill="url(#goldFade)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
