'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { EducationEntry } from '@/lib/types'

interface Props {
  items: EducationEntry[]
  onChange: (items: EducationEntry[]) => void
}

function empty(): EducationEntry {
  return { institution: '', degree: '', period: '', note: '' }
}

export function EducationEditor({ items, onChange }: Props) {
  function update(index: number, patch: Partial<EducationEntry>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((edu, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Institution" value={edu.institution} onChange={(e) => update(i, { institution: e.target.value })} />
            <Input label="Degree / Certification" value={edu.degree} onChange={(e) => update(i, { degree: e.target.value })} />
            <Input label="Period" value={edu.period} placeholder="2015 – 2019" onChange={(e) => update(i, { period: e.target.value })} />
            <Input label="Note (GPA, honors, etc.)" value={edu.note} placeholder="Graduated with Honors (optional)" onChange={(e) => update(i, { note: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Remove entry
            </Button>
          </div>
        </div>
      ))}

      <Button variant="secondary" size="sm" onClick={() => onChange([...items, empty()])}>
        + Add education
      </Button>
    </div>
  )
}
