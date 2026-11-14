import { describe, expect, it } from 'vitest';
import { logoUrl } from './logo';
import { FRAME, geometry, recorderPage } from './scene';

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

describe('the recorder page', () => {
  const look = { paper: '#f4ecdb', ink: '#2e2219', muted: '#6b5a4a', rule: '#ccc', accent: '#9c3b22', path: '#5e4689', green: '#4b644a', deep: '#eee', card: '#fff', lit: '#ddd', font: 'serif', ui: 'serif', logo: logoUrl('#2e2219', '#9c3b22') };
  const page = (ask: boolean) => recorderPage({ scene: { width: 100, height: 100, down: false, boxes: [], edges: [] }, beats: [], look, speed: 1, ask, timer: 3, types: [], ayat: [] });

  it("ends on the shared end frame: the emblem, the app's name and its slogan", () => {
    const html = page(false);
    expect(html).toContain('function outro(');
    expect(html).toContain('نمق');
    expect(html).toContain('تدبّر القرآن');
  });

  it('carries the emblem, and can be paused', () => {
    const html = page(false);
    expect(html).toContain(look.logo.replace(/</g, '\\u003c'));
    expect(html).toContain("data.type === 'pause'");
    expect(html).not.toContain('${');
  });

  it('draws the emblem as an SVG in the theme colours', () => {
    const svg = decodeURIComponent(look.logo.split(',')[1]);
    expect(svg).toMatch(/^<svg [^>]*viewBox="12 24.7 76 76"/);
    expect(svg).toContain('fill="#9c3b22"');
  });
});
