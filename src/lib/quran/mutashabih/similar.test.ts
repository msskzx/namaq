import { describe, expect, it } from 'vitest';
import source from '@/app/quran/branches/trees.json';
import data from '@/app/quran/compare/pairs.json';
import type { BranchAyah } from '../branches';
import { crossingColumns, rootWeights, similarAyahPair, withAliases, type SimilarAyahPair } from './similar';

const ayat = new Map((source.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
const weights = rootWeights((source.ayat as BranchAyah[]).map(withAliases));
const stored = data.pairs as SimilarAyahPair[];
const byKeys = new Map(stored.map(pair => [`${pair.a}|${pair.b}`, pair]));

describe('compare criteria on the engine', () => {
  it('links At-Tur and Al-Qalam where the ayat share their wording, not where only a root repeats', () => {
    const found = stored.filter(pair => pair.a.startsWith('52:') && pair.b.startsWith('68:')).map(pair => `${pair.a}~${pair.b}`);
    expect(found).toEqual(['52:17~68:34', '52:25~68:30', '52:29~68:2', '52:34~68:41', '52:40~68:46', '52:41~68:47']);
    expect(similarAyahPair(ayat.get('52:17')!, ayat.get('68:2')!, weights)).toBeNull();
  });

  it('keeps short ayat whose content words all match', () => {
    expect(byKeys.has('15:40|38:83')).toBe(true);
  });

  it('does not link ayat that share only common words such as «قال» and «رب العالمين»', () => {
    for (const keys of ['7:61|26:23', '7:61|26:47', '7:61|26:188', '7:5|26:41', '2:67|7:28', '2:8|24:47']) expect(byKeys.has(keys)).toBe(false);
  });

  it('stores exactly what the engine finds today', () => {
    for (const pair of stored.filter((_, i) => i % 50 === 0)) expect(similarAyahPair(ayat.get(pair.a)!, ayat.get(pair.b)!, weights)).toEqual(pair);
  });

  it('pairs only ayat of different surahs, once each', () => {
    expect(byKeys.size).toBe(stored.length);
    for (const pair of stored) expect(pair.a.split(':')[0]).not.toBe(pair.b.split(':')[0]);
  });

  it('matches same-lemma words whose order crosses, after the in-order alignment, and only content words', () => {
    const ayah = (key: string, lemmas: (string | null)[]) => ({ key, page: 1, words: lemmas.map(l => l ?? '-'), lemmas, roots: lemmas.map(l => (l ? `r${l}` : null)) });
    const a = ayah('1:1', ['x', 'y', null, 'z']);
    const b = ayah('2:1', ['z', null, 'x', 'y']);
    expect(crossingColumns(a, b, [[0, 2, 'exact'], [1, 3, 'exact']])).toEqual([[3, 0, 'lemma']]);
  });

  it('then matches crossing words that share only a root (الظالمون / أظلم in 3:94 and 10:17)', () => {
    const pair = byKeys.get('3:94|10:17');
    expect(pair?.columns).toContainEqual([10, 1, 'root']);
    const a = { key: '1:1', page: 1, words: ['a', 'b'], lemmas: ['ZaAlim', 'x'], roots: ['Zlm', 'rx'] };
    const b = { key: '2:1', page: 1, words: ['c', 'd'], lemmas: ['>aZolam', 'x'], roots: ['Zlm', 'rx'] };
    expect(crossingColumns(a, b, [[1, 1, 'exact']])).toEqual([[0, 0, 'root']]);
  });

  it('gives يهوديا the lemma and root of هودا', () => {
    const fixed = withAliases({ key: '3:67', page: 1, words: ['يهوديا'], lemmas: ['yahuwdiy~'], roots: [null] });
    expect([fixed.lemmas?.[0], fixed.roots?.[0]]).toEqual(['huwd2', 'hwd']);
  });
});
