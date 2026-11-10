// frontend/src/components/capitalio/dashboard-page.jsx
import * as React from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  dashboardBottomByPeriod,
  dashboardDetailByPeriod,
  dashboardSummaryCardsByPeriod,
} from './data'
import {
  DashboardAnalyticsUpIcon,
  Dashboard3dScaleIcon,
  DashboardArrowUpIcon,
  DashboardArrowUpRightIcon,
  DashboardMoneyBagIcon,
  DashboardPieChartIcon,
  DashboardReloadHorizontalIcon,
  DashboardShieldIcon,
  DashboardTaxesIcon,
} from './icons'
import { Button } from '@/components/ui/button'
import {
  ChartMarker,
  DashboardCard,
  DashboardChartTooltip,
  DetailHeader,
  DetailTag,
  toneColor,
  useDashboardPeriod,
} from './shared'
import { cn } from '@/lib/utils'

const cardIcons = {
  wallet: DashboardMoneyBagIcon,
  trend: DashboardAnalyticsUpIcon,
  pie: DashboardPieChartIcon,
  shield: DashboardShieldIcon,
}

const insightIcons = {
  scale: Dashboard3dScaleIcon,
  taxes: DashboardTaxesIcon,
  reload: DashboardReloadHorizontalIcon,
}

function createChartData(points, baseline) {
  return points.map((point) => ({
    name: point.label,
    x: point.x,
    value: baseline - point.y,
  }))
}

function getEveryOtherLabels(points) {
  return points
    .filter((_, index) => index % 2 === 0)
    .map((point) => point.label)
}

function IconBadge({ card }) {
  const Icon = cardIcons[card.icon] || DashboardMoneyBagIcon

  return (
    <div className="dashboard-icon-badge flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1.5 text-white shadow-none">
      <Icon className="size-5 shrink-0" />
    </div>
  )
}

