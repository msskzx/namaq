import manifest from './categories.json';
import type { Category, Group } from './types';

const reviewed = new Map(manifest.rules.flatMap(rule => rule.groups.map(id => [id, rule.categories as Category[]] as const)));

export function kindsOf(cited: boolean, reviewedAs: Category[]): Category[] {
  if (cited) return ['mutashabeh'];
  return [...new Set(reviewedAs.map(category => category === 'mutashabeh' ? 'pondering' as const : category))];
}

export function categorizedGroups(groups: Group[]): Group[] {
  return [
    ...groups.map(group => ({ ...group, categories: kindsOf(group.citations.length > 0, reviewed.get(group.id) ?? ['words']) })),
    ...manifest.extraComparisons.map(comparison => ({
      id: comparison.id,
      text: comparison.text,
      tree: { id: comparison.id, text: comparison.text, occurrences: comparison.places },
      places: comparison.places,
      categories: kindsOf(false, comparison.categories as Category[]),
      kind: 'shared_phrase' as const,
      tags: [],
      differences: {},
      score: 1,
      citations: [],
      columns: [],
    })),
  ];
}
