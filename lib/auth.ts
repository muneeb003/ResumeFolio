import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import PostgresAdapter from '@auth/pg-adapter'
import { Pool } from 'pg'

// Lazy pool — only created on first auth request, not at module load
let pool: Pool | null = null
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? 'postgres://placeholder',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? 'placeholder',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? 'placeholder',
      authorization: {
        params: {
          scope: 'read:user user:email public_repo delete_repo',
        },
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  adapter: PostgresAdapter(getPool()) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (profile && 'login' in profile) {
        token.githubLogin = (profile as { login: string }).login
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.githubLogin = token.githubLogin as string
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
}

declare module 'next-auth' {
  interface Session {
    accessToken: string
    githubLogin: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    githubLogin?: string
  }
}
