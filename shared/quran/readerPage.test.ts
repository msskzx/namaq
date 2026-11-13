import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import surahs from '../data/quran/surahs.json';
import { ayahWords, mushafPages, pageGroups, type MushafPage } from './readerPage';

const page = (n: number): MushafPage => JSON.parse(readFileSync(join(__dirname, '../data/quran/mushaf', `${n}.json`), 'utf8'));
const top = (n: number) => surahs.findLast(row => row.page != null && row.page < n)?.number;
const starts = mushafPages(Array.from({ length: 604 }, (_, i) => page(i + 1)));
const words = (key: string) => { const at = starts.get(key)!; return ayahWords(key, page(at), top(at)); };

describe('ayahWords', () => {
  it('reads one ayah from the page it starts on', () => {
    const fatiha = page(1).items.filter(item => 'line' in item).map(item => (item as { line: (string | number)[] }).line);
    expect(words('1:1')).toEqual(fatiha[0].slice(0, 4));
    expect(words('1:3')).toEqual(fatiha[2].slice(0, 2));
    expect(words('1:7')).toEqual([...fatiha[4].slice(3), ...fatiha[5], ...fatiha[6].slice(0, -1)]);
    expect(words('112:1')).toHaveLength(4);
  });

  it('needs no next page: every page opens on an ayah’s first word', () => {
    for (let n = 2; n <= 604; n++) {
      const first = pageGroups(page(n).items, top(n)).find(line => line?.length)![0];
      expect(starts.get(`${first.surah}:${first.ayah}`), `page ${n}`).toBe(n);
    }
  });
});
