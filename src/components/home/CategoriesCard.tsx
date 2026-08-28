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
      <Card title="Gastos por categoria">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="mt-4 h-16 w-full" />
      </Card>
    )
  }

  if (!categories) return null

  const items = categories.categories

  return (
    <Card
      title="Gastos por categoria"
      action={
        <span className="text-xs text-parchment/45">
          {items.length} {items.length === 1 ? 'categoria' : 'categorias'}
        </span>
      }
    >
      {items.length === 0 ? (
        <EmptyState message="Sem gastos registrados neste mes." />
      ) : (
        <>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-parchment/10">
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

          <ul className="mt-3 space-y-2">
            {items.slice(0, 5).map((item, index) => (
              <li key={item.category} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: categoryColor(item.category, index) }}
                />
                <span className="truncate text-parchment/75">
                  {categoryLabel(item.category)}
                </span>
                <span className="shrink-0 text-parchment/35">
                  {item.share_percentage.toFixed(0)}%
                </span>
                <span className="ml-auto shrink-0 font-medium text-parchment/90">
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
