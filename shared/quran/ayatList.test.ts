import { describe, expect, it } from 'vitest';
import { ayatFound, SURAHS, surahAyat, surahAyatFound, typedAyah } from './ayatList';

describe('the ayat list', () => {
  it('lists every ayah of every surah once, in order, so each ayah page is reachable', () => {
    for (const surah of SURAHS) {
      const keys = surahAyat(surah.number).map(ayah => ayah.key);
      expect(keys).toEqual(Array.from({ length: surah.numberOfAyat }, (_, at) => `${surah.number}:${at + 1}`));
    }
  });

  it('reads a typed surah and ayah number as that ayah', () => {
    expect(typedAyah('البقرة ٣٦')).toBe('2:36');
    expect(typedAyah('2:255')).toBe('2:255');
    expect(typedAyah('الفاتحة 8')).toBeNull();
    expect(ayatFound('البقرة ٣٦', 5).ayat[0]).toBe('2:36');
  });

  it('finds ayat by their words, and only inside the surah when searching a surah', () => {
    expect(ayatFound('الحمد لله رب العالمين', 50).ayat).toContain('1:2');
    const inBaqara = surahAyatFound(2, 'الحمد لله', 50);
    expect(inBaqara.every(key => key.startsWith('2:'))).toBe(true);
    expect(surahAyatFound(2, '٣٦', 50)).toEqual(['2:36']);
  });
});
