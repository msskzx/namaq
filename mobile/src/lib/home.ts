import type { Bookmark } from '@shared/bookmarks';
import { bookmarkKind, type BookmarkKind } from '@shared/bookmarkKind';
import { compareBookmarkAyat } from '@shared/compareBookmarks';
import { aliasesOf } from './branchList';
import { treeList } from './branches';
import type { Intent } from './intent';
import { quranText } from './quranText';

export type Reference = { surah: number; ayat: number[]; range?: boolean };
export type SavedCard = { id: string; text: string; kind: BookmarkKind; references: Reference[]; open: Intent | null };

let treeKeys: Map<string, string[]> | undefined;
/** Each tree's ayat under its id and the ids the website saved it under. */
const keysOfTree = (id: string) => {
  if (!treeKeys) {
    treeKeys = new Map();
    for (const piece of treeList()) for (const name of [piece.id, ...aliasesOf(piece)]) if (name && !treeKeys.has(name)) treeKeys.set(name, piece.keys);
  }
  return treeKeys.get(id);
};

const split = (key: string) => key.split(':').map(Number) as [number, number];

/** The ayat a saved card names, by surah in mushaf order, as the website's homepage lists them. */
export function referencesOf(keys: string[], range = false): Reference[] {
  const bySurah = new Map<number, number[]>();
  [...new Set(keys)].map(split).sort(([a, b], [c, d]) => a - c || b - d).forEach(([surah, ayah]) => bySurah.set(surah, [...(bySurah.get(surah) ?? []), ayah]));
  return [...bySurah].map(([surah, ayat]) => ({ surah, ayat, ...(range && ayat.length > 1 ? { range: true } : {}) }));
}

/** A homepage shelf card: what it is, which ayat it holds, and where in the app it opens. */
export function savedCard(item: Bookmark): SavedCard {
  const kind = bookmarkKind(item);
  if (kind === 'ayah') {
    const key = item.id.slice('ayah:'.length);
    const [surah, ayah] = split(key);
    return { id: item.id, text: item.text, kind, references: surah && ayah ? [{ surah, ayat: [ayah] }] : [], open: surah && ayah ? { tab: 'read', at: key } : null };
  }
  if (kind === 'compare') {
    const keys = compareBookmarkAyat(item);
    const surahs = keys.map(key => split(key)[0]);
    const other = surahs.find(surah => surah !== surahs[0]) ?? surahs[0];
    return { id: item.id, text: item.text, kind, references: referencesOf(keys, /\d-\d/.test(item.id)), open: surahs.length ? { tab: 'compare', lead: surahs[0], other } : null };
  }
  const keys = keysOfTree(item.id);
  return { id: item.id, text: item.text, kind, references: referencesOf(keys ?? []), open: keys ? { tab: 'branches', open: item.id } : null };
}

/**
 * A shelf card's words as the mushaf font draws them. A saved ayah already holds the mushaf page's own words;
 * trees and compare cards hold the corpus spelling, whose marks (such as the small zero over a silent alif) the font has no glyph for.
 */
export const shelfText = (card: Pick<SavedCard, 'kind' | 'text'>) => (card.kind === 'ayah' ? card.text : quranText(card.text));
