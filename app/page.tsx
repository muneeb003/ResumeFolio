import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const ctaHref = session ? '/create' : '/auth/signin'

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight text-zinc-900">ResumeFolio</span>
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Free · No credit card · No API keys needed
          </div>

          <h1 className="text-[3.5rem] sm:text-[4.5rem] font-bold tracking-[-0.04em] text-zinc-900 leading-[1.05] mb-6 text-balance">
            Your resume,<br />
            <span className="text-indigo-600">turned portfolio.</span>
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed mb-10 max-w-[420px]">
            Upload your PDF. AI extracts your work, projects, and skills.
            Pick a design. Ship a live portfolio — in under 60 seconds.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href={ctaHref}>
              <Button size="lg" className="px-6 text-sm">
                Build my portfolio →
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary" size="lg" className="text-sm">
                Sign in with GitHub
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-zinc-100"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400">Used by developers and designers worldwide</p>
          </div>
        </div>

        {/* Visual mockup */}
        <div className="hidden lg:block relative h-[460px] shrink-0">
          {/* Developer template mockup */}
          <div className="absolute top-0 right-0 w-[360px] h-[220px] rounded-xl bg-zinc-900 shadow-2xl shadow-zinc-900/25 overflow-hidden border border-zinc-700/60">
            <div className="h-7 bg-zinc-800 flex items-center px-3 gap-1.5 border-b border-zinc-700/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <div className="flex-1 mx-4 h-4 bg-zinc-700/60 rounded text-[8px] flex items-center px-2 text-zinc-500">portfolio.dev</div>
            </div>
            <div className="flex h-[calc(100%-28px)]">
              <div className="w-28 bg-zinc-800/80 border-r border-zinc-700/40 p-2.5 flex flex-col gap-1.5">
                <div className="text-[7px] text-zinc-500 uppercase tracking-wider mb-1 px-1">Explorer</div>
                <div className="h-1.5 bg-indigo-500/50 rounded-sm w-4/5 px-1" />
                <div className="h-1.5 bg-zinc-600/60 rounded-sm w-3/5 ml-2" />
                <div className="h-1.5 bg-zinc-600/60 rounded-sm w-4/5 ml-2" />
                <div className="h-1.5 bg-zinc-600/60 rounded-sm w-2/3 ml-2" />
              </div>
              <div className="flex-1 p-3">
                <div className="h-2 bg-violet-400/60 rounded-sm w-1/3 mb-3" />
                <div className="h-1.5 bg-zinc-600/50 rounded-sm w-full mb-1.5" />
                <div className="h-1.5 bg-zinc-600/40 rounded-sm w-5/6 mb-1.5" />
                <div className="h-1.5 bg-zinc-600/30 rounded-sm w-4/6 mb-3" />
                <div className="h-1.5 bg-emerald-500/50 rounded-sm w-2/5 mb-1.5" />
                <div className="h-1.5 bg-zinc-600/40 rounded-sm w-3/5" />
              </div>
            </div>
          </div>

          {/* Minimal template mockup */}
          <div className="absolute bottom-12 left-0 w-[300px] h-[200px] rounded-xl bg-white shadow-xl shadow-zinc-900/10 overflow-hidden border border-zinc-200">
            <div className="h-10 bg-gradient-to-r from-indigo-600 to-violet-500 px-4 flex items-end pb-2">
              <div className="h-2 bg-white/30 rounded-sm w-24" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-full bg-indigo-100 shrink-0" />
                <div>
                  <div className="h-2 bg-zinc-200 rounded-sm w-20 mb-1.5" />
                  <div className="h-1.5 bg-zinc-100 rounded-sm w-14" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[48, 36, 52, 40, 44].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-md bg-indigo-50 border border-indigo-100"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Terminal card */}
          <div className="absolute bottom-0 right-6 w-[220px] h-[110px] rounded-lg bg-zinc-950 shadow-xl shadow-zinc-900/30 overflow-hidden border border-zinc-800">
            <div className="h-5 bg-zinc-900 flex items-center px-2.5 gap-1 border-b border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <span className="text-[8px] text-zinc-600 ml-1">terminal</span>
            </div>
            <div className="p-2.5">
              <p className="text-[8px] text-emerald-400 font-mono mb-1.5">$ resumefolio deploy</p>
              <div className="h-1 bg-emerald-900/50 rounded-sm w-3/4 mb-1" />
              <p className="text-[7px] text-zinc-500 font-mono">✓ Live at resumefolio.app/p/…</p>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute top-36 left-8 bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-md shadow-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-100 rounded-md flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[8px] font-semibold text-zinc-900 leading-none mb-0.5">Portfolio live</p>
                <p className="text-[7px] text-zinc-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="lg:sticky lg:top-24 shrink-0 lg:w-56">
              <p className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">Process</p>
              <h2 className="text-3xl font-bold text-zinc-900 leading-tight tracking-tight">
                Four steps.<br />One portfolio.
              </h2>
            </div>

            <div className="flex-1 flex flex-col divide-y divide-zinc-200">
              {[
                {
                  n: '01',
                  title: 'Upload your resume',
                  desc: 'Drag and drop a PDF or DOCX. Any format — structured, creative, or plain text.',
                },
                {
                  n: '02',
                  title: 'AI extracts everything',
                  desc: 'Gemini reads your resume and structures all your experience, projects, and skills instantly.',
                },
                {
                  n: '03',
                  title: 'Choose a design',
                  desc: 'Pick from 14 professional templates. Adjust accent colors, reorder or hide sections.',
                },
                {
                  n: '04',
                  title: 'Deploy in one click',
                  desc: 'Publish instantly to a shareable URL, or push to GitHub Pages for your own github.io domain.',
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-8 py-8 group cursor-default">
                  <span className="text-4xl font-bold text-zinc-200 group-hover:text-indigo-200 transition-colors duration-300 shrink-0 tabular-nums leading-none pt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">Features</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Everything included. Nothing extra.
            </h2>
          </div>

          {/* Grid with dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {[
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
                title: 'AI Extraction',
                desc: 'Gemini 2.5 Flash reads any resume format and structures your data in seconds. No manual entry.',
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                ),
                title: 'Bullet Refinement',
                desc: 'One-click AI rewriting turns weak, vague bullets into strong, quantified achievements.',
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: 'ATS Analysis',
                desc: 'Get a keyword gap score and specific suggestions to rank higher with applicant tracking systems.',
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                ),
                title: '14 Templates',
                desc: 'From VS Code–inspired developer layouts to editorial magazine designs and glassmorphism.',
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                ),
                title: 'GitHub Pages',
                desc: 'Deploy to your own github.io URL using your existing GitHub login. No extra tokens required.',
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: 'Instant Hosting',
                desc: 'Live on a shareable ResumeFolio URL in seconds. No GitHub, no setup, no waiting.',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`p-8 bg-white hover:bg-zinc-50/80 transition-colors duration-150 ${
                  i < 3 ? 'md:border-b border-zinc-100' : ''
                } ${i % 3 !== 2 ? 'lg:border-r border-zinc-100' : ''} ${
                  i % 2 === 0 ? 'md:border-r lg:border-r-0' : 'md:border-r-0'
                } ${i % 2 === 0 && i % 3 !== 2 ? 'lg:border-r border-zinc-100' : ''}`}
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-950 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase mb-4">Get started</p>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-5 text-balance">
              Your portfolio is one upload away.
            </h2>
            <p className="text-zinc-400 mb-10 leading-relaxed">
              Free forever. No credit card. Sign in with GitHub, Google, or your email and have a live portfolio in under a minute.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="bg-white text-zinc-900 hover:bg-zinc-100 border-0 shadow-none text-sm px-6"
                >
                  Build my portfolio →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-bold tracking-tight text-zinc-900">ResumeFolio</span>
          <p className="text-xs text-zinc-400">Built with Next.js, Tailwind CSS, and Google Gemini.</p>
        </div>
      </footer>
    </div>
  )
}
