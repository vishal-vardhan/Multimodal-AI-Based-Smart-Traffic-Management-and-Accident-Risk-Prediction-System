// frontend/src/components/bento/TrafficBento.jsx
//
// State-of-the-Art Bento Grid Traffic Intelligence Dashboard
// Plain DOM + SVG rendering inside a React container with zero external charting dependencies.
// Recreates the exact 12-column Bento Grid architecture:
//   • Vehicle Flow Stream river with animated 7x5 LED dot-matrix counter (DotNumber)
//   • Roadway Saturation (K_sat) 56-tick half-gauge with Level of Service (LOS)
//   • 4 KPI Tiles:
//       1. Accident Risk Baseline (R_t)
//       2. Corridor Flow Speed with 36 Runway Ticks
//       3. Active Bottlenecks & Priority Junctions
//       4. Adaptive Signal Clearance with 40 Animated Tick Marks
//   • Diurnal Inflow vs Outflow Mirrored Waves with Calipers
//   • Priority Corridors Watch with 7-Day Speed Sparklines
//   • Weekday Volume Capsule Columns (Mon-Fri)
//   • 1-Click Toggle: Clean White / Light Theme & Obsidian Dark Mode

import * as React from 'react'

/* ------------------------------------------------------------------ */
/*  CSS Styling (Clean Light & Obsidian Dark Modes)                   */
/* ------------------------------------------------------------------ */
const BENTO_CSS = `
.t-bento {
  font-family: Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  width: 100%;
  margin: 0 auto;
  transition: background-color .3s ease, color .3s ease;
}
.t-bento * { box-sizing: border-box; }
.t-bento .fpb-c { border-radius: 28px; position: relative; padding: 22px 24px; transition: background .3s, border-color .3s; }
.t-bento .vbrow { display: flex; justify-content: flex-end; margin-top: 16px; }

/* Theme Variables: Obsidian Dark */
.t-bento.theme-dark {
  --bg-page: #000000;
  --bg-card: #0b0b0e;
  --acc: #E8FF1F;
  --t1: #ffffff;
  --t2: rgba(255,255,255,.62);
  --t3: rgba(255,255,255,.38);
  --hair: rgba(255,255,255,.14);
  --ease: cubic-bezier(.32,.72,0,1);
  --cars: #ffffff;
  --heavy: #A9B2FF;
  --bikes: #FFB37A;
  --glass: rgba(255,255,255,.06);
  --glass-border: rgba(255,255,255,.12);
  --tip-bg: rgba(14,14,16,.94);
  --tip-border: rgba(255,255,255,.15);
  --tip-txt: #ffffff;
  --top-seg-bg: rgba(255,255,255,.08);
  --top-seg-border: rgba(255,255,255,.14);
  --card-border: rgba(255,255,255,.08);
}
.t-bento.theme-dark .fpb-c { background: #000000; color: #ffffff; }

/* Theme Variables: Clean White / Light */
.t-bento.theme-light {
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --acc: #0284c7;
  --t1: #0f172a;
  --t2: #475569;
  --t3: #94a3b8;
  --hair: rgba(15,23,42,.12);
  --ease: cubic-bezier(.32,.72,0,1);
  --cars: #0284c7;
  --heavy: #6366f1;
  --bikes: #f97316;
  --glass: rgba(255,255,255,.94);
  --glass-border: #e2e8f0;
  --tip-bg: rgba(15,23,42,.95);
  --tip-border: rgba(255,255,255,.2);
  --tip-txt: #ffffff;
  --top-seg-bg: #e2e8f0;
  --top-seg-border: #cbd5e1;
  --card-border: #e2e8f0;
}
.t-bento.theme-light .fpb-c { background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

/* Header Top Bar */
.t-bento .top {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 48px;
  margin-bottom: 18px;
}
.t-bento .top h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -.03em;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.t-bento .top h1 span {
  font-weight: 500;
  color: var(--t3);
  font-size: 14px;
  letter-spacing: -.01em;
}
.t-bento .seg {
  display: flex;
  padding: 3px;
  gap: 2px;
  border-radius: 14px;
  background: var(--top-seg-bg);
  border: 1px solid var(--top-seg-border);
}
.t-bento .seg button {
  border: 0;
  height: 28px;
  min-width: 44px;
  padding: 0 12px;
  border-radius: 11px;
  background: transparent;
  color: var(--t2);
  font: 600 12.5px Geist, ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: background .25s, color .25s, box-shadow .2s;
}
.t-bento .seg button[aria-pressed="true"] {
  background: var(--bg-card);
  color: var(--t1);
  box-shadow: 0 1px 3px rgba(0,0,0,.15);
}
.t-bento .seg button:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 2px;
}
.t-bento .ctrls { display: flex; gap: 10px; align-items: center; }
.t-bento .theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 14px;
  background: var(--top-seg-bg);
  border: 1px solid var(--top-seg-border);
  color: var(--t1);
  font: 600 12.5px Geist, sans-serif;
  cursor: pointer;
  transition: all .2s ease;
}
.t-bento .theme-toggle-btn:hover {
  background: var(--bg-card);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.t-bento .ava {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px rgba(255,255,255,.18);
  flex: 0 0 auto;
}

/* 12-Column Responsive Bento Grid */
.t-bento .grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
}
.t-bento .h1 { height: 380px; }
.t-bento .h2 { height: 172px; }
.t-bento .h3 { height: 340px; }
.t-bento #nw { grid-column: span 8; }
.t-bento #alloc { grid-column: span 4; }
.t-bento .kpi { grid-column: span 3; }
.t-bento #flow { grid-column: span 5; }
.t-bento #crypto { grid-column: span 4; }
.t-bento #stocks { grid-column: span 3; }

@media (max-width: 1199px) {
  .t-bento #nw { grid-column: span 12; }
  .t-bento #alloc { grid-column: span 6; grid-row: span 2; height: auto; }
  .t-bento .kpi { grid-column: span 6; }
  .t-bento #flow { grid-column: span 12; }
  .t-bento #crypto, .t-bento #stocks { grid-column: span 6; }
}
@media (max-width: 767px) {
  .t-bento .fpb-c { padding: 16px 14px; }
  .t-bento .top { flex-wrap: wrap; height: auto; gap: 12px; }
  .t-bento .top h1 { flex: 1; font-size: 22px; }
  .t-bento .top h1 span { display: block; margin: 4px 0 0; }
  .t-bento .ctrls { order: 3; flex: 1 0 100%; justify-content: space-between; }
  .t-bento .ava { order: 2; }
  .t-bento #nw { height: 420px; }
  .t-bento #nw .legend { flex: 1 0 100%; order: 3; margin-top: 8px; }
  .t-bento #nw .hrow { flex-wrap: wrap; }
  .t-bento #nw .nrow { flex-wrap: wrap; gap: 6px 16px; }
  .t-bento #alloc { grid-column: span 12; grid-row: auto; height: 380px; }
  .t-bento .kpi { grid-column: span 6; }
  .t-bento #crypto, .t-bento #stocks { grid-column: span 12; }
  .t-bento .grid { gap: 12px; }
}
@media (max-width: 520px) {
  .t-bento .kpi { grid-column: span 12; }
}

/* Bento Card Foundations */
.t-bento .card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(14px) scale(.985);
  transition: opacity .7s ease, transform .9s var(--ease), box-shadow .3s ease;
  border: 1px solid var(--card-border);
}
.t-bento .in .card { opacity: 1; transform: none; }
.t-bento .card .rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(255,255,255,.06);
  pointer-events: none;
  z-index: 9;
}
.t-bento .g { position: absolute; inset: 0; }
.t-bento .core {
  position: absolute;
  left: 10%; right: 10%;
  top: 16%; bottom: -6%;
  border-radius: 90px;
  filter: blur(60px);
}
.t-bento .glass {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
}
.t-bento .glass .rim { display: none; }
.t-bento .solid {
  background: var(--acc);
  color: #0b0b0c;
}
.t-bento .solid .rim { box-shadow: inset 0 1px 0 rgba(255,255,255,.5); }
.t-bento .in-c { position: absolute; inset: 0; padding: 22px 24px; z-index: 2; }
.t-bento .ttl { font-size: 18px; font-weight: 600; letter-spacing: -.02em; display: flex; align-items: center; gap: 8px; }
.t-bento .cap { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--t2); }
.t-bento .solid .cap { color: rgba(0,0,0,.65); }
.t-bento .big { font-size: 40px; font-weight: 200; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.t-bento .delta { font: 600 12.5px "Geist Mono", monospace; color: var(--acc); letter-spacing: -.02em; }
.t-bento.theme-light .delta { color: #0284c7; }
.t-bento .muted { font-size: 12.5px; color: var(--t3); font-weight: 500; letter-spacing: -.01em; }
.t-bento .chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 11px;
  background: rgba(0,0,0,.75);
  color: #fff;
  font: 600 11px "Geist Mono", monospace;
  letter-spacing: -.02em;
}
.t-bento.theme-light .chip {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}
.t-bento .legend { display: flex; gap: 16px; font-size: 12px; font-weight: 500; color: var(--t2); }
.t-bento .legend span { display: inline-flex; align-items: center; gap: 6px; }
.t-bento .legend i { width: 8px; height: 8px; border-radius: 50%; }
.t-bento .row { display: flex; align-items: center; gap: 12px; }
.t-bento .mono { font-family: "Geist Mono", monospace; font-variant-numeric: tabular-nums; }
.t-bento .dots circle { transition: opacity .26s, transform .26s; transform-box: fill-box; transform-origin: center; }

/* Floating Interactive Tooltip */
.t-bento .tip {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  background: var(--tip-bg);
  color: var(--tip-txt);
  border: 1px solid var(--tip-border);
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 12px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 30px -10px rgba(0,0,0,.5);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .15s, transform .15s;
  white-space: nowrap;
  min-width: 160px;
}
.t-bento .tip.on { opacity: 1; transform: none; }
.t-bento .tip .t { color: #94a3b8; margin-bottom: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
.t-bento .tip .r { display: flex; justify-content: space-between; gap: 14px; align-items: center; line-height: 20px; }
.t-bento .tip .r span { display: inline-flex; align-items: center; gap: 6px; color: #cbd5e1; }
.t-bento .tip i { width: 7px; height: 7px; border-radius: 50%; }
.t-bento .tip b { font: 600 12px "Geist Mono", monospace; }

@media (prefers-reduced-motion: reduce) {
  .t-bento .card { transition: none; }
}
`

