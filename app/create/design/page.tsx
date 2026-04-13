'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

type MobileTab = 'templates' | 'customize' | 'preview'

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <circle cx="4.5" cy="3"  r="1.2" /><circle cx="9.5" cy="3"  r="1.2" />
      <circle cx="4.5" cy="7"  r="1.2" /><circle cx="9.5" cy="7"  r="1.2" />
      <circle cx="4.5" cy="11" r="1.2" /><circle cx="9.5" cy="11" r="1.2" />
    </svg>
  )
}

function SortableSection({ id, label, checked, onToggle }: {
  id: SectionId; label: string; checked: boolean; onToggle: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 10 : undefined }}
      className="flex items-center gap-1.5"
    >
      <button {...attributes} {...listeners}
        className="text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 rounded"
        aria-label="Drag to reorder" tabIndex={-1}
      >
        <GripIcon />
      </button>
      <Toggle checked={checked} onChange={onToggle} label={label} />
    </div>
  )
}

const TEMPLATES: { id: TemplateId; description: string }[] = [
  { id: 'developer',  description: 'VS Code–inspired editor layout with file tree, tabs, and syntax highlighting.' },
  { id: 'designer',   description: 'Asymmetric editorial layout with oversized typography and scroll reveals.' },
  { id: 'editorial',  description: 'Swiss two-column grid. Pure typography, perfect whitespace, zero decoration.' },
  { id: 'cinematic',  description: 'Full-screen sections, alternating dark/light, horizontal project scroll.' },
  { id: 'corporate',  description: 'Fixed sidebar, animated skill bars, and a vertical experience timeline.' },
  { id: 'student',    description: 'Gradient hero, emoji section icons, and a friendly approachable layout.' },
  { id: 'freelancer', description: 'Split-screen hero, services grid, collapsible experience, and a strong CTA.' },
  { id: 'glass',      description: 'Frosted glass cards on an animated dark gradient. Ultra-modern SaaS feel.' },
  { id: 'neon',       description: 'Cyberpunk dark theme with glowing neon accents and scanline texture.' },
  { id: 'brutalist',  description: 'Neo-brutalist: cream background, hard shadows, zero border-radius, raw and bold.' },
  { id: 'magazine',   description: 'Editorial magazine layout with Cormorant Garamond and hairline typography.' },
  { id: 'minimal',    description: 'Clean, white background with subtle accents. Timeless and professional.' },
  { id: 'dark-dev',   description: 'Dark theme with monospace fonts. Popular in developer communities.' },
  { id: 'bold',       description: 'Gradient header with strong typography. Stand out from the crowd.' },
]

const SECTION_LABELS: Record<SectionId, string> = {
  experience: 'Experience',
  projects:   'Projects',
  skills:     'Skills',
  education:  'Education',
  contact:    'Contact',
}

export default function DesignPage() {
  const router = useRouter()
  const [data,           setData]           = useState<ResumeData | null>(null)
  const [templateId,     setTemplateId]     = useState<TemplateId>('developer')
  const [accentColor,    setAccentColor]    = useState('#4f46e5')
  const [sectionOrder,   setSectionOrder]   = useState<SectionId[]>(DEFAULT_SECTION_ORDER)
  const [hiddenSections, setHiddenSections] = useState<SectionId[]>([])
  const [previewHtml,    setPreviewHtml]    = useState('')
  const [mobileTab,      setMobileTab]      = useState<MobileTab>('templates')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSectionOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as SectionId)
        const newIndex = prev.indexOf(over.id as SectionId)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

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
    setPreviewHtml(generateHTML(data, templateId, accentColor, sectionOrder, hiddenSections))
  }, [data, templateId, accentColor, sectionOrder, hiddenSections])

  function changeTemplate(id: TemplateId) {
    setTemplateId(id)
    setAccentColor(TEMPLATE_COLORS[id][0].value)
  }

  function toggleSection(id: SectionId) {
    setHiddenSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  function handleContinue() {
    saveDesign({ templateId, accentColor, sectionOrder, hiddenSections })
    router.push('/create/deploy')
  }

  if (!data) {
    return (
      <div className="h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  // ─── Shared panel pieces ───────────────────────────────────────────────────

  const templateListPanel = (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-1">Template</h2>
      {TEMPLATES.map((t) => (
        <TemplateCard
          key={t.id} id={t.id}
          label={TEMPLATE_LABELS[t.id]} description={t.description}
          selected={templateId === t.id} onClick={() => changeTemplate(t.id)}
        />
      ))}
    </div>
  )

  const customizePanel = (
    <>
      <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Accent Color</h2>
        <ColorPicker swatches={TEMPLATE_COLORS[templateId]} value={accentColor} onChange={setAccentColor} />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sections</h2>
          <span className="text-[10px] text-zinc-400">drag to reorder</span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((id) => (
              <SortableSection
                key={id} id={id}
                label={SECTION_LABELS[id]}
                checked={!hiddenSections.includes(id)}
                onToggle={() => toggleSection(id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex flex-col gap-2">
        <Button size="lg" onClick={handleContinue} className="w-full">Deploy this design →</Button>
        <Button variant="secondary" onClick={() => router.push('/create/review')} className="w-full">← Back to Edit</Button>
      </div>
    </>
  )

  const previewPanel = (
    <>
      {previewHtml
        ? <TemplatePreview html={previewHtml} />
        : <div className="flex-1 min-h-0 bg-zinc-100 rounded-xl flex items-center justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
      }
    </>
  )

  return (
    /*
      h-screen + flex col: the viewport never scrolls.
      Each inner region manages its own scroll / overflow.
    */
    <main className="h-screen overflow-hidden flex flex-col bg-zinc-50">

      {/* ── Page header (shrinks to its natural height) ── */}
      <div className="shrink-0 px-4 sm:px-6 pt-6 sm:pt-8 pb-3">
        <StepIndicator currentStep={3} />
        <div className="mt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Choose your design</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Pick a template and customize the colors and sections.</p>
        </div>
      </div>

      {/* ── Mobile tab bar ── */}
      <div className="lg:hidden shrink-0 flex border-b border-zinc-200 bg-white px-4">
        {(['templates', 'customize', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              mobileTab === tab
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Body — fills all remaining height ── */}
      <div className="flex-1 min-h-0">

        {/* ══ DESKTOP (lg+): flex row, both columns independently manage scroll ══ */}
        <div className="hidden lg:flex h-full gap-6 px-6 py-4 max-w-7xl mx-auto w-full">

          {/* Left sidebar — fixed width, scrolls its own content */}
          <div className="w-[300px] shrink-0 overflow-y-auto flex flex-col gap-4 pb-4">
            {templateListPanel}
            {customizePanel}
          </div>

          {/* Right — fills remaining width, preview stretches to full height */}
          <div className="flex-1 min-w-0 flex flex-col pb-4">
            {previewPanel}
          </div>
        </div>

        {/* ══ MOBILE: one panel at a time, each scrolls internally ══ */}
        <div className="lg:hidden h-full overflow-hidden">

          {mobileTab === 'templates' && (
            <div className="h-full overflow-y-auto px-4 py-4 flex flex-col gap-4">
              {templateListPanel}
            </div>
          )}

          {mobileTab === 'customize' && (
            <div className="h-full overflow-y-auto px-4 py-4 flex flex-col gap-4">
              {customizePanel}
            </div>
          )}

          {mobileTab === 'preview' && (
            <div className="h-full flex flex-col px-4 py-4">
              {previewPanel}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
