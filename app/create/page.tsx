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
    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{sizeMb} MB</p>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Remove file">
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <StepIndicator currentStep={1} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Resume</h1>
          <p className="text-gray-500">
            Our AI will extract your information and pre-fill everything for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
          {!file ? (
            <DropZone onFileDrop={(f) => { setFile(f); setError(null) }} disabled={isLoading} />
          ) : (
            <FilePreview file={file} onRemove={() => setFile(null)} />
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
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
            {isLoading ? 'Extracting with AI…' : 'Extract Resume Data →'}
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
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
            className="text-sm text-indigo-600 hover:text-indigo-700 text-center font-medium"
          >
            Fill in manually instead →
          </button>
        </div>
      </div>
    </main>
  )
}
