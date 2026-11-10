import { describe, expect, it } from 'vitest';
import { FRAME, geometry } from './scene';

const box = (x: number, y: number, w = 100, h = 40) => ({ id: '', size: 18, words: [], x, y, w, h });

describe('the video frame', () => {
  const { placeTree, edgePath } = geometry();

  it('fits a tree of any shape inside the frame, centred', () => {
    for (const scene of [{ width: 2000, height: 300 }, { width: 300, height: 3000 }, { width: 50, height: 50 }]) {
      const { scale, x, y } = placeTree(scene);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x + scene.width * scale).toBeLessThanOrEqual(FRAME.width);
      expect(y + scene.height * scale).toBeLessThanOrEqual(FRAME.height);
      expect(Math.abs(FRAME.width - (2 * x + scene.width * scale))).toBeLessThan(1);
    }
  });

  it('draws a connector from the parent to the child, side or top down', () => {
    const parent = box(400, 100), child = box(100, 300);
    const side = edgePath(parent, child, false, false);
    expect(side[0]).toEqual([parent.x, parent.y + parent.h / 2]);
    expect(side.at(-1)).toEqual([child.x + child.w, child.y + child.h / 2]);
    const down = edgePath(box(100, 0), box(300, 200), true, false);
    expect(down[0]).toEqual([150, 40]);
    expect(down.at(-1)).toEqual([350, 200]);
  });
});
