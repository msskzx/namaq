import corpus from '../data/quran/trees.json';
import type { BranchAyah, Opening } from './branches';
import { buildPhraseGroups, type TreeGroup } from './phraseTrees';
import { ALL_KINDS, searchSharedPhrases } from './branchSearch';
import { subtreeIndex } from './subtrees';
import { browseGroups, filteredAyat, type GroupFilters } from './mutashabih/browse';
import { groups } from './mutashabih/data';
import { phraseTreeId } from './mutashabih/identity';
import type { Group } from './mutashabih/types';
import type { JuzRange } from './juz';

export type BranchPiece = Opening & { legacyId: string; legacyIds?: string[]; keys: string[]; phrase: TreeGroup; opening: Opening; group?: Group };
const ayat = new Map<string, BranchAyah>(corpus.ayat.map(ayah => [ayah.key, ayah]));
let words: TreeGroup[] | undefined;
const inventories = new Map<string, BranchPiece[]>();

export function distinctBranchPieces(pieces: BranchPiece[]): BranchPiece[] {
  const buckets = new Map<string, BranchPiece[]>();
  const result: BranchPiece[] = [];
  for (const piece of pieces) {
    const key = piece.group ? piece.group.places.map(place => `${place.key}-${place.through ?? ''}`).sort().join(',') : piece.keys.map(key => `${key}-`).sort().join(',');
    const bucket = buckets.get(key) ?? [];
    const contains = (outer: BranchPiece, inner: BranchPiece) => inner.phrase.occurrences.every(a => outer.phrase.occurrences.some(b => a.key === b.key && b.start <= a.start && b.end >= a.end));
    const existing = bucket.find(other => contains(other, piece) || contains(piece, other));
    if (existing) {
      existing.legacyIds = [...new Set([...(existing.legacyIds ?? []), piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])])];
      continue;
    }
    bucket.push(piece);
    buckets.set(key, bucket);
    result.push(piece);
  }
  return result;
}

const isFamily = (piece: BranchPiece) => !!piece.group && piece.group.kind !== 'shared_phrase';
const trunk = (piece: BranchPiece) => piece.phrase.occurrences[0] ? piece.phrase.occurrences[0].end - piece.phrase.occurrences[0].start : 0;

/**
 * Drops a family (a whole-ayah likeness) when a phrase tree in the same list holds all its ayat on a trunk at least as long:
 * the phrase tree already shows what the family would. The family's ids move to that tree so a saved family still opens.
 */
export function withoutCoveredFamilies(pieces: BranchPiece[]): BranchPiece[] {
  return pieces.filter(piece => {
    if (!isFamily(piece) || piece.group!.citations.length) return true;
    const cover = pieces.find(other => other !== piece && !isFamily(other) && piece.keys.every(key => other.keys.includes(key)) && trunk(other) >= trunk(piece));
    if (!cover) return true;
    cover.legacyIds = [...new Set([...(cover.legacyIds ?? []), piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group!.aliases ?? [])])];
    return false;
  });
}

export function branchInventory(filters: GroupFilters, range: JuzRange | null): BranchPiece[] {
  const effective = { ...filters, categories: filters.categories ?? 'mutashabeh,pondering' };
  const cacheKey = JSON.stringify([effective, range]);
  const cached = inventories.get(cacheKey);
  if (cached) return cached;
  const comparisons = browseGroups(groups, effective, ayat, range);
  const piece = (tree: TreeGroup, group?: Group): BranchPiece => {
    const keys = [...new Set(tree.occurrences.map(occurrence => occurrence.key))];
    const id = phraseTreeId(tree);
    const opening = { id, text: tree.text, textEn: tree.textEn, count: keys.length };
    return { ...opening, legacyId: tree.id, keys, phrase: tree, opening, group };
  };
  const entries = comparisons.map(group => piece(group.tree, group));
  if (effective.categories.split(',').includes('words') && effective.cited !== '1' && !effective.differences && !effective.relations) {
    words ??= [...new Map<string, TreeGroup>([...buildPhraseGroups(corpus.ayat), ...corpus.trees as TreeGroup[], ...subtreeIndex(corpus.trees as TreeGroup[], corpus.subtrees).groups].map(tree => [tree.id, tree])).values()];
    const visible = filteredAyat(ayat, effective, range);
    for (const tree of words) {
      const occurrences = tree.occurrences.filter(occurrence => visible.has(occurrence.key));
      if (new Set(occurrences.map(occurrence => occurrence.key)).size < 2) continue;
      const scoped = piece(tree);
      scoped.phrase = { ...tree, occurrences };
      scoped.keys = [...new Set(occurrences.map(occurrence => occurrence.key))];
      scoped.count = scoped.keys.length;
      scoped.opening = { ...scoped.opening, count: scoped.count };
      entries.push(scoped);
    }
  }
  const result = withoutCoveredFamilies(distinctBranchPieces(entries));
  if (inventories.size >= 16) inventories.delete(inventories.keys().next().value!);
  inventories.set(cacheKey, result);
  return result;
}

export const OUTSIDE_SUGGESTIONS = 5;

/**
 * Trees a search finds that the current filters hide, for the search box's «خارج التصفية الحالية» section.
 * Searched among every kind of tree with no range, surah or saved-only limit; picking one resets the filters to that.
 */
export function outsideMatches(query: string, shown: BranchPiece[], limit = OUTSIDE_SUGGESTIONS): BranchPiece[] {
  if (!query.trim()) return [];
  const seen = new Set(shown.flatMap(piece => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])]));
  const places = (piece: BranchPiece) => [...piece.keys].sort().join(',');
  const shownPlaces = new Set(shown.map(places));
  const hidden = (piece: BranchPiece) => !shownPlaces.has(places(piece)) && ![piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])].some(id => seen.has(id));
  return distinctBranchPieces(searchSharedPhrases(branchInventory({ categories: ALL_KINDS }, null), query)).filter(hidden).slice(0, limit);
}
