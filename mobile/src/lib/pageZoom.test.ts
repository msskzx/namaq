import { describe, expect, it } from 'vitest';
import { landingPage, MAX_ZOOM, settleZoom, splitDrag } from './pageZoom';

describe('mushaf page zoom', () => {
  it('snaps a pinch near the whole page back to it and stops at the most zoom', () => {
    expect(settleZoom(0.7)).toBe(1);
    expect(settleZoom(1.03)).toBe(1);
    expect(settleZoom(1.8)).toBe(1.8);
    expect(settleZoom(9)).toBe(MAX_ZOOM);
  });

  it('moves the zoomed page until its edge shows, then spills the rest of the drag', () => {
    expect(splitDrag(-100, -400)).toEqual({ offset: -100, spill: 0 });
    expect(splitDrag(30, -400)).toEqual({ offset: 0, spill: 30 });
    expect(splitDrag(-450, -400)).toEqual({ offset: -400, spill: -50 });
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
