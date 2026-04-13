import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { describeProjectFromGitHub } from '@/lib/ai/describeProject'
import { withErrorHandler } from '@/lib/apiHelpers'
import { aiLimiter, rateLimit } from '@/lib/ratelimit'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(aiLimiter, session.user?.email ?? 'anon')
  if (limited) return limited

  const { repoUrl } = await req.json()
  if (!repoUrl || typeof repoUrl !== 'string') {
    return Response.json({ error: 'repoUrl is required' }, { status: 400 })
  }

  const description = await describeProjectFromGitHub(repoUrl)
  return Response.json({ description })
})
