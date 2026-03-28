import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, tags, avatarHtml } from './shared'

export function generateMinimal(
  data: ResumeData,
  accentColor: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accentColor)

  const renderers = {
    experience: (d: ResumeData) => !d.experience.length ? '' : `
      <section>
        <h2 style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid ${a}">Experience</h2>
        ${d.experience.map(exp => `
          <div style="margin-bottom:28px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px">
              <div>
                <span style="font-size:16px;font-weight:600;color:#111827">${esc(exp.role)}</span>
                <span style="color:#6b7280;margin-left:8px">· ${esc(exp.company)}</span>
              </div>
              <span style="font-size:13px;color:#9ca3af">${esc(exp.period)}${exp.location ? ' · ' + esc(exp.location) : ''}</span>
            </div>
            <ul style="margin-top:10px;padding-left:18px;color:#374151;font-size:14px;line-height:1.7">
              ${exp.bullets.filter(b=>b).map(b => `<li style="margin-bottom:4px">${esc(b)}</li>`).join('')}
            </ul>
            ${exp.tags.length ? `<div style="margin-top:10px">${tags(exp.tags, accentColor)}</div>` : ''}
          </div>
        `).join('')}
      </section>`,

    projects: (d: ResumeData) => !d.projects.length ? '' : `
      <section>
        <h2 style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid ${a}">Projects</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
          ${d.projects.map(p => `
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:18px">
              <h3 style="font-size:15px;font-weight:600;color:#111827;margin-bottom:6px">${esc(p.name)}</h3>
              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:12px">${esc(p.description)}</p>
              <div style="margin-bottom:12px">${tags(p.tags, accentColor)}</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" style="font-size:12px;font-weight:500;color:${a};text-decoration:none;border:1px solid ${a};padding:4px 10px;border-radius:6px">Live Demo ↗</a>` : ''}
                ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" style="font-size:12px;font-weight:500;color:#6b7280;text-decoration:none;border:1px solid #e5e7eb;padding:4px 10px;border-radius:6px">GitHub ↗</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>`,

    skills: (d: ResumeData) => !d.skills.length ? '' : `
      <section>
        <h2 style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid ${a}">Skills</h2>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${d.skills.map(g => `
            <div>
              <span style="font-size:13px;font-weight:600;color:#374151;margin-right:10px">${esc(g.category)}</span>
              ${tags(g.items, accentColor)}
            </div>
          `).join('')}
        </div>
      </section>`,

    education: (d: ResumeData) => !d.education.length ? '' : `
      <section>
        <h2 style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid ${a}">Education</h2>
        ${d.education.map(edu => `
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:16px">
            <div>
              <span style="font-size:15px;font-weight:600;color:#111827">${esc(edu.degree)}</span>
              <span style="color:#6b7280;margin-left:8px">· ${esc(edu.institution)}</span>
              ${edu.note ? `<span style="font-size:13px;color:#9ca3af;margin-left:6px">(${esc(edu.note)})</span>` : ''}
            </div>
            <span style="font-size:13px;color:#9ca3af">${esc(edu.period)}</span>
          </div>
        `).join('')}
      </section>`,

    contact: (d: ResumeData) => `
      <section>
        <h2 style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid ${a}">Contact</h2>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="font-size:14px;color:${a};text-decoration:none">${esc(d.contact.email)}</a>` : ''}
          ${d.contact.github ? `<a href="${esc(d.contact.github)}" target="_blank" style="font-size:14px;color:${a};text-decoration:none">GitHub ↗</a>` : ''}
          ${d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}" target="_blank" style="font-size:14px;color:${a};text-decoration:none">LinkedIn ↗</a>` : ''}
        </div>
      </section>`,
  }

  const sections = renderSections(data, sectionOrder, hiddenSections, renderers)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(data.name)} — Portfolio</title>
<meta name="description" content="${esc(data.bio.slice(0, 160))}">
<meta property="og:title" content="${esc(data.name)} — Portfolio">
<meta property="og:description" content="${esc(data.bio.slice(0, 160))}">
<meta property="og:type" content="profile">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}","description":"${esc(data.bio)}"${data.contact.email ? `,"email":"${esc(data.contact.email)}"` : ''}${data.contact.github ? `,"sameAs":"${esc(data.contact.github)}"` : ''}}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;color:#111827;background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
</style>
</head>
<body>
<header style="background:#fff;border-bottom:1px solid #f3f4f6;padding:48px 0 40px">
  <div style="max-width:800px;margin:0 auto;padding:0 32px;display:flex;flex-direction:column;align-items:flex-start">
    ${data.photo ? avatarHtml(data, 80, 'margin-bottom:20px;border:3px solid #e5e7eb;') : ''}
    <h1 style="font-size:36px;font-weight:700;color:#111827;margin-bottom:6px">${esc(data.name)}</h1>
    <p style="font-size:18px;font-weight:500;color:${a};margin-bottom:16px">${esc(data.title)}</p>
    <p style="font-size:15px;color:#6b7280;max-width:600px;line-height:1.7">${esc(data.bio)}</p>
  </div>
</header>
<main style="max-width:800px;margin:0 auto;padding:48px 32px;display:flex;flex-direction:column;gap:48px">
  ${sections}
</main>
</body>
</html>`
}
