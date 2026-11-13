import { branchInventory } from '@shared/quran/branchInventory';
import { branchesHref } from '@shared/quran/branches';
import type { WordDifference } from '@shared/quran/qiraat';
import { qiraatOf } from '@shared/quran/qiraatData';
import type { MushafPage } from '@shared/quran/readerPage';
import { compareLinksOfAyah, type CompareLink } from '../compare/pairCards';

/**
 * Where an ayah's long press leads beyond the reader: its compare cards, the trees that hold it (the branches page's own
 * list), and how the ten readers differ in its words (sent with the page, so the 300 KB of readings stay on the server).
 */
export type AyahLink = { compare: CompareLink[]; trees?: string; qiraat?: WordDifference[] };
export type AyahLinks = Record<string, AyahLink>;

let treeAyat: Set<string> | undefined;
const inTrees = (key: string) => (treeAyat ??= new Set(branchInventory({}, null).flatMap(piece => piece.keys))).has(key);

/** The ayah keys a mushaf page shows: each ayah number on it, in the surah the page has reached. */
export function pageAyat(data: MushafPage, top?: number): string[] {
  let surah = top ?? 0;
  const keys: string[] = [];
  for (const item of data.items) {
    if ('surah' in item) surah = item.surah;
    else if ('line' in item) for (const part of item.line) if (typeof part === 'number') keys.push(`${surah}:${part}`);
  }
  return keys;
}

/** The links of these ayat, only for those that have any. */
export function ayahLinksFor(keys: string[]): AyahLinks {
  return Object.fromEntries(keys.flatMap(key => {
    const compare = compareLinksOfAyah(key);
    const trees = inTrees(key) ? branchesHref('', undefined, { ayah: key }) : undefined;
    const qiraat = qiraatOf(key);
    return compare.length || trees || qiraat.length ? [[key, { compare, ...(trees ? { trees } : {}), ...(qiraat.length ? { qiraat } : {}) }]] : [];
  }));
}
