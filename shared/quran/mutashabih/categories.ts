import manifest from './categories.json';
import type { Category, Group } from './types';

const reviewed = new Map(manifest.rules.flatMap(rule => rule.groups.map(id => [id, rule.categories as Category[]] as const)));

export function categorizedGroups(groups: Group[]): Group[] {
  return [
    ...groups.map(group => ({ ...group, categories: reviewed.get(group.id) ?? ['words' as const] })),
    ...manifest.extraComparisons.map(comparison => ({
      id: comparison.id,
      text: comparison.text,
      tree: { id: comparison.id, text: comparison.text, occurrences: comparison.places },
      places: comparison.places,
      categories: comparison.categories as Category[],
      kind: 'shared_phrase' as const,
      tags: [],
      differences: {},
      score: 1,
      citations: [],
      columns: [],
    })),
  ];
}
