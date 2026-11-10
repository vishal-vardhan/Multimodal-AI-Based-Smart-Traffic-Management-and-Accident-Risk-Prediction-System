// frontend/src/components/capitalio/data.js
// Comprehensive Telemetry Datasets for Capitalio Traffic Intelligence

import {
  SidebarAnalyticsIcon,
  SidebarFixedIncomeIcon,
  SidebarFolderIcon,
  SidebarHomeMutedIcon,
  SidebarLinkIcon,
  SidebarNetWorthIcon,
  SidebarNotificationsIcon,
  SidebarRealEstateIcon,
  SidebarSettingsIcon,
} from './icons'

export const dashboardPeriods = [
  { label: '1 Hour', value: '1h' },
  { label: '6 Hours', value: '6h' },
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'All Time', value: 'all' },
]

export const defaultDashboardPeriod = '24h'

export const sidebarSections = {
  main: [
    {
      label: 'Command Overview',
      collapsible: false,
      items: [
        {
          name: 'Traffic Dashboard',
          href: '/',
          icon: SidebarHomeMutedIcon,
          pageTitle: 'Traffic Flow & Risk Command',
        },
        {
          name: 'Corridor Analytics',
          href: '/analytics',
          icon: SidebarAnalyticsIcon,
          pageTitle: 'Corridor Throughput Analytics',
        },
        {
          name: 'Live Flow Map',
          href: '/map',
          icon: SidebarNetWorthIcon,
          pageTitle: 'Geographic Traffic Map',
        },
      ],
    },
    {
      label: 'Operations & Video',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          name: 'CCTV Camera Feeds',
          href: '/cameras',
          icon: SidebarFolderIcon,
          pageTitle: 'Live Surveillance Feeds',
        },
        {
          name: 'Active Incidents',
          href: '/incidents',
          icon: SidebarLinkIcon,
          pageTitle: 'Incident Management & Clearance',
        },
        {
          name: 'AI Simulation Panel',
          href: '/simulation',
          icon: SidebarRealEstateIcon,
          pageTitle: 'Emergency Scenario Simulator',
        },
        {
          name: 'Computer Vision Lab',
          href: '/vision',
          icon: SidebarFixedIncomeIcon,
          pageTitle: 'Local YOLOv8 Vision Inference',
        },
      ],
    },
  ],
  footer: {
    items: [
      {
        name: 'Settings & Webhooks',
        href: '/settings',
        icon: SidebarSettingsIcon,
        pageTitle: 'Municipal Dispatch Settings',
      },
      {
        name: 'Alert History',
        href: '/notifications',
        icon: SidebarNotificationsIcon,
        pageTitle: 'Notification Dispatch Log',
      },
    ],
  },
}

const navigationItems = [
  ...sidebarSections.main.flatMap((section) => section.items),
  ...sidebarSections.footer.items,
]

export function getPageTitle(pathname) {
  const item = navigationItems.find((navItem) => navItem.href === pathname)
  return item?.pageTitle ?? item?.name ?? 'Traffic Flow & Risk Command'
}

export const currentUser = {
  name: 'Traffic Command Center',
  email: 'operator@smart-traffic.gov',
  initials: 'TC',
  role: 'Municipal Operator · Level 2',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
}

export const dashboardTopbarData = {
  lastUpdated: 'Live · 100% Local Inference · Free APIs',
  currency: 'veh/hr (Vehicles per Hour)',
  dateRange: 'Today · Diurnal Arterial Peak',
}

