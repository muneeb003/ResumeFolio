import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, tags, avatarHtml } from './shared'

export function generateDarkDev(
  data: ResumeData,
  accentColor: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accentColor)

  const renderers = {
    experience: (d: ResumeData) => !d.experience.length ? '' : `
      <section>
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:20px">> Experience</h2>
        ${d.experience.map(exp => `
          <div style="margin-bottom:28px;padding-left:16px;border-left:2px solid ${a}30">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:8px">
              <span style="font-size:15px;font-weight:600;color:#e2e8f0">${esc(exp.role)} <span style="color:${a}">@</span> ${esc(exp.company)}</span>
              <span style="font-size:12px;color:#64748b;font-family:monospace">${esc(exp.period)}</span>
            </div>
            <ul style="color:#94a3b8;font-size:14px;line-height:1.7;padding-left:16px;margin-bottom:10px">
              ${exp.bullets.filter(b=>b).map(b => `<li style="margin-bottom:4px">${esc(b)}</li>`).join('')}
            </ul>
            ${exp.tags.length ? `<div>${tags(exp.tags, accentColor)}</div>` : ''}
          </div>
        `).join('')}
      </section>`,

    projects: (d: ResumeData) => !d.projects.length ? '' : `
      <section>
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:20px">> Projects</h2>
        ${d.projects.map(p => `
          <div style="margin-bottom:20px;padding:16px;border:1px solid #1e293b;border-radius:8px;background:#0f172a">
            <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px;margin-bottom:8px">
              <h3 style="font-size:15px;font-weight:600;color:#e2e8f0;font-family:monospace">${esc(p.name)}</h3>
              <div style="display:flex;gap:8px">
                ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" style="font-size:12px;color:${a};text-decoration:none">↗ live</a>` : ''}
                ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" style="font-size:12px;color:#64748b;text-decoration:none">↗ repo</a>` : ''}
              </div>
            </div>
            <p style="font-size:13px;color:#94a3b8;line-height:1.6;margin-bottom:10px">${esc(p.description)}</p>
            ${tags(p.tags, accentColor)}
          </div>
        `).join('')}
      </section>`,

    skills: (d: ResumeData) => !d.skills.length ? '' : `
      <section>
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:20px">> Skills</h2>
        ${d.skills.map(g => `
          <div style="margin-bottom:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span style="font-size:12px;font-weight:600;color:#64748b;font-family:monospace;min-width:100px">${esc(g.category)}</span>
            ${tags(g.items, accentColor)}
          </div>
        `).join('')}
      </section>`,

    education: (d: ResumeData) => !d.education.length ? '' : `
      <section>
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:20px">> Education</h2>
        ${d.education.map(edu => `
          <div style="margin-bottom:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">
            <span style="color:#e2e8f0;font-size:14px">${esc(edu.degree)} · <span style="color:#94a3b8">${esc(edu.institution)}</span>${edu.note ? ` · <span style="font-size:13px;color:#64748b">${esc(edu.note)}</span>` : ''}</span>
            <span style="font-size:12px;color:#64748b;font-family:monospace">${esc(edu.period)}</span>
          </div>
        `).join('')}
      </section>`,

    contact: (d: ResumeData) => `
      <section>
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:20px">> Contact</h2>
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="font-size:14px;color:${a};text-decoration:none;font-family:monospace">${esc(d.contact.email)}</a>` : ''}
          ${d.contact.github ? `<a href="${esc(d.contact.github)}" target="_blank" style="font-size:14px;color:${a};text-decoration:none">github ↗</a>` : ''}
          ${d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}" target="_blank" style="font-size:14px;color:${a};text-decoration:none">linkedin ↗</a>` : ''}
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
<meta property="og:type" content="profile">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}"}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;color:#cbd5e1;background:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
</style>
</head>
<body>
<header style="max-width:760px;margin:0 auto;padding:56px 32px 40px">
  <p style="font-size:12px;color:${a};font-family:'JetBrains Mono',monospace;margin-bottom:12px">~/portfolio</p>
  ${data.photo ? avatarHtml(data, 80, 'margin-bottom:20px;border:3px solid #30363d;') : ''}
  <h1 style="font-size:38px;font-weight:700;color:#f1f5f9;margin-bottom:6px">${esc(data.name)}</h1>
  <p style="font-size:16px;color:${a};font-family:'JetBrains Mono',monospace;margin-bottom:16px">${esc(data.title)}</p>
  <p style="font-size:14px;color:#94a3b8;max-width:560px;line-height:1.7">${esc(data.bio)}</p>
</header>
<main style="max-width:760px;margin:0 auto;padding:0 32px 64px;display:flex;flex-direction:column;gap:48px">
  ${sections}
</main>
</body>
</html>`
}
