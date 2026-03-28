import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm text-center">
        <a href="/" className="text-lg font-bold tracking-tight text-zinc-900 block mb-8">
          ResumeFolio
        </a>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h1 className="text-base font-bold text-zinc-900 mb-2">Check your email</h1>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6">
            A sign-in link has been sent to your email address. Click it to continue — the link expires in 24 hours.
          </p>
          <p className="text-xs text-zinc-400 mb-6">
            Don&apos;t see it? Check your spam folder.
          </p>

          <Link
            href="/auth/signin"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
