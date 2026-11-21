import { describe, expect, it } from 'vitest';
import { sharePages } from './sharePages';

const used = (heights: number[], page: number[], gap: number) => page.reduce((sum, i) => sum + heights[i], 0) + gap * (page.length - 1);

describe('sharePages', () => {
  it('keeps every block once, in order, and never overfills a page', () => {
    const heights = [80, 120, 40, 200, 60, 60, 150, 30, 90];
    const pages = sharePages({ heights, room: 300, firstRoom: 220, gap: 8 });
    expect(pages.flat()).toEqual(heights.map((_, i) => i));
    pages.forEach((page, p) => expect(used(heights, page, 8)).toBeLessThanOrEqual(p === 0 ? 220 : 300));
  });

  it('evens the pages out instead of leaving the last with one block', () => {
    // Greedy filling would give [0,1,2] [3] : the balanced layout splits them two and two.
    const heights = [100, 100, 90, 100];
    const pages = sharePages({ heights, room: 300, firstRoom: 300, gap: 0 });
    expect(pages).toEqual([[0, 1], [2, 3]]);
  });

  it('puts the last scene alone on the last page when it fits there', () => {
    const heights = [50, 50, 50, 50, 50];
    const pages = sharePages({ heights, room: 300, firstRoom: 300, gap: 0, tailFrom: 3 });
    expect(pages.at(-1)).toEqual([3, 4]);
    expect(pages.slice(0, -1).flat()).toEqual([0, 1, 2]);
  });

  it('leaves room for the foot on the last page', () => {
    const heights = [100, 100, 100, 100];
    for (const tailFrom of [undefined, 3]) {
      const pages = sharePages({ heights, room: 300, firstRoom: 300, gap: 0, tailFrom, foot: 50 });
      expect(used(heights, pages.at(-1)!, 0) + 50).toBeLessThanOrEqual(300);
    }
  });

  it('never puts a block under the head that is taller than the room there', () => {
    const heights = [450, 100, 100];
    const pages = sharePages({ heights, room: 478, firstRoom: 400, gap: 10 });
    expect(pages[0]).toEqual([]);
    expect(pages.flat()).toEqual([0, 1, 2]);
  });

  it('lets a last scene taller than a page flow with the rest', () => {
    const heights = [50, 200, 200];
    const pages = sharePages({ heights, room: 300, firstRoom: 300, gap: 0, tailFrom: 1 });
    expect(pages.flat()).toEqual([0, 1, 2]);
    expect(pages.every(page => used(heights, page, 0) <= 300)).toBe(true);
  });
});
