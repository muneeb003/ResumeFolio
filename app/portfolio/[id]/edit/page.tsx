'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { saveResumeData, saveDesign, savePortfolioId, saveGithubRepo } from '@/lib/storage'
import type { PortfolioRecord } from '@/lib/types'

export default function EditRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = params.id as string
    fetch(`/api/portfolio/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Portfolio not found')
        return r.json()
      })
      .then((portfolio: PortfolioRecord) => {
        // Load portfolio data into localStorage for the multi-step flow
        saveResumeData(portfolio.resume_data)
        saveDesign({
          templateId: portfolio.template_id,
          accentColor: portfolio.accent_color,
          sectionOrder: portfolio.section_order,
          hiddenSections: portfolio.hidden_sections,
        })
        savePortfolioId(portfolio.id)
        if (portfolio.github_repo) saveGithubRepo(portfolio.github_repo)
        router.replace('/create/review')
      })
      .catch((err) => setError(err.message))
  }, [params.id, router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm">← Back to dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading portfolio…</p>
      </div>
    </div>
  )
}
