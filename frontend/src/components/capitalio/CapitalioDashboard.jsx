// frontend/src/components/capitalio/CapitalioDashboard.jsx
//
// Capitalio-grade Traffic Management Command Center
// Built on the Watermelon UI / Capitalio Architecture:
//   • Sidebar with brand, collapsible groups, navigation links, and operator profile
//   • Topbar with live title, sync timestamp, currency/units, date range calendar, period dropdown, theme toggle, and export
//   • 4 Top Summary Cards (with live AreaChart, Risk AreaChart, Speed Progress Bar & Bars, Fleet Mix Patterned Bar)
//   • Detail Performance Chart with dual-series baseline comparison & 4 Key Metrics
//   • Capacity Saturation Donut with 4-corridor breakdown
//   • Monitored Corridors Table with status badges and speed metrics
//   • Predictive AI Insights with gradient icon badges and quick action triggers
//   • Real-time WebSocket synchronization with backend YOLOv8 telemetry

import * as React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
  DashboardNavigationProvider,
  useDashboardNavigation,
} from './navigation'
import { DashboardSidebar } from './sidebar'
import { DashboardTopbar } from './topbar'
import { DashboardPage } from './dashboard-page'
import { AnalyticsPage } from './analytics-page'
import useTrafficSocket from '../../hooks/useTrafficSocket'
import { fetchCameras, fetchIncidents } from '../../services/api'
import CameraFeedCanvas from '../CameraFeedCanvas'
import NotificationSettingsModal from '../NotificationSettingsModal'
import './dashboard.css'

