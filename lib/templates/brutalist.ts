import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateBrutalist(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  // Square hard-border tag — accent bg, pure black text
  function bTag(text: string): string {
    return `<span style="display:inline-block;background:${a};color:#000;font-family:'Space Mono',monospace;font-size:11px;padding:3px 8px;border:2px solid #000;margin:2px 2px 2px 0;line-height:1.4">${esc(text)}</span>`
  }

  // Section heading with [ bracket accent marker
  function sectionHead(label: string): string {
    return `<div style="display:flex;align-items:baseline;margin-bottom:40px">
    <span style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${a}">[</span>
    <h2 style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#000;margin-left:4px">${label}</h2>
  </div>`
  }

  const renderers: Record<SectionId, (d: ResumeData) => string> = {
    experience: (d: ResumeData) =>
      !d.experience.length
        ? ''
        : `<section id="section-experience" style="background:#fff;border-top:8px solid #000;padding:60px clamp(24px,6vw,80px)">
  ${sectionHead('EXPERIENCE')}
  ${d.experience
    .map(
      (exp, i) => `
  <div class="anim" style="border:3px solid #000;padding:28px;box-shadow:6px 6px 0 #000;background:#fff;margin-bottom:24px;animation-delay:${i * 0.08}s">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px">
      <div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:800;color:#000;line-height:1.1">${esc(exp.company)}</div>
        <div style="font-family:'Space Mono',monospace;font-size:14px;color:${a};margin-top:6px">${esc(exp.role)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <span style="background:#000;color:#fff;font-family:'Space Mono',monospace;font-size:11px;padding:3px 8px;display:inline-block;line-height:1.4;flex-shrink:0">${esc(exp.period)}</span>
        ${exp.location ? `<span style="font-family:'Space Mono',monospace;font-size:11px;color:#444">${esc(exp.location)}</span>` : ''}
      </div>
    </div>
    ${
      exp.bullets.filter((b) => b).length
        ? `<ul style="list-style:none;padding:0;margin:0 0 16px 0">
      ${exp.bullets
        .filter((b) => b)
        .map(
          (b) =>
            `<li style="display:flex;gap:10px;font-size:15px;line-height:1.7;margin-bottom:6px;color:#1a1a1a"><span style="color:${a};font-weight:700;flex-shrink:0">→</span><span style="color:#1a1a1a">${esc(b)}</span></li>`
        )
        .join('')}
    </ul>`
        : ''
    }
    ${exp.tags.length ? `<div style="display:flex;flex-wrap:wrap">${exp.tags.map((t) => bTag(t)).join('')}</div>` : ''}
  </div>`
    )
    .join('')}
</section>`,

    projects: (d: ResumeData) =>
      !d.projects.length
        ? ''
        : `<section id="section-projects" style="background:#f5f0e8;border-top:8px solid #000;padding:60px clamp(24px,6vw,80px)">
  ${sectionHead('PROJECTS')}
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px">
    ${d.projects
      .map(
        (p, i) => `
    <div class="anim" style="border:3px solid #000;padding:28px;box-shadow:6px 6px 0 #000;background:#fff;display:flex;flex-direction:column;animation-delay:${i * 0.1}s">
      <h3 style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:800;color:#000;line-height:1.1;margin-bottom:12px">${esc(p.name)}</h3>
      <p style="font-family:'Space Grotesk',sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;margin-bottom:16px;flex:1">${esc(p.description)}</p>
      ${p.tags.length ? `<div style="display:flex;flex-wrap:wrap;margin-bottom:20px">${p.tags.map((t) => bTag(t)).join('')}</div>` : ''}
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" style="font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:#000;background:${a};text-decoration:none;padding:8px 14px;border:2px solid #000;display:inline-block;letter-spacing:0.05em">[LIVE ↗]</a>` : ''}
        ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" style="font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:#fff;background:#000;text-decoration:none;padding:8px 14px;border:2px solid #000;display:inline-block;letter-spacing:0.05em">[CODE ↗]</a>` : ''}
      </div>
    </div>`
      )
      .join('')}
  </div>
</section>`,

    skills: (d: ResumeData) =>
      !d.skills.length
        ? ''
        : `<section id="section-skills" style="background:#fff;border-top:8px solid #000;padding:60px clamp(24px,6vw,80px)">
  ${sectionHead('SKILLS')}
  <div style="display:flex;flex-direction:column;gap:28px">
    ${d.skills
      .map(
        (g, i) => `
    <div class="anim" style="animation-delay:${i * 0.07}s">
      <div style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#000;margin-bottom:10px">${esc(g.category)}</div>
      <div style="display:flex;flex-wrap:wrap">${g.items.map((item) => bTag(item)).join('')}</div>
    </div>`
      )
      .join('')}
  </div>
</section>`,

    education: (d: ResumeData) =>
      !d.education.length
        ? ''
        : `<section id="section-education" style="background:#f5f0e8;border-top:8px solid #000;padding:60px clamp(24px,6vw,80px)">
  ${sectionHead('EDUCATION')}
  ${d.education
    .map(
      (edu, i) => `
  <div class="anim" style="border:3px solid #000;padding:28px;box-shadow:6px 6px 0 #000;background:#fff;margin-bottom:24px;animation-delay:${i * 0.08}s">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:800;color:#000;line-height:1.2">${esc(edu.institution)}</div>
        <div style="font-family:'Space Mono',monospace;font-size:14px;color:${a};margin-top:6px">${esc(edu.degree)}</div>
        ${edu.note ? `<div style="font-family:'Space Mono',monospace;font-size:12px;color:#444;margin-top:6px">${esc(edu.note)}</div>` : ''}
      </div>
      <span style="background:#000;color:#fff;font-family:'Space Mono',monospace;font-size:11px;padding:3px 8px;display:inline-block;line-height:1.4;flex-shrink:0">${esc(edu.period)}</span>
    </div>
  </div>`
    )
    .join('')}
</section>`,

    contact: (d: ResumeData) =>
      `<section id="section-contact" style="background:#000;border-top:8px solid #000;padding:80px clamp(24px,6vw,80px);text-align:center">
  <div style="font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,6vw,64px);font-weight:800;color:${a};line-height:1;margin-bottom:8px;letter-spacing:-0.02em">AVAILABLE</div>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,6vw,64px);font-weight:800;color:#fff;line-height:1;margin-bottom:48px;letter-spacing:-0.02em">FOR WORK</div>
  <div style="display:flex;flex-direction:column;gap:12px;align-items:center;max-width:420px;margin:0 auto">
    ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="display:block;width:100%;font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:#000;background:${a};text-decoration:none;padding:16px 28px;border:3px solid ${a};text-align:center;letter-spacing:0.05em">${esc(d.contact.email)}</a>` : ''}
    ${d.contact.github ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" style="display:block;width:100%;font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:#fff;background:transparent;text-decoration:none;padding:16px 28px;border:3px solid #fff;text-align:center;letter-spacing:0.05em">GITHUB ↗</a>` : ''}
    ${d.contact.linkedin ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:block;width:100%;font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:#000;background:#fff;text-decoration:none;padding:16px 28px;border:3px solid #fff;text-align:center;letter-spacing:0.05em">LINKEDIN ↗</a>` : ''}
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
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Space Grotesk',sans-serif;background:#f5f0e8;color:#1a1a1a;-webkit-font-smoothing:antialiased}
a{cursor:pointer}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
.anim{animation:slideIn 0.4s ease both}
.nav-link:hover{background:${a} !important;color:#000 !important}
</style>
</head>
<body>

<!-- NAV -->
<nav style="background:#000;padding:0 clamp(16px,4vw,40px);height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
  <span style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:20px;color:#fff;letter-spacing:-0.02em;white-space:nowrap">${esc(data.name)}</span>
  <div style="display:flex;align-items:center;overflow:hidden">
    ${sectionOrder
      .filter((id) => !hiddenSections.includes(id))
      .map(
        (id) =>
          `<a href="#section-${id}" class="nav-link" style="font-family:'Space Mono',monospace;font-size:12px;color:#fff;text-decoration:none;padding:8px 12px;white-space:nowrap;transition:background 0.15s,color 0.15s">${id.toUpperCase()}</a>`
      )
      .join('')}
  </div>
</nav>

<!-- HERO -->
<header style="background:#000;color:#fff;padding:80px clamp(24px,6vw,80px) 80px">
  ${data.photo ? '<div style="margin-bottom:24px">' + avatarHtml(data, 80, 'border:3px solid #fff;') + '</div>' : ''}
  <h1 style="font-family:'Space Grotesk',sans-serif;font-size:clamp(56px,10vw,120px);font-weight:800;line-height:0.9;color:#fff;letter-spacing:-0.03em">${esc(data.name)}</h1>
  <div style="height:12px;background:${a};margin:32px 0"></div>
  <div style="font-family:'Space Mono',monospace;font-size:18px;color:${a};letter-spacing:0.05em;margin-bottom:24px">${esc(data.title)}</div>
  <p style="font-family:'Space Grotesk',sans-serif;font-size:18px;color:rgba(255,255,255,0.85);max-width:700px;line-height:1.7;margin-bottom:40px">${esc(data.bio)}</p>
  <div style="display:flex;gap:16px;flex-wrap:wrap">
    ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:${a};background:#000;text-decoration:none;padding:14px 28px;border:3px solid ${a};letter-spacing:0.05em;display:inline-block">CONTACT ME</a>` : ''}
    ${data.contact.github ? `<a href="${safeUrl(data.contact.github)}" target="_blank" rel="noopener" style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:#000;background:${a};text-decoration:none;padding:14px 28px;border:3px solid ${a};letter-spacing:0.05em;display:inline-block">VIEW GITHUB ↗</a>` : ''}
  </div>
</header>

<!-- MAIN SECTIONS -->
<main>
${sections}
</main>

<!-- FOOTER -->
<footer style="background:#f5f0e8;border-top:3px solid #000;padding:32px clamp(24px,6vw,80px);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
  <span style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:16px;color:#000">${esc(data.name)}</span>
  <span style="font-family:'Space Mono',monospace;font-size:12px;color:#444">© ${new Date().getFullYear()} — ALL RIGHTS RESERVED</span>
</footer>

</body>
</html>`
}
