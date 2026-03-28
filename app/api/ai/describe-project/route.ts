import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { describeProjectFromGitHub } from '@/lib/ai/describeProject'
import { withErrorHandler } from '@/lib/apiHelpers'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { repoUrl } = await req.json()
  if (!repoUrl || typeof repoUrl !== 'string') {
    return Response.json({ error: 'repoUrl is required' }, { status: 400 })
  }

  const description = await describeProjectFromGitHub(repoUrl)
  return Response.json({ description })
})