function DashboardContent({ cameras, incidents, onSelectCam }) {
  const { pathname, navigate, theme } = useDashboardNavigation()
  const [selectedIncident, setSelectedIncident] = React.useState(null)

  // Direct route handlers
  if (pathname === '/analytics') {
    return <AnalyticsPage />
  }

  if (pathname === '/cameras') {
    return (
      <div className="p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Surveillance CCTV Feeds (1080p Local YOLOv8)</h2>
            <p className="text-xs text-muted-foreground">Real-time video inference and vehicle bounding boxes</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(cameras.length > 0 ? cameras.slice(0, 4) : [
            { id: 'cam-1', name: 'Cyber Towers Junction', location: 'Cyberabad Arterial', vehicle_count: 24 },
            { id: 'cam-2', name: 'Gachibowli Expressway', location: 'Flyover Inbound', vehicle_count: 18 },
            { id: 'cam-3', name: 'Jubilee Hills Checkpost', location: 'Arterial Node West', vehicle_count: 14 },
            { id: 'cam-4', name: 'Outer Ring Road (I-95)', location: 'Expressway South', vehicle_count: 9 },
          ]).map((cam) => (
            <div
              key={cam.id}
              onClick={() => onSelectCam && onSelectCam(cam)}
              className="rounded-lg border border-border bg-card p-3 shadow-custom cursor-pointer hover:border-primary transition-all"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-xs font-semibold">
                <span className="text-foreground">[{cam.id}] {cam.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">LIVE YOLOv8</span>
              </div>
              <div className="rounded-md overflow-hidden bg-black/90 aspect-video flex items-center justify-center">
                <CameraFeedCanvas camera={cam} isFocused={false} />
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 text-xs text-muted-foreground">
                <span>{cam.location}</span>
                <span className="font-semibold text-foreground">{cam.vehicle_count || 22} vehicles</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (pathname === '/incidents') {
    return (
      <div className="p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Active Incidents & Municipal Clearance</h2>
            <p className="text-xs text-muted-foreground">Automated accident detection & priority response queue</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-custom overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-semibold">
                <th className="p-3">Incident ID</th>
                <th className="p-3">Corridor Location</th>
                <th className="p-3">Type</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Elapsed Time</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(incidents.length > 0 ? incidents : [
                { id: 'inc-101', location: 'Gachibowli Flyover', type: 'Stalled Truck', severity: 'Critical', timeAgo: '6 mins ago' },
                { id: 'inc-102', location: 'Cyber Towers Node', type: 'Lane Obstruction', severity: 'High', timeAgo: '12 mins ago' },
                { id: 'inc-103', location: 'Jubilee Hills Arterial', type: 'High Density Bottleneck', severity: 'Moderate', timeAgo: '18 mins ago' },
              ]).map((inc) => (
                <tr key={inc.id} className="border-b border-border/60 hover:bg-muted/20">
                  <td className="p-3 font-mono font-bold text-primary">{inc.id}</td>
                  <td className="p-3 font-medium text-foreground">{inc.location}</td>
                  <td className="p-3">{inc.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      inc.severity === 'Critical'
                        ? 'bg-red-500/10 text-red-500'
                        : inc.severity === 'High'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{inc.timeAgo || 'Recent'}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Municipal Dispatch sent for ${inc.location}`)}
                      className="px-2.5 py-1 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Default: Overview Dashboard Page
  return (
    <DashboardPage
      onOpenCctv={() => navigate('/cameras')}
      onInsightAction={(item) => {
        if (item.action.includes('Signal')) navigate('/simulation')
        else if (item.action.includes('Risk')) navigate('/analytics')
        else navigate('/cameras')
      }}
    />
  )
}

function CapitalioDashboardInner({ onOpenSettings }) {
  const { theme } = useDashboardNavigation()
  const { socketData, socketConnected } = useTrafficSocket()
  const [cameras, setCameras] = React.useState([])
  const [incidents, setIncidents] = React.useState([])
  const [selectedCam, setSelectedCam] = React.useState(null)

  React.useEffect(() => {
    fetchCameras()
      .then((res) => {
        if (res && res.cameras && res.cameras.length > 0) setCameras(res.cameras)
      })
      .catch(() => {})

    fetchIncidents()
      .then((res) => {
        if (res && res.incidents && res.incidents.length > 0) setIncidents(res.incidents)
      })
      .catch(() => {})
  }, [])

  React.useEffect(() => {
    if (socketData) {
      if (socketData.active_cameras && socketData.active_cameras.length > 0) {
        setCameras(socketData.active_cameras)
      }
      if (socketData.active_incidents && socketData.active_incidents.length > 0) {
        setIncidents(socketData.active_incidents)
      }
    }
  }, [socketData])

  return (
    <SidebarProvider
      defaultOpen
      className={`capitalio-dashboard h-screen w-full overflow-hidden no-scrollbar ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        '--sidebar-width': '16rem',
      }}
    >
      <DashboardSidebar />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col shadow-custom">
          <DashboardTopbar onExport={null} />
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <DashboardContent
              cameras={cameras}
              incidents={incidents}
              onSelectCam={setSelectedCam}
            />
          </div>
        </div>
      </main>

      {/* Camera Inspection Modal */}
      {selectedCam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedCam(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg border border-border bg-card p-4 shadow-2xl text-card-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  [{selectedCam.id}] {selectedCam.name}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedCam.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCam(null)}
                className="px-2 py-1 rounded-md bg-muted text-xs font-bold hover:bg-muted/80 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="my-3 rounded-md overflow-hidden bg-black aspect-video flex items-center justify-center">
              <CameraFeedCanvas camera={selectedCam} isFocused={true} />
            </div>
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border">
              <span>Instantaneous Count: <strong className="text-foreground">{selectedCam.vehicle_count || 22} vehicles</strong></span>
              <span className="text-emerald-500 font-semibold">1080p Local Edge Vision</span>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}

export function CapitalioDashboard({ onOpenSettings }) {
  return (
    <DashboardNavigationProvider initialPath="/" initialTheme="light">
      <CapitalioDashboardInner onOpenSettings={onOpenSettings} />
    </DashboardNavigationProvider>
  )
}

export default CapitalioDashboard
