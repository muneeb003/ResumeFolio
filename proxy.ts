import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

// Protect all routes except landing, auth, and public API
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/portfolio/:path*',
    '/api/parse',
    '/api/ai/:path*',
    '/api/deploy/:path*',
    '/api/portfolio/:path*',
  ],
}
