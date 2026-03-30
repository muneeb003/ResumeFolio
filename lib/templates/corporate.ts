import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateCorporate(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  const initials = data.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  const sectionLabels: Record<SectionId, string> = {
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    education: 'Education',
    contact: 'Contact',
  }

  const navItems = sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map(
      (id) =>
        `<a href="#section-${esc(id)}" class="corp-nav-link" data-section="${esc(id)}" style="display:block;padding:10px 16px 10px 20px;font-size:13px;font-weight:500;color:#475569;text-decoration:none;border-left:3px solid transparent;border-radius:0 6px 6px 0;transition:all .2s;margin-bottom:2px">${esc(sectionLabels[id])}</a>`
    )
    .join('')

  const renderers = {
    experience: (d: ResumeData) =>
      !d.experience.length
        ? ''
        : `<section id="section-experience" style="margin-bottom:56px">
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${a};margin-bottom:32px;display:flex;align-items:center;gap:10px"><span style="display:inline-block;width:24px;height:2px;background:${a}"></span>Experience</h2>
        <div style="position:relative;padding-left:24px;border-left:2px solid #e2e8f0">
          ${d.experience
            .map(
              (exp) => `
            <div style="position:relative;margin-bottom:36px">
              <div style="position:absolute;left:-33px;top:6px;width:16px;height:16px;border-radius:50%;background:${a};border:3px solid #f8fafc;box-shadow:0 0 0 2px ${a}40"></div>
              <div style="background:#fff;border-radius:16px;padding:22px 24px;box-shadow:0 1px 3px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.04);border:1px solid #f1f5f9">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px">
                  <div>
                    <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:2px">${esc(exp.role)}</h3>
                    <p style="font-size:14px;font-weight:500;color:${a}">${esc(exp.company)}${exp.location ? `<span style="color:#94a3b8;font-weight:400"> &middot; ${esc(exp.location)}</span>` : ''}</p>
                  </div>
                  <span style="font-size:12px;color:#64748b;background:#f1f5f9;padding:4px 12px;border-radius:999px;font-weight:500;white-space:nowrap">${esc(exp.period)}</span>
                </div>
                ${
                  exp.bullets.filter((b) => b).length
                    ? `<ul style="padding-left:18px;color:#475569;font-size:14px;line-height:1.75;margin-bottom:12px">
                    ${exp.bullets
                      .filter((b) => b)
                      .map((b) => `<li style="margin-bottom:5px">${esc(b)}</li>`)
                      .join('')}
                  </ul>`
                    : ''
                }
                ${
                  exp.tags.length
                    ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
                    ${exp.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:${a}12;color:${a};letter-spacing:.02em">${esc(t)}</span>`).join('')}
                  </div>`
                    : ''
                }
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    projects: (d: ResumeData) =>
      !d.projects.length
        ? ''
        : `<section id="section-projects" style="margin-bottom:56px">
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${a};margin-bottom:32px;display:flex;align-items:center;gap:10px"><span style="display:inline-block;width:24px;height:2px;background:${a}"></span>Projects</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">
          ${d.projects
            .map(
              (p) => `
            <div class="corp-proj-card" style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 1px 3px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.04);border:1px solid #f1f5f9;transition:transform .2s,box-shadow .2s;cursor:default">
              <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px">${esc(p.name)}</h3>
              <p style="font-size:13px;color:#64748b;line-height:1.65;margin-bottom:14px">${esc(p.description)}</p>
              <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px">
                ${p.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:${a}12;color:${a}">${esc(t)}</span>`).join('')}
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:600;color:#fff;background:${a};text-decoration:none;padding:6px 14px;border-radius:8px;transition:opacity .2s">Live Demo ↗</a>` : ''}
                ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:600;color:#475569;background:#f1f5f9;text-decoration:none;padding:6px 14px;border-radius:8px;transition:opacity .2s">GitHub ↗</a>` : ''}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    skills: (d: ResumeData) =>
      !d.skills.length
        ? ''
        : `<section id="section-skills" style="margin-bottom:56px">
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${a};margin-bottom:32px;display:flex;align-items:center;gap:10px"><span style="display:inline-block;width:24px;height:2px;background:${a}"></span>Skills</h2>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${d.skills
            .map(
              (g, gi) => `
            <div style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.04);border:1px solid #f1f5f9">
              <h3 style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px">${esc(g.category)}</h3>
              <div style="display:flex;flex-direction:column;gap:10px">
                ${g.items
                  .map(
                    (item, ii) => `
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
                      <span style="font-size:13px;font-weight:500;color:#334155">${esc(item)}</span>
                    </div>
                    <div style="height:6px;background:#f1f5f9;border-radius:999px;overflow:hidden">
                      <div class="corp-skill-bar" data-pct="${70 + ((gi * 7 + ii * 11) % 28)}" style="height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,${a},${a}cc);transition:width .8s cubic-bezier(.4,0,.2,1)"></div>
                    </div>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    education: (d: ResumeData) =>
      !d.education.length
        ? ''
        : `<section id="section-education" style="margin-bottom:56px">
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${a};margin-bottom:32px;display:flex;align-items:center;gap:10px"><span style="display:inline-block;width:24px;height:2px;background:${a}"></span>Education</h2>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${d.education
            .map(
              (edu) => `
            <div style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.04);border:1px solid #f1f5f9;border-left:4px solid ${a}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                <div>
                  <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:3px">${esc(edu.degree)}</h3>
                  <p style="font-size:14px;color:#64748b;font-weight:500">${esc(edu.institution)}</p>
                  ${edu.note ? `<p style="font-size:13px;color:#94a3b8;margin-top:4px">${esc(edu.note)}</p>` : ''}
                </div>
                <span style="font-size:12px;color:#64748b;background:#f1f5f9;padding:4px 12px;border-radius:999px;font-weight:500;white-space:nowrap">${esc(edu.period)}</span>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>`,

    contact: (d: ResumeData) =>
      `<section id="section-contact" style="margin-bottom:56px">
        <h2 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${a};margin-bottom:32px;display:flex;align-items:center;gap:10px"><span style="display:inline-block;width:24px;height:2px;background:${a}"></span>Contact</h2>
        <div style="display:flex;flex-wrap:wrap;gap:14px">
          ${
            d.contact.email
              ? `<a href="mailto:${esc(d.contact.email)}" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#0f172a;text-decoration:none;background:#fff;border:1px solid #e2e8f0;padding:10px 18px;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:box-shadow .2s">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              ${esc(d.contact.email)}
            </a>`
              : ''
          }
          ${
            d.contact.github
              ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#0f172a;text-decoration:none;background:#fff;border:1px solid #e2e8f0;padding:10px 18px;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:box-shadow .2s">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub ↗
            </a>`
              : ''
          }
          ${
            d.contact.linkedin
              ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#0f172a;text-decoration:none;background:#fff;border:1px solid #e2e8f0;padding:10px 18px;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:box-shadow .2s">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${a}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn ↗
            </a>`
              : ''
          }
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;color:#334155;background:#f8fafc;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;transition:opacity .15s}
a:hover{opacity:.75}
.corp-sidebar{position:fixed;top:0;left:0;width:280px;height:100vh;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;overflow-y:auto;z-index:100}
.corp-main{margin-left:280px;padding:48px 52px;min-height:100vh}
.corp-nav-link:hover{background:#f1f5f9;color:#0f172a!important;border-left-color:${a}60!important}
.corp-nav-link.active{color:#0f172a!important;font-weight:600!important;border-left-color:${a}!important;background:#fff}
.corp-proj-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.1)!important}
@media(max-width:768px){
  .corp-sidebar{position:relative;width:100%;height:auto;border-right:none;border-bottom:1px solid #e2e8f0;flex-direction:row;align-items:center;flex-wrap:wrap;padding:16px;gap:12px}
  .corp-main{margin-left:0;padding:32px 20px}
  .corp-sidebar-profile{display:flex;align-items:center;gap:12px;padding:0}
  .corp-sidebar-nav{display:flex;flex-direction:row;flex-wrap:wrap;gap:4px;padding:0}
  .corp-sidebar-contact{display:none}
  .corp-nav-link{padding:6px 12px!important;border-left:none!important;border-radius:6px!important;border-bottom:2px solid transparent!important}
  .corp-nav-link.active{border-bottom-color:${a}!important;background:#f1f5f9}
}
</style>
</head>
<body>

<aside class="corp-sidebar">
  <div class="corp-sidebar-profile" style="padding:32px 24px 24px">
    ${avatarHtml(data, 72, 'background:' + a + ';color:#fff;margin-bottom:16px;')}
    <h1 style="font-size:17px;font-weight:700;color:#0f172a;line-height:1.3;margin-bottom:4px">${esc(data.name)}</h1>
    <p style="font-size:12px;color:#64748b;font-weight:500;line-height:1.4">${esc(data.title)}</p>
  </div>

  <div style="padding:0 12px;margin:0 0 4px">
    <div style="height:1px;background:#e2e8f0"></div>
  </div>

  <nav class="corp-sidebar-nav" style="padding:12px 12px;flex:1" aria-label="Page sections">
    ${navItems}
  </nav>

  <div class="corp-sidebar-contact" style="padding:20px 24px;border-top:1px solid #e2e8f0">
    ${
      data.contact.email
        ? `<a href="mailto:${esc(data.contact.email)}" style="display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;text-decoration:none;margin-bottom:10px;transition:color .15s" onmouseover="this.style.color='${a}'" onmouseout="this.style.color='#64748b'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(data.contact.email)}</span>
      </a>`
        : ''
    }
    ${
      data.contact.github
        ? `<a href="${safeUrl(data.contact.github)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;text-decoration:none;margin-bottom:10px;transition:color .15s" onmouseover="this.style.color='${a}'" onmouseout="this.style.color='#64748b'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>`
        : ''
    }
    ${
      data.contact.linkedin
        ? `<a href="${safeUrl(data.contact.linkedin)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;text-decoration:none;transition:color .15s" onmouseover="this.style.color='${a}'" onmouseout="this.style.color='#64748b'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>`
        : ''
    }
  </div>
</aside>

<main class="corp-main">
  <div style="max-width:820px">
    <section id="section-bio" style="margin-bottom:56px">
      <p style="font-size:16px;color:#475569;line-height:1.8;max-width:680px">${esc(data.bio)}</p>
    </section>
    ${sections}
  </div>
</main>

<script>
(function() {
  var navLinks = document.querySelectorAll('.corp-nav-link');
  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('data-section');
    var el = document.getElementById('section-' + id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  function setActive(id) {
    navLinks.forEach(function(l) { l.classList.remove('active'); });
    var found = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id) { found = sections[i]; break; }
    }
    if (found) found.link.classList.add('active');
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id.replace('section-', '');
        setActive(id);
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(function(s) { observer.observe(s.el); });
  if (sections.length) setActive(sections[0].id);

  var skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var bars = entry.target.querySelectorAll('.corp-skill-bar');
        bars.forEach(function(bar) {
          var pct = bar.getAttribute('data-pct');
          bar.style.width = pct + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  var skillSection = document.getElementById('section-skills');
  if (skillSection) skillObserver.observe(skillSection);
})();
</script>
</body>
</html>`
}
