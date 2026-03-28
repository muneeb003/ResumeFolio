import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml } from './shared'

export function generateStudent(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = esc(accent)

  const initials = data.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  const sectionEmoji: Record<SectionId, string> = {
    experience: '📋',
    projects: '🚀',
    skills: '💡',
    education: '🎓',
    contact: '📬',
  }

  const sectionLabels: Record<SectionId, string> = {
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    education: 'Education',
    contact: 'Contact',
  }

  const navTabs = sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map(
      (id) =>
        `<a href="#stu-${esc(id)}" style="display:inline-flex;align-items:center;gap:6px;padding:10px 18px;font-size:13px;font-weight:600;color:#475569;text-decoration:none;border-radius:999px;transition:all .2s;white-space:nowrap" onmouseover="this.style.background='${a}18';this.style.color='${a}'" onmouseout="this.style.background='transparent';this.style.color='#475569'">${esc(sectionEmoji[id])} ${esc(sectionLabels[id])}</a>`
    )
    .join('')

  const renderers = {
    experience: (d: ResumeData) =>
      !d.experience.length
        ? ''
        : `<section id="stu-experience" class="stu-section" style="opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <span style="font-size:24px" role="img" aria-label="experience">📋</span>
          <h2 style="font-size:22px;font-weight:800;color:#1e293b;letter-spacing:-.02em">Experience</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${d.experience
            .map(
              (exp) => `
            <div style="background:#fff;border-radius:20px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9;border-left:4px solid ${a};position:relative">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px">
                <div>
                  <h3 style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:2px">${esc(exp.company)}</h3>
                  <p style="font-size:14px;color:#64748b;font-weight:600">${esc(exp.role)}</p>
                </div>
                <span style="font-size:12px;color:${a};background:${a}15;padding:5px 12px;border-radius:999px;font-weight:600;white-space:nowrap">${esc(exp.period)}</span>
              </div>
              ${
                exp.bullets.filter((b) => b).length
                  ? `<ul style="padding-left:18px;color:#64748b;font-size:13.5px;line-height:1.7;margin:12px 0">
                  ${exp.bullets
                    .filter((b) => b)
                    .map((b) => `<li style="margin-bottom:4px">${esc(b)}</li>`)
                    .join('')}
                </ul>`
                  : ''
              }
              ${
                exp.tags.length
                  ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px">
                  ${exp.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:${a}12;color:${a}">${esc(t)}</span>`).join('')}
                </div>`
                  : ''
              }
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    projects: (d: ResumeData) =>
      !d.projects.length
        ? ''
        : `<section id="stu-projects" class="stu-section" style="opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <span style="font-size:24px" role="img" aria-label="projects">🚀</span>
          <h2 style="font-size:22px;font-weight:800;color:#1e293b;letter-spacing:-.02em">Projects</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px">
          ${d.projects
            .map(
              (p) => `
            <div class="stu-card" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9;transition:transform .2s,box-shadow .2s">
              <div style="height:4px;background:linear-gradient(90deg,${a},${a}aa)"></div>
              <div style="padding:20px">
                <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:8px">${esc(p.name)}</h3>
                <p style="font-size:13px;color:#64748b;line-height:1.65;margin-bottom:14px">${esc(p.description)}</p>
                <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px">
                  ${p.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;background:#f1f5f9;color:#475569">${esc(t)}</span>`).join('')}
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#fff;background:${a};text-decoration:none;padding:7px 15px;border-radius:10px">Live ↗</a>` : ''}
                  ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#475569;background:#f8fafc;text-decoration:none;padding:7px 15px;border-radius:10px;border:1px solid #e2e8f0">Repo ↗</a>` : ''}
                </div>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    skills: (d: ResumeData) =>
      !d.skills.length
        ? ''
        : `<section id="stu-skills" class="stu-section" style="opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <span style="font-size:24px" role="img" aria-label="skills">💡</span>
          <h2 style="font-size:22px;font-weight:800;color:#1e293b;letter-spacing:-.02em">Skills</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
          ${d.skills
            .map(
              (g, gi) => `
            <div style="background:#fff;border-radius:18px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9">
              <h3 style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${a};margin-bottom:12px;opacity:${gi % 3 === 0 ? '1' : gi % 3 === 1 ? '.85' : '.7'}">${esc(g.category)}</h3>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${g.items.map((item) => `<span style="font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;background:${a}10;color:${a};border:1px solid ${a}20">${esc(item)}</span>`).join('')}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    education: (d: ResumeData) =>
      !d.education.length
        ? ''
        : `<section id="stu-education" class="stu-section" style="opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <span style="font-size:24px" role="img" aria-label="education">🎓</span>
          <h2 style="font-size:22px;font-weight:800;color:#1e293b;letter-spacing:-.02em">Education</h2>
        </div>
        <div style="position:relative;padding-left:28px">
          <div style="position:absolute;left:10px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,${a},${a}22)"></div>
          ${d.education
            .map(
              (edu) => `
            <div style="position:relative;margin-bottom:20px">
              <div style="position:absolute;left:-22px;top:18px;width:14px;height:14px;border-radius:50%;background:${a};border:3px solid #f0f9ff;box-shadow:0 0 0 2px ${a}30"></div>
              <div style="background:#fff;border-radius:18px;padding:20px 22px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                  <div>
                    <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:3px">${esc(edu.institution)}</h3>
                    <p style="font-size:13px;color:#64748b;font-weight:500">${esc(edu.degree)}</p>
                    ${edu.note ? `<p style="font-size:12px;color:#94a3b8;margin-top:4px">${esc(edu.note)}</p>` : ''}
                  </div>
                  <span style="font-size:12px;color:${a};background:${a}12;padding:4px 12px;border-radius:999px;font-weight:600;white-space:nowrap">${esc(edu.period)}</span>
                </div>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    contact: (d: ResumeData) =>
      `<section id="stu-contact" class="stu-section" style="opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <span style="font-size:24px" role="img" aria-label="contact">📬</span>
          <h2 style="font-size:22px;font-weight:800;color:#1e293b;letter-spacing:-.02em">Contact</h2>
        </div>
        <div style="background:#fff;border-radius:20px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9;text-align:center">
          <p style="font-size:15px;color:#64748b;margin-bottom:28px;line-height:1.6">Excited to connect, collaborate, and grow together!</p>
          <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px">
            ${
              d.contact.email
                ? `<a href="mailto:${esc(d.contact.email)}" style="display:inline-flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:#fff;background:${a};text-decoration:none;padding:13px 24px;border-radius:14px;transition:opacity .2s">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                ${esc(d.contact.email)}
              </a>`
                : ''
            }
            ${
              d.contact.github
                ? `<a href="${esc(d.contact.github)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:#0f172a;background:#f1f5f9;text-decoration:none;padding:13px 24px;border-radius:14px;transition:opacity .2s;border:1px solid #e2e8f0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>`
                : ''
            }
            ${
              d.contact.linkedin
                ? `<a href="${esc(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:#0f172a;background:#f1f5f9;text-decoration:none;padding:13px 24px;border-radius:14px;transition:opacity .2s;border:1px solid #e2e8f0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${a}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>`
                : ''
            }
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
<title>${esc(data.name)} &mdash; Portfolio</title>
<meta name="description" content="${esc(data.bio.slice(0, 160))}">
<meta property="og:title" content="${esc(data.name)} &mdash; Portfolio">
<meta property="og:description" content="${esc(data.bio.slice(0, 160))}">
<meta property="og:type" content="profile">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${esc(data.name)}","jobTitle":"${esc(data.title)}","description":"${esc(data.bio)}"${data.contact.email ? `,"email":"${esc(data.contact.email)}"` : ''}}</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;color:#334155;background:#f8fafc;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;transition:opacity .15s}
a:hover{opacity:.8}
.stu-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.1)!important}
.stu-sticky-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,.04)}
@media(max-width:640px){
  .stu-hero-avatar{width:72px!important;height:72px!important;font-size:26px!important}
  .stu-hero-name{font-size:28px!important}
  .stu-hero-title{font-size:15px!important}
  .stu-nav-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
}
</style>
</head>
<body>

