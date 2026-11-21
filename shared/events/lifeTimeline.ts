// A person's «حياته» drawn (owner, 2026-11-18; sketch timeline-events/sketch-dark.png, screens 1 and 4): a strip of dots,
// one column per hijri year and one dot per thing in it, then the same things down a rail by year. The app's
// components/LifeTimeline.tsx and the website's components/tarajim/LifeTimeline.tsx both draw what this file lays out.
import type { AppCite, AppReading } from '../battles/battle';
import type { AppLifeEntry } from './life';
import { pageLabel, type AppPerson, type PersonFact } from '../tarajim';
import { citeSource, uniqueSources, type QuizSource } from '../quiz/sources';

/** What a row is: a raid the Prophet ﷺ went out on himself, one he sent, a later battle, an event, a story, or the person's own fact. */
export type LifeKind = 'ghazwah' | 'sariyyah' | 'battle' | 'event' | 'story' | 'own';

export type LifeItem = {
  key: string;
  kind: LifeKind;
  name: string;
  /** The battle's or story's page; none for an event or the person's own fact. */
  open?: { to: 'battle' | 'story'; slug: string };
  /** The year as the sources give it first; none for an undated story. */
  year?: number;
  /** The sentences that give the year (the book's year heading, a narrator's «in year five»). */
  yearRefs: AppCite[];
  /** Where the sources give the year otherwise: each saying in its words, with its pages, shown on a tap. */
  others: AppReading[];
  /** «استشهد فيها» and the like, said small after the name. */
  note?: string;
  /** The sentences that place the person there, with their pages. */
  refs: AppCite[];
};

/** The books a drawn life stands on: each row's sentences and those that give its year, a sentence cited twice given once. */
export const lifeSources = (items: LifeItem[]): QuizSource[] => uniqueSources(items.flatMap(item => [...item.refs, ...item.yearRefs]).map(citeSource));

/** The chips over the rail, in the sketch's order; a chip shows only when the person has something of its kind. */
export const LIFE_FILTERS: { kinds: LifeKind[]; label: string }[] = [
  { kinds: ['ghazwah'], label: 'الغزوات' },
  { kinds: ['sariyyah'], label: 'السرايا' },
  { kinds: ['battle'], label: 'المعارك' },
  { kinds: ['event'], label: 'الأحداث' },
  { kinds: ['story'], label: 'القصص' },
];

/** A battle's kind word as its page gives it («غزوة», «سرية», «معركة»). */
const KIND_OF: Record<string, LifeKind> = { 'غزوة': 'ghazwah', 'سرية': 'sariyyah', 'معركة': 'battle' };

/**
 * The rows of one person's life: the catalog's entries (shared/data/events/life.json), each battle's kind read from its
 * page, and the person's death where the entry dates it (owner 2026-11-18: a person's own death is a field shown on the
 * timeline, not an event row). An entry the catalog lists twice is one row with the sentences of both.
 */
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

/**
 * A converted person's rows, the same on the app and the website: his catalog entries, and his death where his entry gives
 * its year as a number (the first saying; the others shown on a tap, in their words).
 */
export function personLifeItems(person: AppPerson, entries: AppLifeEntry[], battleKind: (slug: string) => string | undefined): LifeItem[] {
  const [first, ...rest] = person.died.year.filter(fact => typeof fact.value === 'number');
  const cite = (fact: PersonFact) => ({ text: bareText(fact.text), cite: pageLabel(fact.refs) });
  const death = first && {
    year: first.value as number, label: person.sex === 'FEMALE' ? 'وفاتها' : 'وفاته', refs: [cite(first)],
    others: rest.map(fact => ({ text: bareText(fact.text), refs: [cite(fact)] })),
  };
  return lifeItems(entries, battleKind, death || undefined);
}

/** The words of the button that opens a row's page: its own kind's page, or the story. */
export const openLabel = (item: LifeItem) =>
  ({ ghazwah: 'صفحة الغزوة', sariyyah: 'صفحة السرية', battle: 'صفحة المعركة', story: 'القصة' } as Partial<Record<LifeKind, string>>)[item.kind] ?? 'صفحتها';

/**
 * Which strip columns carry their year under them, so that no two labels overlap: a column with something in it is
 * named when the last named one is at least a label's width away (`columnWidth`, `labelWidth` as measured on screen).
 */
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

/** A year's place: before the hijra all in one place (as the book groups them), then each year after it. */
export type LifeYear = { key: string; year?: number; before?: boolean; items: LifeItem[] };

const placeOf = (item: LifeItem) => (item.year === undefined ? 'undated' : item.year < 1 ? 'before' : String(item.year));

/**
 * The rail: the places that hold something, before the hijra first, then by year, then what has no year. Within a
 * place the rows keep the catalog's order (life.json is already in the book's order), the person's death last.
 */
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

/** A life the feed draws: one with more than one column on the strip, since a line needs two points. */
export const drawsLine = (items: LifeItem[]) => lifeStrip(items).length > 1;

/**
 * The strip: one column for before the hijra (when there is something there) and one for every year from the first
 * to the last, empty years included, so the gaps in a life show as gaps. Undated rows are not on it.
 */
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

/** The filters this person's rows call for: only kinds he has, and none at all when everything is one kind. */
export function lifeFilters(items: LifeItem[]) {
  const shown = LIFE_FILTERS.filter(filter => items.some(item => filter.kinds.includes(item.kind)));
  return shown.length > 1 ? shown : [];
}

/**
 * Lives side by side (sketch screen 4, «حياتهما»): every place any of them has, in order, and in it one row per thing,
 * each person's cell holding it where he was in it. A row two or more share (the same battle or event, not a death)
 * is `shared`, drawn joined across.
 */
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