// ─── 4 TOP SUMMARY CARDS (BY PERIOD) ─────────────────────────────────────────
export const dashboardSummaryCardsByPeriod = {
  '1h': [
    {
      id: 'net-worth',
      title: 'Corridor Volume',
      value: '14,820',
      suffix: 'veh/hr',
      change: { value: '+4.2%', label: 'vs 1h ago', tone: 'positive' },
      icon: 'wallet',
      color: 'var(--chart-1)',
      chart: {
        points: [
          { label: '00m', x: 0, y: 32 },
          { label: '15m', x: 15, y: 28 },
          { label: '30m', x: 30, y: 19 },
          { label: '45m', x: 45, y: 14 },
          { label: '60m', x: 60, y: 8 },
        ],
      },
    },
    {
      id: 'risk-score',
      title: 'Accident Risk Baseline (R_t)',
      value: '38.4',
      suffix: '/ 100',
      change: { value: 'Tier: Moderate', label: 'R_t Heuristic', tone: 'neutral' },
      icon: 'shield',
      color: 'var(--chart-4)',
      chart: {
        points: [
          { label: '00m', x: 0, y: 22 },
          { label: '15m', x: 15, y: 24 },
          { label: '30m', x: 30, y: 21 },
          { label: '45m', x: 45, y: 18 },
          { label: '60m', x: 60, y: 15 },
        ],
      },
    },
    {
      id: 'portfolio-return',
      title: 'Average Flow Speed',
      value: '28.4',
      suffix: 'mph',
      target: {
        progress: 64,
        gained: '28.4 mph live',
        goal: '45 mph free flow limit',
        current: '64%',
        label: 'of corridor limit',
      },
      icon: 'trend',
      bars: [
        { label: '10m', value: 24 },
        { label: '20m', value: 26 },
        { label: '30m', value: 29 },
        { label: '40m', value: 27 },
        { label: '50m', value: 28 },
      ],
    },
    {
      id: 'asset-classes',
      title: 'Vehicle Fleet Distribution',
      value: '14.8K',
      suffix: 'detected',
      change: { value: '4 COCO Classes', label: 'YOLOv8', tone: 'neutral' },
      icon: 'pie',
      allocations: [
        { label: 'Cars', share: 58, value: '8,590 veh (58%)', color: 'var(--chart-1)' },
        { label: 'Trucks & Buses', share: 22, value: '3,260 veh (22%)', color: 'var(--chart-2)' },
        { label: 'Two-Wheelers', share: 20, value: '2,970 veh (20%)', color: 'var(--chart-3)' },
      ],
    },
  ],
  '24h': [
    {
      id: 'net-worth',
      title: 'Total Corridor Volume',
      value: '14,820',
      suffix: 'veh/hr',
      change: { value: '+4.2%', label: 'vs historical median', tone: 'positive' },
      icon: 'wallet',
      color: 'var(--chart-1)',
      chart: {
        points: [
          { label: '06 AM', x: 0, y: 38 },
          { label: '09 AM', x: 4, y: 12 },
          { label: '12 PM', x: 8, y: 26 },
          { label: '03 PM', x: 12, y: 20 },
          { label: '06 PM', x: 16, y: 9 },
          { label: '09 PM', x: 20, y: 30 },
          { label: 'Now', x: 24, y: 14 },
        ],
      },
    },
    {
      id: 'risk-score',
      title: 'Accident Risk Baseline (R_t)',
      value: '38.4',
      suffix: '/ 100',
      change: { value: 'Tier: Moderate', label: '0.55D + 0.20V + 0.15M + 0.10P', tone: 'neutral' },
      icon: 'shield',
      color: 'var(--chart-4)',
      chart: {
        points: [
          { label: '06 AM', x: 0, y: 24 },
          { label: '09 AM', x: 4, y: 15 },
          { label: '12 PM', x: 8, y: 20 },
          { label: '03 PM', x: 12, y: 18 },
          { label: '06 PM', x: 16, y: 12 },
          { label: '09 PM', x: 20, y: 25 },
          { label: 'Now', x: 24, y: 17 },
        ],
      },
    },
    {
      id: 'portfolio-return',
      title: 'Average Flow Speed',
      value: '28.4',
      suffix: 'mph',
      target: {
        progress: 64,
        gained: '28.4 mph live',
        goal: '45 mph free flow limit',
        current: '64%',
        label: 'of speed limit',
      },
      icon: 'trend',
      bars: [
        { label: 'Mon', value: 26 },
        { label: 'Tue', value: 29 },
        { label: 'Wed', value: 31 },
        { label: 'Thu', value: 27 },
        { label: 'Fri', value: 28 },
      ],
    },
    {
      id: 'asset-classes',
      title: 'Vehicle Fleet Distribution',
      value: '14.8K',
      suffix: 'classified',
      change: { value: '4 COCO Classes', label: 'Local YOLOv8', tone: 'neutral' },
      icon: 'pie',
      allocations: [
        { label: 'Cars', share: 58, value: '8,590 veh (58%)', color: 'var(--chart-1)' },
        { label: 'Commercial & Buses', share: 22, value: '3,260 veh (22%)', color: 'var(--chart-2)' },
        { label: 'Two-Wheelers', share: 20, value: '2,970 veh (20%)', color: 'var(--chart-3)' },
      ],
    },
  ],
  '7d': [
    {
      id: 'net-worth',
      title: 'Weekly Corridor Throughput',
      value: '104.2K',
      suffix: 'vehicles',
      change: { value: '+6.1%', label: 'vs last week', tone: 'positive' },
      icon: 'wallet',
      color: 'var(--chart-1)',
      chart: {
        points: [
          { label: 'Mon', x: 0, y: 32 },
          { label: 'Tue', x: 2, y: 25 },
          { label: 'Wed', x: 4, y: 18 },
          { label: 'Thu', x: 6, y: 16 },
          { label: 'Fri', x: 8, y: 11 },
          { label: 'Sat', x: 10, y: 22 },
          { label: 'Sun', x: 12, y: 28 },
        ],
      },
    },
    {
      id: 'risk-score',
      title: 'Weekly Accident Risk',
      value: '34.8',
      suffix: '/ 100',
      change: { value: 'Tier: Low/Med', label: '7-day composite', tone: 'neutral' },
      icon: 'shield',
      color: 'var(--chart-4)',
      chart: {
        points: [
          { label: 'Mon', x: 0, y: 20 },
          { label: 'Tue', x: 2, y: 18 },
          { label: 'Wed', x: 4, y: 15 },
          { label: 'Thu', x: 6, y: 17 },
          { label: 'Fri', x: 8, y: 13 },
          { label: 'Sat', x: 10, y: 19 },
          { label: 'Sun', x: 12, y: 21 },
        ],
      },
    },
    {
      id: 'portfolio-return',
      title: '7-Day Average Velocity',
      value: '30.2',
      suffix: 'mph',
      target: {
        progress: 68,
        gained: '30.2 mph median',
        goal: '45 mph free flow limit',
        current: '68%',
        label: 'of target',
      },
      icon: 'trend',
      bars: [
        { label: 'Mon', value: 28 },
        { label: 'Tue', value: 31 },
        { label: 'Wed', value: 33 },
        { label: 'Thu', value: 29 },
        { label: 'Fri', value: 30 },
      ],
    },
    {
      id: 'asset-classes',
      title: 'Weekly Fleet Proportions',
      value: '104K',
      suffix: 'vehicles',
      change: { value: 'Reliable Fleet Mix', label: '7-day rollup', tone: 'neutral' },
      icon: 'pie',
      allocations: [
        { label: 'Cars', share: 56, value: '58,240 veh (56%)', color: 'var(--chart-1)' },
        { label: 'Commercial & Buses', share: 23, value: '23,920 veh (23%)', color: 'var(--chart-2)' },
        { label: 'Two-Wheelers', share: 21, value: '21,840 veh (21%)', color: 'var(--chart-3)' },
      ],
    },
  ],
}

