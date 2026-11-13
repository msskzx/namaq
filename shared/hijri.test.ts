import { describe, expect, it } from 'vitest';
import { hijriDate, hijriDay, todaysJuz } from './hijri';

describe('hijriDate', () => {
  it('gives the Umm al-Qura date in Arabic', () => {
    expect(hijriDate(new Date(2026, 10, 13, 12))).toBe('الجمعة، ٣ جمادى الآخرة ١٤٤٨ هـ');
  });
});

describe('todaysJuz', () => {
  it('reads the juz of the Hijri day', () => {
    expect(hijriDay(new Date(2026, 10, 13, 12))).toBe(3);
    expect(todaysJuz(new Date(2026, 10, 13, 12))).toEqual([3]);
  });

  it('covers all thirty juz in every month, with both last juz on the 29th of a short month', () => {
    let short = 0;
    let long = 0;
    let read: number[] = [];
    for (let d = new Date(2026, 0, 1, 12); d < new Date(2028, 0, 1); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
      const day = hijriDay(d)!;
      if (day === 1) read = [];
      read.push(...todaysJuz(d)!);
      const tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12);
      if (hijriDay(tomorrow) === 1 && read[0] === 1) {
        expect(read).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
        if (day === 29) short++; else long++;
      }
    }
    expect(short).toBeGreaterThan(0);
    expect(long).toBeGreaterThan(0);
  });
});
