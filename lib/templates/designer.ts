import type { ResumeData, SectionId } from '@/lib/types'
import { esc, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateDesigner(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  const visibleSections = sectionOrder.filter((id) => !hiddenSections.includes(id))

  // Section display metadata
  const sectionMeta: Record<SectionId, { label: string; num: string }> = {
    experience: { label: 'Experience', num: '01' },
    projects:   { label: 'Projects',   num: '02' },
    skills:     { label: 'Skills',     num: '03' },
    education:  { label: 'Education',  num: '04' },
    contact:    { label: 'Contact',    num: '05' },
  }

  // Assign display numbers based on position in visible list
  visibleSections.forEach((id, i) => {
    sectionMeta[id].num = String(i + 1).padStart(2, '0')
  })

  // ── EXPERIENCE ───────────────────────────────────────────────────────────
  function renderExperience(): string {
    if (!data.experience.length) return ''
    return `
      <div class="exp-list">
        ${data.experience
          .map(
            (exp, idx) => `
          <article class="exp-item ${idx % 2 === 1 ? 'exp-item--right' : ''}" data-reveal>
            <div class="exp-inner">
              <div class="exp-meta">
                <span class="exp-period">${esc(exp.period)}</span>
                ${exp.location ? `<span class="exp-location">${esc(exp.location)}</span>` : ''}
              </div>
              <h3 class="exp-company">${esc(exp.company)}</h3>
              <p class="exp-role">${esc(exp.role)}</p>
              ${
                exp.bullets.filter(Boolean).length
                  ? `<ul class="exp-bullets">
                      ${exp.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                    </ul>`
                  : ''
              }
              ${
                exp.tags.length
                  ? `<div class="exp-tags">
                      ${exp.tags.map((t) => `<span class="skill-pill skill-pill--sm">${esc(t)}</span>`).join('')}
                    </div>`
                  : ''
              }
            </div>
          </article>`
          )
          .join('')}
      </div>`
  }

  // ── PROJECTS ─────────────────────────────────────────────────────────────
  function renderProjects(): string {
    if (!data.projects.length) return ''
    return `
      <div class="proj-grid">
        ${data.projects
          .map(
            (p) => `
          <article class="proj-card" data-reveal>
            <div class="proj-body">
              <h3 class="proj-name">${esc(p.name)}</h3>
              <p class="proj-desc">${esc(p.description)}</p>
              <div class="proj-tags">
                ${p.tags.map((t) => `<span class="skill-pill skill-pill--sm">${esc(t)}</span>`).join('')}
              </div>
            </div>
            <div class="proj-footer">
              ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" class="proj-link proj-link--primary">View Live ↗</a>` : ''}
              ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" class="proj-link proj-link--ghost">Source ↗</a>` : ''}
            </div>
          </article>`
          )
          .join('')}
      </div>`
  }

  // ── SKILLS ───────────────────────────────────────────────────────────────
  function renderSkills(): string {
    if (!data.skills.length) return ''
    return `
      <div class="skills-cloud" data-reveal>
        ${data.skills
          .map(
            (group) => `
          <div class="skill-group">
            <div class="skill-group-label">${esc(group.category)}</div>
            <div class="skill-pills">
              ${group.items.map((item) => `<span class="skill-pill">${esc(item)}</span>`).join('')}
            </div>
          </div>`
          )
          .join('')}
      </div>`
  }

  // ── EDUCATION ────────────────────────────────────────────────────────────
  function renderEducation(): string {
    if (!data.education.length) return ''
    return `
      <div class="edu-list" data-reveal>
        ${data.education
          .map(
            (edu) => `
          <div class="edu-item">
            <div class="edu-left">
              <h3 class="edu-institution">${esc(edu.institution)}</h3>
              <p class="edu-degree">${esc(edu.degree)}</p>
              ${edu.note ? `<p class="edu-note">${esc(edu.note)}</p>` : ''}
            </div>
            <div class="edu-period">${esc(edu.period)}</div>
          </div>`
          )
          .join('')}
      </div>`
  }

  // ── CONTACT ──────────────────────────────────────────────────────────────
  function renderContact(): string {
    return `
      <div class="contact-block" data-reveal>
        <p class="contact-tagline">Let&#039;s create something remarkable together.</p>
        <div class="contact-links">
          ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="contact-cta">${esc(data.contact.email)}</a>` : ''}
          ${data.contact.github ? `<a href="${safeUrl(data.contact.github)}" target="_blank" class="contact-ghost">GitHub ↗</a>` : ''}
          ${data.contact.linkedin ? `<a href="${safeUrl(data.contact.linkedin)}" target="_blank" class="contact-ghost">LinkedIn ↗</a>` : ''}
        </div>
      </div>`
  }

  const sectionRenderers: Record<SectionId, () => string> = {
    experience: renderExperience,
    projects:   renderProjects,
    skills:     renderSkills,
    education:  renderEducation,
    contact:    renderContact,
  }

  // ── NAV LINKS ────────────────────────────────────────────────────────────
  const navLinks = visibleSections
    .map(
      (id) =>
        `<a href="#section-${id}" class="nav-link">${sectionMeta[id].label}</a>`
    )
    .join('')

  // ── SECTIONS ─────────────────────────────────────────────────────────────
  const sectionsHtml = visibleSections
    .map(
      (id) => `
    <section id="section-${id}" class="page-section ${id === 'experience' ? 'page-section--alt' : ''}">
      <div class="section-inner">
        <div class="section-header" data-reveal>
          <span class="section-num">${sectionMeta[id].num}</span>
          <h2 class="section-title">${sectionMeta[id].label}</h2>
        </div>
        <div class="section-content">
          ${sectionRenderers[id]()}
        </div>
      </div>
    </section>`
    )
    .join('')

  // Name split for hero — first word large, rest smaller
  const nameParts = data.name.trim().split(/\s+/)
  const heroFirstName = esc(nameParts[0] ?? '')
  const heroLastName = esc(nameParts.slice(1).join(' '))

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
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
/* ── Reset & Base ──────────────────────────────────────────────────────── */
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:'DM Sans',sans-serif;
  color:#111827;
  background:#fff;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
a{text-decoration:none;color:inherit}
ul{list-style:none}
img{max-width:100%}

/* ── Scroll Reveal ─────────────────────────────────────────────────────── */
[data-reveal]{
  opacity:0;
  transform:translateY(32px);
  transition:opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
}
[data-reveal].revealed{
  opacity:1;
  transform:translateY(0);
}

/* ── Nav ───────────────────────────────────────────────────────────────── */
.nav{
  position:sticky;top:0;z-index:100;
  background:rgba(255,255,255,.88);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid #f3f4f6;
  height:60px;
  display:flex;align-items:center;
  padding:0 clamp(24px, 5vw, 80px);
}
.nav-inner{
  width:100%;max-width:1200px;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
}
.nav-name{
  font-family:'Playfair Display',serif;
  font-size:18px;font-weight:700;
  color:#111827;letter-spacing:-.01em;
}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-link{
  font-size:13px;font-weight:500;
  color:#6b7280;letter-spacing:.02em;
  transition:color .2s;
  position:relative;
}
.nav-link::after{
  content:'';
  position:absolute;bottom:-2px;left:0;right:0;height:1px;
  background:${a};
  transform:scaleX(0);transform-origin:left;
  transition:transform .25s cubic-bezier(.4,0,.2,1);
}
.nav-link:hover{color:#111827}
.nav-link:hover::after{transform:scaleX(1)}

/* ── Hero ──────────────────────────────────────────────────────────────── */
.hero{
  min-height:92vh;
  display:grid;
  grid-template-columns:1fr 1fr;
  align-items:center;
  padding:0 clamp(24px, 5vw, 80px);
  gap:40px;
  position:relative;
  overflow:hidden;
}
.hero::before{
  content:'';
  position:absolute;
  top:0;right:0;
  width:50%;height:100%;
  background:#f9fafb;
  z-index:0;
}
.hero-left{position:relative;z-index:1}
.hero-right{position:relative;z-index:1;padding:60px 0}

.hero-tag{
  display:inline-block;
  font-size:11px;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;
  color:${a};
  border:1px solid ${a}44;
  padding:5px 12px;border-radius:999px;
  margin-bottom:28px;
  background:${a}0a;
}
.hero-name{
  font-family:'Playfair Display',serif;
  font-size:clamp(52px, 9vw, 110px);
  font-weight:900;
  line-height:.95;
  color:#111827;
  letter-spacing:-.03em;
  margin-bottom:24px;
  position:relative;
}
.hero-name-first{display:block}
.hero-name-last{
  display:block;
  -webkit-text-stroke:2px #111827;
  color:transparent;
}
.hero-divider{
  width:80px;height:3px;
  background:${a};
  margin-bottom:24px;
}
.hero-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(16px, 2vw, 22px);
  font-weight:400;font-style:italic;
  color:#6b7280;
  margin-bottom:32px;
}

.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.hero-cta{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 24px;border-radius:6px;
  font-size:14px;font-weight:600;letter-spacing:.02em;
  transition:all .2s;
}
.hero-cta--primary{
  background:${a};color:#fff;
}
.hero-cta--primary:hover{opacity:.88;transform:translateY(-1px)}
.hero-cta--ghost{
  border:1.5px solid #e5e7eb;color:#374151;
}
.hero-cta--ghost:hover{border-color:#111827;color:#111827;transform:translateY(-1px)}

/* Hero Right — Bio card */
.hero-bio-card{
  background:#fff;
  border-radius:2px;
  padding:40px 36px;
  box-shadow:0 4px 40px rgba(0,0,0,.07);
  position:relative;
}
.hero-bio-card::before{
  content:'';
  position:absolute;left:0;top:20px;bottom:20px;
  width:3px;background:${a};border-radius:0 2px 2px 0;
}
.hero-bio-quote{
  font-family:'Playfair Display',serif;
  font-size:clamp(22px, 3vw, 32px);
  font-weight:400;font-style:italic;
  line-height:1.45;
  color:#111827;
  margin-bottom:24px;
}
.hero-bio-quote::before{
  content:open-quote;
  font-size:60px;line-height:0;vertical-align:-.35em;
  color:${a};margin-right:4px;
  font-family:'Playfair Display',serif;
}
.hero-bio-name{
  font-size:13px;font-weight:600;
  color:#6b7280;letter-spacing:.06em;text-transform:uppercase;
}

/* ── Sections ──────────────────────────────────────────────────────────── */
.page-section{padding:100px clamp(24px, 5vw, 80px)}
.page-section--alt{background:#f9fafb}

.section-inner{max-width:1200px;margin:0 auto}

.section-header{
  position:relative;
  margin-bottom:60px;
  padding-bottom:20px;
}
.section-num{
  position:absolute;
  font-family:'Playfair Display',serif;
  font-size:clamp(80px, 12vw, 140px);
  font-weight:900;
  color:#111827;
  opacity:.04;
  top:-30px;left:-12px;
  z-index:0;
  line-height:1;
  user-select:none;
  letter-spacing:-.04em;
}
.section-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(28px, 4vw, 44px);
  font-weight:700;
  color:#111827;
  position:relative;z-index:1;
  letter-spacing:-.02em;
}
.section-title::after{
  content:'';
  display:block;
  width:48px;height:3px;
  background:${a};
  margin-top:12px;
  border-radius:2px;
}

/* ── Experience ────────────────────────────────────────────────────────── */
.exp-list{display:flex;flex-direction:column;gap:0}
.exp-item{
  padding:48px 0;
  border-bottom:1px solid #f3f4f6;
  max-width:600px;
}
.exp-item--right{margin-left:auto;text-align:right}
.exp-item--right .exp-bullets{text-align:left;margin-left:auto;padding-right:0;padding-left:0}
.exp-item--right .exp-tags{justify-content:flex-end}
.exp-meta{
  display:flex;gap:12px;align-items:center;
  font-size:12px;font-weight:500;
  color:${a};letter-spacing:.05em;text-transform:uppercase;
  margin-bottom:10px;
}
.exp-item--right .exp-meta{justify-content:flex-end}
.exp-location{color:#9ca3af}
.exp-company{
  font-family:'Playfair Display',serif;
  font-size:clamp(22px, 3vw, 30px);
  font-weight:700;
  color:#111827;
  margin-bottom:4px;
  letter-spacing:-.02em;
}
.exp-role{
  font-size:15px;font-style:italic;
  color:#6b7280;margin-bottom:16px;
  font-family:'Playfair Display',serif;
}
.exp-bullets{
  font-size:14px;color:#374151;line-height:1.8;
  padding-left:0;
  display:flex;flex-direction:column;gap:6px;
  margin-bottom:16px;
}
.exp-bullets li{
  position:relative;
  padding-left:16px;
}
.exp-bullets li::before{
  content:'—';
  position:absolute;left:0;
  color:${a};font-size:12px;top:2px;
}
.exp-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}

/* ── Projects ──────────────────────────────────────────────────────────── */
.proj-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));
  gap:24px;
}
.proj-card{
  background:#fff;
  border-radius:8px;
  display:flex;flex-direction:column;
  transition:transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s cubic-bezier(.4,0,.2,1);
  overflow:hidden;
}
.proj-card:hover{
  transform:translateY(-4px);
  box-shadow:0 20px 60px rgba(0,0,0,.1);
}
.proj-body{
  padding:28px 28px 20px;
  flex:1;
}
.proj-name{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:700;
  color:#111827;margin-bottom:10px;
  letter-spacing:-.01em;
}
.proj-desc{
  font-size:14px;color:#6b7280;
  line-height:1.7;margin-bottom:16px;
}
.proj-tags{display:flex;flex-wrap:wrap;gap:6px}
.proj-footer{
  padding:16px 28px 24px;
  display:flex;gap:10px;flex-wrap:wrap;
  border-top:1px solid #f3f4f6;
}
.proj-link{
  font-size:13px;font-weight:600;
  padding:8px 16px;border-radius:5px;
  transition:all .18s;
  letter-spacing:.01em;
}
.proj-link--primary{
  background:${a};color:#fff;
}
.proj-link--primary:hover{opacity:.88}
.proj-link--ghost{
  border:1.5px solid #e5e7eb;color:#374151;
}
.proj-link--ghost:hover{border-color:#111827;color:#111827}

/* ── Skills ────────────────────────────────────────────────────────────── */
.skills-cloud{display:flex;flex-direction:column;gap:32px}
.skill-group{}
.skill-group-label{
  font-size:11px;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;
  color:#9ca3af;margin-bottom:10px;
}
.skill-pills{display:flex;flex-wrap:wrap;gap:8px}
.skill-pill{
  display:inline-block;
  font-size:13px;font-weight:500;
  color:#374151;
  background:#f3f4f6;
  padding:6px 14px;border-radius:999px;
  transition:background .18s,color .18s,transform .18s;
  cursor:default;
}
.skill-pill:hover{
  background:${a}18;
  color:${a};
  transform:translateY(-1px);
}
.skill-pill--sm{font-size:11px;padding:3px 10px}

/* ── Education ─────────────────────────────────────────────────────────── */
.edu-list{display:flex;flex-direction:column;gap:0}
.edu-item{
  display:flex;justify-content:space-between;align-items:flex-start;
  gap:24px;
  padding:36px 0;
  border-bottom:1px solid #f3f4f6;
  flex-wrap:wrap;
}
.edu-institution{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:700;
  color:#111827;margin-bottom:4px;
}
.edu-degree{font-size:15px;color:#6b7280;font-style:italic;margin-bottom:4px}
.edu-note{font-size:13px;color:#9ca3af}
.edu-period{
  font-size:13px;font-weight:600;
  color:${a};
  letter-spacing:.04em;text-transform:uppercase;
  white-space:nowrap;
  padding-top:4px;
}

/* ── Contact ───────────────────────────────────────────────────────────── */
.contact-block{text-align:center;padding:20px 0 40px}
.contact-tagline{
  font-family:'Playfair Display',serif;
  font-size:clamp(24px, 4vw, 42px);
  font-weight:700;
  color:#111827;
  margin-bottom:40px;
  letter-spacing:-.02em;
}
.contact-links{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.contact-cta{
  display:inline-flex;align-items:center;
  padding:14px 28px;border-radius:6px;
  font-size:15px;font-weight:600;
  background:${a};color:#fff;
  transition:opacity .2s,transform .2s;
}
.contact-cta:hover{opacity:.88;transform:translateY(-1px)}
.contact-ghost{
  display:inline-flex;align-items:center;
  padding:13px 24px;border-radius:6px;
  font-size:14px;font-weight:500;
  border:1.5px solid #e5e7eb;color:#374151;
  transition:all .18s;
}
.contact-ghost:hover{border-color:#111827;color:#111827;transform:translateY(-1px)}

/* ── Footer ────────────────────────────────────────────────────────────── */
.footer{
  padding:32px clamp(24px, 5vw, 80px);
  border-top:1px solid #f3f4f6;
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:12px;
}
.footer-name{
  font-family:'Playfair Display',serif;
  font-size:16px;font-weight:700;
  color:#111827;
}
.footer-copy{font-size:13px;color:#9ca3af}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media(max-width:768px){
  .hero{grid-template-columns:1fr;min-height:auto;padding-top:60px;padding-bottom:60px}
  .hero::before{display:none}
  .hero-right{padding:0}
  .nav-links{display:none}
  .exp-item--right{margin-left:0;text-align:left}
  .exp-item--right .exp-meta{justify-content:flex-start}
  .exp-item--right .exp-tags{justify-content:flex-start}
}
</style>
</head>
<body>

<!-- Nav -->
<nav class="nav">
  <div class="nav-inner">
    <a href="#" class="nav-name">${esc(data.name)}</a>
    <div class="nav-links">
      ${navLinks}
    </div>
  </div>
</nav>

<!-- Hero -->
<header class="hero">
  <div class="hero-left" data-reveal>
    <div class="hero-tag">${esc(data.title)}</div>
    <h1 class="hero-name">
      <span class="hero-name-first">${heroFirstName}</span>
      ${heroLastName ? '<span class="hero-name-last">' + heroLastName + '</span>' : ''}
    </h1>
    <div class="hero-divider"></div>
    <p class="hero-title">${esc(data.title)}</p>
    <div class="hero-ctas">
      ${data.contact.email ? `<a href="mailto:${esc(data.contact.email)}" class="hero-cta hero-cta--primary">Get in Touch</a>` : ''}
      ${visibleSections.includes('projects') ? '<a href="#section-projects" class="hero-cta hero-cta--ghost">View Work</a>' : ''}
    </div>
  </div>
  <div class="hero-right" data-reveal>
    <div class="hero-bio-card">
      ${data.photo ? '<div style="text-align:center;margin-bottom:20px">' + avatarHtml(data, 96, 'border:3px solid #e5e7eb;margin:0 auto;display:block;') + '</div>' : ''}
      <p class="hero-bio-quote">${esc(data.bio)}</p>
      <div class="hero-bio-name">${esc(data.name)}</div>
    </div>
  </div>
</header>

<!-- Sections -->
${sectionsHtml}

<!-- Footer -->
<footer class="footer">
  <div class="footer-name">${esc(data.name)}</div>
  <div class="footer-copy">${esc(data.title)}</div>
</footer>

<script>
(function() {
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, {
    threshold: 0.01,
    rootMargin: '100px'
  });

  var targets = document.querySelectorAll('[data-reveal]');
  for (var i = 0; i < targets.length; i++) {
    observer.observe(targets[i]);
  }

  // Stagger child reveals within each section
  var sections = document.querySelectorAll('.page-section');
  for (var s = 0; s < sections.length; s++) {
    var children = sections[s].querySelectorAll('[data-reveal]');
    for (var c = 0; c < children.length; c++) {
      children[c].style.transitionDelay = (c * 80) + 'ms';
    }
  }

  // Fallback: reveal everything after 600ms (handles iframe previews)
  setTimeout(function() {
    var hidden = document.querySelectorAll('[data-reveal]:not(.revealed)');
    for (var i = 0; i < hidden.length; i++) { hidden[i].classList.add('revealed'); }
  }, 600);
})();
</script>
</body>
</html>`
}
