import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahPairs, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair } from '@/lib/quran/mutashabih/pairs';
import type { SimilarAyahPair } from '@/lib/quran/mutashabih/similar';
import { keptPair, verdictFor, type Verdict } from '@/lib/quran/curation/comparePairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import data from './pairs.json';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
const found = ayahPairs(data.pairs as SimilarAyahPair[], groups);
/** Curation runs after the engine: pairs a reader judged to share only vocabulary are left out. */
const bySurah = pairsBySurah(found.filter(keptPair));
const foundBySurah = pairsBySurah(found);

/** Every surah pair the engine links, by the compare criteria, often enough to get its own page. */
export const listedPairs = surahPairs(bySurah);

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
export type PairCard = { id: string; group?: string; verdict?: Verdict; sides: [CardSide, CardSide] };

function side(key: string, pair: AyahPair, which: 'a' | 'b'): CardSide {
  const marks: SpreadAyah['marks'] = {};
  // Root-only matches are marked lightly: words sharing a root can differ in meaning («بين» and «بيان»).
  pair.columns.forEach((column, index) => {
    marks[column[which].index] = { kind: column.level === 'root' ? 'related' : column.level === 'lemma' ? 'root' : 'exact', link: String(index) };
  });
  const ayah = Number(key.split(':')[1]);
  return { surah: surahOf(key), ayah, ayat: [{ number: ayah, words: words.get(key) ?? [], marks }] };
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order.
 *  `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  return pairsFor(review ? foundBySurah : bySurah, x, y).map(pair => {
    const verdict = review ? verdictFor(pair.a, pair.b) : undefined;
    return {
      id: `${pair.a}|${pair.b}`,
      ...(pair.group ? { group: pair.group } : {}),
      ...(verdict ? { verdict } : {}),
      sides: [side(pair.a, pair, 'a'), side(pair.b, pair, 'b')],
    };
  });
}
