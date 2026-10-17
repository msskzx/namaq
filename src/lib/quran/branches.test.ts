import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { branch, listOpenings, listPhrases, openingId, readerAyat, sharedOpenings, startingWith, type Branch, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';

const all = ayat as BranchAyah[];
const groups = sharedOpenings(all);
const shape = (node: Branch): unknown => ({ words: node.words.map(normalizeWord).join(' '), ayat: node.ayat, children: node.children.map(shape) });
const ayah = (key: string, text: string): BranchAyah => ({ key, page: 1, words: text.split(' ') });

describe('readerAyat', () => {
  it('reads the ayat in page order, dropping the marks the reader sets beside a word', () => {
    const read = readerAyat([
      { juz: 1, items: [{ surah: 1 }, { line: ['۞ بِسْمِ', 'ٱللَّهِ ۖ', 1, 'ٱلْحَمْدُ'] }] },
      { juz: 1, items: [{ line: ['لِلَّهِ', 'ۛ', 2] }, { surah: 2 }, { line: ['الٓمٓ', 1] }] },
    ]);
    expect(read).toEqual([
      { key: '1:1', page: 1, words: ['بِسْمِ', 'ٱللَّهِ'] },
      { key: '1:2', page: 2, words: ['ٱلْحَمْدُ', 'لِلَّهِ'] },
      { key: '2:1', page: 2, words: ['الٓمٓ'] },
    ]);
  });
});

describe('sharedOpenings', () => {
  it('groups only ayat whose first two words match another ayah', () => {
    const shared = sharedOpenings([ayah('1:1', 'قال رب'), ayah('1:2', 'قَالَ رَبِّ ٱغفر'), ayah('1:3', 'قال'), ayah('1:4', 'قال موسى')]);
    expect([...shared.keys()]).toEqual(['قال رب']);
    expect(shared.get('قال رب')!.map(a => a.key)).toEqual(['1:1', '1:2']);
    expect(openingId(ayah('1:3', 'قال'))).toBeNull();
  });

  it('ignores the pause and section marks the reader keeps beside a word', () => {
    const read = readerAyat([{ juz: 1, items: [{ surah: 2 }, { line: ['۞ إِنَّ', 'ٱللَّهَ ۖ', 'عليم', 1, 'إِنَّ', 'ٱللَّهَ', 'غفور', 2] }] }]);
    const shared = sharedOpenings(read);
    expect(listOpenings(shared)).toEqual([{ id: 'ان الله', text: 'إِنَّ ٱللَّهَ', count: 2 }]);
    expect(branch(shared.get('ان الله')!).words).toEqual(['إِنَّ', 'ٱللَّهَ']);
  });

  it('matches what npm run quran:branches writes from the reader pages', () => {
    const pages = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/data', `${i + 1}.json`), 'utf8')));
    expect([...sharedOpenings(readerAyat(pages)).values()].flat()).toEqual(all);
  });

  it('keeps every committed ayah in a group of two or more', () => {
    expect(groups.size).toBe(781);
    expect([...groups.keys()].every(id => id === id.trim() && !id.includes('  '))).toBe(true);
    expect([...groups.values()].flat()).toHaveLength(all.length);
  });

  it('lists the largest openings first', () => {
    const list = listOpenings(groups);
    expect(list[0]).toMatchObject({ id: 'يايها الذين', count: 90 });
    expect(list.every((o, i) => i === 0 || list[i - 1].count >= o.count)).toBe(true);
  });
});

describe('branch', () => {
  it('splits the six ayat that open with إن المتقين where their wording parts', () => {
    expect(shape(branch(groups.get('ان المتقين')!))).toEqual({
      words: 'ان المتقين في',
      ayat: [],
      children: [
        {
          words: 'جنت',
          ayat: [],
          children: [
            { words: 'وعيون', ayat: ['15:45', '51:15'], children: [] },
            { words: 'ونعيم', ayat: ['52:17'], children: [] },
            { words: 'ونهر', ayat: ['54:54'], children: [] },
          ],
        },
        { words: 'مقام امين', ayat: ['44:51'], children: [] },
        { words: 'ظلل وعيون', ayat: ['77:41'], children: [] },
      ],
    });
  });

  it('lists an ayah that ends where a longer one goes on', () => {
    expect(shape(branch([ayah('1:1', 'قال رب'), ayah('1:2', 'قال رب اغفر لي'), ayah('1:3', 'قال رب انصرني')]))).toEqual({
      words: 'قال رب',
      ayat: ['1:1'],
      children: [
        { words: 'اغفر لي', ayat: ['1:2'], children: [] },
        { words: 'انصرني', ayat: ['1:3'], children: [] },
      ],
    });
  });

  it('places every ayah of a group on exactly one node', () => {
    const keys = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keys)];
    for (const group of groups.values()) expect(keys(branch(group)).sort()).toEqual(group.map(a => a.key).sort());
  });
});

describe('listPhrases', () => {
  const phrases = listPhrases(groups);
  const count = (id: string) => phrases.find(p => p.id === id)?.count;

  it('lists every opening and every phrase two or more ayat share before they part', () => {
    expect(count('الم تر')).toBe(31);
    expect(count('الم تر كيف')).toBe(3);
    expect(count('الم تر كيف فعل ربك')).toBe(2);
    expect(count('ان المتقين في')).toBe(6);
    expect(count('ان المتقين في جنت')).toBe(4);
    expect(count('ان المتقين في جنت وعيون')).toBe(2);
    expect(phrases.every(p => p.count >= 2)).toBe(true);
    expect(new Set(phrases.map(p => p.id)).size).toBe(phrases.length);
  });

  it('agrees with startingWith on how many ayat each phrase opens', () => {
    for (const p of phrases.filter((_, i) => i % 40 === 0)) expect(startingWith(all, p.id)).toHaveLength(p.count);
  });
});

describe('startingWith', () => {
  it('matches whole words only', () => {
    expect(startingWith([ayah('1:1', 'الم تروا'), ayah('1:2', 'الم تر كيف')], 'الم تر').map(a => a.key)).toEqual(['1:2']);
  });
});
