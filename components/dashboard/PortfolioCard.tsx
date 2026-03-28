'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TEMPLATE_LABELS } from '@/lib/types'
import type { PortfolioRecord } from '@/lib/types'

interface PortfolioCardProps {
  portfolio: PortfolioRecord
  onDelete: (id: string) => void
}

export function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updatedAt = new Date(portfolio.updated_at)
  const timeAgo = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
  const timeLabel = timeAgo === 0 ? 'today' : timeAgo === 1 ? 'yesterday' : `${timeAgo} days ago`

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/portfolio/${portfolio.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setDeleting(false)
        setConfirmDelete(false)
        alert(data.error ?? 'Delete failed. Please try again.')
        return
      }
      const data = res.status !== 204 ? await res.json().catch(() => ({})) : null
      if (data?.warning) {
        // DB record deleted but GitHub repo deletion failed
        console.warn('Repo delete warning:', data.warning)
        alert(`Portfolio deleted, but the GitHub repo could not be removed: ${data.warning}\n\nYou may need to sign out and sign back in to grant repo deletion permission.`)
      }
      onDelete(portfolio.id)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Network error. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{portfolio.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">
              {TEMPLATE_LABELS[portfolio.template_id]}
            </span>
            <span className="text-xs text-gray-400">Updated {timeLabel}</span>
          </div>
        </div>
      </div>

      {portfolio.deployment_url && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
          <a
            href={portfolio.deployment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-700 truncate flex-1"
          >
            {portfolio.deployment_url}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(portfolio.deployment_url!)}
            className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            Copy
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <a href={`/portfolio/${portfolio.id}/edit`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">Edit</Button>
        </a>
        {portfolio.deployment_url && (
          <a href={portfolio.deployment_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">View ↗</Button>
          </a>
        )}
        {!confirmDelete ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <p className="text-xs text-red-600">
              {portfolio.github_repo
                ? `This will delete the portfolio and the GitHub repo "${portfolio.github_repo}". This cannot be undone.`
                : 'This will permanently delete the portfolio. This cannot be undone.'}
            </p>
            <div className="flex gap-1">
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Yes, delete</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
