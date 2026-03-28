import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateHTML } from '@/lib/templates/index'
import { deployToGitHubPages, slugifyRepoName } from '@/lib/github'
import { deploySchema } from '@/lib/validation/deploySchema'
import { withErrorHandler } from '@/lib/apiHelpers'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  if (!session.accessToken) {
    return Response.json({ error: 'GitHub token not available. Please sign out and sign back in.' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = deploySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid deploy payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const { resumeData, templateId, accentColor, sectionOrder, hiddenSections, repoName } = parsed.data

  const html = generateHTML(resumeData, templateId, accentColor, sectionOrder, hiddenSections)

  const safeRepoName = slugifyRepoName(repoName)
  const deploymentUrl = await deployToGitHubPages(
    html,
    safeRepoName,
    session.accessToken,
    session.githubLogin
  )

  return Response.json({ url: deploymentUrl, repoName: safeRepoName, githubRepo: `${session.githubLogin}/${safeRepoName}` })
})
