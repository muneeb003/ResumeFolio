import { neon } from '@neondatabase/serverless'

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url || url.includes('placeholder')) {
    throw new Error('DATABASE_URL is not configured. Add it to .env.local')
  }
  return url
}

export function getDb() {
  return neon(getDatabaseUrl())
}
