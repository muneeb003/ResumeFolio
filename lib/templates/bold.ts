import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, tags, avatarHtml } from './shared'

export function generateBold(
  data: ResumeData,
  accentColor: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accentColor)

  const renderers = {
    experience: (d: ResumeData) => !d.experience.length ? '' : `
      <section style="padding:0 40px">
        <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:24px;letter-spacing:-.02em">Experience</h2>
        ${d.experience.map(exp => `
          <div style="margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid #f0f0f0">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div>
                <span style="font-size:18px;font-weight:700;color:#111">${esc(exp.role)}</span>
                <span style="font-size:16px;color:#666;margin-left:8px">at ${esc(exp.company)}</span>
              </div>
              <span style="font-size:13px;color:#999;background:#f5f5f5;padding:4px 10px;border-radius:20px">${esc(exp.period)}</span>
            </div>
            <ul style="color:#444;font-size:15px;line-height:1.7;padding-left:20px;margin-bottom:12px">
              ${exp.bullets.filter(b=>b).map(b => `<li style="margin-bottom:5px">${esc(b)}</li>`).join('')}
            </ul>
            ${exp.tags.length ? `<div>${tags(exp.tags, accentColor)}</div>` : ''}
          </div>
        `).join('')}
      </section>`,

    projects: (d: ResumeData) => !d.projects.length ? '' : `
      <section style="padding:0 40px">
        <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:24px;letter-spacing:-.02em">Projects</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px">
          ${d.projects.map(p => `
            <div style="border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)">
              <div style="height:6px;background:${a}"></div>
              <div style="padding:20px">
                <h3 style="font-size:16px;font-weight:700;color:#111;margin-bottom:8px">${esc(p.name)}</h3>
                <p style="font-size:14px;color:#666;line-height:1.6;margin-bottom:12px">${esc(p.description)}</p>
                <div style="margin-bottom:12px">${tags(p.tags, accentColor)}</div>
                <div style="display:flex;gap:8px">
                  ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" style="font-size:12px;font-weight:600;color:#fff;background:${a};text-decoration:none;padding:5px 12px;border-radius:6px">Live Demo</a>` : ''}
                  ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" style="font-size:12px;font-weight:600;color:#555;background:#f5f5f5;text-decoration:none;padding:5px 12px;border-radius:6px">GitHub</a>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>`,

    skills: (d: ResumeData) => !d.skills.length ? '' : `
      <section style="padding:0 40px">
        <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:24px;letter-spacing:-.02em">Skills</h2>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${d.skills.map(g => `
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <span style="font-size:14px;font-weight:700;color:#111;min-width:110px">${esc(g.category)}</span>
              ${tags(g.items, accentColor)}
            </div>
          `).join('')}
        </div>
      </section>`,

    education: (d: ResumeData) => !d.education.length ? '' : `
      <section style="padding:0 40px">
        <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:24px;letter-spacing:-.02em">Education</h2>
        ${d.education.map(edu => `
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f0f0f0">
            <div>
              <span style="font-size:16px;font-weight:700;color:#111">${esc(edu.degree)}</span>
              <span style="color:#666;margin-left:8px">· ${esc(edu.institution)}</span>
              ${edu.note ? `<span style="font-size:13px;color:#999;margin-left:6px">(${esc(edu.note)})</span>` : ''}
            </div>
            <span style="font-size:13px;color:#999;background:#f5f5f5;padding:3px 10px;border-radius:20px">${esc(edu.period)}</span>
          </div>
        `).join('')}
      </section>`,

    contact: (d: ResumeData) => `
      <section style="margin:0 40px;padding:32px;background:#f9f9f9;border-radius:20px;text-align:center">
        <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:8px;letter-spacing:-.02em">Get In Touch</h2>
        <p style="font-size:14px;color:#666;margin-bottom:20px">Open to opportunities and collaborations</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="font-size:14px;font-weight:600;color:#fff;background:${a};text-decoration:none;padding:10px 20px;border-radius:10px">${esc(d.contact.email)}</a>` : ''}
          ${d.contact.github ? `<a href="${esc(d.contact.github)}" target="_blank" style="font-size:14px;font-weight:600;color:#555;background:#ececec;text-decoration:none;padding:10px 20px;border-radius:10px">GitHub ↗</a>` : ''}
          ${d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}" target="_blank" style="font-size:14px;font-weight:600;color:#555;background:#ececec;text-decoration:none;padding:10px 20px;border-radius:10px">LinkedIn ↗</a>` : ''}
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
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}"}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;color:#111;background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
</style>
</head>
<body>
<header style="background:linear-gradient(135deg,${a} 0%,${a}cc 100%);color:white;padding:60px 40px">
  ${data.photo ? avatarHtml(data, 88, 'margin-bottom:20px;border:3px solid rgba(255,255,255,0.3);') : ''}
  <h1 style="font-size:44px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px">${esc(data.name)}</h1>
  <p style="font-size:20px;font-weight:500;opacity:.9;margin-bottom:20px">${esc(data.title)}</p>
  <p style="font-size:15px;opacity:.8;max-width:580px;line-height:1.7">${esc(data.bio)}</p>
</header>
<main style="display:flex;flex-direction:column;gap:52px;padding:52px 0">
  ${sections}
</main>
</body>
</html>`
}
