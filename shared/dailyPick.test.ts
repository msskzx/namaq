import { describe, expect, it } from 'vitest';
import { dailyIndex, dayNumber } from './dailyPick';

describe('daily pick', () => {
  it('is one number for the whole local day', () => {
    expect(dayNumber(new Date(2026, 10, 13, 0, 1))).toBe(dayNumber(new Date(2026, 10, 13, 23, 59)));
    expect(dayNumber(new Date(2026, 10, 14))).toBe(dayNumber(new Date(2026, 10, 13)) + 1);
  });

  it('stays inside the list', () => {
    for (let day = 0; day < 50; day++) expect(dailyIndex(day, 7)).toBeGreaterThanOrEqual(0);
    expect(dailyIndex(5, 0)).toBe(-1);
  });
});
