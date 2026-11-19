import { describe, expect, it } from 'vitest';
import { clampBox, parseBarPlaces } from './barPlaces';

describe('floating bar places', () => {
  it('keeps only well-formed places', () => {
    expect(parseBarPlaces(JSON.stringify({ recite: { x: 0.5, y: 0.2, folded: true }, listen: { x: 2, y: 0, folded: false }, odd: 'x' })))
      .toEqual({ recite: { x: 0.5, y: 0.2, folded: true } });
    expect(parseBarPlaces('not json')).toEqual({});
    expect(parseBarPlaces(null)).toEqual({});
  });

  it('holds a box inside the screen, clear of the bars above and below', () => {
    const screen = { width: 390, height: 844 }, box = { width: 280, height: 52 }, clear = { top: 60, bottom: 30, side: 8 };
    expect(clampBox({ x: 195, y: 400 }, box, screen, clear)).toEqual({ left: 55, top: 374 });
    expect(clampBox({ x: 0, y: 0 }, box, screen, clear)).toEqual({ left: 8, top: 60 });
    expect(clampBox({ x: 999, y: 999 }, box, screen, clear)).toEqual({ left: 102, top: 762 });
  });
});
