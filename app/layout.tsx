import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/auth/SessionProvider'

export const metadata: Metadata = {
  title: 'ResumeFolio — Turn Your Resume Into a Portfolio',
  description:
    'Upload your resume and get a beautiful, deployed portfolio website in minutes. Free, powered by AI.',
  openGraph: {
    title: 'ResumeFolio',
    description: 'Turn your resume into a live portfolio in 60 seconds.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
