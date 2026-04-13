'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TEMPLATE_LABELS } from '@/lib/types'
import type { PortfolioRecord } from '@/lib/types'

interface PortfolioCardProps {
  portfolio: PortfolioRecord
  onDelete: (id: string) => void
  onDuplicate: (p: PortfolioRecord) => void
}

export function PortfolioCard({ portfolio, onDelete, onDuplicate }: PortfolioCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const updatedAt = new Date(portfolio.updated_at)
  const timeAgo = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
  const timeLabel = timeAgo === 0 ? 'Today' : timeAgo === 1 ? 'Yesterday' : `${timeAgo}d ago`

  const deployedAt = portfolio.last_deployed_at ? new Date(portfolio.last_deployed_at) : null
  const deployedDaysAgo = deployedAt
    ? Math.floor((Date.now() - deployedAt.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const deployedLabel = deployedDaysAgo === null
    ? null
    : deployedDaysAgo === 0
    ? 'Deployed today'
    : deployedDaysAgo === 1
    ? 'Deployed yesterday'
    : `Deployed ${deployedDaysAgo}d ago`

  async function handleCopy() {
    if (!portfolio.deployment_url) return
    await navigator.clipboard.writeText(portfolio.deployment_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDuplicate() {
    setDuplicating(true)
    try {
      const res = await fetch(`/api/portfolio/${portfolio.id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      const copy = await res.json()
      onDuplicate(copy)
    } catch {
      alert('Could not duplicate portfolio. Please try again.')
    } finally {
      setDuplicating(false)
    }
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
        alert(
          `Portfolio deleted, but the GitHub repo could not be removed: ${data.warning}\n\nYou may need to sign out and back in to grant permission.`
        )
      }
      onDelete(portfolio.id)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Network error. Please try again.')
    }
  }

  if (confirmDelete) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-700 flex-1 leading-relaxed">
          {portfolio.github_repo
            ? `This will permanently delete the portfolio and the GitHub repo "${portfolio.github_repo}".`
            : 'This will permanently delete this portfolio. Cannot be undone.'}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            Delete permanently
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 hover:shadow-sm transition-all duration-150">
      <div className="group flex items-center gap-4 p-4">
        {/* Template accent bar */}
        <div
          className="w-0.5 h-10 rounded-full shrink-0"
          style={{ backgroundColor: portfolio.accent_color }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-zinc-900 truncate">{portfolio.name}</p>
            <span className="text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md shrink-0 font-medium">
              {TEMPLATE_LABELS[portfolio.template_id]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {portfolio.deployment_url ? (
              <a
                href={portfolio.deployment_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {portfolio.deployment_url.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <p className="text-xs text-zinc-400">Not deployed yet</p>
            )}
            {deployedLabel && (
              <span className="text-[11px] text-zinc-400 hidden sm:inline">{deployedLabel}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {portfolio.view_count > 0 && (
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-900 tabular-nums">{portfolio.view_count.toLocaleString()}</p>
              <p className="text-[10px] text-zinc-400">views</p>
            </div>
          )}
          <span className="text-xs text-zinc-400 tabular-nums">{timeLabel}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <a href={`/portfolio/${portfolio.id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </a>

          {/* Duplicate */}
          <button
            onClick={handleDuplicate}
            disabled={duplicating}
            title="Duplicate portfolio"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* QR code */}
          {portfolio.deployment_url && (
            <button
              onClick={() => setShowQr((v) => !v)}
              title="QR code"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showQr ? 'text-indigo-600 bg-indigo-50' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path strokeLinecap="round" d="M14 14h1m3 0h2m-2 3v4m-3-4v1" />
              </svg>
            </button>
          )}

          {/* Copy URL */}
          {portfolio.deployment_url && (
            <button
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy URL'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>
          )}

          <button
            onClick={() => setConfirmDelete(true)}
            title="Delete portfolio"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* QR code panel */}
      {showQr && portfolio.deployment_url && (
        <div className="border-t border-zinc-100 px-4 py-3 flex items-center gap-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(portfolio.deployment_url)}&bgcolor=ffffff&color=000000&margin=2`}
            alt="QR code"
            width={96}
            height={96}
            className="rounded-lg border border-zinc-100"
          />
          <div>
            <p className="text-xs font-medium text-zinc-700 mb-1">Scan to open portfolio</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs">
              Right-click the QR code to save it. Use it on your resume or business card.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
