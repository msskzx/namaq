import type { BranchAyah } from './branches';
import { findText, firstLevel, searchQuery, wordKeys, type WordKeys } from './searchText';

export { searchable } from './searchText';

export type AyahHit = { key: string; page: number; words: string[]; from: number; to: number };
export type AyahSearch = { total: number; hits: AyahHit[] };
/** `keys` per spoken word; `owner` maps each back to its display word (one display word can hold two, e.g. بَعْدَ مَا). */
export type IndexedAyah = BranchAyah & { keys: WordKeys[]; owner: number[] };

export const indexAyat = (ayat: BranchAyah[]): IndexedAyah[] =>
  ayat.map(ayah => {
    const parts = ayah.words.flatMap((word, index) => word.split(/\s+/).map(part => [wordKeys(part), index] as const)).filter(([keys]) => keys.strict.length > 0);
    return { ...ayah, keys: parts.map(([keys]) => keys), owner: parts.map(([, index]) => index) };
  });

/** Ayat holding the query in mushaf order; hamza-loose matches only when nothing matches as typed. */
export function searchAyat(ayat: IndexedAyah[], query: string, limit = 30): AyahSearch {
  const wanted = searchQuery(query);
  if (wanted.strict.join('').length < 2) return { total: 0, hits: [] };
  const hits = firstLevel(wanted, level => ayat.flatMap(({ key, page, words, keys, owner }) => {
    const found = findText(keys, wanted, level);
    return found ? [{ key, page, words, from: owner[found.from], to: owner[found.to] }] : [];
  }));
  return { total: hits.length, hits: hits.slice(0, limit) };
}
