'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { ResumeData, AtsScore } from '@/lib/types'

interface AtsPanelProps {
  resumeData: ResumeData
}

export function AtsPanel({ resumeData }: AtsPanelProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<AtsScore | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchScore() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      })
      const data = await res.json()
      if (res.ok) setScore(data)
      else setError(data.error)
    } catch {
      setError('Failed to get ATS score')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor =
    score?.score == null ? ''
    : score.score >= 80 ? 'text-green-600'
    : score.score >= 60 ? 'text-amber-600'
    : 'text-red-600'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <button
        type="button"
        onClick={() => { setOpen(!open); if (!open && !score) fetchScore() }}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">ATS Score & Feedback</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">AI</span>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 flex flex-col gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing your resume…
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {score && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className={`text-4xl font-bold ${scoreColor}`}>{score.score}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">ATS Score</p>
                  <p className="text-xs text-gray-400">out of 100</p>
                </div>
              </div>

              {score.missing_keywords.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Missing keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {score.missing_keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {score.suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggestions</p>
                  <ul className="flex flex-col gap-1.5">
                    {score.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button variant="secondary" size="sm" onClick={fetchScore} loading={loading} className="self-start">
                Re-analyze
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
