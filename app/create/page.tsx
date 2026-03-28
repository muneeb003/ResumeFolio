'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/upload/DropZone'
import { saveResumeData } from '@/lib/storage'
import type { ResumeData } from '@/lib/types'

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const sizeMb = (file.size / 1024 / 1024).toFixed(2)
  return (
    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
        <p className="text-xs text-zinc-400">{sizeMb} MB</p>
      </div>
      <button
        onClick={onRemove}
        className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded"
        aria-label="Remove file"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExtract() {
    if (!file) return
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      saveResumeData(data as ResumeData)
      router.push('/create/review')
    } catch {
      setError('Connection error. Please check your network and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-lg mx-auto px-4 py-16">
        <StepIndicator currentStep={1} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
            Upload your resume
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            AI will extract your information and pre-fill everything automatically.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col gap-4">
          {!file ? (
            <DropZone onFileDrop={(f) => { setFile(f); setError(null) }} disabled={isLoading} />
          ) : (
            <FilePreview file={file} onRemove={() => setFile(null)} />
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          <Button
            onClick={handleExtract}
            disabled={!file}
            loading={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Extracting with AI…' : 'Extract resume data →'}
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <button
            onClick={() => {
              saveResumeData({
                name: '', title: '', bio: '',
                contact: { email: '', github: '', linkedin: '' },
                experience: [], projects: [], skills: [], education: [],
              })
              router.push('/create/review')
            }}
            className="text-xs text-zinc-500 hover:text-indigo-600 text-center font-medium transition-colors py-1"
          >
            Fill in manually instead →
          </button>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          PDF or DOCX · max 10 MB · data stays private
        </p>
      </div>
    </main>
  )
}
