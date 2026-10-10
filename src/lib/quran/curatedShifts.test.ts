import { describe, expect, it } from 'vitest';
import { CURATED } from './curatedShifts';

describe('CURATED', () => {
  it('leaves 43:36-37 out, which is not an address shift', () => {
    expect(CURATED.some(c => c.surah === 43 && c.parts.some(([from]) => from >= 36))).toBe(false);
  });

  it('has two parts at most, in order', () => {
    for (const c of CURATED) {
      expect(c.parts.length).toBeLessThanOrEqual(2);
      expect(c.parts.every(([from, to]) => from <= to)).toBe(true);
    }
  });
});
