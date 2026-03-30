import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateGlass(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  // Derive initials for the avatar
  const nameParts = data.name.trim().split(/\s+/)
  const initials = esc(
    nameParts.length >= 2
      ? (nameParts[0]?.[0] ?? '') + (nameParts[nameParts.length - 1]?.[0] ?? '')
      : (nameParts[0]?.slice(0, 2) ?? '')
  ).toUpperCase()

  // Title: first word gets accent color, rest gets muted white
  const titleWords = data.title.trim().split(/\s+/)
  const titleFirstWord = esc(titleWords[0] ?? '')
  const titleRest = esc(titleWords.slice(1).join(' '))

  // Build nav links from sectionOrder minus hidden
  const navLinks = sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map(
      (id) =>
        `<a href="#section-${id}" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s ease" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">${id.charAt(0).toUpperCase() + id.slice(1)}</a>`
    )
    .join('')

  let cardDelay = 0
  const nextDelay = (step = 0.1) => {
    const d = cardDelay
    cardDelay += step
    return d.toFixed(1)
  }

  const renderers = {
    experience: (d: ResumeData) => {
      if (!d.experience.length) return ''
      cardDelay = 0.1
      return `
      <section id="section-experience" style="padding:80px 24px">
        <div class="glass-section-card anim" style="animation-delay:0s">
          <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:32px;display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a};flex-shrink:0"></span>
            <h2 style="font-size:28px;font-weight:700;color:#ffffff;margin:0">Experience</h2>
          </div>
          ${d.experience.map((exp, i) => `
          <div class="anim" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px">
              <div>
                <span style="font-size:18px;font-weight:700;color:#ffffff;display:block">${esc(exp.role)}</span>
                <span style="font-size:15px;font-weight:600;color:${a}">${esc(exp.company)}</span>
                ${exp.location ? `<span style="font-size:13px;color:rgba(255,255,255,0.45);margin-left:8px">${esc(exp.location)}</span>` : ''}
              </div>
              <span style="font-size:13px;color:rgba(255,255,255,0.5);white-space:nowrap;font-weight:500;background:rgba(255,255,255,0.06);padding:4px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.1)">${esc(exp.period)}</span>
            </div>
            ${exp.bullets.filter((b) => b).length ? `
            <ul style="list-style:none;padding:0;margin:0 0 14px 0">
              ${exp.bullets.filter((b) => b).map((b) => `
              <li style="font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;margin-bottom:6px;padding-left:16px;position:relative">
                <span style="position:absolute;left:0;top:0;color:${a}">›</span>${esc(b)}
              </li>`).join('')}
            </ul>` : ''}
            ${exp.tags.length ? `
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${exp.tags.map((t) => `<span style="display:inline-block;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:500;background:${a}22;color:${a};border:1px solid ${a}40">${esc(t)}</span>`).join('')}
            </div>` : ''}
          </div>`).join('')}
        </div>
      </section>`
    },

    projects: (d: ResumeData) => {
      if (!d.projects.length) return ''
      cardDelay = 0.1
      return `
      <section id="section-projects" style="padding:0 24px 80px">
        <div class="glass-section-card anim" style="animation-delay:0s">
          <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:32px;display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a};flex-shrink:0"></span>
            <h2 style="font-size:28px;font-weight:700;color:#ffffff;margin:0">Projects</h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px">
            ${d.projects.map((p, i) => `
            <div class="anim glass-project-card" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:12px;transition:border-color 0.3s ease,box-shadow 0.3s ease" onmouseover="this.style.borderColor='${a}';this.style.boxShadow='0 0 20px ${a}30'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.boxShadow='none'">
              <h3 style="font-size:18px;font-weight:700;color:#ffffff;margin:0">${esc(p.name)}</h3>
              <p style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.65;margin:0;flex:1">${esc(p.description)}</p>
              ${p.tags.length ? `
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${p.tags.map((t) => `<span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:500;background:${a}18;color:${a};border:1px solid ${a}30">${esc(t)}</span>`).join('')}
              </div>` : ''}
              <div style="display:flex;gap:10px;margin-top:4px">
                ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px 16px;background:${a};color:#ffffff;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 4px 16px ${a}40;transition:opacity 0.2s ease" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Live ↗</a>` : ''}
                ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px 16px;background:rgba(255,255,255,0.08);color:#ffffff;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;border:1px solid rgba(255,255,255,0.15);transition:background 0.2s ease" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">Repo ↗</a>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },

    skills: (d: ResumeData) => {
      if (!d.skills.length) return ''
      cardDelay = 0.1
      return `
      <section id="section-skills" style="padding:0 24px 80px">
        <div class="glass-section-card anim" style="animation-delay:0s">
          <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:32px;display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a};flex-shrink:0"></span>
            <h2 style="font-size:28px;font-weight:700;color:#ffffff;margin:0">Skills</h2>
          </div>
          ${d.skills.map((g, i) => `
          <div class="anim" style="animation-delay:${(0.1 + i * 0.08).toFixed(2)}s;margin-bottom:20px">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${a};display:block;margin-bottom:10px">${esc(g.category)}</span>
            <div style="display:flex;flex-wrap:wrap;gap:8px">
              ${g.items.map((item) => `<span style="display:inline-block;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:500;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.12)">${esc(item)}</span>`).join('')}
            </div>
          </div>`).join('')}
        </div>
      </section>`
    },

    education: (d: ResumeData) => {
      if (!d.education.length) return ''
      cardDelay = 0.1
      return `
      <section id="section-education" style="padding:0 24px 80px">
        <div class="glass-section-card anim" style="animation-delay:0s">
          <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:32px;display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a};flex-shrink:0"></span>
            <h2 style="font-size:28px;font-weight:700;color:#ffffff;margin:0">Education</h2>
          </div>
          ${d.education.map((edu, i) => `
          <div class="anim" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
              <span style="font-size:17px;font-weight:700;color:#ffffff;display:block;margin-bottom:4px">${esc(edu.degree)}</span>
              <span style="font-size:14px;font-weight:600;color:${a}">${esc(edu.institution)}</span>
              ${edu.note ? `<span style="font-size:13px;color:rgba(255,255,255,0.5);margin-left:8px">${esc(edu.note)}</span>` : ''}
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.5);white-space:nowrap;font-weight:500;background:rgba(255,255,255,0.06);padding:4px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.1)">${esc(edu.period)}</span>
          </div>`).join('')}
        </div>
      </section>`
    },

    contact: (d: ResumeData) => `
      <section id="section-contact" style="padding:0 24px 100px">
        <div class="glass-section-card anim" style="animation-delay:0s;text-align:center">
          <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:32px;display:flex;align-items:center;justify-content:center;gap:10px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a};flex-shrink:0"></span>
            <h2 style="font-size:28px;font-weight:700;color:#ffffff;margin:0">Contact</h2>
          </div>
          <div class="anim" style="animation-delay:0.1s">
            <p style="font-size:36px;font-weight:800;color:#ffffff;margin-bottom:8px">${esc(d.name)}</p>
            ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="font-size:20px;color:${a};text-decoration:none;display:block;margin-bottom:32px;font-weight:500">${esc(d.contact.email)}</a>` : ''}
            <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px">
              ${d.contact.github ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(255,255,255,0.08);color:#ffffff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;border:1px solid rgba(255,255,255,0.15);transition:background 0.2s ease" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">GitHub ↗</a>` : ''}
              ${d.contact.linkedin ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:${a};color:#ffffff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;box-shadow:0 4px 20px ${a}50;transition:opacity 0.2s ease" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">LinkedIn ↗</a>` : ''}
            </div>
          </div>
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
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0f0f1a;
  color: #ffffff;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100vh;
}

a { text-decoration: none; }

/* ── Animated background blobs ── */
.blob {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, ${a}40 0%, transparent 70%);
  animation: blob1 18s ease-in-out infinite;
}

