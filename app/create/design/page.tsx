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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <StepIndicator currentStep={3} />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Choose your design</h1>
          <p className="text-sm text-zinc-500">Pick a template and customize the colors and sections.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Controls sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-1">Template</h2>
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

            <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-3">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Accent Color</h2>
              <ColorPicker
                swatches={TEMPLATE_COLORS[templateId]}
                value={accentColor}
                onChange={setAccentColor}
              />
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-2.5">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Sections</h2>
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
                Deploy this design →
              </Button>
              <Button variant="secondary" onClick={() => router.push('/create/review')} className="w-full">
                ← Back to Edit
              </Button>
            </div>
          </div>

          {/* Live preview */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-400">Live preview (scaled)</p>
            {previewHtml ? (
              <TemplatePreview html={previewHtml} />
            ) : (
              <div className="bg-zinc-100 rounded-xl aspect-video flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
