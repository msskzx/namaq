// The battles screen's timeline (owner, 2026-11-20; layout-cleanup sketch, panel 5), laid out once for the app and the website.
import type { AppBattle } from './battle';
import { num } from '../quran/arabicNumber';

/** The Prophet's ﷺ years in Madinah: the first axis runs over Hijri years 1 to this one. */
export const MADINAH_YEARS = 11;

/** How a battle's dot is drawn: filled for a غزوة (he went out himself), a ring for a سرية, a quiet dot for a later معركة. */
export type DotKind = 'ghazwah' | 'sariyyah' | 'battle';
export const dotKind = (kind?: string): DotKind => (kind === 'غزوة' ? 'ghazwah' : kind === 'سرية' ? 'sariyyah' : 'battle');
export const DOT_NAMES: Record<DotKind, string> = { ghazwah: 'غزوة', sariyyah: 'سرية', battle: 'معركة' };

export type TimelineDot = { slug: string; name: string; kind: DotKind };
/** One year on an axis, its battles stacked above it in the list's order. */
export type TimelineYear = { year: number; dots: TimelineDot[] };
/** A heading of the list under the drawing and its battles; `year` is missing for the group the source gives no year. */
export type TimelineGroup<B> = { year?: number; title: string; battles: B[] };

export const yearTitle = (year: number) => `السنة ${num(year)}`;
export const UNDATED_TITLE = 'لم يذكر المصدر سنتها';

/** The anchor a year's list group carries, so a tap on the year's column brings it into view. */
export const yearAnchor = (year: number) => `year-${year}`;

/**
 * The drawing and the list: `madinah` holds every year 1..MADINAH_YEARS (an empty year keeps its place), `after` only
 * the later years that have a battle, so a few battles decades apart stay one short line. A battle with no year has no
 * dot and is listed last.
 */
export function battleTimeline<B extends Pick<AppBattle, 'slug' | 'name' | 'kind' | 'year'>>(battles: B[]) {
  const byYear = new Map<number, B[]>();
  const undated: B[] = [];
  for (const battle of battles) {
    const year = battle.year?.value;
    if (typeof year === 'number') byYear.set(year, [...(byYear.get(year) ?? []), battle]);
    else undated.push(battle);
  }
  const years = [...byYear.keys()].sort((a, b) => a - b);
  const column = (year: number): TimelineYear => ({
    year,
    dots: (byYear.get(year) ?? []).map(battle => ({ slug: battle.slug, name: battle.name, kind: dotKind(battle.kind?.value) })),
  });
  const groups: TimelineGroup<B>[] = years.map(year => ({ year, title: yearTitle(year), battles: byYear.get(year)! }));
  if (undated.length) groups.push({ title: UNDATED_TITLE, battles: undated });
  return {
    madinah: Array.from({ length: MADINAH_YEARS }, (_, i) => column(i + 1)),
    after: years.filter(year => year > MADINAH_YEARS).map(column),
    groups,
  };
}

/** The kinds the drawing shows, in the legend's order. */
export const legendKinds = (columns: TimelineYear[]): DotKind[] =>
  (['ghazwah', 'sariyyah', 'battle'] as const).filter(kind => columns.some(column => column.dots.some(dot => dot.kind === kind)));

/** A year column's name for a screen reader: «السنة ٢: غزوة بدر، سرية نخلة». */
export const yearLabel = (column: TimelineYear) => `${yearTitle(column.year)}: ${column.dots.map(dot => dot.name).join('، ')}`;
