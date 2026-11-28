import type { Verdict } from '../compareCards';
import { placesOf, type EventView, type StoryEvent } from './story';

// see docs/plans/quran-prophet-timelines.md
export type PlaceVerdicts = Record<string, Verdict>;

export const placeKey = (slug: string, surah: number, first: number) => `${slug}/${surah}:${first}`;

export function eventPlaceKeys(slug: string, event: StoryEvent): { surah: number; key: string }[] {
  const first = new Map<number, number>();
  for (const { surah, range: [lo] } of event.segments) first.set(surah, Math.min(lo, first.get(surah) ?? lo));
  return [...first].map(([surah, lo]) => ({ surah, key: placeKey(slug, surah, lo) }));
}

export const droppedVerdict = (verdict: Verdict | undefined) => verdict?.keep === false && !verdict.ask;

export function keptEvents(slug: string, events: StoryEvent[], verdicts: PlaceVerdicts): StoryEvent[] {
  return events.flatMap(event => {
    const dropped = new Set(eventPlaceKeys(slug, event).filter(({ key }) => droppedVerdict(verdicts[key])).map(({ surah }) => surah));
    if (!dropped.size) return [event];
    const segments = event.segments.filter(({ surah }) => !dropped.has(surah));
    return segments.length ? [{ ...event, segments }] : [];
  });
}

export const placeKeyOf = (slug: string, place: { surah: number; segments: { range: [number, number] }[] }) => placeKey(slug, place.surah, place.segments[0].range[0]);

export function keptViews(slug: string, events: EventView[], verdicts: PlaceVerdicts): EventView[] {
  return events.flatMap(event => {
    const dropped = new Set(placesOf(event).filter(place => droppedVerdict(verdicts[placeKeyOf(slug, place)])).map(place => place.surah));
    if (!dropped.size) return [event];
    const segments = event.segments.filter(({ surah }) => !dropped.has(surah));
    return segments.length ? [{ ...event, segments, count: segments.reduce((t, g) => t + g.lines.length, 0) }] : [];
  }).map((event, i) => ({ ...event, n: i + 1 }));
}
