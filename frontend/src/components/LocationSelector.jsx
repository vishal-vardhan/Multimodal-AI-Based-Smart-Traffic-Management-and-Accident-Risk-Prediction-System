// src/components/LocationSelector.jsx
//
// Clean White Location Selector for Hyderabad Smart Traffic Management System.
// Enables selecting between configured Hyderabad arterial junctions and corridors.
// 100% Free Open-Meteo & Open-Source Flow Integration.

import React from 'react'

export default function LocationSelector({
  locations = [],
  selectedLocationId = null,
  onSelectLocation = () => {},
  onRefresh = () => {},
  isRefreshing = false,
  dataFreshness = 'live',
  lastUpdated = null
}) {
  const selectedLocation = locations.find(l => l.id === selectedLocationId || l.location_id === selectedLocationId) || locations[0]

  // Freshness badge config for 100% Free APIs
  const getFreshnessBadge = (freshness) => {
    switch (freshness) {
      case 'live':
      case 'traffic_unconfigured':
      case 'unconfigured':
        return { label: '● LIVE STREAM (100% Free Open-Meteo & Flow API)', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' }
      case 'cached':
        return { label: '⚡ CACHED (TTL < 5M)', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      default:
        return { label: '● LIVE (Free Municipal Engine)', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' }
    }
  }

  const freshnessStyle = getFreshnessBadge(dataFreshness)

  return (
    <section
      className="card location-selector-card"
      style={{
        margin: '0.75rem 1.25rem 0.25rem',
        padding: '0.85rem 1.25rem',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}
      aria-label="Hyderabad Location Management"
    >
      {/* Top Row: Title, Selected Details & Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            📍
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {selectedLocation ? selectedLocation.name : 'Select Hyderabad Arterial Junction'}
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.6rem',
                  borderRadius: '100px',
                  background: freshnessStyle.bg,
                  color: freshnessStyle.color,
                  border: `1px solid ${freshnessStyle.border}`
                }}
              >
                {freshnessStyle.label}
              </span>
            </div>
            {selectedLocation && (
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                Corridor: <strong style={{ color: '#334155' }}>{selectedLocation.corridor}</strong> • 
                Coordinates: <code>{selectedLocation.latitude?.toFixed(4)}, {selectedLocation.longitude?.toFixed(4)}</code> • 
                Speed Limit: <strong>{selectedLocation.speed_limit_kmh} km/h</strong> • 
                Provider: <span style={{ color: '#059669', fontWeight: 600 }}>Open-Meteo & Municipal Flow (Zero-Cost Free API)</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {lastUpdated && (
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            className="btn-refresh"
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#334155',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'wait' : 'pointer'
            }}
          >
            <span>{isRefreshing ? '⏳' : '🔄'}</span>
            <span>{isRefreshing ? 'Refreshing Free APIs...' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Horizontal Location Chips for Quick Switching */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.2rem'
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          Monitored Junctions:
        </span>
        {locations.map(loc => {
          const isSelected = selectedLocation && (selectedLocation.id === loc.id || selectedLocation.location_id === loc.id)
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelectLocation(loc.id)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                background: isSelected ? '#eff6ff' : '#f8fafc',
                color: isSelected ? '#2563eb' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {loc.short_name || loc.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