// Fallback mirror for other periods
dashboardSummaryCardsByPeriod['6h'] = dashboardSummaryCardsByPeriod['1h']
dashboardSummaryCardsByPeriod['30d'] = dashboardSummaryCardsByPeriod['7d']
dashboardSummaryCardsByPeriod['all'] = dashboardSummaryCardsByPeriod['7d']

// ─── MAIN DETAIL SECTION (PERFORMANCE CHART + ALLOCATION DONUT) ──────────────
export const dashboardDetailByPeriod = {
  '24h': {
    performance: {
      title: 'Corridor Flow Performance & Peak Capacity',
      trend: '+18.4% Peak Inbound Flow',
      actionLabel: 'Compare Historical Baselines',
      legend: [
        { label: 'Current Flow (veh/hr)', color: 'var(--chart-4)' },
        { label: 'Saturation Benchmark (K_sat)', color: 'var(--chart-1)' },
      ],
      data: [
        { label: '06:00', axisLabel: '06 AM', portfolio: 280, benchmark: 420 },
        { label: '07:30', portfolio: 390, benchmark: 440 },
        { label: '09:00', axisLabel: '09 AM (Morning Peak)', portfolio: 620, benchmark: 540 },
        { label: '11:00', portfolio: 480, benchmark: 490 },
        { label: '13:00', axisLabel: '01 PM', portfolio: 360, benchmark: 450 },
        { label: '15:30', portfolio: 440, benchmark: 470 },
        { label: '18:00', axisLabel: '06 PM (Evening Peak)', portfolio: 660, benchmark: 560 },
        { label: '20:00', portfolio: 410, benchmark: 460 },
        { label: '22:00', axisLabel: '10 PM', portfolio: 290, benchmark: 410 },
      ],
      metrics: [
        { label: 'Peak Flow Rate', value: '16,420 veh/hr', change: '+12.4%', tone: 'positive' },
        { label: 'Average Velocity', value: '28.4 mph', change: '-3.2%', tone: 'negative' },
        { label: 'Saturation Ratio', value: '0.68 LOS-C', change: '+0.05', tone: 'positive' },
        { label: 'Mean Incident Clearance', value: '8.2 min', change: '-2.4 min', tone: 'positive' },
      ],
    },
    allocation: {
      title: 'Corridor Capacity Allocation',
      status: 'LOS-C Stable',
      centerValue: '68%',
      centerLabel: 'K_sat Saturated',
      items: [
        { label: 'Outer Ring Road (I-95)', value: '4,210 veh', percent: 34, color: 'var(--chart-1)' },
        { label: 'Cyber Towers Arterial', value: '3,140 veh', percent: 26, color: 'var(--chart-2)' },
        { label: 'Gachibowli Expressway', value: '2,450 veh', percent: 22, color: 'var(--chart-3)' },
        { label: 'Jubilee Hills Checkpost', value: '1,380 veh', percent: 18, color: 'var(--chart-4)' },
      ],
    },
  },
}
dashboardDetailByPeriod['1h'] = dashboardDetailByPeriod['24h']
dashboardDetailByPeriod['6h'] = dashboardDetailByPeriod['24h']
dashboardDetailByPeriod['7d'] = dashboardDetailByPeriod['24h']
dashboardDetailByPeriod['30d'] = dashboardDetailByPeriod['24h']
dashboardDetailByPeriod['all'] = dashboardDetailByPeriod['24h']

