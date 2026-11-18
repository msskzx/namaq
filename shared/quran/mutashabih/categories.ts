import manifest from './categories.json';
import type { Category, Group } from './types';

const reviewed = new Map(manifest.rules.flatMap(rule => rule.groups.map(id => [id, rule.categories as Category[]] as const)));

export function categorizedGroups(groups: Group[]): Group[] {
  return [
    // A group a book of mutashabih cites is one of the mutashabihat, whatever the word review said (owner 2026-11-18).
    ...groups.map(group => {
      const categories = reviewed.get(group.id) ?? ['words' as const];
      return { ...group, categories: group.citations.length && !categories.includes('mutashabeh') ? ['mutashabeh' as const, ...categories.filter(category => category !== 'words')] : categories };
    }),
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
