import { describe, expect, it } from 'vitest';
import surahs from '../data/quran/surahs.json';
import { TAFSIR_SADI_VERSION, tafsirRuns, tafsirSadiCredit, tafsirSadiPage } from './tafsirSadi';
import { tafsirSadiDataVersion, tafsirSadiOf } from './tafsirSadiData';

const keys = surahs.flatMap(s => Array.from({ length: s.numberOfAyat }, (_, i) => `${s.number}:${i + 1}`));
const text = (key: string) => tafsirSadiOf(key)!.text;

describe('tafsirSadiOf', () => {
  it('has a passage for every one of the 6,236 ayat, inside its own surah and around the ayah', () => {
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
    expect(tafsirSadiOf('115:1')).toBeNull();
  });

  it('follows the book’s own passages, not the dump’s pages', () => {
    expect(tafsirSadiOf('1:3')).toEqual(tafsirSadiOf('1:7'));
    expect(tafsirSadiOf('1:1')).toMatchObject({ from: 1, to: 7, pages: [39, 39] });
    // 2:11 opens on its own quote, not on the end of 2:8–10 that shares its page.
    expect(tafsirSadiOf('2:11')).toMatchObject({ from: 11, to: 12 });
    expect(text('2:11')).toMatch(/^﴿وَإِذَا قِيلَ لَهُمْ لا تُفْسِدُوا/);
    expect(tafsirSadiOf('2:67')).toMatchObject({ from: 67, to: 74 });
    expect(tafsirSadiOf('5:109')).toMatchObject({ from: 109, to: 110 });
    // An ayah he takes without a marker of its own belongs to the passage it is in.
    expect(tafsirSadiOf('2:121')).toMatchObject({ from: 120, to: 123 });
    // A marker that starts inside a wider one cuts it: «{١ - ٥١}» then «{٣٠ - ٥١}».
    expect(tafsirSadiOf('28:35')).toMatchObject({ from: 30, to: 51 });
    expect(tafsirSadiOf('28:1')).toMatchObject({ from: 1, to: 29 });
    // Where he splits an ayah, both halves come: 2:219's second passage («{٢١٩ - ٢٢٠}») ends on the opening words of
    // 2:220, so 2:220 gets it too, before its own passage on the orphans.
    expect(tafsirSadiOf('2:219')).toMatchObject({ from: 219, to: 220 });
    expect(text('2:219')).toContain('الخمر');
    expect(text('2:219')).toContain('مَاذَا يُنْفِقُونَ');
    expect(tafsirSadiOf('2:220')).toMatchObject({ from: 219, to: 220, pages: [98, 99] });
    expect(text('2:220')).toMatch(/^﴿وَيَسْأَلُونَكَ مَاذَا يُنْفِقُونَ/);
    // The quote runs on into 2:220 («… تَتَفَكَّرُونَ * فِي الدُّنْيَا وَالآخِرَةِ»).
    expect(text('2:220').split('\n')[0]).toMatch(/ \* \S+ \S+ \S+﴾\.$/);
    expect(text('2:220')).toContain('لكي تتفكروا في الدنيا وسرعة انقضائها');
    expect(text('2:220')).toContain('﴿وَيَسْأَلُونَكَ عَنِ الْيَتَامَى');
    expect(text('2:220')).not.toContain('الخمر');
    expect(tafsirSadiOf('2:221')).toMatchObject({ from: 221, to: 221 });
    expect(tafsirSadiOf('30:16')).toMatchObject({ from: 11, to: 16 });
    // A passage that quotes the next ayah up front but stops before explaining it keeps to its own ayah.
    expect(tafsirSadiOf('4:30')).toMatchObject({ from: 30 });
    expect(tafsirSadiOf('72:2')).toMatchObject({ from: 2, to: 4 });
  });

  it('keeps the next surah’s heading, the book’s introductions and appendices out', () => {
    expect(text('1:1')).not.toContain('البقرة');
    expect(text('105:1')).not.toContain('لإيلاف');
    expect(text('40:85')).toMatch(/فله الشكر والثناء$/);
    const nas = tafsirSadiOf('114:1')!;
    expect(nas.pages).toEqual([937, 937]);
    expect(nas.text).not.toMatch(/مقدمة|ملحق|أصول وكليات/);
    for (const key of keys) expect(text(key), key).not.toMatch(/(?:^|\n)تفسير سورة [^\n]*$|المجلد \S+ من/);
    expect(text('3:128')).toMatch(/والحمد لله رب العالمين\.$/);
  });

  it('has no footnote marks, page or range markers, or HTML, and no passage cut short', () => {
    for (const key of keys) expect(text(key), key).not.toMatch(/[^\n]\([٠-٩]+\)|-\[[٠-٩]+\]-|⦗|<[a-z/]|[{﴿]\s*[٠-٩]|\[…\]/);
    // Where the dump's piece breaks off, Shamela's copy of the same edition gives the rest (scripts/quran/sadiShamela.ts).
    expect(text('3:96')).toContain('وهل بعد الطواف تداني\nوألثم منه الركن');
    expect(text('3:96')).toMatch(/انتهى كلامه رحمه الله تعالى\.$/);
    expect(tafsirSadiOf('3:96')).toMatchObject({ pages: [138, 141] });
    expect(text('12:110')).toMatch(/تم تفسير سورة يوسف وأبيه وإخوته عليهم الصلاة والسلام، والحمد لله رب العالمين\.$/);
    expect(text('48:29')).toMatch(/وهذا آخر تفسير سورة الفتح ولله الحمد والمنة$/);
    expect(text('48:29')).not.toContain('بقلم');
    // A gap that was only a page break keeps the paragraph break before the next quote.
    expect(text('27:1')).toContain('السفسطة.\n﴿');
  });

  it('was built from the version the credit names', () => {
    expect(tafsirSadiDataVersion).toBe(TAFSIR_SADI_VERSION);
  });
});

describe('tafsirRuns', () => {
  it('sets the Quran quotes apart from the prose', () => {
    expect(tafsirRuns('﴿الْحَمْدُ لِلَّهِ﴾ هو الثناء، ﴿رَبِّ﴾')).toEqual([
      { text: '﴿الْحَمْدُ لِلَّهِ﴾', quran: true }, { text: ' هو الثناء، ', quran: false }, { text: '﴿رَبِّ﴾', quran: true },
    ]);
  });
});

it('links a passage to its page on Quranpedia and credits the page, Quranpedia and the dump version', () => {
  expect(tafsirSadiPage(tafsirSadiOf('105:3')!)).toBe('https://quranpedia.net/book/3/1/934');
  expect(tafsirSadiCredit(tafsirSadiOf('1:1')!)).toBe('تيسير الكريم الرحمن للسعدي، ص ٣٩ · الموسوعة القرآنية، إصدار ٢٠٢٦-٠٨-١٠');
});
