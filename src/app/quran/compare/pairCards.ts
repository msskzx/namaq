import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahPairs, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair } from '@/lib/quran/mutashabih/pairs';
import type { SimilarAyahPair } from '@/lib/quran/mutashabih/similar';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import data from './pairs.json';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
const bySurah = pairsBySurah(ayahPairs(data.pairs as SimilarAyahPair[], groups));

/** Every surah pair the engine links, by the compare criteria, often enough to get its own page. */
export const listedPairs = surahPairs(bySurah);

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
export type PairCard = { id: string; group?: string; sides: [CardSide, CardSide] };

function side(key: string, pair: AyahPair, which: 'a' | 'b'): CardSide {
  const marks: SpreadAyah['marks'] = {};
  pair.columns.forEach((column, index) => {
    marks[column[which].index] = { kind: column.level === 'lemma' || column.level === 'root' ? 'root' : 'exact', link: String(index) };
  });
  const ayah = Number(key.split(':')[1]);
  return { surah: surahOf(key), ayah, ayat: [{ number: ayah, words: words.get(key) ?? [], marks }] };
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order. */
export function pairCards(x: number, y: number): PairCard[] {
  return pairsFor(bySurah, x, y).map(pair => ({
    id: `${pair.a}|${pair.b}`,
    ...(pair.group ? { group: pair.group } : {}),
    sides: [side(pair.a, pair, 'a'), side(pair.b, pair, 'b')],
  }));
}
