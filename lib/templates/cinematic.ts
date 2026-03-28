import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml } from './shared'

export function generateCinematic(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accent)

  const nameParts = data.name.trim().split(/\s+/)
  const firstName = esc(nameParts[0] ?? '')
  const lastName = esc(nameParts.slice(1).join(' '))

  // Section index is tracked to alternate dark/light
  let sectionIndex = 0

  const getSectionColors = (idx: number) => {
    if (idx % 2 === 0) {
      return { bg: '#0a0a0a', text: '#ffffff', muted: 'rgba(255,255,255,0.55)', sub: 'rgba(255,255,255,0.35)', border: 'rgba(255,255,255,0.1)' }
    }
    return { bg: '#ffffff', text: '#0a0a0a', muted: '#6b7280', sub: '#9ca3af', border: '#e5e7eb' }
  }

  const renderers = {
    experience: (d: ResumeData) => {
      if (!d.experience.length) return ''
      const idx = sectionIndex++
      const c = getSectionColors(idx)
      const num = String(idx + 1).padStart(2, '0')
      return `
      <section class="cin-section reveal-section" style="background:${c.bg};color:${c.text};" data-idx="${idx}">
        <div class="section-num" style="color:${c.text};">${num}</div>
        <div class="cin-container">
          <h2 class="cin-section-title reveal-item" style="color:${c.text};">Experience</h2>
          <div class="timeline" style="--tl-line:${c.border}">
            ${d.experience.map((exp, i) => `
              <div class="timeline-entry reveal-item" style="--delay:${i * 80}ms">
                <div class="timeline-dot" style="background:${a};box-shadow:0 0 0 4px ${c.bg},0 0 0 5px ${a}40;"></div>
                <div class="timeline-content">
                  <div class="tl-header">
                    <div class="tl-left">
                      <span class="tl-role" style="color:${c.text}">${esc(exp.role)}</span>
                      <span class="tl-company" style="color:${a}">${esc(exp.company)}</span>
                      ${exp.location ? `<span class="tl-loc" style="color:${c.muted}">${esc(exp.location)}</span>` : ''}
                    </div>
                    <span class="tl-period" style="color:${c.sub}">${esc(exp.period)}</span>
                  </div>
                  ${exp.bullets.filter(b => b).length ? `
                  <ul class="tl-bullets" style="color:${c.muted}">
                    ${exp.bullets.filter(b => b).map(b => `<li>${esc(b)}</li>`).join('')}
                  </ul>` : ''}
                  ${exp.tags.length ? `
                  <div class="tl-tags">
                    ${exp.tags.map(t => `<span class="tl-tag" style="background:${a}18;color:${a};border:1px solid ${a}30">${esc(t)}</span>`).join('')}
                  </div>` : ''}
                </div>
              </div>`
            ).join('')}
          </div>
        </div>
      </section>`
    },

    projects: (d: ResumeData) => {
      if (!d.projects.length) return ''
      const idx = sectionIndex++
      const c = getSectionColors(idx)
      const num = String(idx + 1).padStart(2, '0')
      return `
      <section class="cin-section reveal-section" style="background:${c.bg};color:${c.text};" data-idx="${idx}">
        <div class="section-num" style="color:${c.text};">${num}</div>
        <div class="cin-container">
          <h2 class="cin-section-title reveal-item" style="color:${c.text};">Projects</h2>
          <div class="projects-scroll">
            ${d.projects.map((p, i) => `
              <div class="proj-card reveal-item" style="background:${idx % 2 === 0 ? '#161616' : '#f9f9f9'};border:1px solid ${c.border};--delay:${i * 100}ms">
                <div class="proj-card-inner">
                  <h3 class="proj-card-name" style="color:${c.text}">${esc(p.name)}</h3>
                  <p class="proj-card-desc" style="color:${c.muted}">${esc(p.description)}</p>
                  ${p.tags.length ? `
                  <div class="proj-card-tags">
                    ${p.tags.map(t => `<span class="proj-card-tag" style="color:${c.sub}">${esc(t)}</span>`).join('')}
                  </div>` : ''}
                  <div class="proj-card-links">
                    ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener" class="proj-card-link" style="background:${a};color:#fff">Live ↗</a>` : ''}
                    ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener" class="proj-card-link" style="background:${c.border};color:${c.muted}">Repo ↗</a>` : ''}
                  </div>
                </div>
              </div>`
            ).join('')}
          </div>
        </div>
      </section>`
    },

    skills: (d: ResumeData) => {
      if (!d.skills.length) return ''
      const idx = sectionIndex++
      const c = getSectionColors(idx)
      const num = String(idx + 1).padStart(2, '0')
      const allItems = d.skills.flatMap(g => g.items)
      // Alternate colors for visual rhythm
      const colorCycle = [c.text, a, c.muted, c.text, c.muted, a]
      return `
      <section class="cin-section reveal-section" style="background:${c.bg};color:${c.text};" data-idx="${idx}">
        <div class="section-num" style="color:${c.text};">${num}</div>
        <div class="cin-container">
          <h2 class="cin-section-title reveal-item" style="color:${c.text};">Skills</h2>
          <div class="skills-flow reveal-item">
            ${allItems.map((item, i) => `<span class="skill-word" style="color:${colorCycle[i % colorCycle.length]}">${esc(item)}</span>${i < allItems.length - 1 ? `<span class="skill-dot" style="color:${c.border}"> · </span>` : ''}`).join('')}
          </div>
          <div class="skills-categories reveal-item">
            ${d.skills.map(g => `
              <div class="skill-cat">
                <span class="skill-cat-label" style="color:${a}">${esc(g.category)}</span>
                <span class="skill-cat-items" style="color:${c.muted}">${g.items.map(i => esc(i)).join(', ')}</span>
              </div>`
            ).join('')}
          </div>
        </div>
      </section>`
    },

    education: (d: ResumeData) => {
      if (!d.education.length) return ''
      const idx = sectionIndex++
      const c = getSectionColors(idx)
      const num = String(idx + 1).padStart(2, '0')
      return `
      <section class="cin-section reveal-section" style="background:${c.bg};color:${c.text};" data-idx="${idx}">
        <div class="section-num" style="color:${c.text};">${num}</div>
        <div class="cin-container">
          <h2 class="cin-section-title reveal-item" style="color:${c.text};">Education</h2>
          <div class="edu-list">
            ${d.education.map((edu, i) => `
              <div class="edu-entry reveal-item" style="border-bottom:1px solid ${c.border};--delay:${i * 80}ms">
                <div class="edu-main">
                  <span class="edu-degree" style="color:${c.text}">${esc(edu.degree)}</span>
                  <span class="edu-inst" style="color:${a}">${esc(edu.institution)}</span>
                  ${edu.note ? `<span class="edu-note" style="color:${c.muted}">${esc(edu.note)}</span>` : ''}
                </div>
                <span class="edu-period" style="color:${c.sub}">${esc(edu.period)}</span>
              </div>`
            ).join('')}
          </div>
        </div>
      </section>`
    },

    contact: (d: ResumeData) => {
      const idx = sectionIndex++
      const c = getSectionColors(idx)
      const num = String(idx + 1).padStart(2, '0')
      return `
      <section class="cin-section reveal-section" style="background:${c.bg};color:${c.text};" data-idx="${idx}">
        <div class="section-num" style="color:${c.text};">${num}</div>
        <div class="cin-container">
          <h2 class="cin-section-title reveal-item" style="color:${c.text};">Contact</h2>
          <div class="contact-block reveal-item">
            ${d.contact.email ? `
            <a href="mailto:${esc(d.contact.email)}" class="contact-big-link" style="color:${c.text}">
              <span class="contact-link-label" style="color:${c.sub}">Email</span>
              <span class="contact-link-value">${esc(d.contact.email)}<span class="contact-accent-dot" style="color:${a}">.</span></span>
            </a>` : ''}
            ${d.contact.github ? `
            <a href="${esc(d.contact.github)}" target="_blank" rel="noopener" class="contact-big-link" style="color:${c.text}">
              <span class="contact-link-label" style="color:${c.sub}">GitHub</span>
              <span class="contact-link-value">GitHub ↗<span class="contact-accent-dot" style="color:${a}">.</span></span>
            </a>` : ''}
            ${d.contact.linkedin ? `
            <a href="${esc(d.contact.linkedin)}" target="_blank" rel="noopener" class="contact-big-link" style="color:${c.text}">
              <span class="contact-link-label" style="color:${c.sub}">LinkedIn</span>
              <span class="contact-link-value">LinkedIn ↗<span class="contact-accent-dot" style="color:${a}">.</span></span>
            </a>` : ''}
          </div>
        </div>
      </section>`
    },
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
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}","description":"${esc(data.bio)}"${data.contact.email ? `,"email":"${esc(data.contact.email)}"` : ''}${data.contact.github ? `,"sameAs":"${esc(data.contact.github)}"` : ''}}</script>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: ${a};
  --hero-bg: #0a0a0a;
  --container-w: 1100px;
  --nav-h: 52px;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--hero-bg);
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

