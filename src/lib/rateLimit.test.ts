import { beforeEach, describe, expect, it } from 'vitest';
import { RATE_LIMIT, RATE_LIMIT_WINDOW_MS, checkRateLimit, resetRateLimitState } from './rateLimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimitState();
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < RATE_LIMIT; i++) {
      expect(checkRateLimit('1.2.3.4', 0).limited).toBe(false);
    }
  });

  it('blocks once the limit is exceeded within the window', () => {
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit('1.2.3.4', 0);
    const result = checkRateLimit('1.2.3.4', 0);
    expect(result.limited).toBe(true);
    if (result.limited) expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('tracks separate keys independently', () => {
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit('1.2.3.4', 0);
    expect(checkRateLimit('5.6.7.8', 0).limited).toBe(false);
  });

  it('resets after the window elapses', () => {
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit('1.2.3.4', 0);
    expect(checkRateLimit('1.2.3.4', 0).limited).toBe(true);
    expect(checkRateLimit('1.2.3.4', RATE_LIMIT_WINDOW_MS).limited).toBe(false);
  });
});
