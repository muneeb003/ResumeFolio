'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  hint?: string
}

export function TagInput({ label, value, onChange, placeholder = 'Type and press Enter', hint }: TagInputProps) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent hover:border-gray-300 transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="hover:text-indigo-900 focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
        />
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
