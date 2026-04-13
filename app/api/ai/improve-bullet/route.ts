import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { improveBullet } from '@/lib/ai/improveBullet'
import { withErrorHandler } from '@/lib/apiHelpers'
import { aiLimiter, rateLimit } from '@/lib/ratelimit'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(aiLimiter, session.user?.email ?? 'anon')
  if (limited) return limited

  const { bullet, role } = await req.json()
  if (!bullet || typeof bullet !== 'string') {
    return Response.json({ error: 'bullet is required' }, { status: 400 })
  }

  const improved = await improveBullet(bullet, role ?? '')
  return Response.json({ improved })
})
