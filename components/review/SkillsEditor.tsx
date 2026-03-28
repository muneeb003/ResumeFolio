'use client'

import { Input } from '@/components/ui/Input'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import type { SkillGroup } from '@/lib/types'

interface Props {
  items: SkillGroup[]
  onChange: (items: SkillGroup[]) => void
}

export function SkillsEditor({ items, onChange }: Props) {
  function update(index: number, patch: Partial<SkillGroup>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((group, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Category (e.g. Frontend)"
              value={group.category}
              onChange={(e) => update(i, { category: e.target.value })}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
            >
              Remove
            </Button>
          </div>
          <TagInput
            value={group.items}
            onChange={(tags) => update(i, { items: tags })}
            placeholder="TypeScript, React, Node.js…"
          />
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        disabled={items.length >= 6}
        onClick={() => onChange([...items, { category: '', items: [] }])}
      >
        + Add skill category
      </Button>
    </div>
  )
}
