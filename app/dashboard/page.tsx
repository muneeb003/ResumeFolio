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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-gray-900">ResumeFolio</a>
          <div className="flex items-center gap-3">
            <a href="/create" onClick={handleCreateNew}>
              <Button size="sm">+ New Portfolio</Button>
            </a>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {session?.user?.name ? `Welcome back, ${session.user.name.split(' ')[0]}` : 'My Portfolios'}
          </h1>
          <p className="text-gray-500">Manage and update your portfolio websites.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No portfolios yet</h2>
            <p className="text-gray-500 mb-6">Upload your resume to create your first portfolio in minutes.</p>
            <a href="/create" onClick={handleCreateNew}>
              <Button size="lg">Create Your Portfolio →</Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((p) => (
              <PortfolioCard key={p.id} portfolio={p} onDelete={handleDelete} />
            ))}
            <a href="/create" onClick={handleCreateNew} className="block">
              <div className="h-full min-h-[180px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-400">+</span>
                </div>
                <span className="text-sm font-medium text-gray-500">New Portfolio</span>
              </div>
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
