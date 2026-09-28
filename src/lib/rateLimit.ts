const WINDOW_MS = 60_000;
const LIMIT = 100;

const hits = new Map<string, { count: number; resetAt: number }>();

/**
 * Fixed-window request counter keyed by an arbitrary string (typically an IP).
 * ponytail: single-process in-memory map, resets on deploy/restart and isn't
 * shared across serverless instances; move to Upstash/Redis if abuse survives
 * that or the app grows past one region.
 */
export function checkRateLimit(key: string, now = Date.now()) {
  const entry = hits.get(key);

  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false as const };
  }

  entry.count += 1;
  if (entry.count > LIMIT) {
    return { limited: true as const, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false as const };
}

export function resetRateLimitState() {
  hits.clear();
}

export { LIMIT as RATE_LIMIT, WINDOW_MS as RATE_LIMIT_WINDOW_MS };
