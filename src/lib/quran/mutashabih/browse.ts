import type { BranchAyah } from '../branches';
import { inJuzRange, juzOf, type JuzRange } from '../juz';
import { num } from '../arabicNumber';
import type { Group } from './types';

export const SORTS = ['mushaf', 'closest', 'places', 'differences'] as const;
export const FILTER_KEYS = ['relations', 'differences', 'surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo', 'sort', 'cited'] as const;
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
  const scoped = groups.flatMap(group => {
    const places = group.places.filter(place => visible.has(place.key) && (!place.through || visible.has(place.through)));
    const keys = new Set(places.map(place => place.key));
    if (keys.size < 2) return [];
    return [{ ...group, places, tree: { ...group.tree, occurrences: group.tree.occurrences.filter(occurrence => keys.has(occurrence.key)) } }];
  });
  return scoped.filter(group =>
    (!tags?.length || group.tags.some(tag => tags.includes(tag))) &&
    (!kinds?.length || kinds.includes(group.kind)) &&
    (filters.cited !== '1' || group.citations.length > 0)
  ).sort((a, b) => {
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

export function groupAyat(group: Group, ayat: Map<string, BranchAyah>): BranchAyah[] {
  return group.places.map(place => {
    const first = ayat.get(place.key)!;
    const last = place.through && ayat.get(place.through);
    if (!last) return { ...first, through: undefined, next: undefined, nextRoots: undefined, nextLemmas: undefined };
    return {
      ...first,
      words: [...first.words, `﴿${num(Number(first.key.split(':')[1]))}﴾`, ...last.words],
      roots: [...(first.roots ?? first.words.map(() => null)), null, ...(last.roots ?? last.words.map(() => null))],
      lemmas: [...(first.lemmas ?? first.words.map(() => null)), null, ...(last.lemmas ?? last.words.map(() => null))],
      through: last.key, next: undefined, nextRoots: undefined, nextLemmas: undefined,
    };
  });
}
