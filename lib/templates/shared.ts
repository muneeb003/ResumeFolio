import type { ResumeData, SectionId } from '@/lib/types'

// ── HTML entity escaping (text content & attribute values) ───────────────────
export function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ── URL allow-listing (for href attributes) ──────────────────────────────────
// Blocks javascript:, data:, vbscript:, and any other non-http(s)/mailto scheme.
// Returns '#' for anything that doesn't match.
export function safeUrl(url: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return esc(trimmed)
  }
  return '#'
}

// ── Image src allow-listing ──────────────────────────────────────────────────
// Same as safeUrl but also permits data:image/ base64 URIs (safe for img src).
// Still blocks data:text/html, data:application/*, javascript:, etc.
export function safeImgSrc(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return esc(trimmed)
  if (/^data:image\/(jpeg|png|gif|webp|avif|svg\+xml);base64,/i.test(trimmed)) return trimmed
  return ''
}

// ── Hex color validation ─────────────────────────────────────────────────────
// Only allows #rgb, #rrggbb, #rrggbbaa. Prevents CSS injection via accent color.
export function safeColor(color: string): string {
  if (!color) return '#4f46e5'
  const trimmed = color.trim()
  return /^#[0-9a-fA-F]{3,8}$/.test(trimmed) ? trimmed : '#4f46e5'
}

// ── JSON-LD structured data ──────────────────────────────────────────────────
// Using JSON.stringify (not esc) — HTML entities are not decoded inside <script>.
// Escaping </script> prevents breaking out of the script tag.
export function buildJsonLd(data: ResumeData): string {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.title,
  }
  if (data.bio) obj.description = data.bio
  if (data.contact?.email) obj.email = data.contact.email

  const sameAs: string[] = []
  if (data.contact?.github) sameAs.push(data.contact.github)
  if (data.contact?.linkedin) sameAs.push(data.contact.linkedin)
  if (sameAs.length === 1) obj.sameAs = sameAs[0]
  else if (sameAs.length > 1) obj.sameAs = sameAs

  const json = JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>')
  return `<script type="application/ld+json">${json}</script>`
}

// ── Avatar ───────────────────────────────────────────────────────────────────
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
    const src = safeImgSrc(data.photo)
    if (src) return `<img src="${src}" alt="${esc(data.name)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;${extraStyle}">`
  }
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(size * 0.38)}px;flex-shrink:0;${extraStyle}">${esc(initials)}</div>`
}

// ── Section renderer ─────────────────────────────────────────────────────────
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

// ── Skill/tech tags ──────────────────────────────────────────────────────────
export function tags(items: string[], accent: string): string {
  const a = safeColor(accent)
  return items
    .map(
      (t) =>
        `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:500;background:${a}18;color:${a};margin:2px">${esc(t)}</span>`
    )
    .join('')
}
