import type { ResumeData, SectionId } from '@/lib/types'
import { esc, renderSections, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateFreelancer(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  const sectionLabels: Record<SectionId, string> = {
    experience: 'Experience',
    projects: 'Featured Work',
    skills: 'Services',
    education: 'Education',
    contact: 'Contact',
  }

  const navLinks = sectionOrder
    .filter((id) => !hiddenSections.includes(id))
    .map(
      (id) =>
        `<a href="#fl-${esc(id)}" style="font-size:13px;font-weight:600;color:rgba(255,255,255,.7);text-decoration:none;letter-spacing:.02em;transition:color .2s;padding:4px 0" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.7)'">${esc(sectionLabels[id])}</a>`
    )
    .join('')

  // Build services cards from first 4 skill groups (or all if fewer)
  const serviceGroups = data.skills.slice(0, 4)

  const serviceIcons = [
    `<div style="width:40px;height:40px;border-radius:10px;background:${a}15;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><div style="width:20px;height:20px;background:${a};clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)"></div></div>`,
    `<div style="width:40px;height:40px;border-radius:10px;background:${a}15;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><div style="width:18px;height:18px;background:${a};border-radius:3px;transform:rotate(45deg)"></div></div>`,
    `<div style="width:40px;height:40px;border-radius:10px;background:${a}15;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><div style="width:20px;height:20px;background:${a};border-radius:50%"></div></div>`,
    `<div style="width:40px;height:40px;border-radius:10px;background:${a}15;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><div style="width:20px;height:6px;background:${a};border-radius:3px;margin-bottom:4px"></div><div style="width:14px;height:6px;background:${a};border-radius:3px"></div></div>`,
  ]

  const servicesSection =
    !hiddenSections.includes('skills') && serviceGroups.length
      ? `<section id="fl-skills" style="background:#fff;padding:80px 0">
    <div style="max-width:1100px;margin:0 auto;padding:0 48px">
      <div style="margin-bottom:48px">
        <p style="font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:10px">What I Do</p>
        <h2 style="font-size:36px;font-weight:800;color:#111827;letter-spacing:-.03em;line-height:1.1">Services &amp; Expertise</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px">
        ${serviceGroups
          .map(
            (g, gi) => `
          <div class="fl-service-card" style="background:#f9fafb;border-radius:16px;padding:28px;border:1px solid #f3f4f6;transition:all .25s;cursor:default">
            ${serviceIcons[gi % 4]}
            <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:12px">${esc(g.category)}</h3>
            <ul style="list-style:none;padding:0">
              ${g.items
                .slice(0, 5)
                .map(
                  (item) =>
                    `<li style="font-size:13px;color:#6b7280;padding:4px 0;display:flex;align-items:center;gap:7px"><span style="width:5px;height:5px;border-radius:50%;background:${a};flex-shrink:0;display:inline-block"></span>${esc(item)}</li>`
                )
                .join('')}
            </ul>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>`
      : ''

  const renderers = {
    experience: (d: ResumeData) =>
      !d.experience.length
        ? ''
        : `<section id="fl-experience" style="background:#fff;padding:80px 0;border-top:1px solid #f3f4f6">
        <div style="max-width:1100px;margin:0 auto;padding:0 48px">
          <div style="margin-bottom:48px">
            <p style="font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:10px">Background</p>
            <h2 style="font-size:36px;font-weight:800;color:#111827;letter-spacing:-.03em;line-height:1.1">Experience</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:0">
            ${d.experience
              .map(
                (exp, ei) => `
              <div class="fl-exp-item" style="border-bottom:1px solid #f3f4f6;padding:28px 0">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:12px">
                  <div style="display:flex;align-items:flex-start;gap:20px">
                    <span style="font-size:13px;font-weight:800;color:${a};font-variant-numeric:tabular-nums;min-width:30px;margin-top:3px">0${ei + 1}</span>
                    <div>
                      <h3 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:3px">${esc(exp.role)}</h3>
                      <p style="font-size:14px;color:#6b7280;font-weight:500">${esc(exp.company)}${exp.location ? ` &middot; ${esc(exp.location)}` : ''}</p>
                    </div>
                  </div>
                  <span style="font-size:12px;color:#9ca3af;font-weight:500;white-space:nowrap;margin-top:5px">${esc(exp.period)}</span>
                </div>
                <div style="padding-left:50px">
                  <button class="fl-exp-toggle" data-idx="${ei}" style="font-size:12px;font-weight:700;color:${a};background:none;border:none;cursor:pointer;padding:0;letter-spacing:.02em;display:flex;align-items:center;gap:5px;margin-bottom:0;transition:opacity .2s">
                    <span class="fl-toggle-label-${ei}">Show details</span>
                    <svg class="fl-toggle-icon-${ei}" width="12" height="12" viewBox="0 0 12 12" fill="none" style="transition:transform .25s"><path d="M2 4l4 4 4-4" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <div class="fl-exp-bullets-${ei}" style="display:none;margin-top:14px">
                    ${
                      exp.bullets.filter((b) => b).length
                        ? `<ul style="padding-left:16px;color:#6b7280;font-size:14px;line-height:1.75;margin-bottom:12px">
                        ${exp.bullets
                          .filter((b) => b)
                          .map((b) => `<li style="margin-bottom:5px">${esc(b)}</li>`)
                          .join('')}
                      </ul>`
                        : ''
                    }
                    ${
                      exp.tags.length
                        ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
                        ${exp.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:${a}12;color:${a}">${esc(t)}</span>`).join('')}
                      </div>`
                        : ''
                    }
                  </div>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`,

    projects: (d: ResumeData) =>
      !d.projects.length
        ? ''
        : `<section id="fl-projects" style="background:#111827;padding:80px 0">
        <div style="max-width:1100px;margin:0 auto;padding:0 48px">
          <div style="margin-bottom:48px">
            <p style="font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:10px">Portfolio</p>
            <h2 style="font-size:36px;font-weight:800;color:#fff;letter-spacing:-.03em;line-height:1.1">Featured Work</h2>
          </div>
          <div>
            ${d.projects
              .map(
                (p, pi) => `
              <div class="fl-proj-item" style="display:flex;flex-wrap:wrap;gap:32px;padding:36px 0;border-bottom:1px solid rgba(255,255,255,.07);position:relative;transition:padding-left .2s">
                <div style="min-width:200px;flex:0 0 200px">
                  <span style="font-size:48px;font-weight:800;color:rgba(255,255,255,.08);line-height:1;display:block;margin-bottom:12px;font-variant-numeric:tabular-nums">${String(pi + 1).padStart(2, '0')}</span>
                  <h3 style="font-size:20px;font-weight:700;color:#fff;line-height:1.2">${esc(p.name)}</h3>
                </div>
                <div style="flex:1;min-width:240px">
                  <p style="font-size:14px;color:#9ca3af;line-height:1.75;margin-bottom:18px">${esc(p.description)}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px">
                    ${p.tags.map((t) => `<span style="font-size:11px;font-weight:600;padding:4px 11px;border-radius:999px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1)">${esc(t)}</span>`).join('')}
                  </div>
                  <div style="display:flex;gap:10px;flex-wrap:wrap">
                    ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener" style="font-size:13px;font-weight:700;color:#fff;background:${a};text-decoration:none;padding:9px 20px;border-radius:10px;transition:opacity .2s">View Live ↗</a>` : ''}
                    ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener" style="font-size:13px;font-weight:700;color:rgba(255,255,255,.7);background:rgba(255,255,255,.08);text-decoration:none;padding:9px 20px;border-radius:10px;border:1px solid rgba(255,255,255,.12);transition:opacity .2s">Source Code ↗</a>` : ''}
                  </div>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`,

    skills: (_d: ResumeData) => '',

    education: (d: ResumeData) =>
      !d.education.length
        ? ''
        : `<section id="fl-education" style="background:#fff;padding:80px 0;border-top:1px solid #f3f4f6">
        <div style="max-width:1100px;margin:0 auto;padding:0 48px">
          <div style="margin-bottom:48px">
            <p style="font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:10px">Academic</p>
            <h2 style="font-size:36px;font-weight:800;color:#111827;letter-spacing:-.03em;line-height:1.1">Education</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            ${d.education
              .map(
                (edu) => `
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:16px;padding:24px 28px;background:#f9fafb;border-radius:16px;border:1px solid #f3f4f6;border-left:4px solid ${a}">
                <div>
                  <h3 style="font-size:16px;font-weight:700;color:#111827;margin-bottom:3px">${esc(edu.degree)}</h3>
                  <p style="font-size:14px;color:#6b7280;font-weight:500">${esc(edu.institution)}</p>
                  ${edu.note ? `<p style="font-size:13px;color:#9ca3af;margin-top:4px">${esc(edu.note)}</p>` : ''}
                </div>
                <span style="font-size:12px;color:#9ca3af;font-weight:600;white-space:nowrap;background:#fff;padding:5px 14px;border-radius:999px;border:1px solid #e5e7eb">${esc(edu.period)}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`,

    contact: (d: ResumeData) =>
      `<section id="fl-contact" style="background:#111827;padding:100px 0">
        <div style="max-width:700px;margin:0 auto;padding:0 48px;text-align:center">
          <p style="font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${a};margin-bottom:16px">Get In Touch</p>
          <h2 style="font-size:clamp(32px,5vw,52px);font-weight:800;color:#fff;letter-spacing:-.03em;line-height:1.1;margin-bottom:20px">Let&rsquo;s Work Together</h2>
          <p style="font-size:16px;color:#9ca3af;line-height:1.7;margin-bottom:40px">Have a project in mind? I&rsquo;d love to hear about it and explore how we can create something remarkable.</p>
          ${
            d.contact.email
              ? `<a href="mailto:${esc(d.contact.email)}" style="display:inline-flex;align-items:center;gap:10px;font-size:16px;font-weight:700;color:#fff;background:${a};text-decoration:none;padding:16px 36px;border-radius:14px;transition:opacity .2s;margin-bottom:40px">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              ${esc(d.contact.email)}
            </a>`
              : ''
          }
          <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;padding-top:32px;border-top:1px solid rgba(255,255,255,.08)">
            ${
              d.contact.github
                ? `<a href="${safeUrl(d.contact.github)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,.6);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.6)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>`
                : ''
            }
            ${
              d.contact.linkedin
                ? `<a href="${safeUrl(d.contact.linkedin)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,.6);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.6)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>`
                : ''
            }
          </div>
        </div>
      </section>`,
  }

  // Build the main section output but handle skills override (services rendered separately above projects)
  const visibleSections = sectionOrder.filter((id) => !hiddenSections.includes(id))

  const sectionHtml = visibleSections
    .map((id) => {
      if (id === 'skills') return servicesSection
      const renderer = renderers[id]
      return renderer ? renderer(data) : ''
    })
    .join('\n')

  // For renderSections compatibility we call it but only use non-skills result
  // Actually we build the output manually above; renderSections used for structural compliance
  void renderSections

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
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;color:#374151;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;transition:opacity .15s}
a:hover{opacity:.8}
.fl-service-card:hover{background:#fff!important;box-shadow:0 8px 30px rgba(0,0,0,.08);transform:translateY(-2px)}
.fl-exp-item:hover .fl-exp-accent{opacity:1}
.fl-proj-item:hover{padding-left:12px!important}
.fl-proj-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:${a};border-radius:2px;opacity:0;transition:opacity .2s}
.fl-proj-item:hover::before{opacity:1}
@media(max-width:768px){
  .fl-hero-split{flex-direction:column!important}
  .fl-hero-left{min-height:auto!important;padding:52px 28px!important}
  .fl-hero-right{min-height:300px!important}
  .fl-hero-name{font-size:clamp(36px,10vw,56px)!important}
  .fl-sticky-nav{display:none}
}
@media(max-width:640px){
  section > div{padding:0 24px!important}
  .fl-proj-item{flex-direction:column!important;gap:16px!important}
  .fl-proj-item > div:first-child{min-width:auto!important;flex:none!important}
}
</style>
</head>
<body>

<header style="position:relative">
  <nav class="fl-sticky-nav" style="position:absolute;top:0;left:0;right:0;z-index:100;padding:20px 48px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;letter-spacing:-.01em">${esc(data.name.split(' ')[0] ?? data.name)}</span>
    <div style="display:flex;gap:28px;align-items:center">
      ${navLinks}
    </div>
  </nav>

  <div class="fl-hero-split" style="display:flex;min-height:100vh">
    <div class="fl-hero-left" style="flex:1;background:#111827;padding:120px 64px 80px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
        <div style="position:absolute;top:-60px;right:-60px;width:280px;height:280px;border-radius:50%;border:2px solid ${a}18"></div>
        <div style="position:absolute;bottom:60px;left:-40px;width:160px;height:160px;border-radius:50%;border:1px solid ${a}12"></div>
        <div style="position:absolute;top:40%;left:30%;width:1px;height:200px;background:linear-gradient(180deg,transparent,${a}20,transparent);transform:rotate(30deg)"></div>
      </div>
      <div style="position:relative;max-width:480px">
        ${data.photo ? '<div style="margin-bottom:24px">' + avatarHtml(data, 80, 'border:3px solid rgba(255,255,255,0.15);') + '</div>' : ''}
        <p style="font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${a};margin-bottom:20px">${esc(data.title)}</p>
        <h1 class="fl-hero-name" style="font-family:'Syne',sans-serif;font-size:clamp(40px,6vw,72px);font-weight:800;color:#fff;line-height:1;letter-spacing:-.03em;margin-bottom:24px">${esc(data.name)}</h1>
        <p style="font-size:15px;color:#9ca3af;line-height:1.75;margin-bottom:40px;max-width:400px">${esc(data.bio)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          ${!hiddenSections.includes('projects') ? `<a href="#fl-projects" style="font-size:14px;font-weight:700;color:#fff;background:${a};text-decoration:none;padding:13px 28px;border-radius:12px;transition:opacity .2s">View My Work</a>` : ''}
          ${!hiddenSections.includes('contact') ? `<a href="#fl-contact" style="font-size:14px;font-weight:700;color:#fff;background:transparent;text-decoration:none;padding:12px 28px;border-radius:12px;border:2px solid rgba(255,255,255,.25);transition:border-color .2s" onmouseover="this.style.borderColor='rgba(255,255,255,.6)'" onmouseout="this.style.borderColor='rgba(255,255,255,.25)'">Get In Touch</a>` : ''}
        </div>
      </div>
    </div>

    <div class="fl-hero-right" style="flex:0 0 42%;background:#f9fafb;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
      <div style="position:relative;width:320px;height:320px">
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${a};opacity:.35"></div>
        <div style="position:absolute;top:10%;left:10%;width:80%;height:80%;border-radius:50%;border:1px solid ${a};opacity:.2"></div>
        <div style="position:absolute;top:20%;left:5%;width:55%;height:55%;background:${a};opacity:.07;border-radius:4px;transform:rotate(-15deg)"></div>
        <div style="position:absolute;top:30%;left:35%;width:55%;height:55%;background:${a};opacity:.07;border-radius:4px;transform:rotate(20deg)"></div>
        <div style="position:absolute;top:38%;left:25%;width:40%;height:40%;background:${a};opacity:.12;border-radius:50%"></div>
        <div style="position:absolute;top:45%;left:42%;width:20%;height:20%;background:${a};opacity:.5;border-radius:50%"></div>
        <div style="position:absolute;bottom:15%;right:10%;width:30%;height:3px;background:${a};opacity:.4;border-radius:2px;transform:rotate(-5deg)"></div>
        <div style="position:absolute;top:12%;right:18%;width:18%;height:3px;background:${a};opacity:.3;border-radius:2px;transform:rotate(12deg)"></div>
      </div>
    </div>
  </div>
</header>

<main>
  ${sectionHtml}
</main>

<script>
(function() {
  var expCount = ${data.experience.length};
  for (var i = 0; i < expCount; i++) {
    (function(idx) {
      var btn = document.querySelector('.fl-exp-toggle[data-idx="' + idx + '"]');
      if (!btn) return;
      btn.addEventListener('click', function() {
        var bullets = document.querySelector('.fl-exp-bullets-' + idx);
        var label = document.querySelector('.fl-toggle-label-' + idx);
        var icon = document.querySelector('.fl-toggle-icon-' + idx);
        if (!bullets) return;
        var isOpen = bullets.style.display !== 'none';
        if (isOpen) {
          bullets.style.display = 'none';
          if (label) label.textContent = 'Show details';
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          bullets.style.display = 'block';
          if (label) label.textContent = 'Hide details';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    })(i);
  }
})();
</script>
</body>
</html>`
}
