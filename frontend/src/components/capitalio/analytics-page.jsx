// frontend/src/components/capitalio/analytics-page.jsx
import * as React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { analyticsDataByPeriod } from './data'
import { Button } from '@/components/ui/button'
import {
  ChartMarker,
  DashboardCard,
  DashboardChartTooltip,
  DetailHeader,
  DetailTag,
  useDashboardPeriod,
} from './shared'

function axisLabelsFrom(data) {
  return data
    .filter((point) => point.axisLabel)
    .map((point) => point.axisLabel)
}

function AnalyticsLegend({ series }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-5 pt-2 border-t border-border/60">
      {series.map((item) => (
        <div key={item.label} className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
          <ChartMarker color={item.color} className="size-2.5" />
          <span className="truncate">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function AnalyticsPerformanceChart({ performance, returns }) {
  const chartData = performance.data.map((point) => ({
    label: point.label,
    portfolio: point.portfolio,
    benchmark: point.benchmark,
    balanced: point.balanced,
  }))
  const axisLabels = axisLabelsFrom(performance.data)

  return (
    <DashboardCard className="flex flex-col gap-5">
      <DetailHeader title={performance.title} subtitle={performance.subtitle}>
        <DetailTag color="var(--chart-4)">{performance.trend}</DetailTag>
        <Button type="button" variant="secondary" size="sm" className="text-xs">
          {performance.compareLabel}
        </Button>
      </DetailHeader>

      <div className="dashboard-dot-grid h-80 min-w-0 overflow-hidden rounded-md border border-border/50 p-2 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="analytics-performance-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--chart-4)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis axisLine={false} dataKey="label" tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: '0.75rem' }} />
            <YAxis
              axisLine={false}
              domain={[50, 750]}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: '0.75rem' }}
              tickFormatter={(v) => `${v} v`}
              width={50}
            />
            <RechartsTooltip
              content={
                <DashboardChartTooltip
                  colors={{
                    portfolio: 'var(--chart-4)',
                    benchmark: 'var(--chart-1)',
                    balanced: 'var(--chart-2)',
                  }}
                  names={{
                    portfolio: 'Live Corridor Volume',
                    benchmark: 'Free Flow Capacity',
                    balanced: '7-Day Median Flow',
                  }}
                  valueFormatter={(v) => `${v} veh/hr`}
                />
              }
            />
            <Area
              dataKey="portfolio"
              type="monotone"
              stroke="var(--chart-4)"
              fill="url(#analytics-performance-fill)"
              strokeWidth={3}
              isAnimationActive
            />
            <Area
              dataKey="benchmark"
              type="monotone"
              stroke="var(--chart-1)"
              fill="transparent"
              strokeWidth={2}
              strokeDasharray="5 5"
              isAnimationActive
            />
            <Area
              dataKey="balanced"
              type="monotone"
              stroke="var(--chart-2)"
              fill="transparent"
              strokeWidth={2}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <AnalyticsLegend series={returns.series} />
    </DashboardCard>
  )
}

function AnalyticsMetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <DashboardCard key={m.label} className="space-y-1.5 p-4">
          <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
          <div className="text-2xl font-bold tracking-tight text-foreground">{m.value}</div>
          <div className="text-xs font-semibold text-emerald-500">{m.change}</div>
        </DashboardCard>
      ))}
    </div>
  )
}

export function AnalyticsPage() {
  const period = useDashboardPeriod()
  const data = analyticsDataByPeriod[period] || analyticsDataByPeriod['24h']

  return (
    <section className="flex min-h-full flex-col gap-5 p-4 pb-8 md:p-6 lg:p-8">
      <AnalyticsMetricsGrid metrics={data.metrics} />
      <AnalyticsPerformanceChart
        performance={data.performance}
        returns={data.returns}
      />
    </section>
  )
}

export default AnalyticsPage
