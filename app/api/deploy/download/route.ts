import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateHTML } from '@/lib/templates/index'
import { generateZip } from '@/lib/zip'
import { deploySchema } from '@/lib/validation/deploySchema'
import { withErrorHandler } from '@/lib/apiHelpers'

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = deploySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid deploy payload' }, { status: 400 })
  }

  const { resumeData, templateId, accentColor, sectionOrder, hiddenSections } = parsed.data
  const html = generateHTML(resumeData, templateId, accentColor, sectionOrder, hiddenSections)
  const zip = await generateZip(html)

  return new Response(zip.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="portfolio.zip"`,
      'Content-Length': String(zip.length),
    },
  })
})
