import type { Bookmark } from '@shared/bookmarks';
import { bookmarkKind, type BookmarkKind } from '@shared/bookmarkKind';
import { ayahBookmarkId } from '@shared/ayahMarks';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { aliasesOf, hasTrees } from './branchList';
import { cardsFor, compareTargetsFor, compareTargetsOfAyah, type CompareTarget } from './compare';
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

/**
 * The saved items the app can still show. A saved tree the data review removed has nothing to open, so it is left
 * out quietly; it stays in storage, so it comes back if the tree returns.
 */
export const shownBookmarks = (items: Bookmark[]) => items.filter(item => bookmarkKind(item) !== 'tree' || !!keysOfTree(item.id));

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
    return { id: item.id, text: item.text, kind, references: referencesOf(keys, /\d-\d/.test(item.id)), open: surahs.length ? { tab: 'compare', lead: surahs[0], other, ayat: keys } : null };
  }
  const keys = keysOfTree(item.id);
  return { id: item.id, text: item.text, kind, references: referencesOf(keys ?? []), open: keys ? { tab: 'branches', open: item.id } : null };
}

/**
 * A shelf card's words as the mushaf font draws them. A saved ayah already holds the mushaf page's own words;
 * trees and compare cards hold the corpus spelling, whose marks (such as the small zero over a silent alif) the font has no glyph for.
 */
export const shelfText = (card: Pick<SavedCard, 'kind' | 'text'>) => (card.kind === 'ayah' ? card.text : quranText(card.text));

/**
 * Where else a saved card's ayat can be seen, for its long press: the mushaf, its tree and matrix (or, for an ayah,
 * the trees that hold it) and compare. Only the ones that lead somewhere; `targets` lists the compare pages to pick from.
 */
export type CardWay =
  | { to: 'mushaf'; at: string }
  | { to: 'tree' | 'matrix'; open: Intent | null; tree?: string }
  | { to: 'trees'; ayah: string }
  | { to: 'compare'; targets: CompareTarget[] };

const inMushafOrder = (keys: string[]) => [...keys].sort((p, q) => { const [a, b] = split(p); const [c, d] = split(q); return a - c || b - d; });

export function cardWays(item: Bookmark): CardWay[] {
  const kind = bookmarkKind(item);
  if (kind === 'ayah') {
    const key = item.id.slice('ayah:'.length);
    const [surah, ayah] = split(key);
    if (!surah || !ayah) return [];
    const targets = compareTargetsOfAyah(key);
    return [
      { to: 'mushaf', at: key },
      ...(hasTrees(key) ? [{ to: 'trees' as const, ayah: key }] : []),
      ...(targets.length ? [{ to: 'compare' as const, targets }] : []),
    ];
  }
  if (kind === 'compare') {
    const keys = compareBookmarkAyat(item);
    if (!keys.length) return [];
    const surahs = keys.map(key => split(key)[0]);
    const other = surahs.find(surah => surah !== surahs[0]) ?? surahs[0];
    const group = cardsFor(surahs[0], other).find(card => savedAs(card.id, [item]).length)?.group;
    return [
      { to: 'mushaf', at: inMushafOrder(keys)[0] },
      ...(group ? (['tree', 'matrix'] as const).map(to => ({ to, open: null, tree: group })) : []),
      { to: 'compare', targets: [{ lead: surahs[0], other, ayat: [split(keys[0])[1], split(keys[keys.length - 1])[1]] }] },
    ];
  }
  const keys = keysOfTree(item.id);
  if (!keys) return [];
  const targets = compareTargetsFor(keys);
  return [
    { to: 'mushaf', at: inMushafOrder(keys)[0] },
    { to: 'tree', open: { tab: 'branches', open: item.id } },
    { to: 'matrix', open: { tab: 'branches', open: item.id } },
    ...(targets.length ? [{ to: 'compare' as const, targets }] : []),
  ];
}

/** A forgotten ayah as a homepage card; it opens the reader reviewing from that ayah. */
export function forgottenCard(key: string, text: string): SavedCard {
  const [surah, ayah] = split(key);
  return { id: key, text, kind: 'ayah', references: [{ surah, ayat: [ayah] }], open: { tab: 'read', at: key, recite: true, review: true } };
}

/** The other views of a forgotten ayah: the same as a saved ayah's. */
export const forgottenWays = (key: string) => cardWays({ id: ayahBookmarkId(key), text: '', href: '', savedAt: 0 });
