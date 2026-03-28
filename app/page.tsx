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
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">ResumeFolio</span>
          {session ? (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button variant="secondary" size="sm">Sign in with GitHub</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          Free forever · No credit card needed
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Turn Your Resume Into<br />
          <span className="text-indigo-600">a Portfolio</span> in 60 Seconds
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your PDF or DOCX resume. AI extracts your experience, projects, and skills.
          Pick a design. Deploy to GitHub Pages — all for free.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href={ctaHref}>
            <Button size="lg" className="text-base px-8">
              Get Started Free →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="text-base">
              View Dashboard
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">Sign in with GitHub · No API keys needed</p>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Upload Resume', desc: 'Drag & drop your PDF or DOCX. We accept any format.' },
              { num: '02', title: 'AI Extracts', desc: 'Gemini AI parses your resume into structured data instantly.' },
              { num: '03', title: 'Review & Edit', desc: 'Check accuracy, improve bullets with AI, get an ATS score.' },
              { num: '04', title: 'Deploy Free', desc: 'Choose a template, pick colors, deploy to GitHub Pages in one click.' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-2xl font-black text-indigo-100 mb-3">{step.num}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">Everything you need, nothing you don&apos;t</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI-Powered Extraction', desc: 'Gemini AI reads your resume and structures the data — no manual entry.' },
              { icon: '✨', title: 'Bullet Improvement', desc: 'One click to rewrite any experience bullet as a strong, quantified achievement.' },
              { icon: '📊', title: 'ATS Score', desc: 'Get a score and specific suggestions to make your resume more recruiter-friendly.' },
              { icon: '🎨', title: '3 Professional Templates', desc: 'Minimal, Dark Dev, and Bold — each with 5 accent color options.' },
              { icon: '🔗', title: 'GitHub Pages Deploy', desc: 'Uses your existing GitHub login — no new accounts or tokens required.' },
              { icon: '📦', title: 'Download as ZIP', desc: 'Always available as a fallback. Host anywhere, any time.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-gray-100">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to ship your portfolio?</h2>
          <p className="text-indigo-200 mb-8">Free forever. No credit card. Sign in with GitHub and start in seconds.</p>
          <Link href={ctaHref}>
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-base px-8">
              Build My Portfolio →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-400">
          Built with Next.js, Tailwind CSS, and Google Gemini.
        </p>
      </footer>
    </div>
  )
}
