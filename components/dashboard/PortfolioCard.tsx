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
  const [copied, setCopied] = useState(false)

  const updatedAt = new Date(portfolio.updated_at)
  const timeAgo = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
  const timeLabel = timeAgo === 0 ? 'today' : timeAgo === 1 ? 'yesterday' : `${timeAgo}d ago`

  async function handleCopy() {
    if (!portfolio.deployment_url) return
    await navigator.clipboard.writeText(portfolio.deployment_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        alert(`Portfolio deleted, but the GitHub repo could not be removed: ${data.warning}\n\nYou may need to sign out and back in to grant permission.`)
      }
      onDelete(portfolio.id)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Network error. Please try again.')
    }
  }

  return (
    <div className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100 transition-all duration-200">
      {/* Accent strip */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 truncate mb-1.5">{portfolio.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-medium">
              {TEMPLATE_LABELS[portfolio.template_id]}
            </span>
            <span className="text-[11px] text-zinc-400">Updated {timeLabel}</span>
          </div>
        </div>

        {/* URL */}
        {portfolio.deployment_url && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <a
              href={portfolio.deployment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-zinc-500 hover:text-indigo-600 truncate flex-1 transition-colors"
            >
              {portfolio.deployment_url.replace(/^https?:\/\//, '')}
            </a>
            <button
              onClick={handleCopy}
              className="text-[11px] text-zinc-400 hover:text-zinc-700 shrink-0 transition-colors font-medium"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}

        {/* Actions */}
        {!confirmDelete ? (
          <div className="flex gap-1.5">
            <a href={`/portfolio/${portfolio.id}/edit`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                Edit
              </Button>
            </a>
            {portfolio.deployment_url && (
              <a href={portfolio.deployment_url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="px-2.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Button>
              </a>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="text-zinc-400 hover:text-red-500 hover:bg-red-50 px-2.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-red-600 leading-relaxed">
              {portfolio.github_repo
                ? `Deletes this portfolio and the GitHub repo "${portfolio.github_repo}". Permanent.`
                : 'Permanently deletes this portfolio. Cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete} className="flex-1">
                Delete permanently
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
