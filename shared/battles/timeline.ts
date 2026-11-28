import type { AppBattle } from './battle';
import { num } from '../quran/arabicNumber';

export const MADINAH_YEARS = 11;

export type DotKind = 'ghazwah' | 'sariyyah' | 'battle';
export const dotKind = (kind?: string): DotKind => (kind === 'غزوة' ? 'ghazwah' : kind === 'سرية' ? 'sariyyah' : 'battle');
export const DOT_NAMES: Record<DotKind, string> = { ghazwah: 'غزوة', sariyyah: 'سرية', battle: 'معركة' };

export type TimelineDot = { slug: string; name: string; kind: DotKind };
export type TimelineYear = { year: number; dots: TimelineDot[] };
export type TimelineGroup<B> = { year?: number; title: string; battles: B[] };

export const yearTitle = (year: number) => `السنة ${num(year)}`;
export const UNDATED_TITLE = 'لم يذكر المصدر سنتها';

export const yearAnchor = (year: number) => `year-${year}`;

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

export const legendKinds = (columns: TimelineYear[]): DotKind[] =>
  (['ghazwah', 'sariyyah', 'battle'] as const).filter(kind => columns.some(column => column.dots.some(dot => dot.kind === kind)));

export const yearLabel = (column: TimelineYear) => `${yearTitle(column.year)}: ${column.dots.map(dot => dot.name).join('، ')}`;
