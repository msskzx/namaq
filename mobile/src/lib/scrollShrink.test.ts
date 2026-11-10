import { describe, expect, it } from 'vitest';
import { nextCompact } from './scrollShrink';

const at = (y: number, maxY = 1000) => ({ y, maxY });

describe('the shrinking tab bar', () => {
  it('shrinks while the page scrolls down', () => {
    expect(nextCompact(false, at(100), at(130))).toBe(true);
  });

  it('comes back to full size when the page scrolls up', () => {
    expect(nextCompact(true, at(500), at(480))).toBe(false);
  });

  it('stays full size near the top', () => {
    expect(nextCompact(false, at(0), at(20))).toBe(false);
    expect(nextCompact(true, at(60), at(10))).toBe(false);
  });

  it('ignores small jitter', () => {
    expect(nextCompact(true, at(300), at(297))).toBe(true);
    expect(nextCompact(false, at(300), at(304))).toBe(false);
  });

  it('ignores the bounce past the bottom of the page', () => {
    expect(nextCompact(true, at(1030), at(1000))).toBe(true);
    expect(nextCompact(true, at(1000), at(1020))).toBe(true);
  });

  it('stays small when its own shrinking makes the page taller at the bottom', () => {
    expect(nextCompact(true, at(126, 126), at(114, 114))).toBe(true);
  });
});
