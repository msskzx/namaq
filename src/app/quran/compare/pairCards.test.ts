import { describe, expect, it } from 'vitest';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import data from './pairs.json';
import { listedPairs, pairCards } from './pairCards';

describe('compare pair cards', () => {
  it('shows At-Tur and Al-Qalam as six single-ayah cards with marks inside each ayah', () => {
    const cards = pairCards(68, 52);
    expect(cards.map(card => card.sides.map(side => `${side.surah}:${side.ayah}`).join('~'))).toEqual(['52:17~68:34', '52:25~68:30', '52:29~68:2', '52:34~68:41', '52:40~68:46', '52:41~68:47']);
    for (const side of cards.flatMap(card => card.sides)) for (const index of Object.keys(side.ayat[0].marks ?? {})) expect(Number(index)).toBeLessThan(side.ayat[0].words.length);
  });

  it('gives both words of a match the same link', () => {
    for (const card of pairCards(7, 26)) {
      const links = card.sides.map(side => Object.values(side.ayat[0].marks ?? {}).map(mark => mark.link).sort());
      expect(links[0]).toEqual(links[1]);
      expect(links[0].length).toBeGreaterThan(0);
    }
  });

  it('leaves out pairs a reader judged to share only vocabulary, and shows them with their verdict in review', () => {
    const ids = (cards: ReturnType<typeof pairCards>) => cards.map(card => card.id);
    const dropped = ['2:107|3:29', '2:116|3:29', '2:116|3:189', '2:121|3:100'];
    for (const id of dropped) expect(compareVerdicts[id]?.keep).toBe(false);
    expect(ids(pairCards(2, 3))).not.toEqual(expect.arrayContaining([dropped[0]]));
    expect(ids(pairCards(2, 3))).toEqual(expect.arrayContaining(['2:66|3:138', '2:127|3:35']));
    const review = pairCards(2, 3, true);
    expect(review.length).toBe(78);
    expect(review.find(card => card.id === '2:107|3:29')?.verdict?.keep).toBe(false);
    expect(listedPairs.find(pair => pair.a === 2 && pair.b === 3)?.count).toBe(pairCards(2, 3).length);
  });

  it('has a verdict only for pairs the engine finds', () => {
    const found = new Set((data.pairs as { a: string; b: string }[]).map(pair => [pair.a, pair.b].sort((x, y) => Number(x.split(':')[0]) - Number(y.split(':')[0])).join('|')));
    expect(Object.keys(compareVerdicts).filter(id => !found.has(id))).toEqual([]);
  });

  it('marks words that share only a root lightly, apart from same-word matches', () => {
    const card = pairCards(2, 3).find(card => card.id === '2:66|3:138')!;
    const kinds = card.sides.map(side => Object.entries(side.ayat[0].marks ?? {}).map(([i, mark]) => `${side.ayat[0].words[Number(i)]}:${mark.kind}`));
    expect(kinds[0]).toContain('بَيْنَ:related');
    expect(kinds[1].filter(entry => entry.endsWith(':related'))).toHaveLength(1);
  });

  it('matches words whose order crosses, and words the corpus spells apart', () => {
    const card = pairCards(2, 3).find(card => card.id === '2:135|3:67')!;
    const [a, b] = card.sides.map(side => side.ayat[0].marks ?? {});
    // هودا ↔ يهوديا and نصارى ↔ نصرانيا
    expect([a[2]?.link, a[4]?.link]).toEqual([b[3]?.link, b[5]?.link]);
    expect(a[2]?.kind).toBe('root');
  });
});
