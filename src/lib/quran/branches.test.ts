import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { branch, listOpenings, openingId, readerAyat, sharedOpenings, type Branch, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';

const all = ayat as BranchAyah[];
const groups = sharedOpenings(all);
const shape = (node: Branch): unknown => ({ words: node.words.map(normalizeWord).join(' '), ayat: node.ayat, children: node.children.map(shape) });
const ayah = (key: string, text: string): BranchAyah => ({ key, page: 1, words: text.split(' ') });

describe('readerAyat', () => {
  it('reads the ayat in page order, skipping tokens that are only marks', () => {
    const read = readerAyat([
      { juz: 1, items: [{ surah: 1 }, { line: ['بِسْمِ', 'ٱللَّهِ', 1, 'ٱلْحَمْدُ'] }] },
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
    const shared = sharedOpenings([ayah('1:1', 'إِنَّ ٱللَّهَ غفور'), { key: '1:2', page: 1, words: ['۞ إِنَّ', 'ٱللَّهَ ۖ', 'عليم'] }]);
    expect([...shared.keys()]).toEqual(['ان الله']);
    expect(branch(shared.get('ان الله')!).children).toHaveLength(2);
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
