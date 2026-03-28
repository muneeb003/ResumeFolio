'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Toggle } from '@/components/ui/Toggle'
import { TemplateCard } from '@/components/design/TemplateCard'
import { TemplatePreview } from '@/components/design/TemplatePreview'
import { loadResumeData, loadDesign, saveDesign } from '@/lib/storage'
import { generateHTML } from '@/lib/templates/index'
import { TEMPLATE_COLORS, TEMPLATE_LABELS, DEFAULT_SECTION_ORDER } from '@/lib/types'
import type { ResumeData, TemplateId, SectionId } from '@/lib/types'

const TEMPLATES: { id: TemplateId; description: string }[] = [
  { id: 'developer', description: 'VS Code–inspired editor layout with file tree, tabs, and syntax highlighting.' },
  { id: 'designer', description: 'Asymmetric editorial layout with oversized typography and scroll reveals.' },
  { id: 'editorial', description: 'Swiss two-column grid. Pure typography, perfect whitespace, zero decoration.' },
  { id: 'cinematic', description: 'Full-screen sections, alternating dark/light, horizontal project scroll.' },
  { id: 'corporate', description: 'Fixed sidebar, animated skill bars, and a vertical experience timeline.' },
  { id: 'student', description: 'Gradient hero, emoji section icons, and a friendly approachable layout.' },
  { id: 'freelancer', description: 'Split-screen hero, services grid, collapsible experience, and a strong CTA.' },
  { id: 'glass', description: 'Frosted glass cards on an animated dark gradient. Ultra-modern SaaS feel.' },
  { id: 'neon', description: 'Cyberpunk dark theme with glowing neon accents and scanline texture.' },
  { id: 'brutalist', description: 'Neo-brutalist: cream background, hard shadows, zero border-radius, raw and bold.' },
  { id: 'magazine', description: 'Editorial magazine layout with Cormorant Garamond and hairline typography.' },
  { id: 'minimal', description: 'Clean, white background with subtle accents. Timeless and professional.' },
  { id: 'dark-dev', description: 'Dark theme with monospace fonts. Popular in developer communities.' },
  { id: 'bold', description: 'Gradient header with strong typography. Stand out from the crowd.' },
]

const SECTION_LABELS: Record<SectionId, string> = {
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  contact: 'Contact',
}

export default function DesignPage() {
  const router = useRouter()
  const [data, setData] = useState<ResumeData | null>(null)
  const [templateId, setTemplateId] = useState<TemplateId>('developer')
  const [accentColor, setAccentColor] = useState('#4f46e5')
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER)
  const [hiddenSections, setHiddenSections] = useState<SectionId[]>([])
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    const resumeData = loadResumeData()
    if (!resumeData) { router.replace('/create'); return }
    setData(resumeData)

    const design = loadDesign()
    setTemplateId(design.templateId)
    setAccentColor(design.accentColor)
    setSectionOrder(design.sectionOrder)
    setHiddenSections(design.hiddenSections)
  }, [router])

  useEffect(() => {
    if (!data) return
    const html = generateHTML(data, templateId, accentColor, sectionOrder, hiddenSections)
    setPreviewHtml(html)
  }, [data, templateId, accentColor, sectionOrder, hiddenSections])

  function changeTemplate(id: TemplateId) {
    setTemplateId(id)
    setAccentColor(TEMPLATE_COLORS[id][0].value)
  }

  function toggleSection(id: SectionId) {
    setHiddenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function handleContinue() {
    saveDesign({ templateId, accentColor, sectionOrder, hiddenSections })
    router.push('/create/deploy')
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        <StepIndicator currentStep={3} />

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">Choose Your Design</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          {/* Controls sidebar */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-700">Template</h2>
              {TEMPLATES.map((t) => (
                <TemplateCard
                  key={t.id}
                  id={t.id}
                  label={TEMPLATE_LABELS[t.id]}
                  description={t.description}
                  selected={templateId === t.id}
                  onClick={() => changeTemplate(t.id)}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-700">Accent Color</h2>
              <ColorPicker
                swatches={TEMPLATE_COLORS[templateId]}
                value={accentColor}
                onChange={setAccentColor}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-700">Sections</h2>
              {sectionOrder.map((id) => (
                <Toggle
                  key={id}
                  checked={!hiddenSections.includes(id)}
                  onChange={() => toggleSection(id)}
                  label={SECTION_LABELS[id]}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={handleContinue} className="w-full">
                Deploy This Design →
              </Button>
              <Button variant="secondary" onClick={() => router.push('/create/review')} className="w-full">
                ← Back to Edit
              </Button>
            </div>
          </div>

          {/* Live preview */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 text-center">Live preview (scaled)</p>
            {previewHtml ? (
              <TemplatePreview html={previewHtml} />
            ) : (
              <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
