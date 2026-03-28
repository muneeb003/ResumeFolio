import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPortfolioById, updatePortfolio, deletePortfolio } from '@/lib/db/portfolios'
import { deleteGitHubRepo } from '@/lib/github'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const portfolio = await getPortfolioById(id, session.user.id)
    if (!portfolio) return Response.json({ error: 'Not found' }, { status: 404 })

    return Response.json(portfolio)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const portfolio = await updatePortfolio(id, session.user.id, {
      resumeData: body.resumeData,
      templateId: body.templateId,
      accentColor: body.accentColor,
      sectionOrder: body.sectionOrder,
      hiddenSections: body.hiddenSections,
      deploymentUrl: body.deploymentUrl,
      githubRepo: body.githubRepo,
      lastDeployedAt: body.deploymentUrl ? new Date().toISOString() : undefined,
    })

    return Response.json(portfolio)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const portfolio = await getPortfolioById(id, session.user.id)
    if (!portfolio) return Response.json({ error: 'Not found' }, { status: 404 })

    // Delete GitHub repo if one was deployed
    let repoDeleteError: string | null = null
    if (portfolio.github_repo && session.accessToken && session.githubLogin) {
      const repoName = portfolio.github_repo.split('/')[1]
      try {
        await deleteGitHubRepo(repoName, session.accessToken, session.githubLogin)
      } catch (err) {
        repoDeleteError = err instanceof Error ? err.message : 'Failed to delete GitHub repo'
        console.error('GitHub repo delete failed:', repoDeleteError)
      }
    }

    await deletePortfolio(id, session.user.id)

    if (repoDeleteError) {
      return Response.json({ warning: repoDeleteError }, { status: 200 })
    }
    return new Response(null, { status: 204 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