function AxisLabels({ labels }) {
  return (
    <div className="grid grid-cols-3 text-xs leading-none text-muted-foreground pt-1">
      {labels.map((label, index) => (
        <span
          key={label}
          className={cn(index === 1 && 'text-center', index === 2 && 'text-right')}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

function LineChart({ card }) {
  const chartData = createChartData(card.chart.points, 58)
  const axisLabels = getEveryOtherLabels(card.chart.points)
  const xDomain = [chartData[0]?.x ?? 0, chartData[chartData.length - 1]?.x ?? 0]

  return (
    <div className="space-y-2">
      <div
        role="img"
        aria-label={`${card.title} trend`}
        className="h-16 w-full"
        style={{ color: card.color }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${card.id}-fill`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis dataKey="x" type="number" hide domain={xDomain} />
            <YAxis hide domain={[0, 58]} />
            <RechartsTooltip
              cursor={false}
              content={
                <DashboardChartTooltip
                  colors={{ value: card.color }}
                  names={{ value: card.title }}
                />
              }
            />
            <Area
              dataKey="value"
              dot={false}
              fill={`url(#${card.id}-fill)`}
              isAnimationActive
              stroke="currentColor"
              strokeWidth={2}
              type="monotone"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
      <AxisLabels labels={axisLabels} />
    </div>
  )
}

function AreaChart({ card }) {
  const chartData = createChartData(card.chart.points, 48)
  const axisLabels = getEveryOtherLabels(card.chart.points)
  const xDomain = [chartData[0]?.x ?? 0, chartData[chartData.length - 1]?.x ?? 0]

  return (
    <div className="space-y-2">
      <div
        role="img"
        aria-label={`${card.title} history`}
        className="h-12 w-full"
        style={{ color: card.color }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${card.id}-risk-fill`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.36" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis dataKey="x" type="number" hide domain={xDomain} />
            <YAxis hide domain={[0, 48]} />
            <RechartsTooltip
              cursor={false}
              content={
                <DashboardChartTooltip
                  colors={{ value: card.color }}
                  names={{ value: card.title }}
                />
              }
            />
            <Area
              dataKey="value"
              dot={false}
              fill={`url(#${card.id}-risk-fill)`}
              isAnimationActive
              stroke="currentColor"
              strokeWidth={2}
              type="monotone"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
      <AxisLabels labels={axisLabels} />
    </div>
  )
}

function ReturnChart({ card }) {
  const chartData = card.bars.map((bar, index) => ({
    name: bar.label,
    value: bar.value,
    isActive: index === card.bars.length - 1,
  }))
  const axisLabels = card.bars
    .filter((_, index) => index % 2 === 0)
    .map((bar) => bar.label)

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div
          className="h-2 overflow-hidden rounded-sm bg-muted"
        >
          <div
            key={card.target.progress}
            className="dashboard-progress-fill h-full rounded-sm bg-primary"
            style={{ width: `${card.target.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs leading-none">
          <span className="font-semibold text-foreground">{card.target.gained}</span>
          <span className="text-muted-foreground">{card.target.goal}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div role="img" aria-label={`${card.title} bars`} className="h-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 35]} />
              <RechartsTooltip
                cursor={false}
                content={
                  <DashboardChartTooltip
                    colors={{ value: 'var(--chart-1)' }}
                    names={{ value: card.title }}
                  />
                }
              />
              <Bar
                dataKey="value"
                fill="var(--chart-1)"
                isAnimationActive
                shape={(props) => (
                  <rect
                    x={props.x}
                    y={props.y}
                    width={props.width}
                    height={props.height}
                    rx="4"
                    fill={
                      props.payload?.isActive
                        ? 'var(--chart-1)'
                        : 'color-mix(in oklab, var(--chart-1) 35%, transparent)'
                    }
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <AxisLabels labels={axisLabels} />
      </div>
    </div>
  )
}

function AllocationChart({ card }) {
  const chartData = [
    Object.fromEntries(card.allocations.map((a) => [a.label, a.share])),
  ]
  const patternIds = card.allocations.map((a, index) =>
    `${card.id}-${index}-${a.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-pattern`
  )

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div role="img" aria-label={`${card.title} allocation`} className="h-5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" hide />
            <defs>
              {card.allocations.map((allocation, index) => (
                <pattern
                  key={allocation.label}
                  id={patternIds[index]}
                  width="20"
                  height="20"
                  patternTransform="rotate(45)"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="20" height="20" fill={allocation.color} />
                  <rect
                    width="8"
                    height="20"
                    fill={`color-mix(in oklab, ${allocation.color} 85%, black)`}
                  />
                </pattern>
              ))}
            </defs>
            {card.allocations.map((allocation, index) => (
              <Bar
                key={allocation.label}
                dataKey={allocation.label}
                fill={`url(#${patternIds[index]})`}
                isAnimationActive
                radius={index === 0 ? [4, 0, 0, 4] : index === card.allocations.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                stackId="allocation"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {card.allocations.map((allocation) => (
          <div key={allocation.label} className="flex items-center gap-2.5">
            <ChartMarker color={allocation.color} className="size-3" />
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {allocation.label}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {allocation.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryVisualization({ card }) {
  if (card.id === 'asset-classes') return <AllocationChart card={card} />
  if (card.id === 'portfolio-return') return <ReturnChart card={card} />
  if (card.id === 'risk-score') return <AreaChart card={card} />
  return <LineChart card={card} />
}

function SummaryCard({ card }) {
  return (
    <DashboardCard className="flex min-h-48 flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="truncate text-sm font-medium text-muted-foreground">{card.title}</h2>
        <IconBadge card={card} />
      </div>

      <div className="flex items-end gap-2">
        <div className="text-2.5xl font-bold leading-none tracking-tight text-foreground">
          {card.value}
          {'suffix' in card ? (
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              {card.suffix}
            </span>
          ) : null}
        </div>

        {'change' in card ? (
          <div className="flex min-w-0 items-center gap-1 pb-0.5 text-xs text-muted-foreground">
            {card.change.tone === 'positive' ? (
              <DashboardArrowUpIcon className="size-2.5 shrink-0 text-emerald-500" />
            ) : null}
            <span
              className={cn(
                'shrink-0 font-semibold',
                card.change.tone === 'positive' ? 'text-emerald-500' : 'text-foreground'
              )}
            >
              {card.change.value}
            </span>
            <span className="truncate">{card.change.label}</span>
          </div>
        ) : null}

        {'target' in card ? (
          <div className="min-w-0 pb-0.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{card.target.current}</span>{' '}
            <span>{card.target.label}</span>
          </div>
        ) : null}
      </div>

      <SummaryVisualization card={card} />
    </DashboardCard>
  )
}

function PerformanceChart({ performance }) {
  const chartData = performance.data.map((point) => ({
    name: point.label,
    portfolio: point.portfolio,
    benchmark: point.benchmark,
  }))
  const axisLabels = performance.data
    .filter((point) => point.axisLabel)
    .map((point) => point.axisLabel)

  return (
    <div className="flex min-h-80 min-w-0 flex-col gap-3">
      <div className="dashboard-dot-grid min-h-72 min-w-0 flex-1 overflow-hidden rounded-md border border-border/50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="portfolio-performance-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--chart-4)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis axisLine={false} dataKey="name" tick={false} tickLine={false} />
            <YAxis
              axisLine={false}
              dataKey="portfolio"
              domain={[100, 800]}
              ticks={[200, 400, 600, 800]}
              tick={{ fill: 'var(--muted-foreground)', fontSize: '0.75rem' }}
              tickFormatter={(value) => `${value} veh`}
              tickLine={false}
              width={54}
            />
            <RechartsTooltip
              cursor={false}
              content={
                <DashboardChartTooltip
                  colors={{
                    portfolio: 'var(--chart-4)',
                    benchmark: 'var(--chart-1)',
                  }}
                  names={{
                    portfolio: 'Live Flow (veh/hr)',
                    benchmark: 'Saturation Limit (K_sat)',
                  }}
                  valueFormatter={(value) => `${value} veh/hr`}
                />
              }
            />
            <Area
              dataKey="portfolio"
              dot={false}
              fill="url(#portfolio-performance-fill)"
              isAnimationActive
              stroke="var(--chart-4)"
              strokeWidth={3}
              type="monotone"
            />
            <Area
              dataKey="benchmark"
              dot={false}
              fill="transparent"
              isAnimationActive
              stroke="var(--chart-1)"
              strokeDasharray="6 6"
              strokeWidth={2}
              type="monotone"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid min-w-0 grid-cols-4 pl-12 text-center text-xs text-muted-foreground">
        {axisLabels.map((label) => (
          <span key={label} className="truncate">{label}</span>
        ))}
      </div>
    </div>
  )
}

function PerformancePanel({ performance }) {
  return (
    <DashboardCard className="flex flex-col gap-6 xl:col-span-2">
      <DetailHeader title={performance.title}>
        <DetailTag color="var(--chart-4)">{performance.trend}</DetailTag>
        <Button type="button" variant="secondary" size="sm" className="gap-1 text-xs">
          <span className="truncate">{performance.actionLabel}</span>
          <DashboardArrowUpRightIcon className="size-3.5 shrink-0" />
        </Button>
      </DetailHeader>

      <PerformanceChart performance={performance} />

      <div className="flex flex-wrap items-center justify-end gap-5 pt-1 border-t border-border/60">
        {performance.legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <ChartMarker color={item.color} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 pt-2">
        {performance.metrics.map((metric) => (
          <div key={metric.label} className="space-y-1.5 p-2 rounded-md bg-muted/40 border border-border/40">
            <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
            <div className="text-xl font-bold tracking-tight text-foreground">{metric.value}</div>
            <div
              className="flex items-center gap-1 text-xs font-semibold"
              style={{
                color: metric.tone === 'positive' ? 'var(--chart-4)' : 'var(--destructive)',
              }}
            >
              <DashboardArrowUpIcon className={cn('size-2.5', metric.tone === 'negative' && 'rotate-180')} />
              <span>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function AllocationDonut({ allocation }) {
  const chartData = allocation.items.map((item) => ({
    name: item.label,
    value: item.percent,
    fill: item.color,
  }))

  return (
    <div className="relative mx-auto aspect-square w-full max-w-56 my-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            cornerRadius={4}
            data={chartData}
            dataKey="value"
            endAngle={-270}
            innerRadius="68%"
            isAnimationActive
            outerRadius="88%"
            paddingAngle={6}
            startAngle={90}
            stroke="none"
          />
          <RechartsTooltip
            wrapperStyle={{ zIndex: 20 }}
            cursor={false}
            content={
              <DashboardChartTooltip
                valueFormatter={(value) => `${value}%`}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold leading-none text-foreground">{allocation.centerValue}</div>
        <div className="mt-1 text-xs font-medium text-muted-foreground">{allocation.centerLabel}</div>
      </div>
    </div>
  )
}

function AllocationPanel({ allocation }) {
  return (
    <DashboardCard className="flex flex-col gap-6">
      <DetailHeader title={allocation.title}>
        <DetailTag>{allocation.status}</DetailTag>
      </DetailHeader>

      <div className="flex flex-1 flex-col justify-between gap-6">
        <AllocationDonut allocation={allocation} />

        <div className="space-y-3.5 pt-2 border-t border-border/60">
          {allocation.items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex min-w-0 items-center gap-2.5">
                <ChartMarker color={item.color} className="size-3" />
                <span className="truncate font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-muted-foreground">{item.value}</span>
                <span className="min-w-8 text-right font-bold text-foreground">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}

function DashboardDetailSection({ detail }) {
  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">
      <PerformancePanel performance={detail.performance} />
      <AllocationPanel allocation={detail.allocation} />
    </div>
  )
}

function HoldingAsset({ row }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
        <img src={row.logo} alt="" className="size-full object-cover" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-xs font-bold leading-none text-foreground">{row.asset}</div>
        <div className="mt-1 truncate text-[11px] leading-none text-muted-foreground">{row.type}</div>
      </div>
    </div>
  )
}

function HoldingsTable({ holdings, onOpenCctv }) {
  return (
    <DashboardCard className="flex flex-col gap-4 lg:col-span-2">
      <DetailHeader title={holdings.title}>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenCctv}
          className="gap-1 text-xs"
        >
          <span className="truncate">{holdings.actionLabel}</span>
          <DashboardArrowUpRightIcon className="size-3.5 shrink-0" />
        </Button>
      </DetailHeader>

      <div className="hidden min-w-0 md:block overflow-x-auto">
        <div className="grid grid-cols-12 items-center rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1">{holdings.columns[0]}</div>
          <div className="col-span-4">{holdings.columns[1]}</div>
          <div className="col-span-2">{holdings.columns[2]}</div>
          <div className="col-span-2">{holdings.columns[3]}</div>
          <div className="col-span-2">{holdings.columns[4]}</div>
          <div className="col-span-1">{holdings.columns[5]}</div>
        </div>

        <div>
          {holdings.rows.map((row) => (
            <div
              key={row.no}
              className="grid grid-cols-12 items-center border-b border-border/60 px-4 py-3 last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">{row.no}</div>
              <div className="col-span-4 min-w-0">
                <HoldingAsset row={row} />
              </div>
              <div className="col-span-2 text-xs font-semibold text-foreground">{row.value}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{row.allocation}</div>
              <div className="col-span-2 text-xs font-medium" style={{ color: toneColor(row.tone) }}>
                {row.return}
              </div>
              <div className="col-span-1 text-xs font-semibold" style={{ color: toneColor(row.dayTone) }}>
                {row.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {holdings.rows.map((row) => (
          <div key={row.no} className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <HoldingAsset row={row} />
              <span className="text-xs font-mono text-muted-foreground">#{row.no}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
              <div>
                <span className="text-muted-foreground">Volume: </span>
                <span className="font-semibold text-foreground">{row.value}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Speed: </span>
                <span style={{ color: toneColor(row.tone) }}>{row.return}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function InsightIcon({ item }) {
  const Icon = insightIcons[item.icon] || Dashboard3dScaleIcon

  return (
    <div className="dashboard-icon-badge flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1.5 text-white">
      <Icon className="size-5 text-white" />
    </div>
  )
}

function SmartInsightsPanel({ insights, onAction }) {
  return (
    <DashboardCard className="flex flex-col gap-5">
      <DetailHeader title={insights.title}>
        <DetailTag color="var(--chart-4)">{insights.status}</DetailTag>
      </DetailHeader>

      <div className="flex flex-col gap-4">
        {insights.items.map((item, index) => (
          <div
            key={item.title}
            className={cn('flex gap-3', index > 0 && 'border-t border-border/70 pt-4')}
          >
            <InsightIcon item={item} />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight text-foreground">{item.title}</div>
              <div className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </div>
              <div className="mt-2.5 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onAction && onAction(item)}
                  className="gap-1 text-xs"
                >
                  <span className="truncate">{item.action}</span>
                  <DashboardArrowUpRightIcon className="size-3 shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function DashboardBottomSection({ bottom, onOpenCctv, onInsightAction }) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3">
      <HoldingsTable holdings={bottom.holdings} onOpenCctv={onOpenCctv} />
      <SmartInsightsPanel insights={bottom.insights} onAction={onInsightAction} />
    </div>
  )
}

export function DashboardPage({ onOpenCctv, onInsightAction }) {
  const period = useDashboardPeriod()
  const dashboardSummaryCards = dashboardSummaryCardsByPeriod[period] || dashboardSummaryCardsByPeriod['24h']
  const dashboardDetail = dashboardDetailByPeriod[period] || dashboardDetailByPeriod['24h']
  const dashboardBottom = dashboardBottomByPeriod[period] || dashboardBottomByPeriod['24h']

  return (
    <section className="flex min-h-full flex-col gap-4 p-4 pb-8 md:p-6 lg:p-8">
      {/* 4 Top Summary KPI Cards */}
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardSummaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </div>

      {/* Middle Detail: Performance Chart + Capacity Donut */}
      <DashboardDetailSection detail={dashboardDetail} />

      {/* Bottom: Monitored Corridors Table + Smart AI Insights */}
      <DashboardBottomSection
        bottom={dashboardBottom}
        onOpenCctv={onOpenCctv}
        onInsightAction={onInsightAction}
      />
    </section>
  )
}

export default DashboardPage
