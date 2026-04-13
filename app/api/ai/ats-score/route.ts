import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAtsScore } from '@/lib/ai/atsScore'
import { resumeDataSchema } from '@/lib/validation/resumeSchema'
import { withErrorHandler } from '@/lib/apiHelpers'
import { aiLimiter, rateLimit } from '@/lib/ratelimit'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(aiLimiter, session.user?.email ?? 'anon')
  if (limited) return limited

  const body = await req.json()
  const parsed = resumeDataSchema.safeParse(body.resumeData)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid resume data' }, { status: 400 })
  }

  const score = await getAtsScore(parsed.data)
  return Response.json(score)
})
