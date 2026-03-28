import { GoogleGenerativeAI } from '@google/generative-ai'

function getClient() {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY is not set')
  }
  return new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
}

export function getFlashModel() {
  return getClient().getGenerativeModel({ model: 'gemini-2.5-flash' })
}