/* ------------------------------------------------------------------ */
/*  Font Loader for Geist & Geist Mono                                */
/* ------------------------------------------------------------------ */
function useGeistFonts() {
  React.useEffect(() => {
    const id = 'geist-fonts-bento'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@200;300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(link)
  }, [])
}

/* ------------------------------------------------------------------ */
/*  Default Traffic Telemetry Fixture Generator                       */
/* ------------------------------------------------------------------ */
function generateDefaultTrafficData() {
  // 36 continuous observation points (simulating 36 hours / months of corridor flow)
  const history = Array.from({ length: 36 }, (_, i) => {
    const t = i / 35
    const d = new Date(Date.now() - (35 - i) * 3600 * 1000)
    const noise = (Math.sin(i * 12.9898 + 156.466) * 43758.5453) % 1
    return {
      date: d.toISOString(),
      cars: Math.round(6200 + t * 2400 + Math.sin(i * 0.9) * 450),
      heavy: Math.round(1800 + t * 950 + Math.sin(i * 0.55) * 280 + noise * 120),
      bikes: Math.round(Math.max(1200, 2400 + t * 1800 + Math.sin(i * 0.8 + 1) * 600 + Math.cos(i * 0.33) * 300)),
    }
  })

  return {
    history,
    bottlenecks: [
      { name: 'Cyber Towers Junction', delay: '8 min', vehicles: 2410, level: 'High' },
      { name: 'Gachibowli Expressway', delay: '14 min', vehicles: 1890, level: 'Critical' },
      { name: 'Jubilee Hills Checkpost', delay: '5 min', vehicles: 1120, level: 'Moderate' },
    ],
    goals: [
      { name: 'Inbound Corridor Clearance', progress: 0.78, target: 1200, unit: 'veh/hr' },
      { name: 'Transit Bus Wave Priority', progress: 0.92, target: 450, unit: 'buses/hr' },
    ],
    flow: {
      hours: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      inflow: [
        [2.8, 5.4, 3.8, 4.6, 6.2, 3.6],
        [2.2, 4.4, 3.1, 3.9, 5.1, 2.9],
        [1.8, 3.6, 2.6, 3.1, 4.2, 2.3]
      ],
      outflow: [
        [1.4, 2.6, 3.2, 4.2, 5.8, 4.1],
        [1.1, 2.1, 2.7, 3.4, 4.8, 3.3],
        [0.9, 1.6, 2.1, 2.7, 3.9, 2.6]
      ],
    },
    corridors: [
      {
        name: 'Cyber Towers Node',
        symbol: 'CYBER',
        share: 0.52,
        speed: 28,
        change: '+4.2%',
        ohlc: [
          [24, 26, 22, 25],
          [25, 27, 24, 26],
          [26, 28, 25, 27],
          [27, 29, 25, 28],
          [28, 31, 27, 30],
          [30, 32, 28, 29],
          [29, 31, 27, 28]
        ]
      },
      {
        name: 'Gachibowli Flyover',
        symbol: 'GACHI',
        share: 0.32,
        speed: 22,
        change: '-2.1%',
        ohlc: [
          [26, 27, 22, 24],
          [24, 25, 21, 23],
          [23, 24, 20, 22],
          [22, 23, 19, 21],
          [21, 23, 20, 22],
          [22, 24, 21, 23],
          [23, 24, 21, 22]
        ]
      },
      {
        name: 'Jubilee Hills Node',
        symbol: 'JUBIL',
        share: 0.16,
        speed: 34,
        change: '+6.8%',
        ohlc: [
          [30, 32, 29, 31],
          [31, 33, 30, 32],
          [32, 34, 30, 33],
          [33, 35, 31, 34],
          [34, 36, 32, 35],
          [35, 37, 33, 36],
          [36, 38, 34, 34]
        ]
      },
    ],
    throughput: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      values: [4.2, 5.1, 5.8, 6.2, 4.9]
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Mount Engine: Plain DOM + SVG Interactive Chart Subsystem         */
/* ------------------------------------------------------------------ */
function mountTrafficBento(root, data, themeMode = 'light') {
  let alive = true
  const frames = new Set()
  const RAF = (cb) => {
    if (!alive) return 0
    const id = requestAnimationFrame((t) => {
      frames.delete(id)
      if (alive) cb(t)
    })
    frames.add(id)
    return id
  }
  const $id = (id) => root.querySelector('#' + id)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isDark = themeMode === 'dark'

  const ACC = isDark ? '#E8FF1F' : '#0284c7'
  const T2 = isDark ? 'rgba(255,255,255,.62)' : '#475569'
  const T3 = isDark ? 'rgba(255,255,255,.38)' : '#94a3b8'
  const HAIR = isDark ? 'rgba(255,255,255,.14)' : 'rgba(15,23,42,.12)'

  // Color mapping for vehicle classes
  const COL = {
    cars: isDark ? '#FFFFFF' : '#0284c7',
    heavy: isDark ? '#A9B2FF' : '#6366f1',
    bikes: isDark ? '#FFB37A' : '#f97316'
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3)
  const NS = 'http://www.w3.org/2000/svg'
  const el = (t, a = {}, p) => {
    const e = document.createElementNS(NS, t)
    for (const k in a) e.setAttribute(k, a[k])
    p && p.appendChild(e)
    return e
  }

  /* ---------- State ---------- */
  const S = { period: '24H', unit: 'Vehicles' }

  const formatVolume = (v, { compact = false } = {}) => {
    if (compact && Math.abs(v) >= 1000) {
      return (v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1) + 'K'
    }
    return Math.round(v).toLocaleString('en-US')
  }

  /* ---------- History Series Data ---------- */
  const H = data.history.map((h) => ({
    d: new Date(h.date),
    cars: h.cars,
    heavy: h.heavy,
    bikes: h.bikes
  }))

  function series() {
    if (S.period === 'All' || S.period === '7D') {
      return H.map((h) => ({ ...h, l: h.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))
    }
    if (S.period === '24H') {
      return H.slice(-24).map((h) => ({
        ...h,
        l: h.d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      }))
    }
    // 6H or 1H: interpolated subset
    const n = S.period === '6H' ? 12 : 6
    const src = H.slice(-6)
    const out = []
    for (let k = 0; k < n; k++) {
      const f = (k / (n - 1)) * (src.length - 1)
      const i = Math.min(src.length - 2, Math.floor(f))
      const t = f - i
      const a = src[i]
      const b = src[i + 1]
      const w = Math.sin(k * 1.7) * 0.015
      const d = new Date(H[H.length - 1].d.getTime() - (n - 1 - k) * 300 * 1000)
      out.push({
        d,
        l: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        cars: Math.round((a.cars + (b.cars - a.cars) * t) * (1 + w * 0.3)),
        heavy: Math.round((a.heavy + (b.heavy - a.heavy) * t) * (1 + w)),
        bikes: Math.round((a.bikes + (b.bikes - a.bikes) * t) * (1 + w * 1.5))
      })
    }
    return out
  }

  const total = (p) => p.cars + p.heavy + p.bikes

  /* ---------- Gradients ---------- */
  function bg({ top, base, bottom, core }) {
    return `<div class="g" style="background:linear-gradient(180deg,${top} 0%,${base} 36%,${base} 74%,${bottom} 100%)"></div><div class="core" style="background:${core}"></div>`
  }

  const GR_DARK = {
    blue: { top: '#b9a6ff', base: '#2e43ff', bottom: '#6d7dff', core: '#05082a' },
    graph: { top: '#9a9aa8', base: '#3a3a44', bottom: '#55555f', core: '#060608' },
    pink: { top: '#ffb3d6', base: '#ff2a85', bottom: '#ff6aa8', core: '#3a031c' },
    copper: { top: '#f6bf96', base: '#c2683a', bottom: '#dc8a5c', core: '#1d0b05' },
    green: { top: '#a6e8c8', base: '#36956f', bottom: '#58b58c', core: '#061d15' },
    lime: { top: '#f4ffb8', base: '#a3c400', bottom: '#c9e03a', core: '#121700' }
  }

  const GR_LIGHT = {
    blue: { top: '#dbeafe', base: '#93c5fd', bottom: '#60a5fa', core: '#bfdbfe' },
    graph: { top: '#f1f5f9', base: '#e2e8f0', bottom: '#cbd5e1', core: '#e2e8f0' },
    pink: { top: '#ffe4e6', base: '#fda4af', bottom: '#fb7185', core: '#fecdd3' },
    copper: { top: '#ffedd5', base: '#fdba74', bottom: '#fb923c', core: '#fed7aa' },
    green: { top: '#dcfce7', base: '#86efac', bottom: '#4ade80', core: '#bbf7d0' },
    lime: { top: '#ecfccb', base: '#bef264', bottom: '#a3e635', core: '#d9f99d' }
  }

  const GR = isDark ? GR_DARK : GR_LIGHT

  /* ---------- Geometry & Spline Engine ---------- */
  function smoothPath(P, move = true) {
    let d = (move ? 'M' : 'L') + `${P[0][0]},${P[0][1]}`
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i]
      const p1 = P[i]
      const p2 = P[i + 1]
      const p3 = P[i + 2] || p2
      const k = 0.17
      d += `C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${p2[0] - (p3[0] - p1[0]) * k},${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`
    }
    return d
  }

  const P2 = (r, a) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)]

  /* ---------- Dot-Matrix LED Digit Counter (DotNumber) ---------- */
  const F = {
    '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
    '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
    '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
    '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
    '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
    '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
    '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
    '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
    '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
    ',': ['0', '0', '0', '0', '0', '1', '1'],
    '.': ['0', '0', '0', '0', '0', '0', '1'],
    ' ': ['00', '00', '00', '00', '00', '00', '00']
  }

  function DotNumber(host, pitch) {
    const cols = 48
    const svg = el('svg', { class: 'dots', 'aria-hidden': 'true' }, host)
    const cells = []
    const dotFill = isDark ? '#ffffff' : '#0f172a'
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 7; r++) {
        const ci = el(
          'circle',
          { cx: c * pitch + pitch / 2, cy: r * pitch + pitch / 2, r: pitch * 0.36, fill: dotFill, opacity: 0 },
          svg
        )
        ci.style.transitionDelay = c * 7 + 'ms'
        cells.push([c, r, ci])
      }
    }
    const set = (t) => {
      const on = new Set()
      let x = 0
      for (const ch of t) {
        const g = F[ch] || F[' ']
        const w = g[0].length
        for (let r = 0; r < 7; r++) {
          for (let k = 0; k < w; k++) {
            if (g[r][k] === '1') on.add((x + k) * 8 + r)
          }
        }
        x += w + 1
      }
      const used = Math.max(1, x - 1)
      for (const [c, r, ci] of cells) {
        const v = on.has(c * 8 + r)
        ci.setAttribute('opacity', v ? 1 : c < used ? (isDark ? 0.08 : 0.06) : 0)
        ci.style.transform = v ? 'none' : 'scale(.55)'
      }
      svg.setAttribute('width', used * pitch)
      svg.setAttribute('height', 7 * pitch)
      svg.setAttribute('viewBox', `0 0 ${used * pitch} ${7 * pitch}`)
    }
    let raf = 0, cur = 0
    return {
      count(to, dur = 900) {
        cancelAnimationFrame(raf)
        const from = cur, t0 = performance.now()
        let last = ''
        const f = (now) => {
          const t = reduce ? 1 : Math.min(1, (now - t0) / dur)
          cur = from + (to - from) * ease(t)
          const s = Math.round(cur).toLocaleString('en-US')
          if (s !== last) {
            set(s)
            last = s
          }
          if (t < 1) raf = RAF(f)
        }
        raf = RAF(f)
      }
    }
  }

  function tween(node, to, fmt, dur = 900) {
    const from = +node.dataset.v || 0, t0 = performance.now()
    node.dataset.v = to
    ;(function f(now) {
      const t = reduce ? 1 : Math.min(1, (now - t0) / dur)
      node.textContent = fmt(from + (to - from) * ease(t))
      if (t < 1) RAF(f)
    })(t0)
  }

  /* ---------- Floating Tooltip ---------- */
  const tip = $id('bento-tip')
  function showTip(x, y, title, rows) {
    if (!tip) return
    tip.innerHTML =
      `<div class="t">${title}</div>` +
      rows.map(([k, v, c]) => `<div class="r"><span>${c ? `<i style="background:${c}"></i>` : ''}${k}</span><b>${v}</b></div>`).join('')
    tip.classList.add('on')
    const r = tip.getBoundingClientRect()
    let L = x + 16, T = y - r.height - 14
    if (L + r.width > window.innerWidth - 8) L = x - r.width - 16
    if (T < 8) T = y + 16
    tip.style.left = L + 'px'
    tip.style.top = T + 'px'
  }
  const hideTip = () => tip && tip.classList.remove('on')

  /* ================================================================= */
  /*  Card 1: Vehicle Flow Stream (#nw)                                */
  /* ================================================================= */
  const nw = $id('nw')
  nw.innerHTML = `
    ${bg(GR.blue)}
    <div class="in-c">
      <div class="row hrow" style="justify-content:space-between">
        <div class="ttl">Corridor Flow Stream</div>
        <div class="legend">
          <span><i style="background:${COL.cars}"></i>Cars</span>
          <span><i style="background:${COL.heavy}"></i>Trucks / Buses</span>
          <span><i style="background:${COL.bikes}"></i>Two-Wheelers</span>
        </div>
      </div>
      <div class="row nrow" style="margin-top:16px;align-items:flex-end;gap:16px">
        <div class="nwn"></div>
        <div style="padding-bottom:6px">
          <div class="delta nwd"></div>
          <div class="muted nwc" style="margin-top:3px"></div>
        </div>
      </div>
      <svg class="nws" style="position:absolute;left:0;right:0;bottom:0;display:block" aria-hidden="true"></svg>
    </div>
    <div class="rim"></div>
  `

  const nwNum = DotNumber(nw.querySelector('.nwn'), window.innerWidth < 520 ? 5.4 : 7)
  let nwGrow = 0, nwRaf = 0, nwData = null

  function drawNW() {
    const svg = nw.querySelector('.nws')
    const W = nw.clientWidth
    const Hh = 226, top = 26, bot = 26, mid = top + (Hh - top - bot) / 2
    svg.setAttribute('width', W)
    svg.setAttribute('height', Hh)
    svg.setAttribute('viewBox', `0 0 ${W} ${Hh}`)

    const D = nwData, n = D.length
    const tots = D.map(total)
    const mx = Math.max(...tots), mn = Math.min(...tots)
    const floor = mn - (mx - mn) * 0.9, half = (Hh - top - bot) / 2
    const k = (p) => ((total(p) - floor) / (mx - floor)) * half * 2 / total(p)
    const X = (i) => -20 + (i / (n - 1)) * (W + 40)
    const g = ease(nwGrow)

    const lay = D.map((p) => {
      const q = (k(p) * g) / 2
      const c = p.cars * q
      const h = p.heavy * q
      const b = p.bikes * q
      return { c, ch: c + h, chb: c + h + b }
    })

    const band = (key) => {
      const T = D.map((p, i) => [X(i), mid - lay[i][key]])
      const B = D.map((p, i) => [X(i), mid + lay[i][key]]).reverse()
      return smoothPath(T) + smoothPath(B, false) + 'Z'
    }

    const marks = [Math.round((n - 1) * 0.18), Math.round((n - 1) * 0.55), n - 1]
    const pillBg = isDark ? '#000000' : '#ffffff'
    const pillTxt = isDark ? '#ffffff' : '#0f172a'
    const strokeLine = isDark ? 'rgba(0,0,0,.55)' : 'rgba(15,23,42,.35)'

    svg.innerHTML = `
      <defs>
        <linearGradient id="nwf" x1="0" x2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".0"/>
          <stop offset=".25" stop-color="#fff" stop-opacity="1"/>
        </linearGradient>
        <mask id="nwm"><rect width="${W}" height="${Hh}" fill="url(#nwf)"/></mask>
      </defs>
      <g mask="url(#nwm)">
        <path d="${band('chb')}" fill="${COL.bikes}" opacity=".92"/>
        <path d="${band('ch')}" fill="${COL.heavy}" opacity=".95"/>
        <path d="${band('c')}" fill="${COL.cars}" opacity=".98"/>
      </g>
      ${marks
        .map((i, idx) => {
          const x = Math.min(W - 36, Math.max(36, X(i)))
          const t = total(D[i])
          return `
            <g style="opacity:${g > 0.6 ? 1 : 0};transition:opacity .4s ${idx * 0.08}s">
              <line x1="${x}" x2="${x}" y1="${top - 4}" y2="${Hh - bot + 4}" stroke="${strokeLine}" stroke-width="1.5"/>
              <rect x="${x - 34}" y="${top - 14}" width="68" height="22" rx="11" fill="${pillBg}" stroke="${isDark ? 'none' : '#cbd5e1'}"/>
              <text x="${x}" y="${top + 1}" text-anchor="middle" font-size="11" font-weight="600" fill="${pillTxt}" font-family="Geist Mono">${formatVolume(t, { compact: true })} veh</text>
              <rect x="${x - 30}" y="${Hh - bot - 8}" width="60" height="22" rx="11" fill="${pillBg}" stroke="${isDark ? 'none' : '#cbd5e1'}"/>
              <text x="${x}" y="${Hh - bot + 7}" text-anchor="middle" font-size="10.5" font-weight="500" fill="${isDark ? 'rgba(255,255,255,.7)' : '#64748b'}" font-family="Geist Mono">${D[i].l}</text>
            </g>`
        })
        .join('')}
      <line class="hl" y1="${top}" y2="${Hh - bot}" stroke="${isDark ? '#fff' : '#0f172a'}" stroke-width="1.5" opacity="0"/>
      <rect width="${W}" height="${Hh}" fill="transparent" class="hit"/>
    `

    const hit = svg.querySelector('.hit')
    const hl = svg.querySelector('.hl')
    hit.onpointermove = (e) => {
      const r = svg.getBoundingClientRect()
      const z = r.width / W
      const x = (e.clientX - r.left) / z
      const i = Math.max(0, Math.min(n - 1, Math.round(((x + 20) / (W + 40)) * (n - 1))))
      const p = D[i]
      hl.setAttribute('x1', X(i))
      hl.setAttribute('x2', X(i))
      hl.setAttribute('opacity', 1)
      showTip(
        r.left + X(i) * z,
        r.top + (mid - lay[i].chb) * z,
        p.l + ' · Corridor Volume',
        [
          ['Two-Wheelers', formatVolume(p.bikes), COL.bikes],
          ['Heavy / Buses', formatVolume(p.heavy), COL.heavy],
          ['Cars', formatVolume(p.cars), COL.cars],
          ['Total Volume', formatVolume(total(p)) + ' veh']
        ]
      )
    }
    hit.onpointerleave = () => {
      hl.setAttribute('opacity', 0)
      hideTip()
    }
  }

  function updateNW() {
    nwData = series()
    const D = nwData
    const a = total(D[0]), b = total(D[D.length - 1])
    nwNum.count(b)
    const deltaPct = (((b - a) / a) * 100).toFixed(1)
    nw.querySelector('.nwd').textContent = (b >= a ? '↑ ' : '↓ ') + Math.abs(deltaPct) + '%'
    nw.querySelector('.nwc').textContent =
      (b >= a ? '+' : '−') + formatVolume(Math.abs(b - a)) + ' veh ' +
      ({ '1H': 'last hour', '6H': 'last 6 hours', '24H': 'today', '7D': 'this week', 'All': 'past 30 days' }[S.period] || 'period')

    cancelAnimationFrame(nwRaf)
    const t0 = performance.now()
    nwGrow = 0
    const f = (now) => {
      nwGrow = reduce ? 1 : Math.min(1, (now - t0) / 1100)
      drawNW()
      if (nwGrow < 1) nwRaf = RAF(f)
    }
    nwRaf = RAF(f)
  }

  /* ================================================================= */
  /*  Card 2: Capacity Saturation Half-Gauge (#alloc)                  */
  /* ================================================================= */
  const al = $id('alloc')
  al.innerHTML = `
    ${bg(GR.graph)}
    <div class="in-c">
      <div class="row" style="justify-content:space-between">
        <div class="ttl">Capacity Saturation</div>
        <span class="chip">K_sat: LOS-C</span>
      </div>
      <svg class="alg" width="300" height="168" viewBox="-150 -150 300 168" style="position:absolute;left:50%;margin-left:-150px;top:70px" aria-hidden="true"></svg>
      <div class="all" style="position:absolute;left:24px;right:24px;bottom:20px"></div>
    </div>
    <div class="rim"></div>
  `

  function updateAlloc() {
    const p = nwData[nwData.length - 1]
    const t = total(p)
    const fr = { cars: p.cars / t, heavy: p.heavy / t, bikes: p.bikes / t }
    const n = 56
    const svg = al.querySelector('.alg')
    let s = ''
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const a = 180 + f * 180
      const cls = f <= fr.cars ? 'cars' : f <= fr.cars + fr.heavy ? 'heavy' : 'bikes'
      const [x1, y1] = P2(136, a)
      const [x2, y2] = P2(i % 7 === 0 ? 112 : 118, a)
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${COL[cls]}" stroke-opacity="${cls === 'cars' ? 1 : 0.85}" stroke-width="3.2" stroke-linecap="round" style="opacity:0;animation:tk .4s ${i * 12}ms forwards"/>`
    }
    const saturationPct = Math.round(68 + Math.sin(Date.now() / 10000) * 4)
    s += `
      <text y="-22" text-anchor="middle" font-family="Geist" font-weight="200" font-size="52" fill="${isDark ? '#fff' : '#0f172a'}" letter-spacing="-2">
        ${saturationPct}<tspan font-size="17" dy="-24" fill="${T2}">%</tspan>
      </text>
      <text y="0" text-anchor="middle" font-size="12" font-weight="500" fill="${T3}" font-family="Geist">K_sat capacity</text>
    `
    svg.innerHTML = `<style>@keyframes tk{to{opacity:1}}</style>` + s

    al.querySelector('.all').innerHTML = [
      ['Cars', fr.cars, p.cars, 'cars'],
      ['Heavy Vehicles', fr.heavy, p.heavy, 'heavy'],
      ['Two-Wheelers', fr.bikes, p.bikes, 'bikes']
    ]
      .map(
        ([k, f, v, c], i) => `
        <div class="row" style="height:30px;${i ? `border-top:1px solid ${HAIR}` : ''}">
          <i style="width:8px;height:8px;border-radius:50%;background:${COL[c]}"></i>
          <span style="flex:1;font-size:13px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">${k}</span>
          <span class="mono muted" style="width:44px;text-align:right">${Math.round(f * 100)}%</span>
          <span class="mono" style="width:76px;text-align:right;font-size:13px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">${formatVolume(v)}</span>
        </div>`
      )
      .join('')
  }

  /* ================================================================= */
  /*  Card 3 (KPI 1): Accident Risk Baseline R_t (#ret)                */
  /* ================================================================= */
  const ret = $id('ret')
  ret.innerHTML = `
    ${bg(GR.lime)}
    <div class="in-c">
      <div class="row" style="justify-content:space-between">
        <div class="cap">Accident Risk Index (R_t)</div>
        <span class="chip rtc">Tier: Med</span>
      </div>
      <div style="position:absolute;left:22px;bottom:32px;display:flex;align-items:center;gap:8px">
        <svg width="30" height="36" viewBox="0 0 34 40" aria-hidden="true">
          <path d="M17 37V5M5 17L17 5l12 12" fill="none" stroke="${isDark ? '#fff' : '#0f172a'}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="big rtv" style="font-size:48px;font-weight:700;color:${isDark ? '#fff' : '#0f172a'}">38.4</span>
      </div>
      <div class="muted rtp" style="position:absolute;left:24px;bottom:14px;font-size:11.5px">
        Deterministic Heuristic baseline · 0.55·D + 0.20·V + 0.15·M + 0.10·P
      </div>
    </div>
    <div class="rim"></div>
  `

  function updateRet() {
    const riskScore = 38.4
    ret.querySelector('.rtv').textContent = riskScore.toFixed(1)
    ret.querySelector('.rtc').textContent = riskScore < 35 ? 'Tier: Low' : riskScore < 67 ? 'Tier: Moderate' : 'Tier: High'
  }

  /* ================================================================= */
  /*  Card 4 (KPI 2): Average Flow Speed & Runway Ticks (#cash)        */
  /* ================================================================= */
  const cash = $id('cash')
  cash.innerHTML = `
    <div class="in-c">
      <div class="row" style="justify-content:space-between">
        <div class="cap">Average Flow Speed</div>
        <span class="muted">Runway Index</span>
      </div>
      <div class="row" style="margin-top:14px;align-items:baseline;justify-content:space-between">
        <span class="big csv" style="font-size:38px;color:${isDark ? '#fff' : '#0f172a'}">28</span>
        <span class="mono" style="font-size:20px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">
          mph <span class="muted" style="font-size:12px">/ 45 target</span>
        </span>
      </div>
      <svg class="cst" width="100%" height="22" style="position:absolute;left:24px;right:24px;bottom:22px;width:calc(100% - 48px)" aria-hidden="true"></svg>
    </div>
  `

  function updateCash() {
    const spd = 28
    const svg = cash.querySelector('.cst')
    const W = svg.getBoundingClientRect().width || 220
    const n = 36
    let s = ''
    for (let i = 0; i < n; i++) {
      const x = 1 + (i * (W - 2)) / (n - 1)
      const on = i / (n - 1) <= spd / 45
      s += `<line x1="${x}" x2="${x}" y1="${i % 6 === 0 ? 2 : 8}" y2="20" stroke="${on ? ACC : HAIR}" stroke-width="1.6" stroke-linecap="round" style="transition:stroke .2s ${i * 14}ms"/>`
    }
    svg.innerHTML = s + `<text x="${W}" y="0" dy="-4" text-anchor="end" font-size="10" fill="${T3}" font-family="Geist Mono">45 mph</text>`
  }

  /* ================================================================= */
  /*  Card 5 (KPI 3): Active Bottlenecks (#pay)                        */
  /* ================================================================= */
  const pay = $id('pay')
  const BOTTLENECKS = data.bottlenecks || [
    { name: 'Cyber Towers Junction', delay: '8 min', vehicles: 2410 },
    { name: 'Gachibowli Flyover', delay: '14 min', vehicles: 1890 },
    { name: 'Jubilee Hills Checkpost', delay: '5 min', vehicles: 1120 }
  ]

  function updatePay() {
    const totalDelayed = BOTTLENECKS.reduce((acc, b) => acc + b.vehicles, 0)
    pay.innerHTML = `
      <div class="in-c" style="padding-bottom:14px">
        <div class="row" style="justify-content:space-between">
          <div class="cap">Active Bottlenecks</div>
          <span class="mono muted">${formatVolume(totalDelayed)} delayed veh</span>
        </div>
        <div style="margin-top:10px">
          ${BOTTLENECKS.map(
            (b, i) => `
            <div class="row" style="height:34px;${i ? `border-top:1px solid ${HAIR}` : ''}">
              <i style="width:24px;height:24px;border-radius:8px;background:${isDark ? 'rgba(255,255,255,.1)' : '#f1f5f9'};display:grid;place-items:center;font:700 11px Geist;color:${isDark ? '#fff' : '#0f172a'};font-style:normal">
                ${b.name.charAt(0)}
              </i>
              <span style="flex:1;font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${isDark ? '#fff' : '#0f172a'}">
                ${b.name}
              </span>
              <span class="muted mono" style="font-size:11px;color:${b.delay.includes('14') ? '#ef4444' : '#f59e0b'}">${b.delay}</span>
              <span class="mono" style="width:62px;text-align:right;font-size:12.5px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">${formatVolume(b.vehicles)}</span>
            </div>`
          ).join('')}
        </div>
      </div>`
  }

  /* ================================================================= */
  /*  Card 6 (KPI 4): Adaptive Signal Clearance Goals (#goals)         */
  /* ================================================================= */
  const goals = $id('goals')
  const GO = data.goals || [
    { name: 'Inbound Corridor Clearance', progress: 0.78, target: 1200, unit: 'veh/hr' },
    { name: 'Transit Bus Wave Priority', progress: 0.92, target: 450, unit: 'buses/hr' }
  ]

  function updateGoals() {
    goals.innerHTML = `
      <div class="in-c">
        <div class="row" style="justify-content:space-between">
          <div class="cap">Signal Efficiency</div>
          <span class="muted">2 active waves</span>
        </div>
        ${GO.map(
          (g, k) => `
          <div style="margin-top:${k ? 14 : 16}px">
            <div class="row" style="justify-content:space-between;font-size:12.5px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">
              <span>${g.name}</span>
              <span class="mono" style="font-weight:500">
                ${Math.round(g.progress * 100)}%
                <span class="muted"> of ${formatVolume(g.target, { compact: true })}</span>
              </span>
            </div>
            <svg width="100%" height="12" style="margin-top:8px;display:block" class="gl" data-f="${g.progress}" aria-hidden="true"></svg>
          </div>`
        ).join('')}
      </div>`

    RAF(() => {
      goals.querySelectorAll('.gl').forEach((svg, k) => {
        const W = svg.getBoundingClientRect().width || 200
        const n = 40, f = +svg.dataset.f
        let s = ''
        for (let i = 0; i < n; i++) {
          const x = 1 + (i * (W - 2)) / (n - 1)
          const on = i / (n - 1) <= f
          s += `<line x1="${x}" x2="${x}" y1="${i % 8 === 0 ? 0 : 4}" y2="12" stroke="${on ? ACC : HAIR}" stroke-width="1.6" stroke-linecap="round" style="opacity:0;animation:tk2 .3s ${300 + k * 150 + i * 12}ms forwards"/>`
        }
        svg.innerHTML = '<style>@keyframes tk2{to{opacity:1}}</style>' + s
      })
    })
  }

  /* ================================================================= */
  /*  Card 7: Diurnal Corridor Flow Mirrored Waves (#flow)             */
  /* ================================================================= */
  const flow = $id('flow')
  flow.innerHTML = `
    ${bg(GR.pink)}
    <div class="in-c">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="ttl">Diurnal Corridor Flow</div>
          <div class="muted" style="margin-top:4px">
            Net <span class="mono" style="color:${ACC}">+1,840 veh/hr</span> inbound peak
          </div>
        </div>
        <div class="legend" style="flex-direction:column;gap:4px;align-items:flex-end">
          <span><i style="background:${isDark ? '#fff' : '#0284c7'}"></i>Inbound Flow</span>
          <span><i style="background:${isDark ? '#FFD0E6' : '#ec4899'}"></i>Outbound Flow</span>
        </div>
      </div>
      <svg class="fls" style="position:absolute;left:0;bottom:12px" aria-hidden="true"></svg>
    </div>
    <div class="rim"></div>
  `

  const MLAB = data.flow.hours
  const INC = data.flow.inflow
  const SPN = data.flow.outflow
  let flowRaf = 0

  function updateFlow(instant) {
    const svg = flow.querySelector('.fls')
    const W = flow.clientWidth
    const Hh = 246, L = 44, R = W - 36, mid = Hh / 2, lab = 16, amp = mid - lab - 8, max = 7
    svg.setAttribute('width', W)
    svg.setAttribute('height', Hh)
    svg.setAttribute('viewBox', `0 0 ${W} ${Hh}`)

    const X = (i) => L + (i / (MLAB.length - 1)) * (R - L)
    cancelAnimationFrame(flowRaf)
    const t0 = instant ? -1e6 : performance.now()

    const frame = (now) => {
      const g = ease(reduce ? 1 : Math.min(1, (now - t0) / 1200))
      const path = (arr, dir) => smoothPath(arr.map((v, i) => [X(i), mid + dir * (lab + (v / max) * amp * g)]))
      let s = ''

      ;[0, 2, 4, 6].forEach((v) => {
        const yT = mid - lab - (v / max) * amp
        const yB = mid + lab + (v / max) * amp
        s += `
          <line x1="${L}" x2="${R}" y1="${yT}" y2="${yT}" stroke="${HAIR}"/>
          <line x1="${L}" x2="${R}" y1="${yB}" y2="${yB}" stroke="${HAIR}"/>
          <text x="${L - 12}" y="${yT + 3.5}" text-anchor="end" font-size="10" fill="${T3}" font-family="Geist Mono">${v ? v + 'K' : '0'}</text>
          <text x="${L - 12}" y="${yB + 3.5}" text-anchor="end" font-size="10" fill="${T3}" font-family="Geist Mono">${v ? v + 'K' : '0'}</text>
          <line x1="${R + 8}" x2="${R + 14}" y1="${yT}" y2="${yT}" stroke="${T3}"/>
          <line x1="${R + 8}" x2="${R + 14}" y1="${yB}" y2="${yB}" stroke="${T3}"/>
        `
      })

      MLAB.forEach(
        (m, i) =>
          (s += `<text x="${X(i)}" y="${mid + 4}" text-anchor="middle" font-size="10.5" font-weight="500" fill="${isDark ? 'rgba(255,255,255,.75)' : '#64748b'}" font-family="Geist Mono">${m}</text>`)
      )

      INC.slice()
        .reverse()
        .forEach((a, k) => {
          const j = 2 - k
          s += `<path d="${path(a, -1)}" fill="none" stroke="${isDark ? '#fff' : '#0284c7'}" stroke-opacity="${[1, 0.55, 0.3][j]}" stroke-width="${j ? 1.6 : 2.4}" stroke-linecap="round"/>`
        })

      SPN.slice()
        .reverse()
        .forEach((a, k) => {
          const j = 2 - k
          s += `<path d="${path(a, 1)}" fill="none" stroke="${isDark ? '#FFD0E6' : '#ec4899'}" stroke-opacity="${[1, 0.55, 0.3][j]}" stroke-width="${j ? 1.6 : 2.4}" stroke-linecap="round"/>`
        })

      s += `<line class="hl" y1="10" y2="${Hh - 10}" stroke="${isDark ? '#fff' : '#0f172a'}" stroke-opacity=".5" opacity="0"/><rect class="hit" x="${L - 10}" width="${R - L + 20}" height="${Hh}" fill="transparent"/>`
      svg.innerHTML = s

      const hit = svg.querySelector('.hit')
      const hl = svg.querySelector('.hl')
      hit.onpointermove = (e) => {
        const r = svg.getBoundingClientRect()
        const z = r.width / W
        const x = (e.clientX - r.left) / z
        const i = Math.max(0, Math.min(5, Math.round(((x - L) / (R - L)) * 5)))
        hl.setAttribute('x1', X(i))
        hl.setAttribute('x2', X(i))
        hl.setAttribute('opacity', 1)
        showTip(
          r.left + X(i) * z,
          r.top + (mid - lab - (INC[0][i] / max) * amp) * z,
          MLAB[i] + ' Flow Metrics',
          [
            ['Inbound Volume', formatVolume(INC[0][i] * 1000) + ' veh/hr', isDark ? '#fff' : '#0284c7'],
            ['Outbound Volume', formatVolume(SPN[0][i] * 1000) + ' veh/hr', isDark ? '#FFD0E6' : '#ec4899'],
            ['Net Inflow Delta', formatVolume((INC[0][i] - SPN[0][i]) * 1000) + ' veh/hr']
          ]
        )
      }
      hit.onpointerleave = () => {
        hl.setAttribute('opacity', 0)
        hideTip()
      }
      if (g < 1) flowRaf = RAF(frame)
    }
    flowRaf = RAF(frame)
  }

  /* ================================================================= */
  /*  Card 8: Priority Corridors Watch & Sparklines (#crypto)          */
  /* ================================================================= */
  const cr = $id('crypto')
  const CORRS = data.corridors || []
  cr.innerHTML = `
    ${bg(GR.copper)}
    <div class="in-c">
      <div class="row" style="justify-content:space-between">
        <div class="ttl">Corridor Watch</div>
        <span class="muted">7-day speed index</span>
      </div>
      <div class="row" style="margin-top:14px;align-items:flex-end;justify-content:space-between">
        <span class="big crv" style="color:${isDark ? '#fff' : '#0f172a'}">28.4</span>
        <span style="padding-bottom:4px">
          <span class="delta crd"></span>
          <span class="muted"> 24h</span>
        </span>
      </div>
      <div class="crb" style="margin-top:16px"></div>
      <div class="crl" style="position:absolute;left:24px;right:24px;bottom:14px"></div>
    </div>
    <div class="rim"></div>
  `

  const OHLC = Object.fromEntries(CORRS.map((a) => [a.symbol, a.ohlc]))
  function candles(t) {
    const d = (OHLC[t] || [[20, 22, 19, 21]]).map((x) => x[3])
    const W = 96, H = 30
    const lo = Math.min(...d), hi = Math.max(...d)
    const pad = (hi - lo) * 0.15 || 1
    const Y = (v) => H - 3 - ((v - lo + pad) / (hi - lo + 2 * pad)) * (H - 6)
    const P = d.map((v, i) => [2 + (i / (d.length - 1)) * (W - 6), Y(v)])
    const e = P[P.length - 1]
    const up = d[d.length - 1] >= d[0]
    const gid = 'sg' + t + (isDark ? 'd' : 'l')
    return `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs>
          <linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="${isDark ? '#fff' : '#0284c7'}" stop-opacity=".18"/>
            <stop offset="1" stop-color="${isDark ? '#fff' : '#0284c7'}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${smoothPath(P)}L${e[0]},${H}L${P[0][0]},${H}Z" fill="url(#${gid})"/>
        <path d="${smoothPath(P)}" fill="none" stroke="${isDark ? '#fff' : '#0284c7'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${e[0]}" cy="${e[1]}" r="3" fill="${up ? ACC : isDark ? '#fff' : '#0f172a'}" stroke="rgba(0,0,0,.35)" stroke-width="1"/>
      </svg>`
  }

  function updateCrypto() {
    cr.querySelector('.crv').textContent = '28.4 mph'
    cr.querySelector('.crd').textContent = '↑ 3.8%'

    cr.querySelector('.crb').innerHTML = `
      <div style="display:flex;gap:3px;height:6px">
        ${CORRS.map(
          (c, i) =>
            `<div style="flex:0 0 calc(${c.share * 100}% - 2px);border-radius:3px;background:${isDark ? `rgba(255,255,255,${[0.95, 0.6, 0.32][i]})` : `rgba(2,132,199,${[0.95, 0.65, 0.4][i]})`};transform-origin:left;transform:scaleX(0);transition:transform .8s var(--ease) ${0.1 + i * 0.1}s" class="crs"></div>`
        ).join('')}
      </div>
      <div style="display:flex;gap:3px;margin-top:7px">
        ${CORRS.map(
          (c) =>
            `<span class="mono muted" style="flex:0 0 calc(${c.share * 100}% - 2px);font-size:11px;white-space:nowrap">${c.symbol} ${Math.round(c.share * 100)}%</span>`
        ).join('')}
      </div>`

    RAF(() => RAF(() => cr.querySelectorAll('.crs').forEach((b) => (b.style.transform = 'scaleX(1)'))))

    cr.querySelector('.crl').innerHTML = CORRS.map(
      (c, i) => `
      <div class="row" style="height:50px;${i ? `border-top:1px solid ${HAIR}` : ''}">
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">${c.name}</div>
          <div class="mono muted" style="font-size:11px">${c.symbol} · 7d speed</div>
        </div>
        ${candles(c.symbol)}
        <div style="width:80px;text-align:right">
          <div class="mono" style="font-size:13px;font-weight:600;color:${isDark ? '#fff' : '#0f172a'}">${c.speed} mph</div>
          <div class="mono" style="font-size:11px;color:${c.change.startsWith('+') ? (isDark ? ACC : '#16a34a') : '#dc2626'}">${c.change}</div>
        </div>
      </div>`
    ).join('')
  }

  /* ================================================================= */
  /*  Card 9: Weekday Volume Capsule Columns (#stocks)                 */
  /* ================================================================= */
  const st = $id('stocks')
  const WK = data.throughput.days
  const WV = data.throughput.values

  st.innerHTML = `
    ${bg(GR.green)}
    <div class="in-c">
      <div class="ttl">Weekday Volume</div>
      <div style="margin-top:14px">
        <span class="big stv" style="font-size:34px;color:${isDark ? '#fff' : '#0f172a'}">84.6K</span>
      </div>
      <div class="row" style="margin-top:6px;gap:8px">
        <span class="delta" style="color:${isDark ? ACC : '#16a34a'}">↑ 5.2%</span>
        <span class="muted">this week</span>
      </div>
      <svg class="sts" style="position:absolute;left:18px;bottom:14px" aria-hidden="true"></svg>
    </div>
    <div class="rim"></div>
  `

  function updateStocks(instant) {
    const svg = st.querySelector('.sts')
    const W = st.clientWidth - 36
    const Hh = 160, pb = 18, bw = 22, max = 7
    const gap = (W - 24 - bw * 5) / 4
    svg.setAttribute('width', W)
    svg.setAttribute('height', Hh)

    const Y = (x) => (Hh - pb) * (1 - x / max)
    let s = ''
    ;[0, 2, 4, 6].forEach((t) => (s += `<text x="0" y="${Y(t) + 3.5}" font-size="9.5" fill="${T3}" font-family="Geist Mono">${t}K</text>`))

    WV.forEach((x, i) => {
      const X = 24 + i * (bw + gap)
      const today = i === WV.length - 1
      s += `
        <rect x="${X}" y="${Y(max)}" width="${bw}" height="${Hh - pb - Y(max)}" rx="${bw / 2}" fill="${isDark ? 'rgba(0,0,0,.28)' : 'rgba(15,23,42,.08)'}"/>
        <rect class="sb" x="${X}" y="${Hh - pb}" width="${bw}" height="0" rx="${bw / 2}" fill="${today ? ACC : isDark ? '#fff' : '#0284c7'}" data-y="${Y(x)}" data-h="${Hh - pb - Y(x)}" style="transition:y .8s var(--ease) ${i * 70}ms,height .8s var(--ease) ${i * 70}ms"/>
        <text x="${X + bw / 2}" y="${Hh - 3}" text-anchor="middle" font-size="10" fill="${today ? (isDark ? '#fff' : '#0f172a') : T3}" font-weight="${today ? '700' : '500'}" font-family="Geist Mono">${WK[i]}</text>
        <rect class="hit" x="${X - 4}" y="0" width="${bw + 8}" height="${Hh}" fill="transparent" data-i="${i}"/>
      `
    })
    svg.innerHTML = s

    RAF(() =>
      RAF(() =>
        svg.querySelectorAll('.sb').forEach((b) => {
          b.setAttribute('y', b.dataset.y)
          b.setAttribute('height', b.dataset.h)
        })
      )
    )

    svg.querySelectorAll('.hit').forEach((h) => {
      h.onpointermove = (e) => {
        const i = +h.dataset.i
        showTip(
          e.clientX,
          e.clientY,
          WK[i] + ' · Corridor Throughput',
          [
            ['Peak Hour Throughput', formatVolume(WV[i] * 1000 * 0.65) + ' veh/hr', isDark ? '#fff' : '#0284c7'],
            ['Off-Peak Volume', formatVolume(WV[i] * 1000 * 0.35) + ' veh/hr'],
            ['Total Day Volume', formatVolume(WV[i] * 1000) + ' veh']
          ]
        )
      }
      h.onpointerleave = hideTip
    })
  }

  /* ---------- Controls: Period & Segments ---------- */
  function seg(host, items, key) {
    if (!host) return
    host.innerHTML = items.map((k) => `<button type="button" aria-pressed="${S[key] === k}">${k}</button>`).join('')
    host.querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        S[key] = b.textContent
        host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b))
        updateAll()
      }
    })
  }

  seg($id('bento-period'), ['1H', '6H', '24H', '7D'], 'period')
  seg($id('bento-unit'), ['Vehicles', 'Speed'], 'unit')

  function updateAll() {
    updateNW()
    updateAlloc()
    updateRet()
    updateCash()
    updatePay()
    updateGoals()
    updateFlow()
    updateCrypto()
    updateStocks()
  }

  /* ---------- ResizeObserver Lifecycle ---------- */
  let rz
  const ro = new ResizeObserver(() => {
    clearTimeout(rz)
    rz = setTimeout(() => {
      if (!nwData) return
      cancelAnimationFrame(nwRaf)
      nwGrow = 1
      drawNW()
      updateFlow(true)
      updateStocks(true)
      updateCash()
      updateGoals()
    }, 120)
  })

  ;['nw', 'flow', 'stocks', 'cash'].forEach((id) => {
    const target = $id(id)
    if (target) ro.observe(target)
  })

  ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    if (!alive) return
    const gridEl = $id('grid')
    if (gridEl) gridEl.classList.add('in')
    root.querySelectorAll('.card').forEach((c, i) => (c.style.transitionDelay = i * 60 + 'ms'))
    updateAll()
  })

  return () => {
    alive = false
    frames.forEach((f) => cancelAnimationFrame(f))
    ro.disconnect()
    clearTimeout(rz)
  }
}

