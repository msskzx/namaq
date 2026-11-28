import type { AppCite, AppReading } from '../battles/battle';
import type { AppLifeEntry } from './life';
import { pageLabel, type AppPerson, type PersonFact } from '../tarajim';
import { citeSource, uniqueSources, type QuizSource } from '../quiz/sources';

export type LifeKind = 'ghazwah' | 'sariyyah' | 'battle' | 'event' | 'story' | 'own';

export type LifeItem = {
  key: string;
  kind: LifeKind;
  name: string;
  open?: { to: 'battle' | 'story'; slug: string };
  year?: number;
  yearRefs: AppCite[];
  others: AppReading[];
  note?: string;
  refs: AppCite[];
};

export const lifeSources = (items: LifeItem[]): QuizSource[] => uniqueSources(items.flatMap(item => [...item.refs, ...item.yearRefs]).map(citeSource));

export const LIFE_FILTERS: { kinds: LifeKind[]; label: string }[] = [
  { kinds: ['ghazwah'], label: 'الغزوات' },
  { kinds: ['sariyyah'], label: 'السرايا' },
  { kinds: ['battle'], label: 'المعارك' },
  { kinds: ['event'], label: 'الأحداث' },
  { kinds: ['story'], label: 'القصص' },
];

const KIND_OF: Record<string, LifeKind> = { 'غزوة': 'ghazwah', 'سرية': 'sariyyah', 'معركة': 'battle' };

export function lifeItems(entries: AppLifeEntry[], battleKind: (slug: string) => string | undefined,
  death?: { year: number; refs: AppCite[]; label: string; others: AppReading[] }): LifeItem[] {
  const items = new Map<string, LifeItem>();
  for (const entry of entries) {
    const key = `${entry.kind}:${entry.slug}`;
    const seen = items.get(key);
    if (seen) {
      seen.refs = [...seen.refs, ...entry.refs.filter(ref => !seen.refs.some(had => had.text === ref.text && had.cite === ref.cite))];
      continue;
    }
    const kind: LifeKind = entry.kind === 'battle' ? KIND_OF[battleKind(entry.slug) ?? ''] ?? 'battle' : entry.kind;
    const { name } = entry;
    items.set(key, {
      key, kind, name, year: entry.year?.value, yearRefs: entry.year?.refs ?? [], others: entry.year?.others ?? [],
      open: entry.kind === 'event' ? undefined : { to: entry.kind === 'story' ? 'story' : 'battle', slug: entry.slug },
      note: entry.role === 'استشهد فيها' ? entry.role : undefined, refs: entry.refs,
    });
  }
  if (death) items.set('own:death', { key: 'own:death', kind: 'own', name: death.label, year: death.year, yearRefs: death.refs, others: death.others, refs: death.refs });
  return [...items.values()];
}

const bareText = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');

export function personLifeItems(person: AppPerson, entries: AppLifeEntry[], battleKind: (slug: string) => string | undefined): LifeItem[] {
  const [first, ...rest] = person.died.year.filter(fact => typeof fact.value === 'number');
  const cite = (fact: PersonFact) => ({ text: bareText(fact.text), cite: pageLabel(fact.refs) });
  const death = first && {
    year: first.value as number, label: person.sex === 'FEMALE' ? 'وفاتها' : 'وفاته', refs: [cite(first)],
    others: rest.map(fact => ({ text: bareText(fact.text), refs: [cite(fact)] })),
  };
  return lifeItems(entries, battleKind, death || undefined);
}

export const openLabel = (item: LifeItem) =>
  ({ ghazwah: 'صفحة الغزوة', sariyyah: 'صفحة السرية', battle: 'صفحة المعركة', story: 'القصة' } as Partial<Record<LifeKind, string>>)[item.kind] ?? 'صفحتها';

export function stripLabels(columns: LifeYear[], columnWidth: number, labelWidth: number): Set<string> {
  const named = new Set<string>();
  let last = -Infinity;
  columns.forEach((column, i) => {
    if (column.items.length === 0) return;
    if ((i - last) * columnWidth < labelWidth) return;
    named.add(column.key);
    last = i;
  });
  return named;
}

export type LifeYear = { key: string; year?: number; before?: boolean; items: LifeItem[] };

const placeOf = (item: LifeItem) => (item.year === undefined ? 'undated' : item.year < 1 ? 'before' : String(item.year));

export function lifeRail(items: LifeItem[]): LifeYear[] {
  const before = items.filter(item => placeOf(item) === 'before').sort((a, b) => a.year! - b.year!);
  const years = [...new Set(items.filter(item => item.year !== undefined && item.year >= 1).map(item => item.year!))].sort((a, b) => a - b);
  const undated = items.filter(item => item.year === undefined);
  return [
    ...(before.length ? [{ key: 'before', before: true, items: before }] : []),
    ...years.map(year => ({ key: String(year), year, items: items.filter(item => item.year === year) })),
    ...(undated.length ? [{ key: 'undated', items: undated }] : []),
  ];
}

export const drawsLine = (items: LifeItem[]) => lifeStrip(items).length > 1;

export function lifeStrip(items: LifeItem[]): LifeYear[] {
  const dated = items.filter(item => item.year !== undefined && item.year >= 1).map(item => item.year!);
  const before = items.filter(item => placeOf(item) === 'before');
  const columns: LifeYear[] = before.length ? [{ key: 'before', before: true, items: before }] : [];
  if (dated.length) {
    for (let year = Math.min(...dated); year <= Math.max(...dated); year++) {
      columns.push({ key: String(year), year, items: items.filter(item => item.year === year) });
    }
  }
  return columns;
}

export function lifeFilters(items: LifeItem[]) {
  const shown = LIFE_FILTERS.filter(filter => items.some(item => filter.kinds.includes(item.kind)));
  return shown.length > 1 ? shown : [];
}

export function lifeColumns(lives: LifeItem[][]) {
  const rails = lives.map(items => new Map(lifeRail(items).map(place => [place.key, place.items])));
  return lifeRail(lives.flat()).map(place => {
    const keys = [...new Set(place.items.map(item => item.key))];
    const rows = keys.map(key => {
      const cells = rails.map(rail => rail.get(place.key)?.find(item => item.key === key));
      return { key, cells, shared: !key.startsWith('own:') && cells.filter(Boolean).length > 1 };
    });
    return { key: place.key, year: place.year, before: place.before, rows };
  });
}
