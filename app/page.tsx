import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

// bg/dark are only used for the label bar beneath each iframe thumbnail
const TEMPLATES = [
  { id: 'developer',  name: 'Developer',  bg: '#0d1117', dark: true  },
  { id: 'minimal',    name: 'Minimal',    bg: '#f9fafb', dark: false },
  { id: 'dark-dev',   name: 'Dark Dev',   bg: '#0f172a', dark: true  },
  { id: 'bold',       name: 'Bold',       bg: '#4338ca', dark: true  },
  { id: 'glass',      name: 'Glass',      bg: '#0f0c29', dark: true  },
  { id: 'neon',       name: 'Neon',       bg: '#060609', dark: true  },
  { id: 'editorial',  name: 'Editorial',  bg: '#f9fafb', dark: false },
  { id: 'magazine',   name: 'Magazine',   bg: '#fafafa', dark: false },
  { id: 'corporate',  name: 'Corporate',  bg: '#f8fafc', dark: false },
  { id: 'designer',   name: 'Designer',   bg: '#f9fafb', dark: false },
  { id: 'cinematic',  name: 'Cinematic',  bg: '#09090b', dark: true  },
  { id: 'student',    name: 'Student',    bg: '#4338ca', dark: true  },
  { id: 'freelancer', name: 'Freelancer', bg: '#0f172a', dark: true  },
  { id: 'brutalist',  name: 'Brutalist',  bg: '#f5f0e8', dark: false },
]

type TemplateItem = (typeof TEMPLATES)[number]

// ── Marquee thumbnails: 1280×900 → 288×202 ──────────────────────────────────
const SCALE = 0.225
const IFRAME_W = 1280
const IFRAME_H = 900
const THUMB_H = Math.round(IFRAME_H * SCALE) // 202
const LABEL_H = 30

