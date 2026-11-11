import type { Verdict } from '../compareCards';
import { placesOf, type EventView, type StoryEvent } from './story';

// docs/plans/quran-prophet-timelines.md
/** The owner's verdicts on the story map, one for each dot: a surah's place in one event. Keyed by `placeKey`. */
export type PlaceVerdicts = Record<string, Verdict>;

/** A dot's key: the story, then the first ayah the surah gives the event, so renaming or moving an event keeps its verdicts. */
export const placeKey = (slug: string, surah: number, first: number) => `${slug}/${surah}:${first}`;

/** The keys of an event's dots, in the order its surahs first come. */
export function eventPlaceKeys(slug: string, event: StoryEvent): { surah: number; key: string }[] {
  const first = new Map<number, number>();
  for (const { surah, range: [lo] } of event.segments) first.set(surah, Math.min(lo, first.get(surah) ?? lo));
  return [...first].map(([surah, lo]) => ({ surah, key: placeKey(slug, surah, lo) }));
}

/** A dot is hidden once its verdict drops it, unless a question for the owner is still open on it. */
export const droppedVerdict = (verdict: Verdict | undefined) => verdict?.keep === false && !verdict.ask;

/** The story as readers see it: dropped dots taken out, and an event with nothing left taken out with them. */
export function keptEvents(slug: string, events: StoryEvent[], verdicts: PlaceVerdicts): StoryEvent[] {
  return events.flatMap(event => {
    const dropped = new Set(eventPlaceKeys(slug, event).filter(({ key }) => droppedVerdict(verdicts[key])).map(({ surah }) => surah));
    if (!dropped.size) return [event];
    const segments = event.segments.filter(({ surah }) => !dropped.has(surah));
    return segments.length ? [{ ...event, segments }] : [];
  });
}

/** A dot's key from its place on the map: places keep their segments in ayah order. */
export const placeKeyOf = (slug: string, place: { surah: number; segments: { range: [number, number] }[] }) => placeKey(slug, place.surah, place.segments[0].range[0]);

/** The built story as readers see it: the same cut as `keptEvents`, made after the text is in, so review can show both. */
export function keptViews(slug: string, events: EventView[], verdicts: PlaceVerdicts): EventView[] {
  return events.flatMap(event => {
    const dropped = new Set(placesOf(event).filter(place => droppedVerdict(verdicts[placeKeyOf(slug, place)])).map(place => place.surah));
    if (!dropped.size) return [event];
    const segments = event.segments.filter(({ surah }) => !dropped.has(surah));
    return segments.length ? [{ ...event, segments, count: segments.reduce((t, g) => t + g.lines.length, 0) }] : [];
  }).map((event, i) => ({ ...event, n: i + 1 }));
}
