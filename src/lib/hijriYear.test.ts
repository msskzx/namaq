import { describe, expect, it } from 'vitest';
import { compareHijriYear, formatHijriYear } from './hijriYear';

describe('formatHijriYear', () => {
  it('writes a year after the hijra with its era in both languages', () => {
    expect(formatHijriYear(3, 'ar')).toBe('3 هـ');
    expect(formatHijriYear(3, 'en')).toBe('3 AH');
  });

  // -1 is the year the hijra came at the end of, so it reads as 1 before it
  // rather than as a negative number.
  it('writes a year before the hijra as a positive count before it', () => {
    expect(formatHijriYear(-1, 'ar')).toBe('1 ق.هـ');
    expect(formatHijriYear(-1, 'en')).toBe('1 BH');
    expect(formatHijriYear(-3, 'en')).toBe('3 BH');
  });
});

describe('compareHijriYear', () => {
  it('orders years before the hijra ahead of years after it', () => {
    expect([2, -3, -1, 8].sort(compareHijriYear)).toEqual([-3, -1, 2, 8]);
  });

  // The old `(a ?? 0) - (b ?? 0)` put an undated entry at zero, which was
  // before everything only while every year was positive.
  it('keeps undated entries first rather than among the years before the hijra', () => {
    expect([2, null, -3].sort(compareHijriYear)).toEqual([null, -3, 2]);
    expect(compareHijriYear(null, undefined)).toBe(0);
  });
});
