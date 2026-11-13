import { describe, expect, it } from 'vitest';
import { hijriDate } from './hijri';

describe('hijriDate', () => {
  it('gives the Umm al-Qura date in Arabic', () => {
    expect(hijriDate(new Date(2026, 10, 13, 12))).toBe('الجمعة، ٣ جمادى الآخرة ١٤٤٨ هـ');
  });
});
