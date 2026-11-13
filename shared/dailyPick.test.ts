import { describe, expect, it } from 'vitest';
import { dailyIndex, dailyTree, dayNumber } from './dailyPick';

describe('daily pick', () => {
  it('is one number for the whole local day', () => {
    expect(dayNumber(new Date(2026, 10, 13, 0, 1))).toBe(dayNumber(new Date(2026, 10, 13, 23, 59)));
    expect(dayNumber(new Date(2026, 10, 14))).toBe(dayNumber(new Date(2026, 10, 13)) + 1);
  });

  it('stays inside the list', () => {
    for (let day = 0; day < 50; day++) expect(dailyIndex(day, 7)).toBeGreaterThanOrEqual(0);
    expect(dailyIndex(5, 0)).toBe(-1);
  });

  it('picks a mid-sized tree, the same all day', () => {
    const keys = (n: number) => Array.from({ length: n }, (_, i) => `1:${i + 1}`);
    const pieces = [{ keys: keys(2) }, { keys: keys(3) }, { keys: keys(9) }, { keys: keys(8) }];
    for (let day = 0; day < 20; day++) expect([3, 8]).toContain(dailyTree(pieces, day)!.keys.length);
    expect(dailyTree(pieces, 4)).toBe(dailyTree(pieces, 4));
    expect(dailyTree([{ keys: keys(2) }], 1)).toBeUndefined();
  });
});
