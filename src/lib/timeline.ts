import { normalizeSubjectSearch } from '@/lib/subjectSearch';

export const TIMELINE_KINDS = ['event', 'battle', 'ghazwah', 'sariyyah'] as const;
export type TimelineKind = (typeof TIMELINE_KINDS)[number];

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
export interface DerivedBound {
  slug: string;
  kind: 'event' | 'battle';
  name: string;
  nameTransliterated: string | null;
  year: number;
}

export interface DerivedInterval {
  from?: DerivedBound;
  to?: DerivedBound;
}

/** The year an item sorts at: its own, or just inside the interval it was derived into. */
export function timelineYear(item: { hijriYear: number | null; interval?: DerivedInterval | null }) {
  if (item.hijriYear !== null) return item.hijriYear;
  if (item.interval?.from) return item.interval.from.year + 0.25;
  if (item.interval?.to) return item.interval.to.year - 0.25;
  return null;
}

/** One row of the events page, whether it came from an Event or a Battle. */
export interface TimelineItem {
  id: string;
  slug: string;
  kind: TimelineKind;
  name: string;
  nameTransliterated: string | null;
  hijriYear: number | null;
  hijriPeriod: string | null;
  location: string | null;
  locationTransliterated: string | null;
  interval?: DerivedInterval | null;
}

/** A battle row's engagement, with an unset one read as a plain battle. */
export function battleKind(engagement: string | null | undefined): TimelineKind {
  if (engagement === 'GHAZWAH') return 'ghazwah';
  if (engagement === 'SARIYYAH') return 'sariyyah';
  return 'battle';
}

/** Reads `?type=ghazwah,sariyyah`, dropping anything that is not a known kind. */
export function parseKinds(param: string | null): TimelineKind[] {
  const wanted = (param ?? '').split(',');
  return TIMELINE_KINDS.filter((kind) => wanted.includes(kind));
}

/** No kind selected means every kind; a query matches names and location, ignoring diacritics. */
export function filterTimeline(items: TimelineItem[], kinds: TimelineKind[], query: string): TimelineItem[] {
  const needle = normalizeSubjectSearch(query.trim());
  return items.filter((item) => {
    if (kinds.length > 0 && !kinds.includes(item.kind)) return false;
    if (!needle) return true;
    return [item.name, item.nameTransliterated, item.location, item.locationTransliterated].some(
      (field) => field && normalizeSubjectSearch(field).includes(needle),
    );
  });
}
