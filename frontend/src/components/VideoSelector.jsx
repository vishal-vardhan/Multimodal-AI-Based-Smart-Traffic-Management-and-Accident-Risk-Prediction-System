// src/components/VideoSelector.jsx
//
// 100% Dynamic Location & Video Selector — White/Light Theme
// Queries the backend for .mp4 video files in `videos/`, supports upload.

import React, { useState, useEffect, useRef } from 'react'
import { fetchSampleVideos } from '../services/api.js'

export default function VideoSelector({
  selectedVideoId = null,
  onSelectVideo = () => {},
  onUploadVideo = null,
  isProcessing = false,
  statusMessage = null
}) {
  const [videoList, setVideoList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMetadataTags, setShowMetadataTags] = useState(false)
  const [tagLocation, setTagLocation] = useState('')
  const [tagTimestamp, setTagTimestamp] = useState('')
  const fileInputRef = useRef(null)

  const reloadVideos = () => {
    fetchSampleVideos()
      .then(res => {
        if (res && res.videos && Array.isArray(res.videos)) {
          setVideoList(res.videos)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetchSampleVideos()
      .then(res => {
        if (!mounted) return
        if (res && res.videos && Array.isArray(res.videos)) {
          setVideoList(res.videos)
        }
      })
      .catch(() => {
        if (!mounted) return
        setVideoList([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  const currentVideo = videoList.find(v =>
    v.id === selectedVideoId ||
    v.filename === selectedVideoId ||
    v.zone_id === selectedVideoId ||
    v.key === selectedVideoId
  ) || videoList[0]

  const handleDropdownChange = (e) => {
    const nextId = e.target.value
    if (nextId) onSelectVideo(nextId)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onUploadVideo) {
      const metadata = {
        location_id: tagLocation || undefined,
        recorded_at: tagTimestamp || undefined
      }
      onUploadVideo(file, metadata, reloadVideos)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const feedCount = videoList.length

  return (
    <section
      style={{
        margin: '0.75rem 1.25rem 0.5rem',
        padding: '1rem 1.35rem',
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
      aria-label="Dynamic Intersection and Camera Feed Selector"
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Left: Dynamic Folder Scan Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem'
            }}
          >
            📹
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Traffic Video Ingestion (Mode A)
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.12rem 0.55rem',
                  borderRadius: '999px',
                  background: feedCount > 0 ? '#d1fae5' : '#fef3c7',
                  color: feedCount > 0 ? '#065f46' : '#78350f',
                  border: feedCount > 0 ? '1px solid #6ee7b7' : '1px solid #fcd34d',
                  fontWeight: 600
                }}
              >
                ● {feedCount} Feeds Online in <code style={{ fontFamily: 'monospace', fontSize: '0.68rem' }}>videos/</code>
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              {currentVideo ? (
                <>
                  Inspecting:&nbsp;
                  <strong style={{ color: '#334155' }}>{currentVideo.shortName || currentVideo.name}</strong>
                  &nbsp;• File:&nbsp;
                  <code style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentVideo.filename}</code>
                  &nbsp;• YOLOv8 Vehicle Count:&nbsp;
                  <strong style={{ color: '#059669' }}>{currentVideo.vehicleCount} veh</strong>
                </>
              ) : (
                'Scanning local videos/ directory for .mp4 files...'
              )}
            </p>
          </div>
        </div>

        {/* Right: Dynamic Dropdown, Trigger Button & Upload Video Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor="intersection-selector" style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 600 }}>
            Feed:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="intersection-selector"
              value={currentVideo?.id || currentVideo?.filename || ''}
              onChange={handleDropdownChange}
              disabled={isProcessing || videoList.length === 0}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.5rem 2.4rem 0.5rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                minWidth: '220px',
                fontFamily: 'inherit'
              }}
            >
              {videoList.map(v => (
                <option key={v.id || v.filename} value={v.id || v.filename} style={{ background: '#ffffff', color: '#0f172a' }}>
                  {v.name}
                </option>
              ))}
            </select>
            <span
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#2563eb',
                fontSize: '0.75rem'
              }}
            >
              ▼
            </span>
          </div>

          <button
            onClick={() => currentVideo && onSelectVideo(currentVideo.id || currentVideo.filename)}
            disabled={isProcessing || !currentVideo}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            <span>⚡</span> Trigger YOLOv8
          </button>

          {/* Toggle Metadata Tagging Box */}
          <button
            type="button"
            onClick={() => setShowMetadataTags(!showMetadataTags)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: showMetadataTags ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              background: showMetadataTags ? '#eff6ff' : '#f8fafc',
              color: showMetadataTags ? '#2563eb' : '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            title="Optionally tag video with location or timestamp before upload"
          >
            ⚙️ Metadata Tagging {showMetadataTags ? '▲' : '▼'}
          </button>

          {/* Upload Video Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".mp4,.avi,.mov,.mkv"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ddd6fe',
              background: '#f5f3ff',
              color: '#7c3aed',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            title="Upload any .mp4 traffic video for genuine YOLOv8 vehicle detection"
          >
            <span>📤</span> Upload .mp4
          </button>
        </div>
      </div>

      {/* Optional Metadata Tagging Drawer */}
      {showMetadataTags && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#334155', fontWeight: 600 }}>Known Location (Optional):</span>
            <select
              value={tagLocation}
              onChange={(e) => setTagLocation(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="">Unknown / Unspecified Road (Default)</option>
              <option value="hitec-city">HITEC City (Cyber Towers Junction)</option>
              <option value="gachibowli">Gachibowli Junction (ORR Interlink)</option>
              <option value="madhapur">Madhapur (Mindspace Circle)</option>
              <option value="kukatpally">Kukatpally (Y-Junction / NH 65)</option>
              <option value="punjagutta">Punjagutta (Central Flyover Hub)</option>
              <option value="secunderabad">Secunderabad (Station Corridor)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#334155', fontWeight: 600 }}>Recording Timestamp (Optional):</span>
            <input
              type="datetime-local"
              value={tagTimestamp}
              onChange={(e) => setTagTimestamp(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
            * Note: If location or time is unknown, the video is evaluated strictly in isolation without attaching unrelated weather or crash data.
          </span>
        </div>
      )}

      {/* Processing Status Feedback Banner */}
      {statusMessage && (
        <div
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            fontSize: '0.8rem',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{isProcessing ? '⏳' : '✓'}</span>
          <span>{statusMessage}</span>
        </div>
      )}
    </section>
  )
}
