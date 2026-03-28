'use client'

import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const { status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [status, callbackUrl, router])

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailLoading(true)
    setEmailError('')
    const res = await signIn('email', { email, callbackUrl, redirect: false })
    setEmailLoading(false)
    if (res?.error) {
      setEmailError('Failed to send email. Please try again.')
    } else {
      setEmailSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="text-lg font-bold tracking-tight text-zinc-900">
            ResumeFolio
          </a>
          <p className="text-sm text-zinc-500 mt-2">Sign in to build your portfolio</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-7 flex flex-col gap-3">
          {/* GitHub */}
          <button
            onClick={() => signIn('github', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-700 active:scale-[0.98] text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-all duration-150"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>

          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-700 text-sm font-medium py-2.5 px-5 rounded-lg transition-all duration-150 border border-zinc-200"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-[11px] text-zinc-400">or continue with email</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          {/* Email magic link */}
          {emailSent ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">📬</p>
              <p className="text-xs font-semibold text-indigo-800 mb-1">Check your inbox</p>
              <p className="text-xs text-indigo-500 leading-relaxed">
                We sent a sign-in link to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 placeholder:text-zinc-400 transition-all"
              />
              {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              <button
                type="submit"
                disabled={emailLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
              >
                {emailLoading ? 'Sending…' : 'Send magic link →'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-zinc-400 mt-5 leading-relaxed px-4">
          GitHub sign-in requests{' '}
          <code className="bg-zinc-100 px-1 rounded">public_repo</code> access to deploy
          to GitHub Pages. We never push to your existing repos.
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}
