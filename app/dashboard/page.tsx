'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { PortfolioCard } from '@/components/dashboard/PortfolioCard'
import { clearAll } from '@/lib/storage'
import type { PortfolioRecord } from '@/lib/types'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => setPortfolios(Array.isArray(data) ? data : []))
      .catch(() => setPortfolios([]))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id: string) {
    setPortfolios((prev) => prev.filter((p) => p.id !== id))
  }

  function handleDuplicate(copy: PortfolioRecord) {
    setPortfolios((prev) => [copy, ...prev])
  }

  function handleCreateNew() {
    clearAll()
  }

  const name = session?.user?.name ?? ''
  const firstName = name.split(' ')[0] || 'You'
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-zinc-50 flex">

      {/* ── Sidebar (lg+) ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-white border-r border-zinc-200 h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100">
          <a href="/" className="text-sm font-bold tracking-tight text-zinc-900">ResumeFolio</a>
        </div>

        {/* User */}
        <div className="px-5 py-4 border-b border-zinc-100">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-8 h-8 rounded-full mb-3"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
              <span className="text-xs font-bold text-indigo-600">{initials}</span>
            </div>
          )}
          <p className="text-sm font-semibold text-zinc-900 truncate leading-none mb-0.5">
            {session?.user?.name ?? 'User'}
          </p>
          {session?.user?.email && (
            <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4">
          <a
            href="/create"
            onClick={handleCreateNew}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors mb-3"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New portfolio
          </a>

          <div className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg">
            <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Portfolios
            {!loading && (
              <span className="ml-auto text-xs text-zinc-400 tabular-nums">{portfolios.length}</span>
            )}
          </div>
        </nav>

        {/* Sign out */}
        <div className="px-5 py-4 border-t border-zinc-100">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
          <a href="/" className="text-sm font-bold tracking-tight text-zinc-900">ResumeFolio</a>
          <div className="flex items-center gap-2">
            <a href="/create" onClick={handleCreateNew}>
              <Button size="sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New
              </Button>
            </a>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-7 h-7 rounded-full border border-zinc-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-indigo-600">{initials}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-4xl w-full">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              {firstName}&apos;s portfolios
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {loading
                ? 'Loading…'
                : portfolios.length === 0
                ? 'Create your first portfolio below.'
                : `${portfolios.length} portfolio${portfolios.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 py-12 text-zinc-400">
              <div className="w-4 h-4 border-2 border-zinc-300 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm">Loading portfolios…</span>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-zinc-900 mb-2">Nothing here yet</p>
              <p className="text-sm text-zinc-500 mb-8 max-w-xs mx-auto leading-relaxed">
                Upload your resume and have a live portfolio in under a minute.
              </p>
              <a href="/create" onClick={handleCreateNew}>
                <Button>Upload your resume →</Button>
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {portfolios.map((p) => (
                <PortfolioCard key={p.id} portfolio={p} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              ))}

              {/* Add new row */}
              <a
                href="/create"
                onClick={handleCreateNew}
                className="group flex items-center gap-3 p-4 border-2 border-dashed border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 mt-1"
              >
                <div className="w-7 h-7 rounded-lg border-2 border-dashed border-zinc-300 group-hover:border-indigo-400 flex items-center justify-center transition-colors shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors">
                  New portfolio
                </span>
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