// ─── BOTTOM SECTION (HOLDINGS TABLE + SMART AI INSIGHTS) ─────────────────────
export const dashboardBottomByPeriod = {
  '24h': {
    holdings: {
      title: 'Monitored Intersection Corridors',
      actionLabel: 'Open Multi-Camera Inspector',
      columns: ['#', 'Corridor / CCTV Asset', 'Current Volume', 'Capacity Share', 'Speed / Velocity', 'Status / 24H'],
      rows: [
        {
          no: '01',
          asset: 'Cyber Towers Junction',
          type: 'CCTV-01 · 1080p Local YOLOv8 Inference',
          logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80&auto=format&fit=crop&q=80',
          value: '4,210 veh/hr',
          allocation: '34%',
          return: '28 mph (+4.2%)',
          tone: 'positive',
          day: 'Normal Flow',
          dayTone: 'positive',
        },
        {
          no: '02',
          asset: 'Gachibowli Flyover',
          type: 'CCTV-02 · Flyover Inbound Telemetry',
          logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=80&auto=format&fit=crop&q=80',
          value: '3,140 veh/hr',
          allocation: '26%',
          return: '22 mph (-8.4%)',
          tone: 'negative',
          day: 'Congested',
          dayTone: 'negative',
        },
        {
          no: '03',
          asset: 'Jubilee Hills Checkpost',
          type: 'CCTV-03 · Arterial West Node',
          logo: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?w=80&auto=format&fit=crop&q=80',
          value: '2,450 veh/hr',
          allocation: '20%',
          return: '35 mph (+1.8%)',
          tone: 'positive',
          day: 'Free Flow',
          dayTone: 'positive',
        },
        {
          no: '04',
          asset: 'Outer Ring Road (I-95)',
          type: 'CCTV-04 · High-Speed Expressway South',
          logo: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=80&auto=format&fit=crop&q=80',
          value: '1,890 veh/hr',
          allocation: '15%',
          return: '44 mph (+0.5%)',
          tone: 'positive',
          day: 'Free Flow',
          dayTone: 'positive',
        },
        {
          no: '05',
          asset: 'Mehdipatnam Arterial',
          type: 'CCTV-05 · Urban Transit Corridor',
          logo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=80&auto=format&fit=crop&q=80',
          value: '730 veh/hr',
          allocation: '5%',
          return: '18 mph (-12.1%)',
          tone: 'negative',
          day: 'Slow Delay',
          dayTone: 'negative',
        },
      ],
    },
    insights: {
      title: 'Predictive Traffic AI Insights',
      status: '3 Active Alerts',
      items: [
        {
          icon: 'scale',
          title: 'Bottleneck Detected on Gachibowli Flyover',
          description:
            'Heavy vehicle density reached 74% capacity. Estimated corridor delay is currently +14 minutes.',
          action: 'Dispatch Signal Override',
        },
        {
          icon: 'taxes',
          title: 'Accident Risk Elevation Alert',
          description:
            'Precipitation and sudden deceleration detected at Cyber Towers. Deterministic R_t elevated to 46.2.',
          action: 'Review Risk Telemetry',
        },
        {
          icon: 'reload',
          title: 'Green Wave Timing Optimization',
          description:
            'Inbound morning wave volume +18% above median. Synchronize Phase 2 signals across Corridor B.',
          action: 'Apply Timing Plan',
        },
      ],
    },
  },
}
dashboardBottomByPeriod['1h'] = dashboardBottomByPeriod['24h']
dashboardBottomByPeriod['6h'] = dashboardBottomByPeriod['24h']
dashboardBottomByPeriod['7d'] = dashboardBottomByPeriod['24h']
dashboardBottomByPeriod['30d'] = dashboardBottomByPeriod['24h']
dashboardBottomByPeriod['all'] = dashboardBottomByPeriod['24h']

