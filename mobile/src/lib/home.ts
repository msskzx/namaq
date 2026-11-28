import type { Bookmark } from '@shared/bookmarks';
import { bookmarkKind, type BookmarkKind } from '@shared/bookmarkKind';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { aliasesOf, hasTrees } from './branchList';
import { cardsFor, compareTargetsFor, compareTargetsOfAyah, type CompareTarget } from './compare';
import { ayahOf, treeList } from './branches';
import type { Intent } from './intent';
import { quranText } from './quranText';

export type Reference = { surah: number; ayat: number[]; range?: boolean };
export type SavedCard = { id: string; text: string; kind: BookmarkKind; references: Reference[]; open: Intent | null };

let trees: Map<string, { keys: string[]; text: string }> | undefined;
const treeOf = (id: string) => {
  if (!trees) {
    trees = new Map();
    for (const piece of treeList()) for (const name of [piece.id, ...aliasesOf(piece)]) if (name && !trees.has(name)) trees.set(name, { keys: piece.keys, text: piece.text });
  }
  return trees.get(id);
};
const keysOfTree = (id: string) => treeOf(id)?.keys;

const split = (key: string) => key.split(':').map(Number) as [number, number];

export function referencesOf(keys: string[], range = false): Reference[] {
  const bySurah = new Map<number, number[]>();
  [...new Set(keys)].map(split).sort(([a, b], [c, d]) => a - c || b - d).forEach(([surah, ayah]) => bySurah.set(surah, [...(bySurah.get(surah) ?? []), ayah]));
  return [...bySurah].map(([surah, ayat]) => ({ surah, ayat, ...(range && ayat.length > 1 ? { range: true } : {}) }));
}

export const shownBookmarks = (items: Bookmark[]) => items.filter(item => bookmarkKind(item) !== 'tree' || !!keysOfTree(item.id));

export function savedCard(item: Bookmark): SavedCard {
  const kind = bookmarkKind(item);
  if (kind === 'card') return { id: item.id, text: item.text, kind, references: [], open: null };
  if (kind === 'ayah') {
    const key = item.id.slice('ayah:'.length);
    const [surah, ayah] = split(key);
    return { id: item.id, text: item.text, kind, references: surah && ayah ? [{ surah, ayat: [ayah] }] : [], open: surah && ayah ? { tab: 'read', at: key } : null };
  }
  if (kind === 'compare') {
    const keys = compareBookmarkAyat(item);
    const surahs = keys.map(key => split(key)[0]);
    const other = surahs.find(surah => surah !== surahs[0]) ?? surahs[0];
    const words = keys.length ? ayahOf(keys[0])?.words.slice(0, 6).join(' ') : undefined;
    return { id: item.id, text: words ? `${words} …` : item.text, kind, references: referencesOf(keys, /\d-\d/.test(item.id)), open: surahs.length ? { tab: 'compare', lead: surahs[0], other, ayat: keys } : null };
  }
  const tree = treeOf(item.id);
  const keys = tree?.keys;
  return { id: item.id, text: tree?.text ?? item.text, kind, references: referencesOf(keys ?? []), open: keys ? { tab: 'branches', open: item.id } : null };
}

export const shelfText = (card: Pick<SavedCard, 'text'>) => quranText(card.text);

export type CardWay =
  | { to: 'mushaf'; at: string }
  | { to: 'tree' | 'matrix'; open: Intent | null; tree?: string }
  | { to: 'trees'; ayah: string }
  | { to: 'compare'; targets: CompareTarget[] };

const inMushafOrder = (keys: string[]) => [...keys].sort((p, q) => { const [a, b] = split(p); const [c, d] = split(q); return a - c || b - d; });

export function cardWays(item: Bookmark): CardWay[] {
  const kind = bookmarkKind(item);
  if (kind === 'card') return [];
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

export function noteCard(key: string, text: string): SavedCard {
  const [surah, ayah] = split(key);
  return { id: key, text, kind: 'ayah', references: [{ surah, ayat: [ayah] }], open: { tab: 'read', at: key } };
}

