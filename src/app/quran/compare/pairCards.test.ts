import { describe, expect, it } from 'vitest';
import treeData from '@/app/quran/branches/trees.json';
import { pairCards } from './pairCards';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));

describe('compare pair cards', () => {
  it('splits a two-ayah side into its ayat and puts each mark on its own ayah', () => {
    const card = pairCards(7, 2).find(card => card.sides[0].from === 58)!;
    const [baqara, araf] = card.sides;
    expect([baqara.surah, baqara.from, baqara.to, araf.surah, araf.from, araf.to]).toEqual([2, 58, 59, 7, 161, 162]);
    expect(baqara.ayat.map(ayah => ayah.words)).toEqual([words.get('2:58'), words.get('2:59')]);
    for (const side of card.sides) for (const ayah of side.ayat) for (const index of Object.keys(ayah.marks ?? {})) expect(Number(index)).toBeLessThan(ayah.words.length);
    expect(Object.keys(baqara.ayat[1].marks ?? {}).length).toBeGreaterThan(0);
  });

  it('gives both words of a match the same link, and only matched words a mark', () => {
    for (const card of pairCards(7, 26)) {
      const links = card.sides.map(side => side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link)).sort());
      expect(links[0]).toEqual(links[1]);
      expect(links[0].length).toBeGreaterThan(0);
    }
  });
});
