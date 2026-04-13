import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function makeRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL   ?? ''
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? ''
  // Skip if unset or still contains a placeholder value
  if (!url.startsWith('https://') || !token || token.startsWith('your-')) {
    return null
  }
  return new Redis({ url, token })
}

const redis = makeRedis()

// AI endpoints — 20 requests per 10 minutes per user
export const aiLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '10 m'), prefix: 'rl:ai' })
  : null

// Deploy/parse endpoints — 10 requests per hour per user
export const deployLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 h'), prefix: 'rl:deploy' })
  : null

/** Returns a 429 Response if rate limited, or null if the request is allowed. */
export async function rateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<Response | null> {
  if (!limiter) return null
  const { success, reset } = await limiter.limit(identifier)
  if (success) return null
  return Response.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) },
    }
  )
}
