import type { Column, DifferenceWords, Group, Tag } from './types';

const unique = <T,>(values: T[]) => [...new Set(values)];
const MOST = 3;

/** A book's own example for a tag (a citation's), or the detail a one-tag group was built with: text quoted from a book, not the page. */
export const quotedExample = (group: Pick<Group, 'tags' | 'citations' | 'detail'>, tag: Tag): string | undefined =>
  group.citations.find(citation => citation.examples?.[tag])?.examples?.[tag] ?? (group.tags.length === 1 ? group.detail : undefined);

/**
 * The differing words of a group per tag, «a / b»: from its first pair that
 * shows the tag, taken from the Madina page with their tashkeel and signs
 * (owner 2026-11-17: display never drops tashkeel). Tags a book gives its own
 * example for are left out. Built from positions, so mutashabih.json stores no
 * example words.
 */
export function differenceWordsOf(group: Pick<Group, 'tags' | 'columns' | 'citations' | 'detail'>, wordAt: (key: string, index: number) => string | undefined): Partial<Record<Tag, DifferenceWords>> {
  const out: Partial<Record<Tag, DifferenceWords>> = {};
  for (const tag of group.tags) {
    if (quotedExample(group, tag)) continue;
    const shows = (column: Column) => column.tags.includes(tag) || tag === 'frame' && column.tags.length > 0;
    const changed = group.columns.find(pair => pair.columns.some(shows))?.columns.filter(shows);
    if (!changed?.length) continue;
    const selected = tag === 'order' || tag === 'inversion' ? changed : changed.slice(0, 1);
    const side = (key: 'a' | 'b') => {
      const positions = selected.flatMap(column => column[key] ? [column[key]!] : []);
      positions.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }) || a.index - b.index);
      const words = unique(positions.flatMap(position => wordAt(position.key, position.index) ?? []));
      return { words: words.slice(0, MOST), more: words.length > MOST };
    };
    out[tag] = { a: side('a'), b: side('b') };
  }
  return out;
}
