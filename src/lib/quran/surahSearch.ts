import { compactKeys, compactQuery } from './searchText';

/** One surah search for the reader index, the branches pane and the compare pickers. */
export type SearchableSurah = { number: number; name: string; nameTransliterated?: string | null };

const westernDigits = (text: string) => text.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x6f0));
const SURAH = /^سوره/;
const arabicKeys = (text: string) => compactKeys(text).map(value => value.replace(SURAH, ''));

export const latinKey = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/o/g, 'u')
    .replace(/e/g, 'i')
    .replace(/w/g, 'u')
    .replace(/y/g, 'i')
    .replace(/([dgkst])h/g, '$1')
    .replace(/(.)\1+/g, '$1')
    .replace(/(..)h$/, '$1');
const skeleton = (value: string) => value.replace(/[aiu]/g, '');

const nameKeys = new Map<string, string[]>();
const keysOf = (name: string) => {
  let keys = nameKeys.get(name);
  if (!keys) nameKeys.set(name, keys = arabicKeys(name));
  return keys;
};

/**
 * Rank of a surah for a query, or null when it does not match: 0 whole name or
 * number, 1 name or number starting with the query, 2 name holding it, 3 a
 * transliteration match. Names match by their Quran spellings (الرحمن,
 * الرحمان) with or without the article or the word سورة.
 */
export function surahRank(surah: SearchableSurah, query: string): number | null {
  const trimmed = westernDigits(query.trim());
  if (!trimmed) return 0;
  if (/^\d+$/.test(trimmed)) return String(surah.number) === trimmed ? 0 : String(surah.number).startsWith(trimmed) ? 1 : null;
  if (/[؀-ۿ]/.test(trimmed)) {
    const wanted = compactQuery(trimmed).map(value => value.replace(SURAH, ''));
    if (!wanted.length || wanted.every(value => !value)) return 0;
    let best: number | null = null;
    for (const name of keysOf(surah.name)) for (const value of wanted) {
      if (!value) continue;
      const rank = name === value || name === `ال${value}` ? 0 : name.startsWith(value) || name.startsWith(`ال${value}`) ? 1 : name.includes(value) ? 2 : null;
      if (rank !== null && (best === null || rank < best)) best = rank;
    }
    return best;
  }
  const latin = latinKey(trimmed);
  if (!latin) return null;
  const name = latinKey(surah.nameTransliterated ?? '');
  if (!name) return null;
  const bare = (value: string) => value.replace(/^al/, '');
  if (bare(name) === bare(latin)) return 0;
  if (name.startsWith(latin) || (bare(latin) && bare(name).startsWith(bare(latin)))) return 1;
  if (name.includes(latin)) return 2;
  return skeleton(latin).length >= 3 && skeleton(name).includes(skeleton(latin)) ? 3 : null;
}

export const matchesSurah = (surah: SearchableSurah, query: string) => surahRank(surah, query) !== null;

export function searchSurahs<T extends SearchableSurah>(surahs: T[], query: string): T[] {
  return surahs
    .map(surah => ({ surah, rank: surahRank(surah, query) }))
    .filter((found): found is { surah: T; rank: number } => found.rank !== null)
    .sort((a, b) => a.rank - b.rank)
    .map(found => found.surah);
}

/** Is the query the surah's whole name, article aside? */
export const sameSurahName = (surah: SearchableSurah, query: string) => surahRank(surah, query) === 0 && !/^\d+$/.test(westernDigits(query.trim()));
