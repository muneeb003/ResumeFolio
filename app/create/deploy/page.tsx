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

function ProgressRow({
  label,
  state,
}: {
  label: string
  state: 'pending' | 'active' | 'done' | 'error'
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        {state === 'done' && (
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {state === 'active' && (
          <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
        )}
        {state === 'pending' && (
          <div className="w-4 h-4 rounded-full border-2 border-zinc-200" />
        )}
        {state === 'error' && (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
      <span
        className={`text-sm ${
          state === 'active'
            ? 'text-zinc-900 font-medium'
            : state === 'done'
            ? 'text-zinc-500'
            : state === 'error'
            ? 'text-red-600'
            : 'text-zinc-400'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

const MODE_OPTIONS: { id: DeployMode; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'self',
    label: 'Instant Publish',
    desc: 'Live link in seconds',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub Pages',
    desc: 'Your github.io URL',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'download',
    label: 'Download ZIP',
    desc: 'Host it yourself',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
]

export default function DeployPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [design, setDesign] = useState<{
    templateId: TemplateId
    accentColor: string
    sectionOrder: SectionId[]
    hiddenSections: SectionId[]
  } | null>(null)
  const [mode, setMode] = useState<DeployMode>('self')
  const [repoName, setRepoName] = useState('')
  const [existingRepo, setExistingRepo] = useState<string | null>(null)
  const [step, setStep] = useState<DeployStep>('idle')
  const [liveUrl, setLiveUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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
          body: JSON.stringify({ name: resumeData.name || 'My Portfolio', resumeData, ...design }),
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
        body: JSON.stringify({
          resumeData, ...design,
          repoName: repoName.trim(),
          portfolioName: resumeData.name || 'My Portfolio',
        }),
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
          body: JSON.stringify({
            name: resumeData.name || 'My Portfolio', resumeData, ...design,
            githubRepo: fullRepo, deploymentUrl: data.url,
          }),
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

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(liveUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!resumeData || !design) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-lg mx-auto px-4 py-16">
        <StepIndicator currentStep={4} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
            Publish your portfolio
          </h1>
          <p className="text-sm text-zinc-500">Choose how you want to share your work.</p>
        </div>

        {/* IDLE — mode picker */}
        {step === 'idle' && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col gap-5">
            {/* Mode selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all duration-150 ${
                    mode === opt.id
                      ? 'border-indigo-500 bg-indigo-50/60'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <span className={`shrink-0 ${mode === opt.id ? 'text-indigo-600' : 'text-zinc-500'} transition-colors`}>
                    {opt.icon}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold leading-none mb-0.5 sm:mb-1 ${mode === opt.id ? 'text-indigo-700' : 'text-zinc-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-tight">{opt.desc}</p>
                  </div>
                  {/* Mobile selection indicator */}
                  {mode === opt.id && (
                    <div className="ml-auto sm:hidden w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Mode details */}
            {mode === 'self' && (
              <div className="flex items-start gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Your portfolio will be live at a shareable link instantly — no GitHub required.
                </p>
              </div>
            )}

            {mode === 'github' && (
              <div className="flex flex-col gap-3">
                {existingRepo ? (
                  <div className="flex items-center gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-700">Updating existing repo</p>
                      <p className="text-[11px] text-zinc-400 truncate">{existingRepo}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input
                      label="Repository name"
                      value={repoName}
                      onChange={(e) =>
                        setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                      }
                      hint={`Live at: https://your-username.github.io/${repoName || 'my-portfolio'}`}
                    />
                  </>
                )}
              </div>
            )}

            {mode === 'download' && (
              <div className="flex items-start gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                <svg className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Downloads a ZIP with a single{' '}
                  <code className="bg-zinc-200 px-1 rounded text-[11px]">index.html</code> file.
                  Open in any browser or deploy to Netlify, Vercel, or any static host.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <Button size="lg" onClick={handleDeploy} className="w-full">
                {mode === 'self' && 'Publish now →'}
                {mode === 'github' && 'Deploy to GitHub Pages →'}
                {mode === 'download' && 'Download ZIP →'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/create/design')}
                className="w-full"
              >
                ← Back to Design
              </Button>
            </div>
          </div>
        )}

        {/* DEPLOYING / CHECKING */}
        {(step === 'deploying' || step === 'checking') && (
          <div className="bg-white rounded-xl border border-zinc-200 p-7 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-zinc-900 mb-1">
              {mode === 'download' ? 'Packaging your portfolio…' : 'Publishing your portfolio…'}
            </h2>
            <ProgressRow label="Saving portfolio data" state="done" />
            {mode === 'self' && (
              <ProgressRow label="Publishing to your link" state="active" />
            )}
            {mode === 'github' && (
              <>
                <ProgressRow
                  label="Pushing to GitHub repository"
                  state={step === 'deploying' ? 'active' : 'done'}
                />
                <ProgressRow
                  label="Enabling GitHub Pages"
                  state={step === 'checking' ? 'active' : 'pending'}
                />
              </>
            )}
            {mode === 'download' && (
              <ProgressRow label="Packaging ZIP file" state="active" />
            )}
          </div>
        )}

        {/* SUCCESS — URL */}
        {step === 'done' && mode !== 'download' && (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">Portfolio published!</h2>
              {mode === 'github' && (
                <p className="text-xs text-zinc-500 mb-5">
                  GitHub Pages may take 1–3 minutes to go live for the first time.
                </p>
              )}

              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 mb-6 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs text-zinc-600 flex-1 truncate font-mono">{liveUrl}</span>
                <button
                  onClick={handleCopyUrl}
                  className="text-xs text-zinc-400 hover:text-zinc-700 shrink-0 font-medium transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full">Open portfolio ↗</Button>
                </a>
                <Button variant="secondary" onClick={() => router.push('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
                <button
                  onClick={() => { clearAll(); router.push('/create') }}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors mt-1"
                >
                  Start a new portfolio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS — Download */}
        {step === 'done' && mode === 'download' && (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">Download started!</h2>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                Unzip and open{' '}
                <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">index.html</code>{' '}
                in any browser, or deploy to Netlify, GitHub Pages, or any static host.
              </p>
              <Button variant="secondary" onClick={() => router.push('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-lg">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
            <Button onClick={() => setStep('idle')} variant="secondary" className="w-full">
              Try again
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
