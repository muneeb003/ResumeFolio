import { getFlashModel } from '@/lib/gemini'
import type { ResumeData, AtsScore } from '@/lib/types'

export async function getAtsScore(resumeData: ResumeData): Promise<AtsScore> {
  const model = getFlashModel()

  const resumeSummary = `
Name: ${resumeData.name}
Title: ${resumeData.title}
Skills: ${resumeData.skills.map(g => g.items.join(', ')).join(', ')}
Experience roles: ${resumeData.experience.map(e => `${e.role} at ${e.company}`).join(', ')}
`.trim()

  const result = await model.generateContent(
    `Analyze this resume as an ATS (Applicant Tracking System) expert and return ONLY valid JSON, no markdown, no explanation.

Resume:
${resumeSummary}

Return this exact JSON shape:
{
  "score": number between 0-100,
  "missing_keywords": string[] of 3-6 common keywords/skills missing from the resume,
  "suggestions": string[] of 3-5 specific, actionable improvement suggestions
}`
  )

  const text = result.response.text().trim()

  try {
    return JSON.parse(text) as AtsScore
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as AtsScore
    throw new Error('Could not parse ATS score response')
  }
}
