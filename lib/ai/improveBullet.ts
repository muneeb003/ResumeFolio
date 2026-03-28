import { getFlashModel } from '@/lib/gemini'

export async function improveBullet(bullet: string, role: string): Promise<string> {
  const model = getFlashModel()
  const result = await model.generateContent(
    `Rewrite this resume bullet point as a strong, quantified achievement. Keep it one sentence. Start with a past-tense action verb. Be specific and impactful. Return only the rewritten bullet, no explanation, no quotes.

Role context: ${role}
Original bullet: ${bullet}`
  )
  return result.response.text().trim().replace(/^["']|["']$/g, '')
}
