import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateEditorial(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  // Splits a full name into first + rest for the header display
  const nameParts = data.name.trim().split(/\s+/)
  const firstName = esc(nameParts[0] ?? '')
  const restName = esc(nameParts.slice(1).join(' '))

  const row = (label: string, content: string) => `
    <div class="section-row">
      <div class="section-label">${label}</div>
      <div class="section-body">${content}</div>
    </div>`

  const renderers = {
    experience: (d: ResumeData) => !d.experience.length ? '' : row(
      'Experience',
      d.experience.map(exp => `
        <div class="exp-entry">
          <div class="exp-header">
            <div class="exp-meta">
              <span class="exp-role">${esc(exp.role)}</span>
              <span class="exp-company" style="color:${a}">${esc(exp.company)}</span>
              ${exp.location ? `<span class="exp-location">${esc(exp.location)}</span>` : ''}
            </div>
            <span class="exp-period">${esc(exp.period)}</span>
          </div>
          ${exp.bullets.filter(b => b).length ? `
          <ul class="exp-bullets">
            ${exp.bullets.filter(b => b).map(b => `<li><span class="bullet-dash">—</span>${esc(b)}</li>`).join('')}
          </ul>` : ''}
          ${exp.tags.length ? `
          <p class="exp-tags">${exp.tags.map(t => esc(t)).join(', ')}</p>` : ''}
        </div>`
      ).join('<div class="exp-divider"></div>')
    ),

    projects: (d: ResumeData) => !d.projects.length ? '' : row(
      'Projects',
      d.projects.map(p => `
        <div class="proj-entry">
          <div class="proj-line">
            <span class="proj-name">${esc(p.name)}</span>
            <span class="proj-sep"> — </span>
            <span class="proj-desc">${esc(p.description)}</span>
          </div>
          <div class="proj-footer">
            ${p.tags.length ? `<span class="proj-tags">${p.tags.map(t => esc(t)).join(', ')}</span>` : ''}
            <span class="proj-links">
              ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" class="proj-link accent-link" style="--a:${a}">Live ↗</a>` : ''}
              ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" class="proj-link" style="--a:${a}">Repo ↗</a>` : ''}
            </span>
          </div>
        </div>`
      ).join('')
    ),

    skills: (d: ResumeData) => !d.skills.length ? '' : `
      <div class="section-row">
        ${d.skills.map(g => `
          <div class="skills-row">
            <div class="section-label">${esc(g.category)}</div>
            <div class="section-body">
              <span class="skills-items">${g.items.map(i => esc(i)).join(', ')}</span>
            </div>
          </div>`
        ).join('')}
      </div>`,

    education: (d: ResumeData) => !d.education.length ? '' : row(
      'Education',
      d.education.map(edu => `
        <div class="edu-entry">
          <div class="edu-header">
            <div>
              <span class="edu-degree">${esc(edu.degree)}</span>
              <span class="edu-inst">${esc(edu.institution)}</span>
              ${edu.note ? `<span class="edu-note">(${esc(edu.note)})</span>` : ''}
            </div>
            <span class="edu-period">${esc(edu.period)}</span>
          </div>
        </div>`
      ).join('')
    ),

    contact: (d: ResumeData) => row(
      'Contact',
      `<div class="contact-links">
        ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" class="contact-link" style="--a:${a}">${esc(d.contact.email)}</a>` : ''}
        ${d.contact.github ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" class="contact-link" style="--a:${a}">GitHub ↗</a>` : ''}
        ${d.contact.linkedin ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" class="contact-link" style="--a:${a}">LinkedIn ↗</a>` : ''}
      </div>`
    ),
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
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: ${a};
  --text: #111827;
  --muted: #6b7280;
  --faint: #9ca3af;
  --rule: #e5e7eb;
  --label-w: 200px;
  --gap: 48px;
}

html { font-size: 16px; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  background: #ffffff;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: inherit; text-decoration: none; }

/* ── Wrapper ── */
.wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 60px 100px;
}

/* ── Header ── */
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
  padding-bottom: 56px;
  margin-bottom: 0;
}

.header-left { flex: 1; min-width: 0; }

.name-display {
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 200;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--text);
  margin-bottom: 12px;
}

.name-display .last { font-weight: 300; }

.title-display {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 20px;
  font-variant: small-caps;
}

.bio-display {
  font-size: 14px;
  color: var(--muted);
  max-width: 480px;
  line-height: 1.75;
  font-weight: 400;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.header-contact-link {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--faint);
  transition: color 0.2s ease;
}

.header-contact-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Sections ── */
.sections { margin-top: 0; }

/* Skills wrapper re-uses section-row internals differently */
.section-row,
.skills-row {
  display: grid;
  grid-template-columns: var(--label-w) 1fr;
  gap: 32px;
  border-top: 1px solid var(--rule);
  padding: var(--gap) 0;
  align-items: start;
}

/* Skills: each category is its own row, but no extra top border on subsequent ones */
.skills-row:not(:first-child) {
  border-top: none;
  padding-top: 16px;
}

.skills-row:first-child {
  border-top: 1px solid var(--rule);
  padding-top: var(--gap);
}

/* Hide the outer wrapper div border when skills uses internal rows */
.section-row:has(.skills-row) {
  display: contents;
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--faint);
  padding-top: 3px;
  white-space: nowrap;
}

.section-body { min-width: 0; }

/* ── Experience ── */
.exp-entry { padding: 0; }

.exp-divider {
  height: 1px;
  background: var(--rule);
  margin: 28px 0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.exp-meta { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }

.exp-role {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.exp-company {
  font-size: 14px;
  font-weight: 400;
}

.exp-location {
  font-size: 13px;
  color: var(--faint);
}

.exp-period {
  font-size: 12px;
  color: var(--faint);
  white-space: nowrap;
  flex-shrink: 0;
}

.exp-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.exp-bullets li {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.65;
}

.bullet-dash {
  flex-shrink: 0;
  color: var(--faint);
  font-weight: 300;
  user-select: none;
}

.exp-tags {
  font-size: 12px;
  color: var(--faint);
  font-weight: 400;
}

/* ── Projects ── */
.proj-entry {
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--rule);
}

.proj-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.proj-line {
  font-size: 14px;
  line-height: 1.65;
  color: var(--text);
  margin-bottom: 6px;
}

.proj-name { font-weight: 600; }

.proj-sep { color: var(--faint); }

.proj-desc { color: var(--muted); }

.proj-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.proj-tags {
  font-size: 12px;
  color: var(--faint);
}

.proj-links {
  display: flex;
  gap: 16px;
}

.proj-link {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--faint);
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 3px;
}

.proj-link:hover,
.proj-link.accent-link {
  color: var(--a, var(--accent));
  text-decoration-color: var(--a, var(--accent));
}

.proj-link:hover {
  color: var(--a, var(--accent));
  text-decoration-color: var(--a, var(--accent));
}

/* ── Skills ── */
.skills-items {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

/* ── Education ── */
.edu-entry { margin-bottom: 20px; }
.edu-entry:last-child { margin-bottom: 0; }

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
}

.edu-degree {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-right: 8px;
}

.edu-inst {
  font-size: 14px;
  color: var(--muted);
}

.edu-note {
  font-size: 12px;
  color: var(--faint);
  margin-left: 6px;
}

.edu-period {
  font-size: 12px;
  color: var(--faint);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Contact ── */
.contact-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.contact-link {
  font-size: 13px;
  font-weight: 400;
  color: var(--muted);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 3px;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.contact-link:hover {
  color: var(--a, var(--accent));
  text-decoration-color: var(--a, var(--accent));
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .wrapper { padding: 48px 24px 72px; }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 40px;
  }

  .header-right {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 20px;
  }

  .section-row,
  .skills-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 32px 0;
  }

  .skills-row:not(:first-child) { padding-top: 0; }

  :root { --label-w: auto; }
}
</style>
</head>
<body>
<div class="wrapper">

  <header class="site-header">
    <div class="header-left">
      ${data.photo ? '<div style="margin-bottom:24px">' + avatarHtml(data, 72, 'border:2px solid #e5e7eb;') + '</div>' : ''}
      <h1 class="name-display">
        <span class="first">${firstName}</span>${restName ? ` <span class="last">${restName}</span>` : ''}
      </h1>
      <p class="title-display">${esc(data.title)}</p>
      <p class="bio-display">${esc(data.bio)}</p>
    </div>
    <div class="header-right">
      ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="header-contact-link">${esc(data.contact.email)}</a>` : ''}
      ${data.contact.github ? `<a href="${safeUrl(data.contact.github)}" target="_blank" rel="noopener" class="header-contact-link">GitHub ↗</a>` : ''}
      ${data.contact.linkedin ? `<a href="${safeUrl(data.contact.linkedin)}" target="_blank" rel="noopener" class="header-contact-link">LinkedIn ↗</a>` : ''}
    </div>
  </header>

  <main class="sections">
    ${sections}
  </main>

</div>
</body>
</html>`
}
