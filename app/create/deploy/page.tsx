'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loadResumeData, loadDesign, loadPortfolioId, loadGithubRepo, savePortfolioId, saveGithubRepo, clearAll } from '@/lib/storage'
import type { ResumeData, TemplateId, SectionId } from '@/lib/types'

type DeployMode = 'self' | 'github' | 'download'
type DeployStep = 'idle' | 'deploying' | 'checking' | 'done' | 'error'

function ProgressRow({ label, state }: { label: string; state: 'pending' | 'active' | 'done' | 'error' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
        {state === 'done' && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {state === 'active' && <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />}
        {state === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
        {state === 'error' && (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✕</span>
          </div>
        )}
      </div>
      <span className={`text-sm ${state === 'active' ? 'text-gray-900 font-medium' : state === 'done' ? 'text-gray-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

export default function DeployPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [design, setDesign] = useState<{
    templateId: TemplateId; accentColor: string; sectionOrder: SectionId[]; hiddenSections: SectionId[]
  } | null>(null)
  const [mode, setMode] = useState<DeployMode>('self')
  const [repoName, setRepoName] = useState('')
  const [existingRepo, setExistingRepo] = useState<string | null>(null)
  const [step, setStep] = useState<DeployStep>('idle')
  const [liveUrl, setLiveUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const data = loadResumeData()
    if (!data) { router.replace('/create'); return }
    setResumeData(data)
    setDesign(loadDesign())

    const savedRepo = loadGithubRepo()
    if (savedRepo) {
      setExistingRepo(savedRepo)
      setRepoName(savedRepo.split('/')[1] ?? savedRepo)
    } else if (data.name) {
      setRepoName(data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-portfolio')
    } else {
      setRepoName('my-portfolio')
    }
  }, [router])

  async function handleSelfDeploy() {
    if (!resumeData || !design) return
    setStep('deploying')
    setError(null)

    try {
      const existingId = loadPortfolioId()
      let portfolioId = existingId

      if (existingId) {
        await fetch(`/api/portfolio/${existingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData, ...design }),
        })
      } else {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: resumeData.name || 'My Portfolio',
            resumeData,
            ...design,
          }),
        })
        if (!res.ok) throw new Error('Failed to save portfolio')
        const data = await res.json()
        portfolioId = data.id
        savePortfolioId(portfolioId!)
      }

      const url = `${window.location.origin}/p/${portfolioId}`
      await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentUrl: url }),
      })

      setLiveUrl(url)
      setStep('done')
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'Unexpected error')
    }
  }

  async function handleGitHubDeploy() {
    if (!resumeData || !design || !repoName.trim()) return
    setStep('deploying')
    setError(null)

    try {
      const res = await fetch('/api/deploy/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, ...design, repoName: repoName.trim(), portfolioName: resumeData.name || 'My Portfolio' }),
      })
      const data = await res.json()

      if (!res.ok) { setStep('error'); setError(data.error ?? 'Deployment failed'); return }

      setStep('checking')
      setLiveUrl(data.url)

      const fullRepo = existingRepo ?? data.githubRepo
      const existingId = loadPortfolioId()

      if (existingId) {
        await fetch(`/api/portfolio/${existingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData, ...design, githubRepo: fullRepo, deploymentUrl: data.url }),
        }).catch(() => {})
      } else {
        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: resumeData.name || 'My Portfolio', resumeData, ...design, githubRepo: fullRepo, deploymentUrl: data.url }),
        }).then(async (r) => {
          if (r.ok) {
            const { id } = await r.json()
            savePortfolioId(id)
            saveGithubRepo(fullRepo)
          }
        }).catch(() => {})
      }

      setStep('done')
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'Unexpected error')
    }
  }

  async function handleDownload() {
    if (!resumeData || !design) return
    setStep('deploying')
    setError(null)

    try {
      const res = await fetch('/api/deploy/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, ...design, repoName: 'download', portfolioName: resumeData.name || 'My Portfolio' }),
      })

      if (!res.ok) {
        const data = await res.json()
        setStep('error')
        setError(data.error ?? 'Download failed')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'portfolio.zip'
      a.click()
      URL.revokeObjectURL(url)
      setStep('done')
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'Unexpected error')
    }
  }

  function handleDeploy() {
    if (mode === 'self') return handleSelfDeploy()
    if (mode === 'github') return handleGitHubDeploy()
    return handleDownload()
  }

  if (!resumeData || !design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-16">
        <StepIndicator currentStep={4} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Publish Your Portfolio</h1>
          <p className="text-gray-500">Choose how you want to share your portfolio.</p>
        </div>

        {step === 'idle' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMode('self')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'self' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className={`text-sm font-semibold mb-1 ${mode === 'self' ? 'text-indigo-700' : 'text-gray-900'}`}>Instant Publish</p>
                <p className="text-xs text-gray-500">Hosted here, live instantly</p>
              </button>
              <button
                onClick={() => setMode('github')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'github' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className={`text-sm font-semibold mb-1 ${mode === 'github' ? 'text-indigo-700' : 'text-gray-900'}`}>GitHub Pages</p>
                <p className="text-xs text-gray-500">Your own github.io URL</p>
              </button>
              <button
                onClick={() => setMode('download')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'download' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className={`text-sm font-semibold mb-1 ${mode === 'download' ? 'text-indigo-700' : 'text-gray-900'}`}>Download ZIP</p>
                <p className="text-xs text-gray-500">Deploy anywhere yourself</p>
              </button>
            </div>

            {mode === 'self' && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-700">
                Your portfolio will be live at a shareable link instantly — no GitHub required.
              </div>
            )}

            {mode === 'github' && (
              <div className="flex flex-col gap-3">
                {existingRepo ? (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-indigo-700">Updating existing repo</p>
                      <p className="text-xs text-indigo-500 truncate">{existingRepo}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input
                      label="Repository name"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      hint="Will be created at github.com/you/repo-name"
                    />
                    <p className="text-xs text-gray-400">
                      Live at <span className="font-medium text-gray-600">https://your-username.github.io/{repoName || 'my-portfolio'}</span>
                    </p>
                  </>
                )}
              </div>
            )}

            {mode === 'download' && (
              <p className="text-sm text-gray-500">
                Download a ZIP with a single <code className="bg-gray-100 px-1 rounded text-xs">index.html</code> file. Open in any browser or deploy to any host.
              </p>
            )}

            <Button size="lg" onClick={handleDeploy} className="w-full">
              {mode === 'self' && '⚡ Publish Now'}
              {mode === 'github' && '🚀 Deploy to GitHub Pages'}
              {mode === 'download' && '⬇ Download ZIP'}
            </Button>

            <Button variant="secondary" onClick={() => router.push('/create/design')} className="w-full">
              ← Back to Design
            </Button>
          </div>
        )}

        {(step === 'deploying' || step === 'checking') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
            <ProgressRow label="Saving portfolio data" state="done" />
            {mode === 'self' && <ProgressRow label="Publishing to your link" state="active" />}
            {mode === 'github' && (
              <>
                <ProgressRow label="Pushing to GitHub repository" state={step === 'deploying' ? 'active' : 'done'} />
                <ProgressRow label="Enabling GitHub Pages" state={step === 'checking' ? 'active' : 'pending'} />
              </>
            )}
            {mode === 'download' && <ProgressRow label="Packaging ZIP file" state="active" />}
          </div>
        )}

        {step === 'done' && mode !== 'download' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Portfolio Published!</h2>
              {mode === 'github' && (
                <p className="text-gray-500 text-sm mb-4">GitHub Pages can take 1-3 minutes to go live for the first time.</p>
              )}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                <span className="text-sm text-gray-700 flex-1 truncate">{liveUrl}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(liveUrl)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full">Open Portfolio ↗</Button>
              </a>
              <Button variant="secondary" onClick={() => router.push('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
              <button
                onClick={() => { clearAll(); router.push('/create') }}
                className="text-sm text-gray-400 hover:text-gray-600 mt-1"
              >
                Start a new portfolio
              </button>
            </div>
          </div>
        )}

        {step === 'done' && mode === 'download' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Download Started!</h2>
            <p className="text-sm text-gray-500">Unzip and open <code className="bg-gray-100 px-1 rounded">index.html</code> in any browser, or deploy to Netlify, GitHub Pages, or any static host.</p>
            <Button variant="secondary" onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            <Button onClick={() => setStep('idle')} variant="secondary" className="w-full">Try Again</Button>
          </div>
        )}
      </div>
    </main>
  )
}
