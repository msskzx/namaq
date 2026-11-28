import { describe, expect, it } from 'vitest';
import { SURAH_NAMES, surahName } from './surahNames';

const named = (n: number) => surahName(n).normalize('NFC');

describe('surah names', () => {
  it('names all 114 surahs in pause, a sukun on the last letter', () => {
    expect(Object.keys(SURAH_NAMES)).toHaveLength(114);
    expect(named(2)).toBe('البَقَرَةْ'.normalize('NFC'));
    expect(named(52)).toBe('الطُّورْ'.normalize('NFC'));
    expect(named(3)).toBe('آلِ عِمْرَانْ'.normalize('NFC'));
    expect(named(34)).toBe('سَبَأْ'.normalize('NFC'));
  });

  it('keeps a long vowel or the separate letters as the mushaf title writes them', () => {
    expect(named(93)).toBe('الضُّحَىٰ'.normalize('NFC'));
    expect(named(36)).toBe('يسٓ'.normalize('NFC'));
    expect(named(20)).toBe('طه'.normalize('NFC'));
  });

  it('uses one sukun and no case vowel, tatweel or mushaf sukun at the end of any name', () => {
    for (const name of Object.values(SURAH_NAMES)) {
      expect(name).not.toMatch(/[ً-ِ]$|ـ|ۡ/);
    }
  });
});
