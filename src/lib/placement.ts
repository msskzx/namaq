// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
import { formatHijriYear } from './hijriYear';

export interface PlaceSubject {
  readonly slug: string;
  readonly hijriYear: number | null;
  readonly yearDisputed?: boolean;
}

export interface PlaceOrdering {
  readonly earlier: string;
  readonly later: string;
}

export interface Bound {
  readonly slug: string;
  readonly year: number;
}

export interface Placement {
  readonly from?: Bound;
  readonly to?: Bound;
  readonly unplaced?: 'disputed' | 'contradiction';
}

const dated = (s: PlaceSubject | undefined): s is PlaceSubject & { hijriYear: number } =>
  s !== undefined && s.hijriYear !== null && !s.yearDisputed;

function reach(start: string, next: ReadonlyMap<string, string[]>) {
  const seen = new Set<string>();
  const queue = [...(next.get(start) ?? [])];
  while (queue.length > 0) {
    const node = queue.pop() as string;
    if (seen.has(node)) continue;
    seen.add(node);
    queue.push(...(next.get(node) ?? []));
  }
  return seen;
}

const nearest = (slugs: Iterable<string>, bySlug: ReadonlyMap<string, PlaceSubject>, pick: 'max' | 'min') => {
  const bounds = [...slugs]
    .map((slug) => bySlug.get(slug))
    .filter(dated)
    .map((s) => ({ slug: s.slug, year: s.hijriYear }))
    .sort((a, b) => (pick === 'max' ? b.year - a.year : a.year - b.year) || a.slug.localeCompare(b.slug));
  return bounds[0];
};

export function placeUndated(subjects: readonly PlaceSubject[], orderings: readonly PlaceOrdering[]) {
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));
  const after = new Map<string, string[]>();
  const before = new Map<string, string[]>();
  for (const { earlier, later } of orderings) {
    after.set(earlier, [...(after.get(earlier) ?? []), later]);
    before.set(later, [...(before.get(later) ?? []), earlier]);
  }
  const placements = new Map<string, Placement>();
  for (const subject of subjects) {
    if (dated(subject) || (!after.has(subject.slug) && !before.has(subject.slug))) continue;
    const later = reach(subject.slug, after);
    const earlier = reach(subject.slug, before);
    if (later.has(subject.slug) || earlier.has(subject.slug) || subject.yearDisputed) {
      placements.set(subject.slug, { unplaced: 'disputed' });
      continue;
    }
    const from = nearest(earlier, bySlug, 'max');
    const to = nearest(later, bySlug, 'min');
    if (from && to && from.year > to.year) placements.set(subject.slug, { unplaced: 'contradiction' });
    else if (from || to) placements.set(subject.slug, { from, to });
  }
  return placements;
}

export function placementSortYear(placement: Placement | undefined): number | null {
  if (!placement || placement.unplaced) return null;
  if (placement.from) return placement.from.year + 0.25;
  if (placement.to) return placement.to.year - 0.25;
  return null;
}

export function formatInterval(placement: Placement, language: string): string | null {
  if (placement.unplaced) return null;
  const { from, to } = placement;
  const year = (bound: Bound) => formatHijriYear(bound.year, language);
  if (from && to) return language === 'ar' ? `بين ${year(from)} و${year(to)}` : `Between ${year(from)} and ${year(to)}`;
  if (from) return language === 'ar' ? `بعد ${year(from)}` : `After ${year(from)}`;
  if (to) return language === 'ar' ? `قبل ${year(to)}` : `Before ${year(to)}`;
  return null;
}
