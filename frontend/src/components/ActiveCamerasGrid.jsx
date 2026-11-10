// src/components/ActiveCamerasGrid.jsx
//
// 100% Dynamic Active Cameras Grid Component — White/Light Theme
// Renders camera feed cards dynamically scanned from codebase `videos/` folder.

import React from 'react'

export default function ActiveCamerasGrid({
  cameras = [],
  focusedCamId = null,
  onSelectCamera = () => {},
  isProcessing = false
}) {
  return (
    <section className="card active-cameras-section" style={{ padding: '1.25rem' }} aria-label="Active Cameras from Local Video Ingestion">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            📹
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Active Cameras
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  background: cameras.length > 0 ? '#d1fae5' : '#fef3c7',
                  color: cameras.length > 0 ? '#065f46' : '#78350f',
                  border: cameras.length > 0 ? '1px solid #6ee7b7' : '1px solid #fcd34d',
                  fontWeight: 600
                }}
              >
                {cameras.length} / {cameras.length} Feeds Online
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0' }}>
              Dynamically mapped from codebase <code style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', borderRadius: '4px', padding: '0.06rem 0.3rem', fontFamily: 'monospace' }}>videos/</code> folder • Local-First Ingestion
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
          Auto-Scanned from <code style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', borderRadius: '4px', padding: '0.06rem 0.3rem' }}>videos/</code>
        </span>
      </div>

      {/* Grid of Active Camera Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {cameras.map((cam) => {
          const isFocused = focusedCamId === cam.id || (!focusedCamId && cam.number === 1)
          const riskScore = cam.risk?.score || 0
          const riskColor = riskScore >= 67 ? '#dc2626' : riskScore >= 35 ? '#d97706' : '#059669'
          const riskBg    = riskScore >= 67 ? '#fee2e2' : riskScore >= 35 ? '#fef3c7' : '#d1fae5'
          const riskBorder= riskScore >= 67 ? '#fca5a5' : riskScore >= 35 ? '#fcd34d' : '#6ee7b7'

          return (
            <div
              key={cam.id}
              onClick={() => onSelectCamera(cam)}
              style={{
                padding: '1rem 1.15rem',
                borderRadius: '12px',
                background: isFocused ? '#eff6ff' : '#ffffff',
                border: isFocused
                  ? '1.5px solid #2563eb'
                  : '1px solid #e2e8f0',
                boxShadow: isFocused
                  ? '0 0 0 3px rgba(37,99,235,0.12), 0 4px 12px rgba(0,0,0,0.06)'
                  : '0 1px 3px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Highlight ribbon for focused card */}
              {isFocused && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)'
                  }}
                />
              )}

              {/* Card Header: Camera ID, Name, Live badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        fontFamily: 'monospace'
                      }}
                    >
                      {cam.id}
                    </span>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {cam.shortName || cam.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                    📍 {cam.location}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      background: '#d1fae5',
                      color: '#065f46',
                      border: '1px solid #6ee7b7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span style={{ fontSize: '0.5rem', color: '#059669' }}>●</span> LIVE
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {cam.filesize_mb} MB
                  </span>
                </div>
              </div>

              {/* File Origin Tag */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  background: '#f8fafc',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'monospace'
                }}
              >
                <span>📁</span>
                <span style={{ color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  videos/{cam.filename}
                </span>
              </div>

              {/* Real Metrics: Vehicle Count & Rt Risk */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '0.65rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                    YOLOv8 Vehicles (Vt)
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {cam.vehicle_count}
                    <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#64748b', marginLeft: '0.25rem' }}>
                      veh
                    </span>
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                    Deterministic Risk (Rt)
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      background: riskBg,
                      color: riskColor,
                      border: `1px solid ${riskBorder}`,
                      display: 'inline-block'
                    }}
                  >
                    Rt: {cam.risk?.score} ({cam.risk?.category || 'Normal'})
                  </span>
                </div>
              </div>

              {/* Fleet Breakdown Mini-Chips */}
              {cam.breakdown && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                    fontSize: '0.7rem',
                    color: '#334155',
                    marginBottom: '0.75rem'
                  }}
                >
                  <span style={{ padding: '0.15rem 0.4rem', background: '#eff6ff', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                    🚗 {cam.breakdown.car || 0}
                  </span>
                  <span style={{ padding: '0.15rem 0.4rem', background: '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                    🏍️ {cam.breakdown.motorcycle || 0}
                  </span>
                  <span style={{ padding: '0.15rem 0.4rem', background: '#fffbeb', borderRadius: '4px', border: '1px solid #fde68a' }}>
                    🚌 {cam.breakdown.bus || 0}
                  </span>
                  <span style={{ padding: '0.15rem 0.4rem', background: '#f5f3ff', borderRadius: '4px', border: '1px solid #ddd6fe' }}>
                    🚛 {cam.breakdown.truck || 0}
                  </span>
                </div>
              )}

              {/* Focus Button */}
              <button
                type="button"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '7px',
                  border: isFocused ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  background: isFocused ? '#eff6ff' : '#f8fafc',
                  color: isFocused ? '#2563eb' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.18s ease',
                  fontFamily: 'inherit'
                }}
              >
                {isFocused ? '✓ Active Feed Inspected' : '⚡ Focus & Inspect Telemetry'}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
