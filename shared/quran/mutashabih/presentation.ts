import type { BranchAyah } from '../branches';
import { phrasePresentation } from '../phraseTrees';
import { filteredAyat, groupAyat, type GroupFilters } from './browse';
import { type JuzRange } from '../juz';
import type { Group } from './types';

/**
 * A book's card shows exactly the ayat the book names (owner, 2026-11-20): its rows never read on into the next ayah, even where
 * one row's words are the start of another's. A passage the book names (2:58-59) is already whole in `groupAyat`.
 */
export function groupPresentation(group: Group, ayat: Map<string, BranchAyah>, range: JuzRange | null = null, filters: GroupFilters = {}) {
  const visible = filteredAyat(ayat, filters, range);
  const passages = new Map(groupAyat(group, ayat).map(ayah => [ayah.key, ayah]));
  const corpus = [...ayat.values()].map(ayah => passages.get(ayah.key) ?? ayah);
  return phrasePresentation(group.tree, corpus, true, !group.citations.length, key => visible.has(key));
}