a { text-decoration: none; color: inherit; }

/* ── Nav ── */
#cin-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-h);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}

#cin-nav.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.nav-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-link {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
  transition: color 0.2s ease;
}

.nav-link:hover { color: #fff; }

/* ── Hero ── */
.cin-hero {
  min-height: 100vh;
  background: var(--hero-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px 60px 80px;
  position: relative;
  overflow: hidden;
}

.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
}

.hero-content {
  max-width: var(--container-w);
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero-name {
  font-family: 'Space Grotesk', sans-serif;
  line-height: 0.9;
  margin-bottom: 32px;
}

.hero-first {
  display: block;
  font-size: clamp(80px, 15vw, 180px);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.04em;
}

.hero-last {
  display: block;
  font-size: clamp(72px, 13vw, 160px);
  font-weight: 800;
  letter-spacing: -0.04em;
  -webkit-text-stroke: 2px ${a};
  color: transparent;
  margin-left: clamp(20px, 4vw, 80px);
}

.hero-title {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.45);
  margin-bottom: 28px;
}

.hero-line {
  width: 0;
  height: 1px;
  background: ${a};
  margin-bottom: 32px;
  transition: width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s;
}

.hero-line.animated { width: clamp(60px, 15vw, 160px); }

.hero-bio {
  font-size: 16px;
  color: rgba(255,255,255,0.5);
  max-width: 480px;
  line-height: 1.75;
  font-weight: 300;
}

.hero-scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.3);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.hero-chevron {
  width: 20px;
  height: 20px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  animation: chevron-bounce 2s ease-in-out infinite;
}

