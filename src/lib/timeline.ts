import { normalizeSubjectSearch } from '@/lib/subjectSearch';

export const TIMELINE_KINDS = ['event', 'battle', 'ghazwah', 'sariyyah'] as const;
export type TimelineKind = (typeof TIMELINE_KINDS)[number];

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
