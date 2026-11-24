import { describe, expect, it } from 'vitest';
import { searchApp } from './searchAll';

const group = (query: string, kind: string) => searchApp(query).find(found => found.kind === kind)?.hits ?? [];

describe('the app search on the bundled data', () => {
  it('lists the surah first when the query names one', () => {
    const groups = searchApp('البقرة');
    expect(groups[0].kind).toBe('surah');
    expect(groups[0].hits[0]).toMatchObject({ number: 2 });
  });

  it('finds ayat, the word, trees and prophets\' events for «فرعون»', () => {
    expect(group('فرعون', 'ayah').length).toBeGreaterThan(3);
    expect(group('فرعون', 'word')).toContainEqual(expect.objectContaining({ name: 'فِرۡعَوۡن', count: 74 }));
    expect(group('فرعون', 'tree').length).toBeGreaterThan(0);
    expect(group('فرعون', 'event')).toContainEqual(expect.objectContaining({ slug: 'musa', title: 'إغراق فرعون وجنوده' }));
  });

  it('finds compare pages by story name and Tuhfa verses by their words', () => {
    expect(group('موسى وفرعون', 'compare')).toContainEqual(expect.objectContaining({ a: 7, b: 26 }));
    expect(group('الإظهار', 'tuhfa').length).toBeGreaterThan(0);
  });
});

describe('adhkar in the app search', () => {
  it('finds an adhkar card by its words, with the tab it opens on', () => {
    expect(group('أنت السلام ومنك السلام', 'adhkar')).toEqual([expect.objectContaining({ id: 'prayer-peace', occasion: 'after-prayer' })]);
    expect(group('بك أصبحنا', 'adhkar')).toContainEqual(expect.objectContaining({ id: 'morning-by-you', occasion: 'morning' }));
  });

  it('leaves the Quran selection to the ayat, so no Quran text is listed as an adhkar', () => {
    expect(group('قل هو الله أحد', 'adhkar')).toEqual([]);
  });
});

describe('trees in the app search', () => {
  it('keeps to trees that hold the words as typed when there are some', () => {
    const trees = group('فرعون', 'tree') as { text: string }[];
    expect(trees.length).toBeGreaterThan(0);
    expect(trees.every(tree => tree.text.includes('فِرۡعَوۡن'))).toBe(true);
  });

  it('finds a sira chapter by its name before the stories in it (owner, 2026-11-23: «الوفود», «حجة الوداع»)', () => {
    expect(group('الوفود', 'sira')[0]).toMatchObject({ chapter: 'الوفود' });
    expect(group('حجة الوداع', 'sira')[0]).toMatchObject({ chapter: 'حجة الوداع' });
    expect(group('حجة الوداع', 'sira')).toContainEqual(expect.objectContaining({ slug: 'the-sermon-of-the-farewell-hajj' }));
  });
});

describe('people, battles and hadith in the app search (owner, 2026-11-24: it found none of them)', () => {
  it('finds a person by kunya, listed before the ayat since names are few and exact', () => {
    expect(group('أبو بكر', 'person')).toContainEqual(expect.objectContaining({ slug: 'abu-bakr-as-siddiq' }));
    const kinds = searchApp('أبو بكر').map(found => found.kind);
    if (kinds.includes('ayah')) expect(kinds.indexOf('person')).toBeLessThan(kinds.indexOf('ayah'));
  });

  it('finds a battle by its name', () => {
    expect(group('بدر', 'battle').length).toBeGreaterThan(0);
    expect(group('بدر', 'battle').every(hit => 'name' in hit && hit.name.includes('بدر'))).toBe(true);
  });

  it('finds one of the Forty by its words and a Sahih bab by its heading, each with where it opens', () => {
    expect(group('إنما الأعمال بالنيات', 'hadith')).toContainEqual(expect.objectContaining({ book: 'forty', n: 1 }));
    expect(group('سدوا الأبواب', 'hadith')).toContainEqual(expect.objectContaining({ book: 'bukhari', kitab: expect.any(Number) }));
  });
});