.blob-2 {
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, ${a}30 0%, transparent 70%);
  animation: blob2 22s ease-in-out infinite;
}

@keyframes blob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(300px, 200px) scale(1.1); }
  66% { transform: translate(100px, 350px) scale(0.95); }
}

@keyframes blob2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-300px, -200px) scale(1.05); }
  66% { transform: translate(-150px, -350px) scale(0.9); }
}

/* ── All content above blobs ── */
#glass-nav, .glass-hero, section { position: relative; z-index: 1; }

/* ── Nav ── */
#glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: rgba(15, 15, 26, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-brand {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

/* ── Glass card base ── */
.glass-section-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
}

/* ── Hero ── */
.glass-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 24px 80px;
}

.hero-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${a}, ${a}cc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 32px;
  box-shadow: 0 0 40px ${a}40;
  flex-shrink: 0;
}

.hero-name {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 16px;
}

.hero-title {
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.hero-bio {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  line-height: 1.75;
  margin-bottom: 40px;
  font-weight: 400;
}

.hero-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-primary {
  padding: 14px 32px;
  background: ${a};
  color: #ffffff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 24px ${a}50;
  transition: opacity 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.cta-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.cta-ghost {
  padding: 14px 32px;
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(10px);
  display: inline-block;
}

.cta-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* ── CSS-only reveal animations (no IntersectionObserver) ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim {
  animation: fadeInUp 0.6s ease both;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  #glass-nav { padding: 0 20px; }
  .nav-links { display: none; }
  .glass-section-card { padding: 28px 20px; }
  .glass-hero { padding: 80px 16px 60px; }
  .blob { width: 400px; height: 400px; }
}

@media (max-width: 480px) {
  .glass-section-card { padding: 20px 16px; border-radius: 16px; }
}
</style>
</head>
<body>

<div class="blob blob-1" aria-hidden="true"></div>
<div class="blob blob-2" aria-hidden="true"></div>

<nav id="glass-nav" aria-label="Site navigation">
  <span class="nav-brand">${esc(data.name)}</span>
  <div class="nav-links">
    ${navLinks}
  </div>
</nav>

<section class="glass-hero" id="hero">
  <div class="hero-avatar anim" style="animation-delay:0s" aria-hidden="true">${avatarHtml(data, 80, 'background:linear-gradient(135deg,' + a + ',' + a + 'aa);color:#fff;box-shadow:0 0 30px ' + a + '66;border:2px solid rgba(255,255,255,0.2);')}</div>
  <h1 class="hero-name anim" style="animation-delay:0.1s">${esc(data.name)}</h1>
  <p class="hero-title anim" style="animation-delay:0.2s">
    <span style="color:${a}">${titleFirstWord}</span>${titleRest ? ` <span style="color:rgba(255,255,255,0.6)">${titleRest}</span>` : ''}
  </p>
  <p class="hero-bio anim" style="animation-delay:0.3s">${esc(data.bio)}</p>
  <div class="hero-ctas anim" style="animation-delay:0.4s">
    ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="cta-primary">Get In Touch</a>` : ''}
    ${data.contact.github ? `<a href="${safeUrl(data.contact.github)}" target="_blank" rel="noopener" class="cta-ghost">View GitHub ↗</a>` : ''}
  </div>
</section>

${sections}

</body>
</html>`
}