@keyframes chevron-bounce {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(45deg) translateY(4px); opacity: 0.7; }
}

/* ── Sections ── */
.cin-section {
  position: relative;
  overflow: hidden;
  padding: 100px 60px;
}

.cin-container {
  max-width: var(--container-w);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-num {
  position: absolute;
  top: 40px;
  right: 60px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(80px, 20vw, 200px);
  font-weight: 800;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
  line-height: 1;
  user-select: none;
}

.cin-section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 56px;
}

.cin-section-title::after {
  content: '.';
  color: ${a};
}

/* ── Reveal animations ── */
.reveal-item {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: var(--delay, 0ms);
}

.reveal-item.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Timeline (Experience) ── */
.timeline {
  position: relative;
  padding-left: 36px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--tl-line, rgba(255,255,255,0.1));
}

.timeline-entry {
  position: relative;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: var(--delay, 0ms);
}

.timeline-entry.revealed {
  opacity: 1;
  transform: translateX(0);
}

.timeline-entry:last-child { margin-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -42px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-content { min-width: 0; }

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.tl-left { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 12px; }

.tl-role {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.tl-company { font-size: 15px; font-weight: 500; }

.tl-loc { font-size: 13px; }

.tl-period { font-size: 13px; white-space: nowrap; flex-shrink: 0; }

.tl-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 2px solid rgba(255,255,255,0.06);
}

.tl-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.tl-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

/* ── Projects horizontal scroll ── */
.projects-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: ${a}40 transparent;
}

.projects-scroll::-webkit-scrollbar { height: 4px; }
.projects-scroll::-webkit-scrollbar-track { background: transparent; }
.projects-scroll::-webkit-scrollbar-thumb { background: ${a}40; border-radius: 2px; }

.proj-card {
  min-width: 360px;
  max-width: 360px;
  height: 280px;
  border-radius: 16px;
  scroll-snap-align: start;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proj-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.proj-card-inner {
  height: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.proj-card-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  line-height: 1.2;
}

.proj-card-desc {
  font-size: 13px;
  line-height: 1.65;
  flex: 1;
}

.proj-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}

.proj-card-tag {
  font-size: 11px;
  font-weight: 500;
}

.proj-card-tags .proj-card-tag:not(:last-child)::after { content: ' ·'; }

.proj-card-links { display: flex; gap: 8px; }

.proj-card-link {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  letter-spacing: 0.02em;
  transition: opacity 0.2s ease;
}

