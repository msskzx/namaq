import { describe, expect, it } from 'vitest';
import { breakLines, landingPage, MAX_ZOOM, settleZoom } from './pageZoom';

describe('mushaf text size', () => {
  it('snaps a pinch near the printed page back to it and stops at the biggest size', () => {
    expect(settleZoom(0.7)).toBe(1);
    expect(settleZoom(1.06)).toBe(1);
    expect(settleZoom(1.8)).toBe(1.8);
    expect(settleZoom(9)).toBe(MAX_ZOOM);
  });

  it('wraps whole words onto lines no wider than the page', () => {
    expect(breakLines([30, 30, 30, 30], 100, 5)).toEqual([0, 3]);
    expect(breakLines([30, 30, 30], 100, 5)).toEqual([0]);
    // A word wider than the line stands alone.
    expect(breakLines([40, 120, 40], 100, 5)).toEqual([0, 1, 2]);
    expect(breakLines([], 100, 5)).toEqual([]);
  });

  it('turns the page only on a far drag or a flick, and not past the ends', () => {
    expect(landingPage(5, 50, 0, 400, 604)).toBe(5);
    expect(landingPage(5, 100, 0, 400, 604)).toBe(6);
    expect(landingPage(5, -100, 0, 400, 604)).toBe(4);
    expect(landingPage(5, 10, 800, 400, 604)).toBe(6);
    expect(landingPage(0, -300, 0, 400, 604)).toBe(0);
    expect(landingPage(603, 300, 0, 400, 604)).toBe(603);
  });
});
