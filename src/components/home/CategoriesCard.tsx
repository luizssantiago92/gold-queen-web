import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/format'
import { categoryColor, categoryLabel } from '@/lib/palette'
import type { CategoriesResponse } from '@/types/api'

interface Props {
  categories?: CategoriesResponse
  loading: boolean
}

export function CategoriesCard({ categories, loading }: Props) {
  if (loading) {
    return (
      <Card title="Gastos por categoria" subtitle="este mes" showChevron>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="mt-4 h-20 w-full" />
      </Card>
    )
  }

  if (!categories) return null

  const items = categories.categories

  return (
    <Card
      title="Gastos por categoria"
      subtitle="este mes"
      showChevron
      action={
        <span className="text-[11px] text-muted">
          {items.length} {items.length === 1 ? 'categoria' : 'categorias'}
        </span>
      }
    >
      {items.length === 0 ? (
        <EmptyState message="Sem gastos registrados neste mes." />
      ) : (
        <>
          <p className="mb-3 text-2xl font-bold tracking-tight text-parchment">
            {formatMoney(categories.total_expenses)}
          </p>

          <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/8">
            {items.map((item, index) => (
              <div
                key={item.category}
                style={{
                  width: `${item.share_percentage}%`,
                  backgroundColor: categoryColor(item.category, index),
                }}
                title={`${categoryLabel(item.category)}: ${item.share_percentage}%`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2.5">
            {items.slice(0, 5).map((item, index) => (
              <li key={item.category} className="flex items-center gap-2.5 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: categoryColor(item.category, index) }}
                />
                <span className="min-w-0 flex-1 truncate text-parchment/85">
                  {categoryLabel(item.category)}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {item.share_percentage.toFixed(0)}%
                </span>
                <span className="shrink-0 font-semibold text-parchment">
                  {formatMoney(item.total)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
