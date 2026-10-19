import type { BranchAyah } from './branches';
import { normalizeWord } from './normalize';

export type AyahHit = { key: string; page: number; words: string[]; from: number; to: number };
export type AyahSearch = { total: number; hits: AyahHit[] };
export type IndexedAyah = BranchAyah & { exact: string[]; loose: string[] };

const clean = (word: string) => normalizeWord(word).replace(/[^ء-ي\s]/g, '').replace(/\s+/g, ' ').trim();
const loosen = (word: string) => word.replace(/[اء]/g, '');
const queryWords = (text: string) => text.split(/\s+/).map(clean).filter(Boolean);

export const searchable = (query: string) => queryWords(query).join('').length >= 2;

export const indexAyat = (ayat: BranchAyah[]): IndexedAyah[] =>
  ayat.map(ayah => {
    const exact = ayah.words.map(clean);
    return { ...ayah, exact, loose: exact.map(loosen) };
  });

function find(ayat: IndexedAyah[], wanted: string, field: 'exact' | 'loose'): AyahHit[] {
  const hits: AyahHit[] = [];
  for (const ayah of ayat) {
    const keys = ayah[field];
    const text = keys.join(' ');
    const at = text.indexOf(wanted);
    if (at < 0) continue;
    const starts = keys.map((_, index) => keys.slice(0, index).reduce((length, key) => length + key.length + 1, 0));
    const wordAt = (offset: number) => starts.findLastIndex(start => start <= offset);
    const { key, page, words } = ayah;
    hits.push({ key, page, words, from: wordAt(at), to: wordAt(at + wanted.length - 1) });
  }
  return hits;
}

export function searchAyat(ayat: IndexedAyah[], query: string, limit = 30): AyahSearch {
  if (!searchable(query)) return { total: 0, hits: [] };
  const wanted = queryWords(query);
  const exact = find(ayat, wanted.join(' '), 'exact');
  const loose = wanted.map(loosen).filter(Boolean).join(' ');
  const hits = exact.length || !loose ? exact : find(ayat, loose, 'loose');
  return { total: hits.length, hits: hits.slice(0, limit) };
}
