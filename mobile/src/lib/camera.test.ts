import { describe, expect, it } from 'vitest';
import { clampCamera, fitCamera, pickDirection, settleCamera, zoomAt } from './camera';

const view = { width: 400, height: 600 };
const wide = { width: 1600, height: 600 };

describe('tree camera', () => {
  it('opens a wide tree scaled to the card width and centred', () => {
    const camera = fitCamera(wide, view);
    expect(camera.s).toBe(0.25);
    expect(camera.x).toBe(0);
    expect(camera.y).toBe((600 - 150) / 2);
  });

  it('keeps the point under the fingers in place while pinching', () => {
    const start = fitCamera(wide, view);
    const [fx, fy] = [300, 200];
    const treePoint = { x: (fx - start.x) / start.s, y: (fy - start.y) / start.s };
    const zoomed = zoomAt(start, 3, fx, fy, start.s);
    expect(zoomed.s).toBeCloseTo(0.75);
    expect(zoomed.x + treePoint.x * zoomed.s).toBeCloseTo(fx);
    expect(zoomed.y + treePoint.y * zoomed.s).toBeCloseTo(fy);
  });

  it('snaps back to the whole tree after zooming out past it', () => {
    const fit = fitCamera(wide, view);
    expect(settleCamera({ s: fit.s * 0.7, x: 90, y: 10 }, wide, view)).toEqual(fit);
  });

  it('stops a zoomed tree at its edges instead of dragging it off the card', () => {
    const camera = clampCamera({ s: 1, x: 200, y: -5000 }, wide, view);
    expect(camera).toEqual({ s: 1, x: 0, y: 0 });
    expect(clampCamera({ s: 1, x: -5000, y: 0 }, wide, view).x).toBe(400 - 1600);
  });
});

describe('tree direction', () => {
  it('draws a tall narrow tree top down only when that shows it clearly bigger', () => {
    const phone = { width: 390, height: 600 };
    expect(pickDirection({ width: 1600, height: 300 }, { width: 500, height: 700 }, phone)).toBe('down');
    expect(pickDirection({ width: 400, height: 300 }, { width: 380, height: 320 }, phone)).toBe('side');
  });
});
