'use client'

import { useState, useRef, useEffect } from 'react'

type Device = 'desktop' | 'tablet' | 'mobile'

// Full-width rendered at this "virtual monitor" width for each device mode.
const IFRAME_W: Record<Device, number> = {
  desktop: 1280,
  tablet:  768,
  mobile:  390,
}

const DEVICE_LABELS: Record<Device, string> = {
  desktop: 'Desktop',
  tablet:  'Tablet',
  mobile:  'Mobile',
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
    </svg>
  )
}
function TabletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const ICONS: Record<Device, React.ReactNode> = {
  desktop: <MonitorIcon />,
  tablet:  <TabletIcon />,
  mobile:  <PhoneIcon />,
}

export function TemplatePreview({ html }: { html: string }) {
  const [device, setDevice] = useState<Device>('desktop')
  const areaRef = useRef<HTMLDivElement>(null)
  const [areaSize, setAreaSize] = useState({ w: 640, h: 500 })

  // Track the preview area's actual rendered size
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setAreaSize({
        w: Math.round(entry.contentRect.width),
        h: Math.round(entry.contentRect.height),
      })
    })
    obs.observe(el)
    setAreaSize({ w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) })
    return () => obs.disconnect()
  }, [])

  const iframeW   = IFRAME_W[device]
  const isNarrow  = device !== 'desktop'

  // Scale: desktop fills full width; tablet/mobile are capped at 1× (grey surround when container > device width)
  const scale     = isNarrow ? Math.min(1, areaSize.w / iframeW) : areaSize.w / iframeW

  // iframeH fills the area exactly so 100vh ≈ a real monitor height.
  // Content taller than iframeH scrolls inside the iframe itself.
  const iframeH   = areaSize.h > 0 ? Math.round(areaSize.h / scale) : 900

  // Visual footprint after scale() is applied
  const visibleW  = Math.round(iframeW * scale)
  const visibleH  = Math.round(iframeH * scale) // ≈ areaSize.h

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-xs text-zinc-400">Live preview</p>
        <div className="flex items-center gap-0.5 bg-zinc-100 p-1 rounded-lg">
          {(Object.keys(IFRAME_W) as Device[]).map((key) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                device === key
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {ICONS[key]}
              <span className="hidden sm:inline">{DEVICE_LABELS[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Browser chrome + iframe ── */}
      <div className="flex-1 min-h-0 rounded-xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">

        {/* Chrome bar */}
        <div className="h-8 shrink-0 bg-zinc-100 border-b border-zinc-200 flex items-center px-3 gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          <div className="flex-1 mx-2 h-4 bg-zinc-200 rounded-full" />
        </div>

        {/*
          Preview area — ResizeObserver reads dimensions here.
          Narrow devices get a grey surround so the device frame is centred.
        */}
        <div
          ref={areaRef}
          className={`flex-1 min-h-0 overflow-hidden ${
            isNarrow ? 'bg-zinc-200/60 flex items-start justify-center py-6' : ''
          }`}
        >
          {/*
            Wrapper clips the scaled iframe to exactly the visible area.
            The iframe's own document handles internal scrolling; pointer events
            reach it correctly because CSS transform() also moves the hit-test area.
          */}
          <div
            style={{
              width:        isNarrow ? visibleW : '100%',
              height:       visibleH,
              overflow:     'hidden',
              flexShrink:   0,
              borderRadius: device === 'mobile' ? 10 : device === 'tablet' ? 4 : 0,
            }}
          >
            <iframe
              srcDoc={html}
              title="Portfolio preview"
              style={{
                display:         'block',
                width:           iframeW,
                height:          iframeH,
                transform:       `scale(${scale})`,
                transformOrigin: 'top left',
                border:          'none',
              }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
