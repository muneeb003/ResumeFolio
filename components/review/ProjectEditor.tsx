'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import type { ProjectEntry } from '@/lib/types'

interface Props {
  items: ProjectEntry[]
  onChange: (items: ProjectEntry[]) => void
}

function empty(): ProjectEntry {
  return { name: '', description: '', tags: [], liveUrl: '', repoUrl: '' }
}

export function ProjectEditor({ items, onChange }: Props) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})

  function update(index: number, patch: Partial<ProjectEntry>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  async function autoDescribe(index: number) {
    const repoUrl = items[index].repoUrl.trim()
    if (!repoUrl) return
    setLoadingIndex(index)
    setErrors((prev) => ({ ...prev, [index]: '' }))

    try {
      const res = await fetch('/api/ai/describe-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      })
      const data = await res.json()
      if (res.ok) {
        update(index, { description: data.description })
      } else {
        setErrors((prev) => ({ ...prev, [index]: data.error }))
      }
    } catch {
      setErrors((prev) => ({ ...prev, [index]: 'Failed to fetch description' }))
    } finally {
      setLoadingIndex(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((proj, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
          <Input label="Project name" value={proj.name} onChange={(e) => update(i, { name: e.target.value })} />

          <div className="flex flex-col gap-1">
            <Textarea
              label="Description"
              value={proj.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="A brief, portfolio-ready description of what this project does…"
              rows={3}
            />
            <div className="flex items-center gap-2">
              <Input
                placeholder="GitHub repo URL for auto-describe"
                value={proj.repoUrl}
                onChange={(e) => update(i, { repoUrl: e.target.value })}
              />
              <Button
                variant="secondary"
                size="sm"
                loading={loadingIndex === i}
                onClick={() => autoDescribe(i)}
                disabled={!proj.repoUrl.trim()}
                className="flex-shrink-0"
              >
                🔗 Auto-describe
              </Button>
            </div>
            {errors[i] && <p className="text-xs text-red-500">{errors[i]}</p>}
          </div>

          <Input
            label="Live URL"
            value={proj.liveUrl}
            placeholder="https://myproject.com (optional)"
            onChange={(e) => update(i, { liveUrl: e.target.value })}
          />

          <TagInput
            label="Tech tags"
            value={proj.tags}
            onChange={(tags) => update(i, { tags })}
            placeholder="React, TypeScript, Vercel…"
          />

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Remove project
            </Button>
          </div>
        </div>
      ))}

      <Button variant="secondary" size="sm" onClick={() => onChange([...items, empty()])}>
        + Add project
      </Button>
    </div>
  )
}
