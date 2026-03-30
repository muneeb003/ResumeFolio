import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateMagazine(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  // Section counter — each rendered section gets an incrementing two-digit label
  let sectionCounter = 0
  function nextSectionNum(): string {
    sectionCounter++
    return String(sectionCounter).padStart(2, '0')
  }

  // Editorial section header: Cormorant italic title + thin rule + number
  function sectionHeader(title: string, num: string): string {
    return `<div style="display:flex;align-items:center;margin-bottom:48px;gap:24px">
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;font-style:italic;color:#0a0a0a;white-space:nowrap;line-height:1">${title}</h2>
    <div style="flex:1;border-bottom:1px solid #e0e0e0;align-self:center"></div>
    <span style="font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#757575;white-space:nowrap">${num}</span>
  </div>`
  }

  const renderers: Record<SectionId, (d: ResumeData) => string> = {
    experience: (d: ResumeData) => {
      if (!d.experience.length) return ''
      const num = nextSectionNum()
      return `<section id="section-experience" style="padding:80px clamp(24px,6vw,80px);background:#fafafa;border-top:1px solid #e0e0e0">
  ${sectionHeader('Experience', num)}
  <div style="display:flex;flex-direction:column">
    ${d.experience
      .map(
        (exp, i) => `
    <div class="anim" style="display:grid;grid-template-columns:1fr 2fr;gap:40px;padding:36px 0;border-bottom:1px solid #e0e0e0;animation-delay:${i * 0.09}s">
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#0a0a0a;line-height:1.2;margin-bottom:8px">${esc(exp.company)}</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:12px;font-style:italic;color:#757575;margin-bottom:6px">${esc(exp.period)}</div>
        ${exp.location ? `<div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#757575">${esc(exp.location)}</div>` : ''}
      </div>
      <div>
        <div style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;color:#0a0a0a;margin-bottom:14px">${esc(exp.role)}</div>
        ${
          exp.bullets.filter((b) => b).length
            ? `<ul style="list-style:none;padding:0;margin:0 0 14px 0">
            ${exp.bullets
              .filter((b) => b)
              .map(
                (b) =>
                  `<li style="font-family:'DM Sans',sans-serif;font-size:15px;color:#2d2d2d;line-height:1.75;margin-bottom:6px;padding-left:16px;position:relative"><span style="position:absolute;left:0;color:#757575">–</span>${esc(b)}</li>`
              )
              .join('')}
          </ul>`
            : ''
        }
        ${exp.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px">${exp.tags.map((t) => `<span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${a}">${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
    </div>`
      )
      .join('')}
  </div>
</section>`
    },

    projects: (d: ResumeData) => {
      if (!d.projects.length) return ''
      const num = nextSectionNum()
      return `<section id="section-projects" style="padding:80px clamp(24px,6vw,80px);background:#fff;border-top:1px solid #e0e0e0">
  ${sectionHeader('Projects', num)}
  <div style="display:flex;flex-direction:column">
    ${d.projects
      .map(
        (p, i) => `
    <div class="anim" style="display:grid;grid-template-columns:80px 1fr;gap:32px;padding:40px 0;border-bottom:1px solid #e0e0e0;align-items:start;animation-delay:${i * 0.1}s">
      <div style="font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;color:#e0e0e0;line-height:1;padding-top:4px">${String(i + 1).padStart(2, '0')}</div>
      <div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:#0a0a0a;line-height:1.1;margin-bottom:12px">${esc(p.name)}</h3>
        <p style="font-family:'DM Sans',sans-serif;font-size:15px;color:#2d2d2d;line-height:1.75;margin-bottom:16px">${esc(p.description)}</p>
        ${p.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px">${p.tags.map((t) => `<span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#757575">${esc(t)}</span>`).join('')}</div>` : ''}
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:${a};text-decoration:underline;text-underline-offset:3px">Live Site ↗</a>` : ''}
          ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#2d2d2d;text-decoration:underline;text-underline-offset:3px">Source Code ↗</a>` : ''}
        </div>
      </div>
    </div>`
      )
      .join('')}
  </div>
</section>`
    },

    skills: (d: ResumeData) => {
      if (!d.skills.length) return ''
      const num = nextSectionNum()
      return `<section id="section-skills" style="padding:80px clamp(24px,6vw,80px);background:#fafafa;border-top:1px solid #e0e0e0">
  ${sectionHeader('Skills', num)}
  <div style="display:flex;flex-direction:column;gap:24px">
    ${d.skills
      .map(
        (g, i) => `
    <div class="anim" style="display:grid;grid-template-columns:200px 1fr;gap:32px;align-items:baseline;animation-delay:${i * 0.07}s">
      <div style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#0a0a0a">${esc(g.category)}</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:15px;color:#2d2d2d;line-height:1.8">${g.items.map((item) => esc(item)).join('<span style="color:#c0c0c0;margin:0 4px">·</span>')}</div>
    </div>`
      )
      .join('')}
  </div>
</section>`
    },

    education: (d: ResumeData) => {
      if (!d.education.length) return ''
      const num = nextSectionNum()
      return `<section id="section-education" style="padding:80px clamp(24px,6vw,80px);background:#fff;border-top:1px solid #e0e0e0">
  ${sectionHeader('Education', num)}
  <div style="display:flex;flex-direction:column">
    ${d.education
      .map(
        (edu, i) => `
    <div class="anim" style="display:grid;grid-template-columns:1fr 2fr;gap:40px;padding:32px 0;border-bottom:1px solid #e0e0e0;animation-delay:${i * 0.09}s">
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#0a0a0a;line-height:1.2;margin-bottom:6px">${esc(edu.institution)}</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:12px;font-style:italic;color:#757575">${esc(edu.period)}</div>
      </div>
      <div>
        <div style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;color:#2d2d2d;margin-bottom:6px">${esc(edu.degree)}</div>
        ${edu.note ? `<div style="font-family:'DM Sans',sans-serif;font-size:14px;color:#757575;line-height:1.6">${esc(edu.note)}</div>` : ''}
      </div>
    </div>`
      )
      .join('')}
  </div>
</section>`
    },

    contact: (d: ResumeData) => {
      const num = nextSectionNum()
      return `<section id="section-contact" style="padding:100px clamp(24px,6vw,80px);background:#fafafa;border-top:1px solid #e0e0e0;text-align:center">
  <div style="max-width:680px;margin:0 auto">
    <div style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#757575;margin-bottom:20px">${num} / Contact</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(36px,6vw,72px);font-weight:300;font-style:italic;color:#0a0a0a;line-height:1.1;margin-bottom:48px">Let&#039;s create something<br>together.</h2>
    <div style="display:flex;flex-direction:column;gap:0;border-top:1px solid #e0e0e0;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0">
      ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="display:block;padding:20px 32px;border-bottom:1px solid #e0e0e0;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#0a0a0a;text-decoration:none;text-align:left;transition:background 0.15s">${esc(d.contact.email)}</a>` : ''}
      ${d.contact.github ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" style="display:block;padding:20px 32px;border-bottom:1px solid #e0e0e0;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#0a0a0a;text-decoration:none;text-align:left">GitHub ↗</a>` : ''}
      ${d.contact.linkedin ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:block;padding:20px 32px;border-bottom:1px solid #e0e0e0;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#0a0a0a;text-decoration:none;text-align:left">LinkedIn ↗</a>` : ''}
    </div>
  </div>
</section>`
    },
  }

  // Compute some stats for hero strip
  const expCount = data.experience.length
  const projCount = data.projects.length
  const statsItems: string[] = []
  if (expCount > 0) statsItems.push(`${expCount}+ Roles`)
  if (projCount > 0) statsItems.push(`${projCount}+ Projects`)
  statsItems.push('Available Now')

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
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#2d2d2d;-webkit-font-smoothing:antialiased}
a{cursor:pointer}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.anim{animation:fadeIn 0.7s ease both}
.nav-link:hover{color:${a} !important}
.contact-link:hover{background:#f5f5f5 !important}
@media(max-width:640px){
  .hero-grid{grid-template-columns:1fr !important}
  .hero-rule{display:none !important}
  .exp-grid{grid-template-columns:1fr !important}
  .proj-grid{grid-template-columns:1fr !important}
  .skills-grid{grid-template-columns:1fr !important}
  .edu-grid{grid-template-columns:1fr !important}
  .stats-grid{grid-template-columns:1fr !important}
  .mag-nav-links{display:none !important}
  .mag-nav-vol{display:none !important}
}
</style>
</head>
<body>

<!-- NAV -->
<nav style="padding:0 clamp(24px,6vw,80px);border-bottom:2px solid #0a0a0a;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:64px">
  <div>
    <a href="#" style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;font-style:italic;color:#0a0a0a;text-decoration:none">${esc(data.name)}</a>
  </div>
  <div class="mag-nav-links" style="display:flex;align-items:center;gap:0">
    ${sectionOrder
      .filter((id) => !hiddenSections.includes(id))
      .map(
        (id) =>
          `<a href="#section-${id}" class="nav-link" style="font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;padding:0 16px;transition:color 0.15s">${id}</a>`
      )
      .join('')}
  </div>
  <div class="mag-nav-vol" style="text-align:right">
    <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#757575">VOL. 1</span>
  </div>
</nav>

<!-- HERO -->
<header style="padding:80px clamp(24px,6vw,80px) 0;background:#fff;border-bottom:2px solid #0a0a0a">
  <div class="hero-grid" style="display:grid;grid-template-columns:3fr 2fr;gap:0;margin-bottom:0;align-items:start">
    <div style="padding-bottom:60px">
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(64px,10vw,140px);font-weight:300;font-style:italic;color:#0a0a0a;line-height:0.9;letter-spacing:-0.02em">${esc(data.name)}</h1>
    </div>
    <div class="hero-rule" style="border-left:2px solid #0a0a0a;padding:0 0 60px 40px;display:flex;flex-direction:column;justify-content:flex-end">
      ${data.photo ? '<div style="margin-bottom:20px">' + avatarHtml(data, 72, 'border:2px solid #e0e0e0;') + '</div>' : ''}
      <div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;margin-bottom:12px">${esc(data.title)}</div>
      <p style="font-family:'DM Sans',sans-serif;font-size:15px;color:#2d2d2d;line-height:1.75;margin-bottom:24px">${esc(data.bio)}</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:${a};text-decoration:underline;text-underline-offset:3px">${esc(data.contact.email)}</a>` : ''}
        ${data.contact.github ? `<a href="${safeUrl(data.contact.github)}" target="_blank" rel="noopener" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#2d2d2d;text-decoration:underline;text-underline-offset:3px">GitHub ↗</a>` : ''}
        ${data.contact.linkedin ? `<a href="${safeUrl(data.contact.linkedin)}" target="_blank" rel="noopener" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#2d2d2d;text-decoration:underline;text-underline-offset:3px">LinkedIn ↗</a>` : ''}
      </div>
    </div>
  </div>
  <!-- STATS STRIP -->
  <div class="stats-grid" style="display:grid;grid-template-columns:repeat(${statsItems.length},1fr);border-top:2px solid #0a0a0a">
    ${statsItems
      .map(
        (stat, i) =>
          `<div style="padding:20px 28px;${i < statsItems.length - 1 ? 'border-right:1px solid #e0e0e0;' : ''}">
        <div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#0a0a0a">${esc(stat)}</div>
      </div>`
      )
      .join('')}
  </div>
</header>

<!-- MAIN SECTIONS -->
<main>
${sections}
</main>

<!-- FOOTER -->
<footer style="background:#fff;border-top:2px solid #0a0a0a;padding:40px clamp(24px,6vw,80px)">
  <div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center">
    <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;font-style:italic;color:#0a0a0a">${esc(data.name)}</div>
    <div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;color:#757575;letter-spacing:0.05em">${esc(data.title)}</div>
    <div style="width:40px;height:1px;background:#e0e0e0;margin:8px 0"></div>
    <div style="font-family:'DM Sans',sans-serif;font-size:11px;color:#757575">© ${new Date().getFullYear()}</div>
  </div>
</footer>

</body>
</html>`
}