<header style="background:linear-gradient(135deg,${a} 0%,${a}dd 100%);padding:60px 24px 52px;text-align:center;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E') repeat;pointer-events:none"></div>
  <div style="position:relative;max-width:680px;margin:0 auto">
    ${avatarHtml(data, 96, 'background:rgba(255,255,255,0.2);color:#fff;border:3px solid rgba(255,255,255,0.4);margin-bottom:20px;')}
    <h1 class="stu-hero-name" style="font-size:36px;font-weight:800;color:#fff;margin-bottom:8px;letter-spacing:-.02em">${esc(data.name)}</h1>
    <p class="stu-hero-title" style="font-size:17px;color:rgba(255,255,255,.9);font-weight:500;margin-bottom:16px">${esc(data.title)}</p>
    <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 16px;backdrop-filter:blur(4px)">
      <span style="width:7px;height:7px;border-radius:50%;background:#fff;display:inline-block;animation:stu-pulse 2s infinite"></span>
      <span style="font-size:12px;font-weight:700;color:#fff;letter-spacing:.03em">Open to Opportunities</span>
    </div>
  </div>
</header>

<nav class="stu-sticky-nav">
  <div class="stu-nav-scroll" style="max-width:860px;margin:0 auto;padding:8px 20px;display:flex;gap:4px;align-items:center">
    ${navTabs}
  </div>
</nav>

<main style="max-width:860px;margin:0 auto;padding:48px 24px 24px">
  <div style="background:#fff;border-radius:20px;padding:24px 28px;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1px solid #f1f5f9;margin-bottom:52px">
    <p style="font-size:15px;color:#475569;line-height:1.8">${esc(data.bio)}</p>
  </div>
  ${sections}
</main>

<style>
@keyframes stu-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .6; transform: scale(1.2); }
}
</style>

<script>
(function() {
  var sections = document.querySelectorAll('.stu-section');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '100px' });
  sections.forEach(function(s) { observer.observe(s); });

  // Fallback: reveal everything after 600ms (handles iframe previews)
  setTimeout(function() {
    sections.forEach(function(s) {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
  }, 600);
})();
</script>
</body>
</html>`
}
