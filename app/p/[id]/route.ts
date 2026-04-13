import { getPortfolioPublic, incrementViewCount } from '@/lib/db/portfolios'
import { generateHTML } from '@/lib/templates/index'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const portfolio = await getPortfolioPublic(id)

  if (!portfolio) {
    return new Response('<h1>Portfolio not found</h1>', {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Increment view count without blocking the response
  incrementViewCount(id)

  const html = generateHTML(
    portfolio.resume_data,
    portfolio.template_id,
    portfolio.accent_color,
    portfolio.section_order,
    portfolio.hidden_sections
  )

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}
