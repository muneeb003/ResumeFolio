'use client'

import { useState } from 'react'

interface SectionCardProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SectionCard({ title, children, defaultOpen = true }: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>}
    </div>
  )
}