/* ------------------------------------------------------------------ */
/*  Main React Component Export                                       */
/* ------------------------------------------------------------------ */
export function TrafficBento({
  data,
  title = 'Traffic Telemetry Command',
  subtitle = 'Live AI Vision & Accident Prediction',
  avatar,
  avatarAlt = 'Operator Profile',
  credit = false,
  className = '',
  style,
  initialTheme = 'light'
}) {
  useGeistFonts()
  const ref = React.useRef(null)
  const [theme, setTheme] = React.useState(initialTheme)

  // Use provided data or fallback to realistic default telemetry
  const resolvedData = React.useMemo(() => data || generateDefaultTrafficData(), [data])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Rebuild container markup
    el.innerHTML = `
      <div class="fpb-c canvas">
        <div class="top">
          <h1>
            ${title}
            <span id="asof">${subtitle}</span>
          </h1>
          <div class="ctrls">
            <div class="seg" id="bento-period" role="group" aria-label="Telemetry Period"></div>
            <div class="seg" id="bento-unit" role="group" aria-label="Units"></div>
            <button type="button" class="theme-toggle-btn" id="bento-theme-toggle" title="Toggle Light / Dark mode">
              ${theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          ${avatar ? `<img class="ava" alt="${avatarAlt}" src="${avatar}">` : ''}
        </div>
        <div class="grid" id="grid">
          <!-- Corridor Flow Stream (River + Dot Matrix) -->
          <section class="card h1" id="nw" aria-label="Vehicle Flow Stream"></section>
          <!-- Capacity Saturation (Half Gauge) -->
          <section class="card h1" id="alloc" aria-label="Roadway Capacity Saturation"></section>
          <!-- 4 KPI Tiles -->
          <section class="card h2 kpi" id="ret" aria-label="Accident Risk R_t"></section>
          <section class="card glass h2 kpi" id="cash" aria-label="Average Speed Runway"></section>
          <section class="card glass h2 kpi" id="pay" aria-label="Active Bottlenecks"></section>
          <section class="card glass h2 kpi" id="goals" aria-label="Signal Clearance Goals"></section>
          <!-- Bottom Row: Diurnal Waves, Corridors Sparklines, Weekday Volumes -->
          <section class="card h3" id="flow" aria-label="Diurnal Inflow Waves"></section>
          <section class="card h3" id="crypto" aria-label="Corridor Feeds"></section>
          <section class="card h3" id="stocks" aria-label="Weekday Volumes"></section>
        </div>
      </div>
      <div class="tip" id="bento-tip"></div>
    `

    // Bind theme toggle
    const toggleBtn = el.querySelector('#bento-theme-toggle')
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      }
    }

    const stop = mountTrafficBento(el, resolvedData, theme)
    return () => {
      stop()
      el.innerHTML = ''
    }
  }, [resolvedData, title, subtitle, avatar, avatarAlt, credit, theme])

  return (
    <>
      <style>{BENTO_CSS}</style>
      <div ref={ref} className={`t-bento theme-${theme} ${className}`} style={style} />
    </>
  )
}

export default TrafficBento
