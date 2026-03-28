import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml } from './shared'

export function generateNeon(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accent)

  // Build nav links from visible sections
  const navLinks = sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map(
      (id) =>
        `<a href="#section-${id}" style="color:#c8c8d8;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.05em;transition:color 0.2s ease,text-shadow 0.2s ease" onmouseover="this.style.color='${a}';this.style.textShadow='0 0 8px ${a}'" onmouseout="this.style.color='#c8c8d8';this.style.textShadow='none'">${id.toUpperCase()}</a>`
    )
    .join('')

  const renderers = {
    experience: (d: ResumeData) => {
      if (!d.experience.length) return ''
      return `
      <section id="section-experience" style="padding:80px 24px">
        <div class="neon-section-card fade-in" style="animation-delay:0s">
          <div style="border-left:3px solid ${a};padding-left:16px;margin-bottom:36px">
            <h2 style="font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 0 20px ${a}60;letter-spacing:0.08em;margin:0">EXPERIENCE</h2>
          </div>
          ${d.experience.map((exp, i) => `
          <div class="fade-in" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;border:1px solid ${a}30;border-radius:4px;padding:28px;margin-bottom:20px;background:rgba(255,255,255,0.02);position:relative;overflow:hidden">
            <div style="position:absolute;top:0;left:0;width:3px;height:100%;background:${a};opacity:0.6"></div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:14px">
              <div>
                <span style="font-family:'Orbitron',monospace;font-size:11px;font-weight:700;color:${a};letter-spacing:0.15em;text-transform:uppercase;display:block;margin-bottom:4px">${esc(exp.company)}</span>
                <span style="font-size:17px;font-weight:700;color:#ffffff;display:block">${esc(exp.role)}</span>
                ${exp.location ? `<span style="font-size:12px;color:#6868a0;margin-top:2px;display:block">${esc(exp.location)}</span>` : ''}
              </div>
              <span style="font-family:'Share Tech Mono',monospace;font-size:13px;color:${a};white-space:nowrap;background:${a}10;padding:4px 12px;border:1px solid ${a}30;border-radius:2px">${esc(exp.period)}</span>
            </div>
            ${exp.bullets.filter((b) => b).length ? `
            <ul style="list-style:none;padding:0;margin:0 0 16px 0">
              ${exp.bullets.filter((b) => b).map((b) => `
              <li style="font-size:14px;color:#c8c8d8;line-height:1.7;margin-bottom:6px;padding-left:20px;position:relative">
                <span style="position:absolute;left:0;top:0;color:${a};font-family:'Share Tech Mono',monospace;font-weight:700">&gt;</span>${esc(b)}
              </li>`).join('')}
            </ul>` : ''}
            ${exp.tags.length ? `
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${exp.tags.map((t) => `<span style="display:inline-block;padding:3px 12px;font-size:12px;font-weight:500;color:${a};background:${a}10;border:1px solid ${a}30;border-radius:2px;font-family:'Share Tech Mono',monospace">[${esc(t)}]</span>`).join('')}
            </div>` : ''}
          </div>`).join('')}
        </div>
      </section>`
    },

    projects: (d: ResumeData) => {
      if (!d.projects.length) return ''
      return `
      <section id="section-projects" style="padding:0 24px 80px">
        <div class="neon-section-card fade-in" style="animation-delay:0s">
          <div style="border-left:3px solid ${a};padding-left:16px;margin-bottom:36px">
            <h2 style="font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 0 20px ${a}60;letter-spacing:0.08em;margin:0">PROJECTS</h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px">
            ${d.projects.map((p, i) => `
            <div class="fade-in neon-proj-card" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;border:1px solid ${a}25;border-radius:4px;padding:28px;background:rgba(255,255,255,0.02);display:flex;flex-direction:column;gap:12px;transition:border-color 0.3s ease,box-shadow 0.3s ease" onmouseover="this.style.borderColor='${a}';this.style.boxShadow='0 0 20px ${a}30,inset 0 0 20px ${a}08'" onmouseout="this.style.borderColor='${a}25';this.style.boxShadow='none'">
              <h3 style="font-family:'Orbitron',monospace;font-size:15px;font-weight:700;color:#ffffff;margin:0;letter-spacing:0.05em">${esc(p.name)}</h3>
              <p style="font-size:13px;color:#c8c8d8;line-height:1.65;margin:0;flex:1">${esc(p.description)}</p>
              ${p.tags.length ? `
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${p.tags.map((t) => `<span style="display:inline-block;font-family:'Share Tech Mono',monospace;font-size:11px;color:${a};padding:2px 8px;border:1px solid ${a}30;background:${a}08;border-radius:2px">[${esc(t)}]</span>`).join('')}
              </div>` : ''}
              <div style="display:flex;gap:10px;margin-top:4px">
                ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px 14px;border:1px solid ${a};color:${a};border-radius:2px;font-size:13px;font-weight:700;text-decoration:none;font-family:'Share Tech Mono',monospace;transition:background 0.2s ease,color 0.2s ease,box-shadow 0.2s ease" onmouseover="this.style.background='${a}';this.style.color='#080810';this.style.boxShadow='0 0 16px ${a}60'" onmouseout="this.style.background='transparent';this.style.color='${a}';this.style.boxShadow='none'">LIVE ↗</a>` : ''}
                ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px 14px;border:1px solid ${a}40;color:#c8c8d8;border-radius:2px;font-size:13px;font-weight:700;text-decoration:none;font-family:'Share Tech Mono',monospace;transition:border-color 0.2s ease,color 0.2s ease" onmouseover="this.style.borderColor='${a}';this.style.color='${a}'" onmouseout="this.style.borderColor='${a}40';this.style.color='#c8c8d8'">REPO ↗</a>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },

    skills: (d: ResumeData) => {
      if (!d.skills.length) return ''
      return `
      <section id="section-skills" style="padding:0 24px 80px">
        <div class="neon-section-card fade-in" style="animation-delay:0s">
          <div style="border-left:3px solid ${a};padding-left:16px;margin-bottom:36px">
            <h2 style="font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 0 20px ${a}60;letter-spacing:0.08em;margin:0">SKILLS</h2>
          </div>
          ${d.skills.map((g, i) => `
          <div class="fade-in" style="animation-delay:${(0.1 + i * 0.08).toFixed(2)}s;margin-bottom:24px">
            <span style="font-family:'Orbitron',monospace;font-size:11px;font-weight:700;color:${a};letter-spacing:0.15em;text-transform:uppercase;display:block;margin-bottom:10px">${esc(g.category)}</span>
            <div style="display:flex;flex-wrap:wrap;gap:8px">
              ${g.items.map((item) => `<span style="display:inline-block;padding:5px 14px;font-size:13px;font-weight:500;color:${a};background:${a}08;border:1px solid ${a}30;border-radius:2px;transition:all 0.2s ease;cursor:default" onmouseover="this.style.background='${a}18';this.style.boxShadow='0 0 10px ${a}40';this.style.borderColor='${a}'" onmouseout="this.style.background='${a}08';this.style.boxShadow='none';this.style.borderColor='${a}30'">${esc(item)}</span>`).join('')}
            </div>
          </div>`).join('')}
        </div>
      </section>`
    },

    education: (d: ResumeData) => {
      if (!d.education.length) return ''
      return `
      <section id="section-education" style="padding:0 24px 80px">
        <div class="neon-section-card fade-in" style="animation-delay:0s">
          <div style="border-left:3px solid ${a};padding-left:16px;margin-bottom:36px">
            <h2 style="font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 0 20px ${a}60;letter-spacing:0.08em;margin:0">EDUCATION</h2>
          </div>
          ${d.education.map((edu, i) => `
          <div class="fade-in" style="animation-delay:${(0.1 + i * 0.1).toFixed(1)}s;border:1px solid ${a}25;border-radius:4px;padding:24px;margin-bottom:16px;background:rgba(255,255,255,0.02);display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
              <span style="font-size:16px;font-weight:700;color:#ffffff;display:block;margin-bottom:4px">${esc(edu.degree)}</span>
              <span style="font-family:'Orbitron',monospace;font-size:11px;font-weight:700;color:${a};letter-spacing:0.12em;text-transform:uppercase">${esc(edu.institution)}</span>
              ${edu.note ? `<span style="font-size:12px;color:#6868a0;margin-left:10px">${esc(edu.note)}</span>` : ''}
            </div>
            <span style="font-family:'Share Tech Mono',monospace;font-size:13px;color:${a};white-space:nowrap;background:${a}10;padding:4px 12px;border:1px solid ${a}30;border-radius:2px">${esc(edu.period)}</span>
          </div>`).join('')}
        </div>
      </section>`
    },

    contact: (d: ResumeData) => `
      <section id="section-contact" style="padding:0 24px 100px">
        <div class="neon-section-card fade-in" style="animation-delay:0s;text-align:center">
          <div style="border-left:3px solid ${a};padding-left:16px;margin-bottom:36px;text-align:left">
            <h2 style="font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 0 20px ${a}60;letter-spacing:0.08em;margin:0">CONTACT</h2>
          </div>
          <div class="fade-in" style="animation-delay:0.1s">
            <p style="font-family:'Orbitron',monospace;font-size:clamp(22px,4vw,40px);font-weight:700;color:#ffffff;letter-spacing:0.04em;text-shadow:0 0 30px ${a}40;margin-bottom:8px">${esc(d.name)}</p>
            ${d.contact.email ? `<a href="mailto:${esc(d.contact.email)}" style="font-family:'Share Tech Mono',monospace;font-size:18px;color:${a};text-decoration:none;display:block;margin-bottom:36px;text-shadow:0 0 10px ${a}60">${esc(d.contact.email)}</a>` : ''}
            <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px">
              ${d.contact.github ? `<a href="${esc(d.contact.github)}" target="_blank" rel="noopener" style="padding:12px 28px;border:1px solid ${a};color:${a};border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.08em;transition:background 0.2s ease,color 0.2s ease,box-shadow 0.2s ease" onmouseover="this.style.background='${a}';this.style.color='#080810';this.style.boxShadow='0 0 20px ${a}60'" onmouseout="this.style.background='transparent';this.style.color='${a}';this.style.boxShadow='none'">GITHUB ↗</a>` : ''}
              ${d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}" target="_blank" rel="noopener" style="padding:12px 28px;border:1px solid ${a};color:${a};border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.08em;transition:background 0.2s ease,color 0.2s ease,box-shadow 0.2s ease" onmouseover="this.style.background='${a}';this.style.color='#080810';this.style.boxShadow='0 0 20px ${a}60'" onmouseout="this.style.background='transparent';this.style.color='${a}';this.style.boxShadow='none'">LINKEDIN ↗</a>` : ''}
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
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}","description":"${esc(data.bio)}"${data.contact.email ? `,"email":"${esc(data.contact.email)}"` : ''}${data.contact.github ? `,"sameAs":"${esc(data.contact.github)}"` : ''}}</script>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #080810;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    ),
    linear-gradient(${a}08 1px, transparent 1px),
    linear-gradient(90deg, ${a}08 1px, transparent 1px);
  background-size: auto, 40px 40px, 40px 40px;
  color: #c8c8d8;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100vh;
}