.proj-card-link:hover { opacity: 0.8; }

/* ── Skills ── */
.skills-flow {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 48px;
  letter-spacing: -0.01em;
}

.skill-word { }
.skill-dot { font-weight: 300; }

.skills-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.skill-cat { }

.skill-cat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: block;
  margin-bottom: 6px;
}

.skill-cat-items { font-size: 14px; line-height: 1.65; }

/* ── Education ── */
.edu-list { display: flex; flex-direction: column; }

.edu-entry {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px 0;
}

.edu-entry:last-child { border-bottom: none !important; }

.edu-main { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 12px; }

.edu-degree {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.edu-inst { font-size: 15px; }

.edu-note { font-size: 13px; }

.edu-period { font-size: 13px; white-space: nowrap; flex-shrink: 0; }

/* ── Contact ── */
.contact-block {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.contact-big-link {
  display: flex;
  align-items: baseline;
  gap: 20px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  transition: gap 0.3s ease;
}

.contact-big-link:last-child { border-bottom: none; }

.contact-big-link:hover { gap: 32px; }

.contact-link-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  min-width: 70px;
  flex-shrink: 0;
}

.contact-link-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
}

.contact-big-link:hover .contact-link-value { color: ${a}; }

.contact-accent-dot { }

/* ── Responsive ── */
@media (max-width: 768px) {
  .cin-hero { padding: 80px 24px 60px; }
  .cin-section { padding: 72px 24px; }
  .section-num { right: 16px; font-size: 15vw; }
  #cin-nav { padding: 0 20px; }
  .nav-links { display: none; }
  .proj-card { min-width: 290px; max-width: 290px; height: 260px; }
  .hero-last { margin-left: 12px; }
  .timeline { padding-left: 28px; }
  .timeline-dot { left: -34px; }
}

@media (max-width: 480px) {
  .proj-card { min-width: 260px; max-width: 260px; }
}
</style>
</head>
<body>

<nav id="cin-nav" aria-label="Site navigation">
  <span class="nav-name">${esc(data.name)}</span>
  <div class="nav-links">
    ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="nav-link">Email</a>` : ''}
    ${data.contact.github ? `<a href="${esc(data.contact.github)}" target="_blank" rel="noopener" class="nav-link">GitHub</a>` : ''}
    ${data.contact.linkedin ? `<a href="${esc(data.contact.linkedin)}" target="_blank" rel="noopener" class="nav-link">LinkedIn</a>` : ''}
  </div>
</nav>

<section class="cin-hero" id="hero">
  <div class="hero-bg-grid" aria-hidden="true"></div>
  <div class="hero-content">
    ${data.photo ? '<div style="display:flex;justify-content:center;margin-bottom:32px">' + avatarHtml(data, 96, 'border:3px solid rgba(255,255,255,0.2);') + '</div>' : ''}
    <h1 class="hero-name">
      <span class="hero-first">${firstName}</span>
      ${lastName ? `<span class="hero-last">${lastName}</span>` : ''}
    </h1>
    <p class="hero-title">${esc(data.title)}</p>
    <div class="hero-line" id="hero-line" aria-hidden="true"></div>
    <p class="hero-bio">${esc(data.bio)}</p>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <span>Scroll</span>
    <div class="hero-chevron"></div>
  </div>
</section>

${sections}

<script>
(function () {
  var nav = document.getElementById('cin-nav');
  var heroLine = document.getElementById('hero-line');
  var hero = document.getElementById('hero');
  var heroH = hero ? hero.offsetHeight : window.innerHeight;

  // Animate the hero line on load
  requestAnimationFrame(function () {
    setTimeout(function () {
      if (heroLine) heroLine.classList.add('animated');
    }, 200);
  });

  // Show nav after hero
  window.addEventListener('scroll', function () {
    if (window.scrollY > heroH * 0.6) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  }, { passive: true });

  // Intersection Observer for reveal animations
  var revealItems = document.querySelectorAll('.reveal-item, .timeline-entry');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '100px' });

    revealItems.forEach(function (el) {
      observer.observe(el);
    });

    // Fallback: reveal everything after 600ms (handles iframe previews)
    setTimeout(function() {
      revealItems.forEach(function(el) { el.classList.add('revealed'); });
    }, 600);
  } else {
    revealItems.forEach(function (el) {
      el.classList.add('revealed');
    });
  }
})();
</script>

</body>
</html>`
}
