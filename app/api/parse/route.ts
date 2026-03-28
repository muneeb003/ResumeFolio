import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { extractPdf } from '@/lib/extractors/pdfExtractor'
import { extractDocx } from '@/lib/extractors/docxExtractor'
import { extractResume } from '@/lib/ai/extractResume'
import { withErrorHandler } from '@/lib/apiHelpers'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export const POST = withErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: 'Only PDF and DOCX files are supported' }, { status: 415 })
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'File exceeds 10 MB limit' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const rawText =
    file.type === 'application/pdf'
      ? await extractPdf(buffer)
      : await extractDocx(buffer)

  if (!rawText.trim()) {
    return Response.json({ error: 'Could not extract text from the file. Try a different format.' }, { status: 422 })
  }

  const resumeData = await extractResume(rawText)
  return Response.json(resumeData)
})
