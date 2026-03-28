'use client'

import type { TemplateId } from '@/lib/types'

interface TemplateCardProps {
  id: TemplateId
  label: string
  description: string
  selected: boolean
  onClick: () => void
}

export function TemplateCard({ id, label, description, selected, onClick }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-semibold ${selected ? 'text-indigo-700' : 'text-gray-900'}`}>
          {label}
        </span>
        {selected && (
          <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  )
}
