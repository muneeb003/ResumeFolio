'use client'

import type { TemplateId } from '@/lib/types'

interface TemplateCardProps {
  id: TemplateId
  label: string
  description: string
  selected: boolean
  onClick: () => void
}

export function TemplateCard({ id: _id, label, description, selected, onClick }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3.5 py-3 rounded-lg border transition-all duration-150 ${
        selected
          ? 'border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-300/50'
          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span
          className={`text-xs font-semibold ${selected ? 'text-indigo-700' : 'text-zinc-800'}`}
        >
          {label}
        </span>
        {selected && (
          <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-[11px] text-zinc-500 leading-relaxed">{description}</p>
    </button>
  )
}
