'use client'

import { useState } from 'react'

interface ImproveBulletButtonProps {
  bullet: string
  role: string
  onImproved: (improved: string) => void
}

export function ImproveBulletButton({ bullet, role, onImproved }: ImproveBulletButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleImprove() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, role }),
      })
      if (res.ok) {
        const { improved } = await res.json()
        onImproved(improved)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleImprove}
      disabled={loading || !bullet.trim()}
      title="Improve with AI"
      className="flex-shrink-0 text-indigo-500 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span title="Improve with AI" className="text-sm">✨</span>
      )}
    </button>
  )
}
