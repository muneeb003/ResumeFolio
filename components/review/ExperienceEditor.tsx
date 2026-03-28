'use client'

import { Input } from '@/components/ui/Input'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import { ImproveBulletButton } from './ImproveBulletButton'
import type { ExperienceEntry } from '@/lib/types'

interface Props {
  items: ExperienceEntry[]
  onChange: (items: ExperienceEntry[]) => void
}

function empty(): ExperienceEntry {
  return { company: '', role: '', period: '', location: '', bullets: [''], tags: [] }
}

export function ExperienceEditor({ items, onChange }: Props) {
  function update(index: number, patch: Partial<ExperienceEntry>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  function updateBullet(expIndex: number, bulletIndex: number, value: string) {
    const bullets = [...items[expIndex].bullets]
    bullets[bulletIndex] = value
    update(expIndex, { bullets })
  }

  function addBullet(expIndex: number) {
    update(expIndex, { bullets: [...items[expIndex].bullets, ''] })
  }

  function removeBullet(expIndex: number, bulletIndex: number) {
    const bullets = items[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    update(expIndex, { bullets: bullets.length ? bullets : [''] })
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((exp, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Company" value={exp.company} onChange={(e) => update(i, { company: e.target.value })} />
            <Input label="Role / Title" value={exp.role} onChange={(e) => update(i, { role: e.target.value })} />
            <Input label="Period" value={exp.period} placeholder="Jan 2022 – Present" onChange={(e) => update(i, { period: e.target.value })} />
            <Input label="Location" value={exp.location} placeholder="Remote" onChange={(e) => update(i, { location: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Bullets</label>
            {exp.bullets.map((bullet, bi) => (
              <div key={bi} className="flex items-center gap-2">
                <input
                  value={bullet}
                  onChange={(e) => updateBullet(i, bi, e.target.value)}
                  placeholder="Led migration of X, reducing load time by 40%"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <ImproveBulletButton
                  bullet={bullet}
                  role={exp.role}
                  onImproved={(improved) => updateBullet(i, bi, improved)}
                />
                <button
                  type="button"
                  onClick={() => removeBullet(i, bi)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  aria-label="Remove bullet"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addBullet(i)}
              className="text-xs text-indigo-600 hover:text-indigo-700 text-left font-medium mt-1"
            >
              + Add bullet
            </button>
          </div>

          <TagInput
            label="Tech tags"
            value={exp.tags}
            onChange={(tags) => update(i, { tags })}
            placeholder="React, Node.js, PostgreSQL…"
          />

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
        + Add experience
      </Button>
    </div>
  )
}
