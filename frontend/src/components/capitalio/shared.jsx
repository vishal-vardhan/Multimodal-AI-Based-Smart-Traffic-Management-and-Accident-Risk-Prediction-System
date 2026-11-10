// frontend/src/components/capitalio/shared.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { dashboardPeriods, defaultDashboardPeriod } from './data'
import { useDashboardNavigation } from './navigation'

export function useDashboardPeriod() {
  const { period } = useDashboardNavigation()

  return dashboardPeriods.some((periodOption) => periodOption.value === period)
    ? period
    : defaultDashboardPeriod
}

export function toneColor(tone) {
  if (tone === 'positive') {
    return 'var(--chart-4)'
  }

  if (tone === 'negative') {
    return 'var(--destructive)'
  }

  return 'var(--foreground)'
}

export function DashboardCard({ children, className }) {
  return (
    <article
      className={cn(
        'shadow-custom min-w-0 rounded-lg border border-border bg-card p-4 text-card-foreground transition-shadow hover:shadow-md',
        className
      )}
    >
      {children}
    </article>
  )
}

export function DetailHeader({ title, subtitle, children }) {
  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-medium leading-6 text-foreground">{title}</h2>
        {subtitle ? (
          <div className="mt-1 truncate text-xs leading-none text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      {children ? <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">{children}</div> : null}
    </div>
  )
}

export function DetailTag({ children, color = 'var(--chart-1)' }) {
  return (
    <span
      className="rounded-lg px-2.5 py-1 text-xs font-semibold leading-5"
      style={{
        color,
        backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
      }}
    >
      {children}
    </span>
  )
}

export function DashboardChartTooltip({
  active,
  label,
  payload,
  names,
  colors,
  valueFormatter,
}) {
  const items = payload?.filter((item) => item.value !== undefined && item.value !== null) ?? []

  if (!active || items.length === 0) {
    return null
  }

  const header = items[0]?.payload?.name ?? label

  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-custom">
      <div className="mb-2 text-xs font-medium text-muted-foreground">{header}</div>
      <div className="space-y-2">
        {items.map((item) => {
          const dataKey = String(item.dataKey ?? item.name ?? '')
          const color = colors?.[dataKey] ?? item.color ?? item.payload?.fill ?? 'var(--foreground)'
          const name = names?.[dataKey] ?? item.name ?? dataKey
          const value = valueFormatter ? valueFormatter(item.value ?? '', dataKey) : item.value

          return (
            <div key={dataKey} className="grid grid-cols-[1fr_auto] items-center gap-4 leading-none">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-3 shrink-0 rounded-xs" style={{ backgroundColor: color }} />
                <span className="truncate text-xs text-muted-foreground">{name}</span>
              </div>
              <span className="text-right font-medium text-xs text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChartMarker({ color, className }) {
  return (
    <span
      className={cn('size-3 shrink-0 rounded-xs', className)}
      style={{ backgroundColor: color }}
    />
  )
}
