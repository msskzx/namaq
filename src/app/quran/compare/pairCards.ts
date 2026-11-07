import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahPairs, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair, type PairSide } from '@/lib/quran/mutashabih/pairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
const bySurah = pairsBySurah(ayahPairs(groups));

/** Every surah pair the متشابه engine links often enough to get its own page. */
export const listedPairs = surahPairs(bySurah);

export type CardSide = { surah: number; from: number; to: number; ayat: SpreadAyah[] };
export type PairCard = { id: string; group: string; sides: [CardSide, CardSide] };

function side(place: PairSide, pair: AyahPair, which: 'a' | 'b'): CardSide {
  const keys = [place.key, ...(place.through ? [place.through] : [])];
  const ayat = keys.map(key => {
    const marks: SpreadAyah['marks'] = {};
    pair.columns.forEach((column, index) => {
      const position = column[which];
      if (position.key === key) marks[position.index] = { kind: column.level === 'lemma' || column.level === 'root' ? 'root' : 'exact', link: String(index) };
    });
    return { number: Number(key.split(':')[1]), words: words.get(key) ?? [], marks };
  });
  return { surah: surahOf(place.key), from: ayat[0].number, to: ayat[ayat.length - 1].number, ayat };
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order. */
export function pairCards(x: number, y: number): PairCard[] {
  return pairsFor(bySurah, x, y).map(pair => ({
    id: `${pair.a.key}-${pair.a.through ?? ''}|${pair.b.key}-${pair.b.through ?? ''}`,
    group: pair.group,
    sides: [side(pair.a, pair, 'a'), side(pair.b, pair, 'b')],
  }));
}
