import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazily instantiated so the module can be imported at build time
// without requiring env vars to be present.
let _ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit {
  if (_ratelimit) return _ratelimit
  _ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: false,
  })
  return _ratelimit
}

// Returns { success: true } in dev/build when Upstash env vars are absent.
export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true }
  }
  return getRatelimit().limit(ip)
}
