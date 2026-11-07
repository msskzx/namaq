import { describe, expect, it } from 'vitest';
import source from '@/app/quran/branches/trees.json';
import data from '@/app/quran/compare/pairs.json';
import type { BranchAyah } from '../branches';
import { rootWeights, similarAyahPair, type SimilarAyahPair } from './similar';

const ayat = new Map((source.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
const weights = rootWeights(source.ayat as BranchAyah[]);
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
    for (const keys of ['7:61|26:23', '7:61|26:47', '7:61|26:188', '7:5|26:41']) expect(byKeys.has(keys)).toBe(false);
  });

  it('stores exactly what the engine finds today', () => {
    for (const pair of stored.filter((_, i) => i % 50 === 0)) expect(similarAyahPair(ayat.get(pair.a)!, ayat.get(pair.b)!, weights)).toEqual(pair);
  });

  it('pairs only ayat of different surahs, once each', () => {
    expect(byKeys.size).toBe(stored.length);
    for (const pair of stored) expect(pair.a.split(':')[0]).not.toBe(pair.b.split(':')[0]);
  });
});
