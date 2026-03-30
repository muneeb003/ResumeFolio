import type { ResumeData, SectionId } from '@/lib/types'
import { esc, avatarHtml, buildJsonLd, safeUrl, safeColor } from './shared'

export function generateDeveloper(
  data: ResumeData,
  accent: string,
  sectionOrder: SectionId[],
  hiddenSections: SectionId[]
): string {
  const a = safeColor(accent)

  const visibleSections = sectionOrder.filter((id) => !hiddenSections.includes(id))

  // Map section IDs to file names and display labels
  const sectionMeta: Record<SectionId, { file: string; label: string }> = {
    experience: { file: 'experience.ts', label: 'experience.ts' },
    projects: { file: 'projects.ts', label: 'projects.ts' },
    skills: { file: 'skills.ts', label: 'skills.ts' },
    education: { file: 'education.ts', label: 'education.ts' },
    contact: { file: 'contact.ts', label: 'contact.ts' },
  }

  // Line number helper — wraps content lines with numbered gutter
  function lineWrap(lines: string[]): string {
    return lines
      .map(
        (line, i) =>
          `<div class="code-line"><span class="ln">${String(i + 1).padStart(2, '0')}</span><span class="lc">${line}</span></div>`
      )
      .join('')
  }

  // Syntax color spans
  const kw = (t: string) => `<span class="kw">${t}</span>`
  const str = (t: string) => `<span class="str">&quot;${t}&quot;</span>`
  const prop = (t: string) => `<span class="prop">${t}</span>`
  const cmt = (t: string) => `<span class="cmt">${t}</span>`
  const num = (t: string) => `<span class="num">${t}</span>`
  const fn = (t: string) => `<span class="fn">${t}</span>`
  const punc = (t: string) => `<span class="punc">${t}</span>`

  // ── EXPERIENCE PANEL ────────────────────────────────────────────────────
  function renderExperiencePanel(): string {
    if (!data.experience.length) {
      return lineWrap([cmt('// No experience entries yet')])
    }
    const lines: string[] = [
      cmt('// experience.ts — Work history'),
      '',
      kw('import') + ' ' + punc('{') + ' ' + fn('Experience') + ' ' + punc('}') + ' ' + kw('from') + ' ' + str('./types'),
      '',
      kw('const') + ' ' + prop('experience') + punc(':') + ' ' + fn('Experience') + punc('[]') + ' ' + punc('=') + ' ' + punc('['),
    ]

    data.experience.forEach((exp, idx) => {
      lines.push('  ' + punc('{'))
      lines.push('    ' + prop('company') + punc(':') + ' ' + str(esc(exp.company)) + punc(','))
      lines.push('    ' + prop('role') + punc(':') + ' ' + str(esc(exp.role)) + punc(','))
      lines.push('    ' + prop('period') + punc(':') + ' ' + str(esc(exp.period)) + punc(','))
      if (exp.location) {
        lines.push('    ' + prop('location') + punc(':') + ' ' + str(esc(exp.location)) + punc(','))
      }
      if (exp.bullets.filter(Boolean).length) {
        lines.push('    ' + prop('highlights') + punc(':') + ' ' + punc('['))
        exp.bullets.filter(Boolean).forEach((b) => {
          lines.push('      ' + str(esc(b)) + punc(','))
        })
        lines.push('    ' + punc('],'))
      }
      if (exp.tags.length) {
        lines.push('    ' + prop('technologies') + punc(':') + ' ' + punc('[') + exp.tags.map((t) => str(esc(t))).join(punc(', ')) + punc('],'))
      }
      lines.push('  ' + punc('}') + (idx < data.experience.length - 1 ? punc(',') : ''))
    })

    lines.push(punc(']'))
    lines.push('')
    lines.push(kw('export') + ' ' + kw('default') + ' ' + prop('experience'))
    return lineWrap(lines)
  }

  // ── PROJECTS PANEL ──────────────────────────────────────────────────────
  function renderProjectsPanel(): string {
    if (!data.projects.length) {
      return lineWrap([cmt('// No projects yet')])
    }
    return `
      <div class="projects-grid">
        ${data.projects
          .map(
            (p) => `
          <div class="proj-card" tabindex="0">
            <div class="proj-header">
              <span class="proj-icon">◈</span>
              <h3 class="proj-name">${esc(p.name)}</h3>
            </div>
            <p class="proj-desc">${esc(p.description)}</p>
            <div class="proj-tags">
              ${p.tags.map((t) => `<span class="proj-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="proj-links">
              ${p.liveUrl ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" class="proj-link proj-link--live">Live ↗</a>` : ''}
              ${p.repoUrl ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" class="proj-link proj-link--repo">Repo ↗</a>` : ''}
            </div>
          </div>`
          )
          .join('')}
      </div>`
  }

  // ── SKILLS PANEL ────────────────────────────────────────────────────────
  function renderSkillsPanel(): string {
    if (!data.skills.length) {
      return lineWrap([cmt('// No skills listed')])
    }
    const lines: string[] = [
      cmt('// skills.ts — Technical proficiencies'),
      '',
    ]
    data.skills.forEach((group) => {
      lines.push(cmt('// ' + esc(group.category)))
      lines.push(kw('const') + ' ' + prop(esc(group.category.toLowerCase().replace(/\s+/g, '_'))) + ' ' + punc('=') + ' ' + punc('['))
      group.items.forEach((item, i) => {
        lines.push('  ' + str(esc(item)) + (i < group.items.length - 1 ? punc(',') : ''))
      })
      lines.push(punc(']'))
      lines.push('')
    })
    return lineWrap(lines)
  }

  // ── EDUCATION PANEL ─────────────────────────────────────────────────────
  function renderEducationPanel(): string {
    if (!data.education.length) {
      return lineWrap([cmt('// No education entries')])
    }
    const lines: string[] = [
      cmt('// education.ts — Academic background'),
      '',
      kw('const') + ' ' + prop('education') + ' ' + punc('=') + ' ' + punc('['),
    ]
    data.education.forEach((edu, idx) => {
      lines.push('  ' + punc('{'))
      lines.push('    ' + prop('institution') + punc(':') + ' ' + str(esc(edu.institution)) + punc(','))
      lines.push('    ' + prop('degree') + punc(':') + ' ' + str(esc(edu.degree)) + punc(','))
      lines.push('    ' + prop('period') + punc(':') + ' ' + str(esc(edu.period)) + (edu.note ? punc(',') : ''))
      if (edu.note) {
        lines.push('    ' + prop('note') + punc(':') + ' ' + str(esc(edu.note)))
      }
      lines.push('  ' + punc('}') + (idx < data.education.length - 1 ? punc(',') : ''))
    })
    lines.push(punc(']'))
    return lineWrap(lines)
  }

  // ── CONTACT PANEL ───────────────────────────────────────────────────────
  function renderContactPanel(): string {
    const lines: string[] = [
      cmt('// contact.ts — Get in touch'),
      '',
      kw('const') + ' ' + prop('contact') + ' ' + punc('=') + ' ' + punc('{'),
    ]
    if (data.contact.email) {
      lines.push('  ' + prop('email') + punc(':') + ' ' + str(esc(data.contact.email)) + punc(','))
    }
    if (data.contact.github) {
      lines.push('  ' + prop('github') + punc(':') + ' ' + str(esc(data.contact.github)) + punc(','))
    }
    if (data.contact.linkedin) {
      lines.push('  ' + prop('linkedin') + punc(':') + ' ' + str(esc(data.contact.linkedin)) + punc(','))
    }
    lines.push(punc('}'))
    lines.push('')
    lines.push(cmt('// Reach out — always open to new opportunities'))

    const contactLinks: string[] = []
    if (data.contact.email) {
      contactLinks.push(`<a href="mailto:${esc(data.contact.email)}" class="contact-link">${esc(data.contact.email)}</a>`)
    }
    if (data.contact.github) {
      contactLinks.push(`<a href="${safeUrl(data.contact.github)}" target="_blank" class="contact-link">GitHub ↗</a>`)
    }
    if (data.contact.linkedin) {
      contactLinks.push(`<a href="${safeUrl(data.contact.linkedin)}" target="_blank" class="contact-link">LinkedIn ↗</a>`)
    }

    return lineWrap(lines) + (contactLinks.length ? `<div class="contact-actions">${contactLinks.join('')}</div>` : '')
  }

  const panelRenderers: Record<SectionId, () => string> = {
    experience: renderExperiencePanel,
    projects: renderProjectsPanel,
    skills: renderSkillsPanel,
    education: renderEducationPanel,
    contact: renderContactPanel,
  }

  // ── SIDEBAR: skill bars ──────────────────────────────────────────────────
  const skillBarItems = data.skills.flatMap((g) => g.items).slice(0, 12)
  // Deterministic "proficiency" widths — cycle through 75-98 range
  const barWidths = [98, 92, 88, 95, 82, 78, 90, 85, 76, 94, 87, 80]
  const skillBars = skillBarItems
    .map(
      (item, i) => `
      <div class="sb-skill">
        <div class="sb-skill-label">
          <span>${esc(item)}</span>
          <span class="sb-skill-pct">${barWidths[i % barWidths.length]}%</span>
        </div>
        <div class="sb-bar-track">
          <div class="sb-bar-fill" style="width:${barWidths[i % barWidths.length]}%;background:${a}"></div>
        </div>
      </div>`
    )
    .join('')

  // ── SIDEBAR: file tree ───────────────────────────────────────────────────
  const fileTreeItems = visibleSections
    .map(
      (id) => `
      <div class="ft-item" data-tab="${id}" onclick="switchTab('${id}')">
        <span class="ft-icon">📄</span>
        <span class="ft-name">${sectionMeta[id].file}</span>
      </div>`
    )
    .join('')

  // ── TAB BAR ─────────────────────────────────────────────────────────────
  const tabBarItems = visibleSections
    .map(
      (id, idx) => `
      <div class="tab ${idx === 0 ? 'tab--active' : ''}" data-tab="${id}" onclick="switchTab('${id}')">
        <span class="tab-dot"></span>
        ${sectionMeta[id].file}
        <span class="tab-close">×</span>
      </div>`
    )
    .join('')

  // ── PANELS ───────────────────────────────────────────────────────────────
  const panels = visibleSections
    .map(
      (id, idx) => `
      <div class="panel ${idx === 0 ? 'panel--active' : ''}" id="panel-${id}">
        ${id === 'projects'
          ? renderProjectsPanel()
          : `<div class="code-block">${panelRenderers[id]()}</div>`}
      </div>`
    )
    .join('')

  const firstSection = visibleSections[0] ?? 'experience'

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
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
${buildJsonLd(data)}
<style>
/* ── Reset & Base ──────────────────────────────────────────────────────── */
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{
  font-family:'Fira Code',monospace;
  background:#0d1117;
  color:#e6edf3;
  -webkit-font-smoothing:antialiased;
  height:100vh;
  overflow:hidden;
}
a{color:inherit;text-decoration:none}

/* ── Layout ────────────────────────────────────────────────────────────── */
.app{display:flex;flex-direction:column;height:100vh;overflow:hidden}
.titlebar{
  display:flex;align-items:center;gap:12px;
  height:38px;min-height:38px;
  background:#161b22;
  border-bottom:1px solid #30363d;
  padding:0 16px;
  user-select:none;
}
.traffic-lights{display:flex;gap:6px;align-items:center}
.tl{width:12px;height:12px;border-radius:50%;cursor:default}
.tl--red{background:#ff5f57}
.tl--yellow{background:#febc2e}
.tl--green{background:#28c840}
.titlebar-path{font-size:12px;color:#8b949e;margin-left:8px}
.titlebar-path span{color:#e6edf3}

.workspace{display:flex;flex:1;overflow:hidden}

/* ── Sidebar ───────────────────────────────────────────────────────────── */
.sidebar{
  width:240px;min-width:240px;
  background:#161b22;
  border-right:1px solid #30363d;
  display:flex;flex-direction:column;
  overflow:hidden;
}
.sb-section-header{
  font-size:11px;font-weight:600;
  letter-spacing:.08em;text-transform:uppercase;
  color:#8b949e;
  padding:12px 16px 8px;
  border-bottom:1px solid #21262d;
}
.ft-item{
  display:flex;align-items:center;gap:8px;
  padding:5px 16px 5px 20px;
  font-size:13px;color:#8b949e;
  cursor:pointer;
  transition:background .15s,color .15s;
  border-left:2px solid transparent;
}
.ft-item:hover{background:#1f2428;color:#e6edf3}
.ft-item.ft-item--active{
  background:#1f2428;
  color:${a};
  border-left-color:${a};
}
.ft-icon{font-size:12px;flex-shrink:0}
.ft-name{font-size:12px}

.sb-profile{
  padding:16px;
  border-top:1px solid #21262d;
  border-bottom:1px solid #21262d;
}
.sb-avatar{
  width:40px;height:40px;border-radius:50%;
  background:${a}22;
  display:flex;align-items:center;justify-content:center;
  font-size:16px;font-weight:600;color:${a};
  margin-bottom:8px;
  flex-shrink:0;
}
.sb-name{font-size:13px;font-weight:600;color:#e6edf3;margin-bottom:2px}
.sb-title{font-size:11px;color:#8b949e}

.sb-skills{padding:12px 16px;overflow-y:auto;flex:1}
.sb-skills-header{
  font-size:11px;font-weight:600;letter-spacing:.08em;
  text-transform:uppercase;color:#8b949e;
  margin-bottom:10px;
}
.sb-skill{margin-bottom:10px}
.sb-skill-label{
  display:flex;justify-content:space-between;
  font-size:11px;color:#8b949e;margin-bottom:3px;
}
.sb-skill-pct{color:#6e7681}
.sb-bar-track{
  height:3px;background:#21262d;border-radius:2px;overflow:hidden;
}
.sb-bar-fill{
  height:100%;border-radius:2px;
  transition:width .6s cubic-bezier(.4,0,.2,1);
}

/* ── Editor Area ───────────────────────────────────────────────────────── */
.editor-area{display:flex;flex-direction:column;flex:1;overflow:hidden}

.tabbar{
  display:flex;align-items:stretch;
  background:#0d1117;
  border-bottom:1px solid #30363d;
  overflow-x:auto;
  min-height:36px;
  scrollbar-width:none;
}
.tabbar::-webkit-scrollbar{display:none}
.tab{
  display:flex;align-items:center;gap:6px;
  padding:0 14px;
  font-size:12px;color:#8b949e;
  border-right:1px solid #30363d;
  cursor:pointer;
  white-space:nowrap;
  transition:background .15s,color .15s;
  border-top:2px solid transparent;
  min-height:36px;
  user-select:none;
}
.tab:hover{background:#161b22;color:#e6edf3}
.tab--active{
  background:#161b22;
  color:#e6edf3;
  border-top-color:${a};
}
.tab-dot{width:6px;height:6px;border-radius:50%;background:#30363d;flex-shrink:0}
.tab--active .tab-dot{background:${a}}
.tab-close{
  font-size:14px;color:#6e7681;
  margin-left:4px;
  padding:0 2px;
  border-radius:3px;
  transition:color .15s,background .15s;
}
.tab-close:hover{color:#e6edf3;background:#30363d}

/* ── Panels ────────────────────────────────────────────────────────────── */
.panels{flex:1;overflow:hidden;position:relative}
.panel{
  position:absolute;inset:0;
  display:none;
  overflow-y:auto;
  padding:24px 32px 40px;
  scrollbar-width:thin;
  scrollbar-color:#30363d #0d1117;
}
.panel::-webkit-scrollbar{width:8px}
.panel::-webkit-scrollbar-track{background:#0d1117}
.panel::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
.panel::-webkit-scrollbar-thumb:hover{background:#484f58}
.panel--active{display:block;animation:fadeIn .18s ease}

@keyframes fadeIn{
  from{opacity:0;transform:translateY(4px)}
  to{opacity:1;transform:translateY(0)}
}

/* ── Code Block ────────────────────────────────────────────────────────── */
.code-block{font-size:13px;line-height:1.8}
.code-line{display:flex;align-items:flex-start;min-height:23px}
.ln{
  width:32px;min-width:32px;
  color:#3d444d;
  font-size:12px;
  text-align:right;
  margin-right:20px;
  padding-top:1px;
  user-select:none;
  flex-shrink:0;
}
.lc{flex:1;white-space:pre-wrap;word-break:break-word}

/* ── Syntax Colors ─────────────────────────────────────────────────────── */
.kw{color:#ff7b72}
.str{color:#a5d6ff}
.prop{color:#79c0ff}
.cmt{color:#8b949e;font-style:italic}
.num{color:#f2cc60}
.fn{color:#d2a8ff}
.punc{color:#e6edf3}

/* ── Projects Grid ─────────────────────────────────────────────────────── */
.projects-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:16px;
  padding:8px 0;
}
.proj-card{
  background:#161b22;
  border:1px solid #30363d;
  border-radius:8px;
  padding:20px;
  cursor:pointer;
  transition:border-color .2s,box-shadow .2s,transform .2s;
  outline:none;
}
.proj-card:hover,.proj-card:focus{
  border-color:${a};
  box-shadow:0 0 0 1px ${a}44, 0 8px 32px ${a}18;
  transform:translateY(-2px);
}
.proj-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.proj-icon{color:${a};font-size:16px}
.proj-name{font-size:15px;font-weight:600;color:#e6edf3}
.proj-desc{font-size:12px;color:#8b949e;line-height:1.65;margin-bottom:12px}
.proj-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.proj-tag{
  font-size:11px;color:${a};
  background:${a}18;
  padding:2px 8px;border-radius:4px;
  font-family:'Fira Code',monospace;
}
.proj-links{display:flex;gap:8px}
.proj-link{
  font-size:11px;font-weight:500;
  padding:4px 10px;border-radius:5px;
  transition:background .15s,color .15s;
}
.proj-link--live{
  color:${a};
  border:1px solid ${a};
}
.proj-link--live:hover{background:${a};color:#0d1117}
.proj-link--repo{
  color:#8b949e;
  border:1px solid #30363d;
}
.proj-link--repo:hover{background:#30363d;color:#e6edf3}

/* ── Contact ───────────────────────────────────────────────────────────── */
.contact-actions{
  display:flex;gap:12px;flex-wrap:wrap;
  margin-top:28px;
  padding-left:52px;
}
.contact-link{
  font-size:13px;color:${a};
  border:1px solid ${a}66;
  padding:8px 16px;border-radius:6px;
  transition:background .15s,border-color .15s;
}
.contact-link:hover{background:${a}18;border-color:${a}}

/* ── Status Bar ────────────────────────────────────────────────────────── */
.statusbar{
  height:22px;min-height:22px;
  background:${a};
  display:flex;align-items:center;
  padding:0 12px;
  gap:16px;
  font-size:11px;
  color:#0d1117;
  font-weight:500;
}
.sb-item{display:flex;align-items:center;gap:4px}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media(max-width:680px){
  .sidebar{display:none}
  html,body{overflow:auto;height:auto}
  .app{height:auto}
  .panels{overflow:visible;position:static}
  .panel{position:static;display:block !important;animation:none}
  .panel + .panel{border-top:1px solid #30363d}
  .workspace{overflow:auto}
}
</style>
</head>
<body>
<div class="app">

  <!-- Title Bar -->
  <div class="titlebar">
    <div class="traffic-lights">
      <div class="tl tl--red" title="Close"></div>
      <div class="tl tl--yellow" title="Minimize"></div>
      <div class="tl tl--green" title="Maximize"></div>
    </div>
    <div class="titlebar-path">
      portfolio / <span>${esc(data.name.toLowerCase().replace(/\s+/g, '-'))}</span> / src
    </div>
  </div>

  <div class="workspace">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sb-section-header">Explorer</div>

      <!-- File Tree -->
      <div style="padding:8px 0">
        <div style="font-size:11px;color:#6e7681;padding:4px 16px 4px 10px;letter-spacing:.04em;text-transform:uppercase">
          ▾ src
        </div>
        ${fileTreeItems}
      </div>

      <!-- Profile -->
      <div class="sb-profile">
        <div style="display:flex;align-items:center;gap:10px">
          ${avatarHtml(data, 48, 'border:2px solid #30363d;margin-bottom:8px;')}
          <div>
            <div class="sb-name">${esc(data.name)}</div>
            <div class="sb-title">${esc(data.title)}</div>
          </div>
        </div>
      </div>

      <!-- Skill Bars -->
      <div class="sb-skills">
        <div class="sb-skills-header">Proficiency</div>
        ${skillBars}
      </div>
    </aside>

    <!-- Editor -->
    <div class="editor-area">

      <!-- Tab Bar -->
      <div class="tabbar" id="tabbar">
        ${tabBarItems}
      </div>

      <!-- Panels -->
      <div class="panels">
        ${panels}
      </div>

    </div>
  </div>

  <!-- Status Bar -->
  <div class="statusbar">
    <div class="sb-item">⎇ main</div>
    <div class="sb-item">✓ TypeScript</div>
    <div class="sb-item">${esc(data.name)} — Portfolio</div>
  </div>

</div>

<script>
(function() {
  var currentTab = '${firstSection}';

  function switchTab(id) {
    // Deactivate all tabs
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('tab--active');
    }
    // Deactivate all panels
    var panels = document.querySelectorAll('.panel');
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.remove('panel--active');
    }
    // Deactivate all file tree items
    var ftItems = document.querySelectorAll('.ft-item');
    for (var i = 0; i < ftItems.length; i++) {
      ftItems[i].classList.remove('ft-item--active');
    }

    // Activate selected tab
    var selectedTab = document.querySelector('.tab[data-tab="' + id + '"]');
    if (selectedTab) selectedTab.classList.add('tab--active');

    // Activate selected panel
    var selectedPanel = document.getElementById('panel-' + id);
    if (selectedPanel) selectedPanel.classList.add('panel--active');

    // Activate selected file tree item
    var selectedFt = document.querySelector('.ft-item[data-tab="' + id + '"]');
    if (selectedFt) selectedFt.classList.add('ft-item--active');

    currentTab = id;
  }

  // Expose globally for onclick handlers
  window.switchTab = switchTab;

  // Initialize first tab
  switchTab('${firstSection}');

  // Animate skill bars on load
  var fills = document.querySelectorAll('.sb-bar-fill');
  for (var i = 0; i < fills.length; i++) {
    var fill = fills[i];
    var targetWidth = fill.style.width;
    fill.style.width = '0';
    (function(el, w) {
      setTimeout(function() { el.style.width = w; }, 300 + Math.random() * 200);
    })(fill, targetWidth);
  }
})();
</script>
</body>
</html>`
}
