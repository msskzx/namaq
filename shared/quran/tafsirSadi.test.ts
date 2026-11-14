import { describe, expect, it } from 'vitest';
import surahs from '../data/quran/surahs.json';
import { tafsirRuns, tafsirSadiCredit, tafsirSadiOf, tafsirSadiPage } from './tafsirSadi';

const keys = surahs.flatMap(s => Array.from({ length: s.numberOfAyat }, (_, i) => `${s.number}:${i + 1}`));

describe('tafsirSadiOf', () => {
  it('has a passage for every one of the 6,236 ayat, inside its own surah', () => {
    expect(keys).toHaveLength(6236);
    for (const key of keys) {
      const passage = tafsirSadiOf(key);
      const [surah, ayah] = key.split(':').map(Number);
      expect(passage, key).not.toBeNull();
      expect(passage!.surah).toBe(surah);
      expect(ayah).toBeGreaterThanOrEqual(passage!.from);
      expect(ayah).toBeLessThanOrEqual(passage!.to);
      expect(passage!.text.length, key).toBeGreaterThan(20);
    }
  });

  it('gives the ayat of one group the same passage', () => {
    expect(tafsirSadiOf('1:3')).toEqual(tafsirSadiOf('1:7'));
    expect(tafsirSadiOf('1:1')).toMatchObject({ from: 1, to: 7, pages: [39, 39] });
    expect(tafsirSadiOf('2:1')).not.toEqual(tafsirSadiOf('1:7'));
    expect(tafsirSadiOf('115:1')).toBeNull();
  });

  it('keeps the next surah’s heading, the book’s introductions and appendix out of a passage', () => {
    expect(tafsirSadiOf('1:1')!.text).not.toContain('البقرة');
    expect(tafsirSadiOf('105:1')!.text).not.toContain('لإيلاف');
    const nas = tafsirSadiOf('114:1')!;
    expect(nas.pages).toEqual([937, 937]);
    expect(nas.text).not.toMatch(/مقدمة|ملحق|أصول وكليات/);
    for (const key of keys) expect(tafsirSadiOf(key)!.text, key).not.toMatch(/(?:^|\n)تفسير سورة [^\n]*$/);
  });

  it('has none of the edition’s footnote marks, page markers or HTML', () => {
    for (const key of keys) expect(tafsirSadiOf(key)!.text, key).not.toMatch(/[^\n]\([٠-٩]+\)|-\[[٠-٩]+\]-|<[a-z/]/);
  });
});

describe('tafsirRuns', () => {
  it('sets the Quran quotes apart from the prose', () => {
    expect(tafsirRuns('﴿الْحَمْدُ لِلَّهِ﴾ هو الثناء، ﴿رَبِّ﴾')).toEqual([
      { text: '﴿الْحَمْدُ لِلَّهِ﴾', quran: true }, { text: ' هو الثناء، ', quran: false }, { text: '﴿رَبِّ﴾', quran: true },
    ]);
  });
});

it('links a passage to its page on Quranpedia', () => {
  expect(tafsirSadiPage(tafsirSadiOf('105:3')!)).toBe('https://quranpedia.net/book/3/1/934');
});

it('credits the book page, Quranpedia and the dump version', () => {
  expect(tafsirSadiCredit(tafsirSadiOf('1:1')!)).toBe('تيسير الكريم الرحمن للسعدي، ص ٣٩ · الموسوعة القرآنية، إصدار ٢٠٢٦-٠٨-١٠');
});
