import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPortfolio, getPortfoliosByUser } from '@/lib/db/portfolios'
import { withErrorHandler } from '@/lib/apiHelpers'

export const GET = withErrorHandler(async () => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const portfolios = await getPortfoliosByUser(session.user.id)
  return Response.json(portfolios)
})

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const portfolio = await createPortfolio({
    userId: session.user.id,
    name: body.name,
    resumeData: body.resumeData,
    templateId: body.templateId,
    accentColor: body.accentColor,
    sectionOrder: body.sectionOrder,
    hiddenSections: body.hiddenSections,
  })

  // Update with deploy info if provided
  if (body.deploymentUrl || body.githubRepo) {
    const { updatePortfolio } = await import('@/lib/db/portfolios')
    await updatePortfolio(portfolio.id, session.user.id, {
      deploymentUrl: body.deploymentUrl,
      githubRepo: body.githubRepo,
      lastDeployedAt: new Date().toISOString(),
    })
  }

  return Response.json({ id: portfolio.id }, { status: 201 })
})
