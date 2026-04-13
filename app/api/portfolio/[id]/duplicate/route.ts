import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { duplicatePortfolio } from '@/lib/db/portfolios'
import { withErrorHandler } from '@/lib/apiHelpers'

export const POST = withErrorHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const portfolio = await duplicatePortfolio(id, session.user.id)
  return Response.json(portfolio, { status: 201 })
})
