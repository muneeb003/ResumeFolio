import type { ResumeData, SectionId } from '@/lib/types'

/** Renders either a real photo <img> or an initials circle div */
export function avatarHtml(
  data: ResumeData,
  size: number,
  extraStyle = ''
): string {
  const initials = data.name
    .split(' ')
    .slice(0, 2)
    .map((w) => (w[0] ?? '').toUpperCase())
    .join('')
  if (data.photo) {
    return `<img src="${esc(data.photo)}" alt="${esc(data.name)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;${extraStyle}">`
  }
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(size * 0.38)}px;flex-shrink:0;${extraStyle}">${initials}</div>`
}

export function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function renderSections(
  data: ResumeData,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[],
  renderers: Record<SectionId, (data: ResumeData) => string>
): string {
  return sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map((id) => renderers[id]?.(data) ?? '')
    .join('\n')
}

export function tags(items: string[], accent: string): string {
  return items
    .map(
      (t) =>
        `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:500;background:${esc(accent)}18;color:${esc(accent)};margin:2px">${esc(t)}</span>`
    )
    .join('')
}
