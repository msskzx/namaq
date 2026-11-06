import type { BranchAyah } from '../branches';
import { phrasePresentation } from '../phraseTrees';
import { filteredAyat, groupAyat, type GroupFilters } from './browse';
import { type JuzRange } from '../juz';
import type { Group } from './types';

export function groupPresentation(group: Group, ayat: Map<string, BranchAyah>, range: JuzRange | null = null, filters: GroupFilters = {}) {
  const visible = filteredAyat(ayat, filters, range);
  const passages = new Map(groupAyat(group, ayat).map(ayah => [ayah.key, ayah]));
  const corpus = [...ayat.values()].map(ayah => passages.get(ayah.key) ?? ayah);
  return phrasePresentation(group.tree, corpus, true, true, key => visible.has(key));
}
