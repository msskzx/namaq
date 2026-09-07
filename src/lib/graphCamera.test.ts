import { describe, expect, it } from 'vitest';
import { centerTargetForReveal, isComfortablyVisible, usableRect } from './graphCamera';

const viewport = { x: 0, y: 0, width: 1280, height: 800 };

describe('usableRect', () => {
  it('returns the full viewport when there is no panel', () => {
    expect(usableRect(viewport, null)).toEqual(viewport);
  });

  it('carves out a full-height sidebar touching the left edge', () => {
    const panel = { x: 0, y: 0, width: 320, height: 800 };
    expect(usableRect(viewport, panel)).toEqual({ x: 320, y: 0, width: 960, height: 800 });
  });

  it('carves out a full-height sidebar touching the right edge (RTL)', () => {
    const panel = { x: 960, y: 0, width: 320, height: 800 };
    expect(usableRect(viewport, panel)).toEqual({ x: 0, y: 0, width: 960, height: 800 });
  });

  it('carves out a full-width bottom sheet', () => {
    const panel = { x: 0, y: 500, width: 1280, height: 300 };
    expect(usableRect(viewport, panel)).toEqual({ x: 0, y: 0, width: 1280, height: 500 });
  });

  it('ignores a panel that does not span a full edge (collapsed corner icons)', () => {
    const panel = { x: 20, y: 20, width: 100, height: 40 };
    expect(usableRect(viewport, panel)).toEqual(viewport);
  });
});

describe('isComfortablyVisible', () => {
  const area = { x: 0, y: 0, width: 1000, height: 800 };

  it('is true for a point well inside the area', () => {
    expect(isComfortablyVisible({ x: 500, y: 400 }, area)).toBe(true);
  });

  it('is false for a point outside the area entirely', () => {
    expect(isComfortablyVisible({ x: 1500, y: 400 }, area)).toBe(false);
  });

  it('is false for a point within the area but inside the margin', () => {
    expect(isComfortablyVisible({ x: 10, y: 400 }, area, 48)).toBe(false);
  });

  it('falls back to the un-shrunk area when the area is too small for the margin', () => {
    const tinyArea = { x: 0, y: 0, width: 60, height: 60 };
    expect(isComfortablyVisible({ x: 30, y: 30 }, tinyArea, 48)).toBe(true);
  });
});

describe('centerTargetForReveal', () => {
  it('returns the node position unchanged when the usable area is already centered on the viewport', () => {
    expect(centerTargetForReveal({ x: 100, y: 200 }, viewport, viewport, 1)).toEqual({ x: 100, y: 200 });
  });

  it('shifts the target away from a left-side panel so the node lands at the usable area\'s center', () => {
    const area = { x: 320, y: 0, width: 960, height: 800 };
    // Usable area's center is 160px right of the viewport's own center;
    // at zoom 1 that's a 160-world-unit shift.
    expect(centerTargetForReveal({ x: 0, y: 0 }, area, viewport, 1)).toEqual({ x: -160, y: 0 });
  });

  it('scales the pixel offset by zoom', () => {
    const area = { x: 320, y: 0, width: 960, height: 800 };
    expect(centerTargetForReveal({ x: 0, y: 0 }, area, viewport, 2)).toEqual({ x: -80, y: 0 });
  });
});
