import { runOn, type BranchAyah } from '../branches';
import { inJuzRange, juzOf, type JuzRange } from '../juz';
import { num } from '../arabicNumber';
import { focusPhraseGroup } from '../phraseTrees';
import type { Group, Place } from './types';
import { evidenceGroup } from './evidence';

export const SORTS = ['mushaf', 'closest', 'places', 'differences'] as const;
export const FILTER_KEYS = ['categories', 'relations', 'differences', 'surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo', 'sort', 'cited'] as const;
type FilterKey = typeof FILTER_KEYS[number];
export type GroupFilters = Partial<Record<FilterKey, string>>;

export function groupFilters(params: Record<string, unknown>): GroupFilters {
  return Object.fromEntries(FILTER_KEYS.flatMap(key => typeof params[key] === 'string' && params[key] ? [[key, params[key]]] : []));
}

export function toggleFilter(values: string | undefined, value: string) {
  const selected = (values ?? '').split(',').filter(Boolean);
  return (selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]).join(',');
}

export function hasGroupFilters(filters: GroupFilters) {
  return FILTER_KEYS.some(key => key !== 'sort' && Boolean(filters[key]));
}

const numbers = (input: string | undefined, max: number) => new Set((input ?? '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0 && n <= max));
const order = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surah * 1000 + ayah; };
export function filteredAyat(ayat: Map<string, BranchAyah>, filters: GroupFilters, range: JuzRange | null) {
  const surahs = numbers(filters.surahs, 114);
  const juz = numbers(filters.juz, 30);
  const firstSurah = [...numbers(filters.surahFrom, 114)][0] ?? 1;
  const lastSurah = [...numbers(filters.surahTo, 114)][0] ?? 114;
  const firstPage = [...numbers(filters.pageFrom, 604)][0] ?? 1;
  const lastPage = [...numbers(filters.pageTo, 604)][0] ?? 604;
  return new Map([...ayat].filter(([key, ayah]) => {
    const surah = Number(key.split(':')[0]);
    return surah >= firstSurah && surah <= lastSurah && ayah.page >= firstPage && ayah.page <= lastPage &&
      (!range || inJuzRange(key, range)) && (!surahs.size && !juz.size || surahs.has(surah) || juz.has(juzOf(key)));
  }));
}

export function browseGroups(groups: Group[], filters: GroupFilters, ayat: Map<string, BranchAyah>, range: JuzRange | null) {
  const visible = filteredAyat(ayat, filters, range);
  const tags = filters.differences?.split(',');
  const kinds = filters.relations?.split(',');
  const categories = filters.categories?.split(',');
  const scoped = groups.flatMap(group => {
    const places = group.places.filter(place => visible.has(place.key) && (!place.through || visible.has(place.through)));
    const keys = new Set(places.map(place => place.key));
    if (keys.size < 2) return [];
    const occurrences = group.tree.occurrences.filter(occurrence => keys.has(occurrence.key));
    const scopedTree = { ...group.tree, occurrences };
    const tree = places.length !== group.places.length ? focusPhraseGroup(scopedTree, ayat) : scopedTree;
    return [evidenceGroup({ ...group, places, tree, differences: Object.fromEntries(Object.entries(group.differences).filter(([key]) => keys.has(key))) })];
  });
  return deduplicateGroups(scoped.filter(group =>
    (!tags?.length || group.tags.some(tag => tags.includes(tag))) &&
    (!kinds?.length || kinds.includes(group.kind)) &&
    (!categories?.length || group.categories?.some(category => categories.includes(category))) &&
    (filters.cited !== '1' || group.citations.length > 0)
  )).sort((a, b) => {
    const byOrder = order(a.places[0].key) - order(b.places[0].key);
    if (filters.sort === 'closest') return b.score - a.score || byOrder;
    if (filters.sort === 'places') return b.places.length - a.places.length || byOrder;
    if (filters.sort === 'differences') {
      const count = (g: Group) => Object.values(g.differences).reduce((sum, positions) => sum + positions.length, 0);
      return count(a) - count(b) || byOrder;
    }
    return byOrder;
  });
}

export function deduplicateGroups(groups: Group[]): Group[] {
  const retained: Group[] = [];
  const signature = (group: Group) => group.places.map(place => `${place.key}-${place.through ?? ''}`).sort().join(',');
  const contains = (outer: Place[], inner: Place[]) => inner.every(place => outer.some(other => other.key === place.key && other.through === place.through && other.start <= place.start && other.end >= place.end));
  const length = (group: Group) => group.tree.occurrences.reduce((sum, occurrence) => sum + occurrence.end - occurrence.start, 0);
  for (const group of [...groups].sort((a, b) => length(b) - length(a) || b.citations.length - a.citations.length)) {
    const existing = retained.find(other => signature(other) === signature(group) && (contains(other.tree.occurrences, group.tree.occurrences) || contains(group.tree.occurrences, other.tree.occurrences)));
    if (!existing) {
      retained.push({ ...group });
      continue;
    }
    existing.aliases = [...new Set([...(existing.aliases ?? []), group.id, ...(group.aliases ?? [])])].filter(id => id !== existing.id);
    existing.citations = [...new Map([...existing.citations, ...group.citations].map(citation => [citation.id, citation])).values()];
    existing.places = existing.places.map(place => {
      const other = group.places.find(other => other.key === place.key && other.through === place.through)!;
      return { ...place, start: Math.min(place.start, other.start), end: Math.max(place.end, other.end) };
    });
    existing.tags = [...new Set([...existing.tags, ...group.tags])];
    existing.categories = [...new Set([...(existing.categories ?? []), ...(group.categories ?? [])])];
    existing.examples = { ...group.examples, ...existing.examples };
  }
  return retained.map(group => evidenceGroup(group));
}

export function groupAyat(group: Group, ayat: Map<string, BranchAyah>): BranchAyah[] {
  return group.places.map(place => {
    const first = ayat.get(place.key)!;
    const last = place.through && ayat.get(place.through);
    if (!last) return { ...first, through: undefined, next: undefined, nextRoots: undefined, nextLemmas: undefined };
    const read = runOn(first.key, last, ayat.get('1:1'));
    return {
      ...first,
      words: [...first.words, `﴿${num(Number(first.key.split(':')[1]))}﴾`, ...read.words],
      roots: [...(first.roots ?? first.words.map(() => null)), null, ...(read.roots ?? read.words.map(() => null))],
      lemmas: [...(first.lemmas ?? first.words.map(() => null)), null, ...(read.lemmas ?? read.words.map(() => null))],
      through: last.key, next: undefined, nextRoots: undefined, nextLemmas: undefined,
    };
  });
}
