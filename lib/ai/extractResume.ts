import { getFlashModel } from '@/lib/gemini'
import type { ResumeData } from '@/lib/types'

const SCHEMA = `{
  "name": string,
  "title": string,
  "bio": string,
  "contact": {
    "email": string,
    "github": string,
    "linkedin": string
  },
  "experience": [
    {
      "company": string,
      "role": string,
      "period": string,
      "location": string,
      "bullets": string[],
      "tags": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "tags": string[],
      "liveUrl": string,
      "repoUrl": string
    }
  ],
  "skills": [
    {
      "category": string,
      "items": string[]
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "period": string,
      "note": string
    }
  ]
}`

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the resume text and return ONLY valid JSON with no markdown, no code blocks, no explanation.

Match this exact schema:
${SCHEMA}

Rules:
- Use empty string "" for any missing field — never null or undefined
- Infer a 2-3 sentence professional bio if none is stated
- Keep bullet points as complete sentences starting with action verbs
- Group skills into logical categories (max 5 categories, e.g. "Frontend", "Backend", "Tools")
- github and linkedin fields should be full URLs (https://...) or empty string
- Max 5 bullet points per experience entry
- Return valid JSON only`

export async function extractResume(rawText: string): Promise<ResumeData> {
  const model = getFlashModel()
  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `Resume text:\n\n${rawText}` },
  ])

  const text = result.response.text().trim()

  try {
    return JSON.parse(text) as ResumeData
  } catch {
    // Gemini sometimes wraps in ```json ... ``` despite instructions
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0]) as ResumeData
    }
    throw new Error('Could not parse resume data from AI response')
  }
}
