import { describe, expect, it } from 'vitest';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import data from './pairs.json';
import passage from './passagePairs.json';
import treeData from '@/app/quran/branches/trees.json';
import { normalizeWord } from '@/lib/quran/normalize';
import { compareLinkFor, listedPairs, pairCards, reviewPairs, reviewStates } from './pairCards';

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
    const block = pairCards(2, 7).find(card => card.id === '2:57-60|7:160-162')!;
    expect(block.group).toBeDefined();
  });

  it('shows an ayah paired with several far ones as one card, opening on the first', () => {
    const card = pairCards(10, 26).find(item => item.id === '10:72|26:109,127,145,164,180')!;
    expect(card.many?.side).toBe(1);
    expect(card.many?.options.map(option => option.ayah.number)).toEqual([109, 127, 145, 164, 180]);
    expect(card.sides.map(side => side.ayah)).toEqual([72, 109]);
    expect(card.pairs).toHaveLength(5);
    expect(pairCards(10, 26).filter(item => item.id.startsWith('10:72|'))).toHaveLength(1);
    for (const option of card.many!.options) {
      const links = [option.shared, option.ayah].map(ayah => Object.values(ayah.marks ?? {}).map(mark => mark.link).sort());
      expect(links[0].length).toBeGreaterThan(0);
      expect(links[0]).toEqual(links[1]);
    }
  });

  it('works in both directions and leaves pairs inside a range alone', () => {
    const reversed = pairCards(26, 34).find(item => item.id === '26:109,127,145,164,180|34:47')!;
    expect(reversed.many?.side).toBe(0);
    expect(reversed.sides.map(side => side.ayah)).toEqual([109, 47]);
    const moses = pairCards(7, 26).find(card => card.id === '7:106-125|26:31-50')!;
    expect(moses.many).toBeUndefined();
    expect(pairCards(7, 26).some(card => card.many?.options.some(option => moses.pairs!.some(pair => pair.id === option.id)))).toBe(false);
  });

  it('puts every pair on exactly one card, with verdicts per pair in review', () => {
    const count = new Map<string, number>();
    for (const card of pairCards(2, 3, true)) for (const id of card.pairs?.map(pair => pair.id) ?? [card.id]) count.set(id, (count.get(id) ?? 0) + 1);
    expect(count.size).toBe(78);
    expect([...count.values()].every(n => n === 1)).toBe(true);
    const many = pairCards(10, 26, true).find(item => item.id === '10:72|26:109,127,145,164,180')!;
    expect(many.verdict).toBeUndefined();
    expect(many.pairs?.every(pair => pair.verdict)).toBe(true);
  });

  it('keeps a pair marked alone on its own card', () => {
    const ids = pairCards(7, 11).map(card => card.id);
    expect(ids).toContain('7:70|11:62');
    expect(ids.some(id => id.startsWith('7:70-'))).toBe(false);
    expect(pairCards(7, 11).find(card => card.id === '7:70|11:62')?.pairs).toBeUndefined();
  });

  it('merges two runs of one passage when they share an ayah', () => {
    expect(pairCards(69, 101).map(card => card.id)).toContain('69:3-4|101:1-3');
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

  it('lists a page only with three kept pairs, but keeps every engine page in review', () => {
    expect(listedPairs.some(pair => pair.a === 3 && pair.b === 18)).toBe(false);
    expect(reviewPairs.find(pair => pair.a === 3 && pair.b === 18)?.count).toBe(5);
    expect(reviewStates()['3:18']).toBe('checked');
    for (const pair of listedPairs) expect(pair.count).toBeGreaterThanOrEqual(3);
  });

  it('links two ayat of a tree to their compare card only for a kept pair on a listed page', () => {
    expect(compareLinkFor(['2:23', '7:194', '1:1'])).toBe('/quran/compare?a=2&b=7#c-2-23-7-194');
    expect(compareLinkFor(['3:57', '18:30'])).toBeUndefined();
    expect(compareLinkFor(['2:23'])).toBeUndefined();
  });

  it('links a pair inside a range card to the card that holds it', () => {
    expect(compareLinkFor(['7:113', '26:40'])).toBe('/quran/compare?a=7&b=26#c-7-106-26-31');
  });

  describe('passage pairs', () => {
    const ayat = new Map((treeData.ayat as { key: string; words: string[]; lemmas?: (string | null)[]; roots?: (string | null)[] }[]).map(ayah => [ayah.key, ayah]));
    const pairs = passage.pairs as { a: string; b: string; columns: [number, number, string][] }[];

    it('put the lower surah first, and repeat no engine pair', () => {
      const engine = new Set((data.pairs as { a: string; b: string }[]).flatMap(pair => [`${pair.a}|${pair.b}`, `${pair.b}|${pair.a}`]));
      for (const pair of pairs) {
        expect(Number(pair.a.split(':')[0])).toBeLessThan(Number(pair.b.split(':')[0]));
        expect(engine.has(`${pair.a}|${pair.b}`)).toBe(false);
      }
    });

    it('give each matched word the level its lemma and root support', () => {
      for (const pair of pairs) for (const [i, j, level] of pair.columns) {
        const [a, b] = [ayat.get(pair.a)!, ayat.get(pair.b)!];
        const same = normalizeWord(a.words[i]) === normalizeWord(b.words[j]);
        if (level === 'exact') expect(same).toBe(true);
        else if (level === 'lemma') expect(a.lemmas![i]).toBe(b.lemmas![j]);
        else expect(a.roots![i]).toBe(b.roots![j]);
      }
    });

    it('pair a word that recurs in an ayah with the occurrence at the same place', () => {
      const columns = (id: string) => pairs.find(pair => `${pair.a}|${pair.b}` === id)!.columns.map(([i, j]) => [i, j]);
      expect(columns('77:14|82:18')).toEqual(expect.arrayContaining([[2, 3], [0, 1]]));
      expect(columns('56:8|90:18')).toEqual(expect.arrayContaining([[3, 1], [4, 2]]));
    });

    it('recover the Al-Waqi\'ah and Al-Haqqah passage across ayah boundaries', () => {
      expect(pairCards(56, 69).map(card => card.id)).toEqual(expect.arrayContaining(['56:1|69:15', '56:75-80|69:38-43', '56:94|69:31']));
    });
  });

  it('has a verdict only for known pairs, and one for every passage pair', () => {
    const found = new Set(([...data.pairs, ...passage.pairs] as { a: string; b: string }[]).map(pair => [pair.a, pair.b].sort((x, y) => Number(x.split(':')[0]) - Number(y.split(':')[0])).join('|')));
    expect(Object.keys(compareVerdicts).filter(id => !found.has(id))).toEqual([]);
    expect(passage.pairs.filter(pair => !compareVerdicts[`${pair.a}|${pair.b}`])).toEqual([]);
  });

  it('marks words that share only a root lightly, apart from same-word matches', () => {
    const card = pairCards(2, 3).find(card => card.id === '2:66|3:138')!;
    const kinds = card.sides.map(side => Object.entries(side.ayat[0].marks ?? {}).map(([i, mark]) => `${side.ayat[0].words[Number(i)]}:${mark.kind}`));
    expect(kinds[0]).toContain('بَيْنَ:related');
    expect(kinds[1].filter(entry => entry.endsWith(':related'))).toHaveLength(1);
  });

  it('matches words whose order crosses, and words the corpus spells apart', () => {
    const option = pairCards(2, 3).flatMap(card => card.many?.options ?? []).find(item => item.id === '2:135|3:67')!;
    const [a, b] = [option.shared.marks ?? {}, option.ayah.marks ?? {}];
    // هودا ↔ يهوديا and نصارى ↔ نصرانيا
    expect([a[2]?.link, a[4]?.link]).toEqual([b[3]?.link, b[5]?.link]);
    expect(a[2]?.kind).toBe('root');
    // إبراهيم has no root but is a name: matched although it comes after هودا in one ayah and before يهوديا in the other
    expect(a[9]?.link).toBeDefined();
    expect(a[9]?.link).toBe(b[2]?.link);
  });
});
