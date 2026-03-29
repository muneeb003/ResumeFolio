'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/auth/UserMenu'
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

  function handleCreateNew() {
    clearAll()
  }

  const firstName = session?.user?.name?.split(' ')[0]

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight text-zinc-900">
            ResumeFolio
          </a>
          <div className="flex items-center gap-2">
            <a href="/create" onClick={handleCreateNew}>
              <Button size="sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New portfolio
              </Button>
            </a>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">
            {firstName ? `Welcome back, ${firstName}` : 'My Portfolios'}
          </h1>
          <p className="text-sm text-zinc-500">Manage and update your live portfolio websites.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-28">
            <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : portfolios.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-zinc-200 rounded-xl p-16 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-6 h-6 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900 mb-1">No portfolios yet</h2>
            <p className="text-sm text-zinc-500 mb-7 max-w-xs mx-auto leading-relaxed">
              Upload your resume to create your first live portfolio in under a minute.
            </p>
            <a href="/create" onClick={handleCreateNew}>
              <Button>Create your portfolio →</Button>
            </a>
          </div>
        ) : (
          /* Portfolio grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((p) => (
              <PortfolioCard key={p.id} portfolio={p} onDelete={handleDelete} />
            ))}

            {/* Add new card */}
            <a href="/create" onClick={handleCreateNew} className="block">
              <div className="h-full min-h-[180px] border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 rounded-lg border-2 border-dashed border-zinc-300 group-hover:border-indigo-300 flex items-center justify-center transition-colors duration-200">
                  <svg
                    className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors duration-200">
                  New portfolio
                </span>
              </div>
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
