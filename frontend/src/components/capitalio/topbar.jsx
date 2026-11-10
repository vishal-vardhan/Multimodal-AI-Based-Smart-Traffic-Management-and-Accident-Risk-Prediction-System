// frontend/src/components/capitalio/topbar.jsx
import * as React from 'react'
import {
  TopbarCalendarIcon,
  TopbarChevronIcon,
  TopbarExportIcon,
} from './icons'
import { useDashboardNavigation } from './navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  dashboardPeriods,
  dashboardTopbarData,
  defaultDashboardPeriod,
  getPageTitle,
} from './data'

export function DashboardTopbar({ onExport }) {
  const { pathname, period, setPeriod, theme, toggleTheme } = useDashboardNavigation()
  const title = getPageTitle(pathname)

  const selectedPeriod =
    dashboardPeriods.find((p) => p.value === period) ??
    dashboardPeriods.find((p) => p.value === defaultDashboardPeriod) ??
    dashboardPeriods[0]

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      const csv = 'timestamp,corridor,volume_veh_hr,speed_mph,risk_rt\n' +
        new Date().toISOString() + ',Cyber Towers,4210,28,38.4\n' +
        new Date().toISOString() + ',Gachibowli,3140,22,54.2\n'
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `traffic-telemetry-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <header className="flex shrink-0 flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-8 border-b border-border/80 bg-background/95 backdrop-blur-xs">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="size-8.5 shrink-0 md:hidden" />

        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 md:flex-col md:items-start md:justify-center md:gap-1.5">
          <h1 className="truncate text-lg md:text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <div className="flex shrink-0 items-center gap-2 text-xs md:text-sm text-foreground">
            <span className="whitespace-nowrap flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground hidden md:inline">Last update:</span>
              <span className="font-medium text-foreground">{dashboardTopbarData.lastUpdated}</span>
            </span>
            <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40 hidden sm:inline-block" />
            <span className="shrink-0 font-medium text-muted-foreground hidden sm:inline-block">
              <span className="font-normal text-muted-foreground">Units: </span>
              <span className="text-foreground">{dashboardTopbarData.currency}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Date Range Calendar Pill */}
        <div className="hidden lg:flex h-9 items-center gap-2 rounded-l-md border border-r-0 border-border bg-background px-3 text-xs text-muted-foreground shadow-xs">
          <TopbarCalendarIcon className="size-4 shrink-0 text-primary" />
          <span className="truncate font-medium text-foreground">{dashboardTopbarData.dateRange}</span>
        </div>

        {/* Period Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-9 shrink-0 gap-2 bg-card px-3 text-xs font-medium text-foreground hover:bg-accent"
            >
              <span className="text-muted-foreground">Range:</span>
              <span className="font-semibold text-primary">{selectedPeriod.label}</span>
              <TopbarChevronIcon className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {dashboardPeriods.map((periodOption) => (
              <DropdownMenuItem
                key={periodOption.value}
                onClick={() => setPeriod(periodOption.value)}
                className={period === periodOption.value ? 'bg-primary/10 text-primary font-bold' : ''}
              >
                {periodOption.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 1-Click Theme Toggle Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={toggleTheme}
          className="h-9 gap-1.5 text-xs font-semibold px-3"
          title="Toggle Light / Dark mode"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Button>

        {/* Export Telemetry Button */}
        <Button
          onClick={handleExport}
          className="h-9 gap-1.5 text-xs font-semibold px-3.5 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <span>Export</span>
          <TopbarExportIcon className="size-3" />
        </Button>
      </div>
    </header>
  )
}

export default DashboardTopbar
