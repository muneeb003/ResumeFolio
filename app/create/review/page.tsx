'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SectionCard } from '@/components/review/SectionCard'
import { ExperienceEditor } from '@/components/review/ExperienceEditor'
import { ProjectEditor } from '@/components/review/ProjectEditor'
import { SkillsEditor } from '@/components/review/SkillsEditor'
import { EducationEditor } from '@/components/review/EducationEditor'
import { AtsPanel } from '@/components/review/AtsPanel'
import { loadResumeData, saveResumeData } from '@/lib/storage'
import type { ResumeData } from '@/lib/types'

export default function ReviewPage() {
  const router = useRouter()
  const [data, setData] = useState<ResumeData | null>(null)

  useEffect(() => {
    const loaded = loadResumeData()
    if (!loaded) { router.replace('/create'); return }
    setData(loaded)
  }, [router])

  function update(patch: Partial<ResumeData>) {
    setData((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      saveResumeData(next)
      return next
    })
  }

  function updateContact(patch: Partial<ResumeData['contact']>) {
    if (!data) return
    update({ contact: { ...data.contact, ...patch } })
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <StepIndicator currentStep={2} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Review & Edit Your Info</h1>
          <p className="text-gray-500">
            Everything was extracted by AI — check for accuracy and fill in anything that's missing.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SectionCard title="Basic Info">
            {/* Photo upload */}
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                {data.photo ? (
                  <img src={data.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl ring-2 ring-gray-200">
                    {data.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'}
                  </div>
                )}
                {data.photo && (
                  <button
                    onClick={() => update({ photo: undefined })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >✕</button>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Profile Photo</p>
                <p className="text-xs text-gray-400 mb-2">Optional. JPG, PNG or WebP. Will be resized to 400×400.</p>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {data.photo ? 'Change photo' : 'Upload photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const img = new Image()
                      const url = URL.createObjectURL(file)
                      img.onload = () => {
                        const MAX = 400
                        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
                        const canvas = document.createElement('canvas')
                        canvas.width = Math.round(img.width * scale)
                        canvas.height = Math.round(img.height * scale)
                        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
                        update({ photo: canvas.toDataURL('image/jpeg', 0.85) })
                        URL.revokeObjectURL(url)
                      }
                      img.src = url
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" value={data.name} onChange={(e) => update({ name: e.target.value })} />
              <Input label="Job Title" value={data.title} placeholder="Senior Software Engineer" onChange={(e) => update({ title: e.target.value })} />
            </div>
            <Textarea label="Bio" value={data.bio} rows={4} placeholder="A 2-3 sentence professional summary…" onChange={(e) => update({ bio: e.target.value })} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Email" value={data.contact.email} type="email" onChange={(e) => updateContact({ email: e.target.value })} />
              <Input label="GitHub URL" value={data.contact.github} placeholder="https://github.com/…" onChange={(e) => updateContact({ github: e.target.value })} />
              <Input label="LinkedIn URL" value={data.contact.linkedin} placeholder="https://linkedin.com/in/…" onChange={(e) => updateContact({ linkedin: e.target.value })} />
            </div>
          </SectionCard>

          <SectionCard title="Experience">
            <ExperienceEditor items={data.experience} onChange={(experience) => update({ experience })} />
          </SectionCard>

          <SectionCard title="Projects">
            <ProjectEditor items={data.projects} onChange={(projects) => update({ projects })} />
          </SectionCard>

          <SectionCard title="Skills">
            <SkillsEditor items={data.skills} onChange={(skills) => update({ skills })} />
          </SectionCard>

          <SectionCard title="Education">
            <EducationEditor items={data.education} onChange={(education) => update({ education })} />
          </SectionCard>

          <AtsPanel resumeData={data} />
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={() => router.push('/create')}>← Back</Button>
          <Button size="lg" onClick={() => router.push('/create/design')}>
            Choose Design →
          </Button>
        </div>
      </div>
    </main>
  )
}
