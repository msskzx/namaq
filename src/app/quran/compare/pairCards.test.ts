import { describe, expect, it } from 'vitest';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import data from './pairs.json';
import { listedPairs, pairCards } from './pairCards';

describe('compare pair cards', () => {
  it('shows At-Tur and Al-Qalam as five cards, the last two ayat merged, with marks inside each ayah', () => {
    const cards = pairCards(68, 52);
    expect(cards.map(card => card.id)).toEqual(['52:17|68:34', '52:25|68:30', '52:29|68:2', '52:34|68:41', '52:40-41|68:46-47']);
    for (const ayah of cards.flatMap(card => card.sides).flatMap(side => side.ayat)) for (const index of Object.keys(ayah.marks ?? {})) expect(Number(index)).toBeLessThan(ayah.words.length);
  });

  it('merges the Moses and the magicians passage into one range card and leaves far pairs apart', () => {
    const cards = pairCards(7, 26);
    const moses = cards.find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.sides.map(side => side.ayat.map(ayah => ayah.number))).toEqual([Array.from({ length: 20 }, (_, i) => 106 + i), Array.from({ length: 20 }, (_, i) => 31 + i)]);
    expect(moses.pairs?.map(pair => pair.id)).toEqual(expect.arrayContaining(['7:106|26:31', '7:113|26:40', '7:113|26:41', '7:125|26:50']));
    expect(cards.map(card => card.id)).toEqual(expect.arrayContaining(['7:106|26:154', '7:111|26:53']));
  });

  it('gives a range card the tree link of its first pair that has one', () => {
    const block = pairCards(2, 7).find(card => card.id === '2:57-59|7:160-162')!;
    expect(block.group).toBeDefined();
  });

  it('keeps every word link on both sides of a range card', () => {
    for (const card of pairCards(7, 26)) {
      const [a, b] = card.sides.map(side => new Set(side.ayat.flatMap(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link))));
      expect([...a].sort()).toEqual([...b].sort());
    }
  });

  it('keeps a verdict per ayah pair inside a range card in review', () => {
    const moses = pairCards(7, 26, true).find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.verdict).toBeUndefined();
    expect(moses.pairs?.every(pair => pair.verdict?.keep)).toBe(true);
    expect(pairCards(7, 26).find(card => card.id === '7:106-125|26:31-50')?.pairs?.some(pair => pair.verdict)).toBe(false);
  });

  it('counts every ayah pair once across the cards of a page', () => {
    const count = (cards: ReturnType<typeof pairCards>) => cards.reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0);
    for (const pair of listedPairs.slice(0, 50)) expect(count(pairCards(pair.a, pair.b))).toBe(pair.count);
  });

  it('leaves out pairs a reader judged to share only vocabulary, and shows them with their verdict in review', () => {
    const ids = (cards: ReturnType<typeof pairCards>) => cards.map(card => card.id);
    const dropped = ['2:107|3:29', '2:116|3:29', '2:116|3:189', '2:121|3:100'];
    for (const id of dropped) expect(compareVerdicts[id]?.keep).toBe(false);
    expect(ids(pairCards(2, 3))).not.toEqual(expect.arrayContaining([dropped[0]]));
    expect(ids(pairCards(2, 3))).toEqual(expect.arrayContaining(['2:66|3:138', '2:127|3:35']));
    const review = pairCards(2, 3, true);
    expect(review.reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0)).toBe(78);
    expect(review.find(card => card.id === '2:107|3:29')?.verdict?.keep).toBe(false);
    expect(listedPairs.find(pair => pair.a === 2 && pair.b === 3)?.count).toBe(pairCards(2, 3).reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0));
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
    // إبراهيم has no root but is a name: matched although it comes after هودا in one ayah and before يهوديا in the other
    expect(a[9]?.link).toBeDefined();
    expect(a[9]?.link).toBe(b[2]?.link);
  });
});