// ─── ANALYTICS PAGE DATA ─────────────────────────────────────────────────────
export const analyticsDataByPeriod = {
  '24h': {
    performance: {
      title: 'Corridor Throughput vs Benchmark Baseline',
      subtitle: 'Comparative 24-Hour Diurnal Flow (veh/hr)',
      trend: '+14.2% Net Inflow',
      compareLabel: 'Export Raw Rollups',
      data: [
        { label: '00:00', axisLabel: '00:00', portfolio: 120, benchmark: 140, balanced: 130 },
        { label: '03:00', portfolio: 90, benchmark: 110, balanced: 100 },
        { label: '06:00', axisLabel: '06:00', portfolio: 280, benchmark: 220, balanced: 250 },
        { label: '09:00', axisLabel: '09:00 (Peak)', portfolio: 640, benchmark: 520, balanced: 580 },
        { label: '12:00', axisLabel: '12:00', portfolio: 380, benchmark: 390, balanced: 385 },
        { label: '15:00', portfolio: 460, benchmark: 420, balanced: 440 },
        { label: '18:00', axisLabel: '18:00 (Peak)', portfolio: 680, benchmark: 540, balanced: 610 },
        { label: '21:00', axisLabel: '21:00', portfolio: 340, benchmark: 310, balanced: 325 },
      ],
    },
    metrics: [
      { label: 'Diurnal Flow Efficiency', value: '94.2%', change: '+3.4%', tone: 'positive' },
      { label: 'Free-Flow Travel Ratio', value: '1.24 TTI', change: '-0.08', tone: 'positive' },
      { label: 'Average Signal Delay', value: '42 sec', change: '-8 sec', tone: 'positive' },
      { label: 'Bottleneck Incidents', value: '4 Cleared', change: '100% on-time', tone: 'positive' },
    ],
    returns: {
      series: [
        { dataKey: 'portfolio', label: 'Live Corridor Volume', color: 'var(--chart-4)' },
        { dataKey: 'benchmark', label: 'Free Flow Capacity', color: 'var(--chart-1)' },
        { dataKey: 'balanced', label: '7-Day Median', color: 'var(--chart-2)' },
      ],
    },
  },
}
analyticsDataByPeriod['1h'] = analyticsDataByPeriod['24h']
analyticsDataByPeriod['6h'] = analyticsDataByPeriod['24h']
analyticsDataByPeriod['7d'] = analyticsDataByPeriod['24h']
analyticsDataByPeriod['30d'] = analyticsDataByPeriod['24h']
analyticsDataByPeriod['all'] = analyticsDataByPeriod['24h']
