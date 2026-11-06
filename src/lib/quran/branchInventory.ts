import corpus from '@/app/quran/branches/trees.json';
import type { BranchAyah, Opening } from './branches';
import { buildPhraseGroups, type TreeGroup } from './phraseTrees';
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
  const result = distinctBranchPieces(entries);
  if (inventories.size >= 16) inventories.delete(inventories.keys().next().value!);
  inventories.set(cacheKey, result);
  return result;
}