a { text-decoration: none; }

/* ── Neon utilities ── */
.neon-text {
  color: ${a};
  text-shadow: 0 0 10px ${a}, 0 0 20px ${a}80, 0 0 40px ${a}40;
}

.neon-border {
  border: 1px solid ${a};
  box-shadow: 0 0 10px ${a}40, inset 0 0 10px ${a}10;
}

/* ── Nav ── */
#neon-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 56px;
  background: rgba(8, 8, 16, 0.95);
  border-bottom: 1px solid ${a}30;
  box-shadow: 0 0 20px ${a}10;
}

.nav-brand-neon {
  font-family: 'Orbitron', monospace;
  font-size: 14px;
  font-weight: 700;
  color: ${a};
  text-shadow: 0 0 10px ${a}, 0 0 20px ${a}80;
  letter-spacing: 0.1em;
}

.nav-links-neon {
  display: flex;
  gap: 28px;
  align-items: center;
}

/* ── Hero ── */
.neon-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 24px 80px;
  position: relative;
}

.hero-name-neon {
  font-family: 'Orbitron', monospace;
  font-size: clamp(36px, 7vw, 80px);
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 30px ${a}60, 0 0 60px ${a}30;
  letter-spacing: 0.05em;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero-title-neon {
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  color: ${a};
  margin-bottom: 28px;
  letter-spacing: 0.08em;
  text-shadow: 0 0 10px ${a}80;
  position: relative;
  display: inline-block;
}

.hero-title-neon::after {
  content: '_';
  animation: blink 1s step-end infinite;
  color: ${a};
}

.hero-bio-neon {
  font-size: 16px;
  color: #c8c8d8;
  max-width: 560px;
  line-height: 1.75;
  margin-bottom: 40px;
  font-weight: 400;
}

.hero-ctas-neon {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-neon {
  padding: 13px 32px;
  border: 1px solid ${a};
  color: ${a};
  border-radius: 2px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 10px ${a}30, inset 0 0 10px ${a}08;
  display: inline-block;
}

.cta-neon:hover {
  background: ${a};
  color: #080810;
  box-shadow: 0 0 20px ${a}60, 0 0 40px ${a}30;
}

/* ── Section card ── */
.neon-section-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${a}20;
  border-radius: 4px;
  box-shadow: 0 0 30px ${a}08;
}

/* ── CSS-only reveal animations (no IntersectionObserver) ── */
@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.9; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.fade-in {
  animation: fadeIn 0.5s ease both;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  #neon-nav { padding: 0 20px; }
  .nav-links-neon { display: none; }
  .neon-section-card { padding: 24px 16px; }
  .neon-hero { padding: 80px 16px 60px; }
}

@media (max-width: 480px) {
  .neon-section-card { padding: 20px 14px; }
  .hero-name-neon { letter-spacing: 0.02em; }
}
</style>
</head>
<body>

<nav id="neon-nav" aria-label="Site navigation">
  <span class="nav-brand-neon">${esc(data.name)}</span>
  <div class="nav-links-neon">
    ${navLinks}
  </div>
</nav>

<section class="neon-hero" id="hero">
  ${data.photo ? '<div style="margin-bottom:24px">' + avatarHtml(data, 80, 'border:2px solid ' + a + ';box-shadow:0 0 20px ' + a + '66;') + '</div>' : ''}
  <h1 class="hero-name-neon fade-in" style="animation-delay:0s">${esc(data.name)}</h1>
  <p class="hero-title-neon fade-in" style="animation-delay:0.15s">${esc(data.title)}</p>
  <p class="hero-bio-neon fade-in" style="animation-delay:0.3s">${esc(data.bio)}</p>
  <div class="hero-ctas-neon fade-in" style="animation-delay:0.45s">
    ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="cta-neon">CONTACT_ME</a>` : ''}
    ${data.contact.github ? `<a href="${esc(data.contact.github)}" target="_blank" rel="noopener" class="cta-neon">VIEW_GITHUB ↗</a>` : ''}
  </div>
</section>

${sections}

</body>
</html>`
}
