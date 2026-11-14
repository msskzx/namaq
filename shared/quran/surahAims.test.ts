import { describe, expect, it } from 'vitest';
import { BOOKS } from './surahOrder';
import { EARLY_AIMS, surahAim } from './surahAims';

describe('surah aims', () => {
  it('gives every surah an aim from al-Biqa’i, with volume, page and Shamela page', () => {
    for (let surah = 1; surah <= 114; surah += 1) {
      const aim = surahAim(surah);
      expect(aim, `${surah}`).toBeDefined();
      expect(aim!.text.trim()).not.toBe('');
      if (surah <= 40) expect(aim!.text).toMatch(/^(مقصود|المقصود)/);
      expect(['nazm', 'masaid']).toContain(aim!.src.book);
      expect(aim!.src.vol).toBeGreaterThan(0);
      expect(aim!.src.sh).toBeGreaterThan(0);
    }
    expect(Object.keys(EARLY_AIMS).map(Number)).toEqual(Array.from({ length: 40 }, (_, k) => k + 1));
  });

  it('takes al-Fatiha, Al Imran and al-Anfal from Masa’id al-Nazar', () => {
    expect([1, 3, 8].map(s => surahAim(s)!.src.book)).toEqual(['masaid', 'masaid', 'masaid']);
    expect(surahAim(1)!.text).toBe('مقصودها: مراقبة العباد لربهم');
    expect(BOOKS.masaid.shamela).toBe(1404);
  });
});
