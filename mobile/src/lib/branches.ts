import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { branchInventory, type BranchPiece } from '@shared/quran/branchInventory';
import { treeContexts } from '@shared/quran/ayahContext';
import { branchesHref, type Branch, type BranchAyah, type Variant } from '@shared/quran/branches';
import { readBookmarks, toggleBookmark } from '@shared/bookmarks';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import { phrasePresentation } from '@shared/quran/phraseTrees';

export type Presentation = { tree: Branch; prefixes: Variant[]; offsets: Record<string, number>; ayat: BranchAyah[] };
/** For each ayah in a tree, which of its word positions every ayah shares exactly or by root. */
export type Matches = Record<string, { exact: Set<number>; rooted: Set<number> }>;
export type TreeCard = { piece: BranchPiece; presentation: Presentation; matches: Matches };

export const surahs = surahRows;
export const surahNames: Record<number, string> = Object.fromEntries(surahs.map(row => [row.number, row.name]));

let ayatByKey: Map<string, BranchAyah> | undefined;
export const ayahOf = (key: string) => (ayatByKey ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]))).get(key);

/** The trees of the website's default branches list, in mushaf order. */
export const treeList = (): BranchPiece[] => branchInventory({}, null);

const cards = new Map<string, TreeCard>();

/** The tree drawn on a card, built the same way as the website's branches page with no filters. */
export function cardOf(piece: BranchPiece): TreeCard {
  const cached = cards.get(piece.id);
  if (cached) return cached;
  ayahOf('1:1');
  const presentation: Presentation = piece.group ? groupPresentation(piece.group, ayatByKey!) : phrasePresentation(piece.phrase, corpus.ayat as BranchAyah[], true, true);
  const matches: Matches = Object.fromEntries(treeContexts(presentation.ayat).map(context => [context.ayah.key, { exact: new Set(context.match?.exact), rooted: new Set(context.match?.rooted) }]));
  const card = { piece, presentation, matches };
  if (cards.size > 40) cards.delete(cards.keys().next().value!);
  cards.set(piece.id, card);
  return card;
}

/** The other ids a tree was saved under on the website, so a saved tree reads as saved whichever id holds it. */
export const aliasesOf = (piece: BranchPiece) => [...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];
export const isSaved = (piece: BranchPiece, list = readBookmarks()) => {
  const ids = new Set([piece.id, ...aliasesOf(piece)]);
  return list.some(item => ids.has(item.id));
};
export const toggleSaved = (piece: BranchPiece) => toggleBookmark({ id: piece.id, text: piece.text, href: branchesHref(piece.id) }, aliasesOf(piece));
export const WEBSITE = 'https://namaq.vercel.app';
