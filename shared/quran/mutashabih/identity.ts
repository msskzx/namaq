import type { Group, Place } from './types';
import type { PhraseGroup } from '../phraseTrees';

const selection = (places: Place[]) => JSON.stringify(places.map(({ key, start, end, through }) => [key, start, end, through ?? '']).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));

export function comparisonId(places: Place[]): string {
  let first = 2166136261;
  let second = 5381;
  for (const character of selection(places)) {
    const code = character.charCodeAt(0);
    first = Math.imul(first ^ code, 16777619);
    second = Math.imul(second, 33) ^ code;
  }
  return `cmp:${(first >>> 0).toString(36).padStart(7, '0')}${(second >>> 0).toString(36).padStart(7, '0')}`;
}

export function canonicalGroups(groups: Group[]): Group[] {
  const selections = new Map<string, string>();
  return groups.map(group => {
    const id = comparisonId(group.places);
    const selected = selection(group.places);
    const existing = selections.get(id);
    if (existing && existing !== selected) throw new Error(`Comparison ID collision: ${id}`);
    selections.set(id, selected);
    return { ...group, id, aliases: [...new Set([group.id, ...(group.aliases ?? [])])].filter(alias => alias !== id), tree: { ...group.tree, id } };
  });
}

export const groupHasId = (group: Group, id: string) => group.id === id || !!group.aliases?.includes(id);

export const phraseTreeId = (tree: PhraseGroup & { family?: boolean }) => tree.family || tree.id.startsWith('cmp:') ? tree.id : `tree:${comparisonId(tree.occurrences).slice(4)}`;