function TemplateThumb({ t }: { t: TemplateItem }) {
  const labelBorder = t.dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)'

  return (
    <div
      className="shrink-0 mr-3 w-72 rounded-xl overflow-hidden"
      style={{
        height: THUMB_H + LABEL_H,
        border: `1px solid ${t.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      <div style={{ width: 288, height: THUMB_H, overflow: 'hidden', position: 'relative' }}>
        <iframe
          src={`/api/preview/${t.id}`}
          title={`${t.name} template preview`}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: IFRAME_W, height: IFRAME_H,
            transform: `scale(${SCALE})`, transformOrigin: 'top left',
            pointerEvents: 'none', border: 'none', display: 'block',
          }}
        />
      </div>
      <div
        style={{
          height: LABEL_H, display: 'flex', alignItems: 'center',
          paddingLeft: 12, paddingRight: 12,
          background: t.bg, borderTop: labelBorder,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.01em', color: t.dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)' }}>
          {t.name}
        </span>
      </div>
    </div>
  )
}

// ── Hero thumbnails: larger scale for the stacked hero visual ────────────────
const HERO_SCALE = 0.29
const HERO_W = Math.round(IFRAME_W * HERO_SCALE)  // 371
const HERO_H = Math.round(IFRAME_H * HERO_SCALE)  // 261
const HERO_LABEL = 28

function HeroThumb({ t, shadow }: { t: TemplateItem; shadow?: string }) {
  return (
    <div
      style={{
        width: HERO_W, height: HERO_H + HERO_LABEL,
        borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${t.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}`,
        boxShadow: shadow,
      }}
    >
      <div style={{ width: HERO_W, height: HERO_H, overflow: 'hidden', position: 'relative' }}>
        <iframe
          src={`/api/preview/${t.id}`}
          title={`${t.name} template preview`}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: IFRAME_W, height: IFRAME_H,
            transform: `scale(${HERO_SCALE})`, transformOrigin: 'top left',
            pointerEvents: 'none', border: 'none', display: 'block',
          }}
        />
      </div>
      <div
        style={{
          height: HERO_LABEL, display: 'flex', alignItems: 'center',
          paddingLeft: 10, paddingRight: 10, background: t.bg,
          borderTop: t.dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.01em', color: t.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          {t.name}
        </span>
      </div>
    </div>
  )
}

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const ctaHref = session ? '/create' : '/auth/signin'
  const row1 = TEMPLATES.slice(0, 7)
  const row2 = TEMPLATES.slice(7)

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight text-zinc-900">
            ResumeFolio
          </Link>
          <nav className="flex items-center gap-1">
            {session ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="sm">Get started →</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-16 lg:items-center">

          {/* ── Left: text ── */}
          <div>
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] text-zinc-950 leading-[0.95] mb-10">
              Your resume,<br />
              <span className="text-indigo-600">turned portfolio.</span>
            </h1>

            <div className="flex items-start gap-4 mb-8">
              <div className="w-px h-16 bg-indigo-200 shrink-0 mt-0.5" />
              <p className="text-base text-zinc-500 leading-relaxed max-w-xs">
                Upload a PDF. Pick a design. Deploy to a live URL — in under 60 seconds.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <Link href={ctaHref}>
                <Button size="lg" className="px-7">Build mine →</Button>
              </Link>
              <Link href="#templates">
                <Button variant="secondary" size="lg">See templates</Button>
              </Link>
            </div>
            <p className="text-xs text-zinc-400">Free · No credit card · No API keys required</p>
          </div>

          {/* ── Right: 3 stacked template previews (desktop only) ── */}
          <div className="hidden lg:block relative" style={{ height: 340 }}>
            {/* Back card */}
            <div className="absolute pointer-events-none select-none" style={{ top: 28, left: 52, transform: 'rotate(7deg)' }}>
              <HeroThumb t={TEMPLATES[1]} shadow="0 12px 32px rgba(0,0,0,0.15)" />
            </div>
            {/* Middle card */}
            <div className="absolute pointer-events-none select-none" style={{ top: 12, left: 22, transform: 'rotate(3deg)' }}>
              <HeroThumb t={TEMPLATES[3]} shadow="0 16px 40px rgba(0,0,0,0.18)" />
            </div>
            {/* Front card */}
            <div className="absolute pointer-events-none select-none" style={{ top: 0, left: 0, transform: 'rotate(-1.5deg)' }}>
              <HeroThumb t={TEMPLATES[0]} shadow="0 24px 56px rgba(0,0,0,0.22)" />
            </div>
          </div>

        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE ───────────────────────── */}
      <section id="templates" className="bg-zinc-950 py-20 sm:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-zinc-500 tracking-[0.15em] uppercase mb-4">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
              What yours<br className="sm:hidden" /> could look like.
            </h2>
          </div>
          <Link href={ctaHref} className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Try all free →
            </span>
          </Link>
        </div>

        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden group mb-3">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
            {[...row1, ...row1].map((t, i) => (
              <TemplateThumb key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden group">
          <div className="flex w-max animate-marquee-reverse group-hover:[animation-play-state:paused] will-change-transform">
            {[...row2, ...row2].map((t, i) => (
              <TemplateThumb key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-14">
          <div>
            <p className="text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
              Four steps. One portfolio.
            </h2>
          </div>
          <Link href={ctaHref}>
            <Button variant="secondary" size="sm" className="shrink-0">Start now →</Button>
          </Link>
        </div>

        <div>
          {([
            {
              n: '01',
              title: 'Upload your resume',
              desc: 'Drop in a PDF or DOCX — or fill in a simple form if you don\'t have a file. Takes about 30 seconds.',
            },
            {
              n: '02',
              title: 'Your data, auto-filled',
              desc: 'Your experience, projects, skills, and contact info are pulled out automatically. Review and edit anything before moving on.',
            },
            {
              n: '03',
              title: 'Pick a design',
              desc: '14 templates to choose from. Swap colours, reorder sections, hide anything you don\'t want shown. See changes live.',
            },
            {
              n: '04',
              title: 'Go live',
              desc: 'Publish to a shareable link or deploy to your own GitHub Pages domain. Free, with no extra accounts or setup.',
            },
          ] as const).map((step) => (
            <div
              key={step.n}
              className="group flex gap-8 sm:gap-14 items-start border-t border-zinc-100 py-8 last:border-b"
            >
              <span className="text-[2.5rem] sm:text-[3rem] font-bold leading-none tabular-nums text-zinc-200 group-hover:text-indigo-200 transition-colors duration-300 shrink-0 w-14 sm:w-20 pt-0.5">
                {step.n}
              </span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-12">
                <h3 className="text-sm font-semibold text-zinc-900 sm:w-44 shrink-0">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ─────────────────────────── */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">

            <div className="lg:w-52 shrink-0 lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase mb-3">Included</p>
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight leading-snug">
                Everything.<br />Nothing extra.
              </h2>
            </div>

            <div className="flex-1 divide-y divide-zinc-200">
              {([
                {
                  name: 'Auto-fill from your resume',
                  desc: 'Upload a file and your information is filled in for you — no copying and pasting, no manual forms.',
                },
                {
                  name: 'Polish your bullets',
                  desc: 'Weak or vague bullet points? One click rewrites them into clear, specific achievements.',
                },
                {
                  name: 'ATS check',
                  desc: 'See how your profile reads to job-screening tools and get suggestions to close the gaps.',
                },
                {
                  name: 'Project descriptions',
                  desc: 'Paste a GitHub repo link and a description is written for you — pulled straight from the project.',
                },
                {
                  name: 'GitHub Pages',
                  desc: 'Deploy to your own github.io address using the GitHub account you already have. Nothing extra to set up.',
                },
                {
                  name: 'Instant link',
                  desc: 'Every portfolio gets a shareable link the moment it\'s published. No account needed to view it.',
                },
              ] as const).map((f) => (
                <div key={f.name} className="flex flex-col sm:flex-row sm:gap-12 py-6">
                  <p className="text-sm font-semibold text-zinc-900 sm:w-44 shrink-0 mb-1.5 sm:mb-0">{f.name}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="bg-zinc-950 py-28 sm:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium text-zinc-600 tracking-[0.15em] uppercase mb-6">Get started</p>
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-tight mb-6 max-w-xl">
            Your portfolio is one upload away.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-sm">
            Free forever. Sign in with GitHub, Google, or your email — and have a live portfolio in under a minute.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 text-sm font-semibold rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors duration-150"
          >
            Build my portfolio →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="bg-zinc-950 border-t border-zinc-800/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight text-zinc-500">ResumeFolio</span>
          <p className="text-xs text-zinc-700">Built with Next.js · Tailwind CSS · Google Gemini</p>
        </div>
      </footer>
    </div>
  )
}
