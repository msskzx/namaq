import { num } from '../arabicNumber';
import { ayahWords, plainName } from '../normalize';

// docs/plans/quran-prophet-timelines.md
export type Range = [number, number];
export type Segment = { surah: number; range: Range };
export type StoryEvent = { title: string; segments: Segment[]; phase: number };
export type Story = { intro: string; phases: readonly string[]; events: StoryEvent[] };

export const seg = (surah: number, lo: number, hi = lo): Segment => ({ surah, range: [lo, hi] });

/** Where the story's text comes from: the website stores its own ayat file, the app reads its bundled Quran. */
export type StoryText = { names: Record<number, string>; ayah: (key: string) => string | undefined };
export type StoryData = { names: Record<number, string>; ayat: Record<string, string> };
export const storedText = ({ names, ayat }: StoryData): StoryText => ({ names, ayah: key => ayat[key] });

export type StoryLine = { ayah: number; text: string; words: string[]; norm: string[] };
export type SegmentView = { surah: number; name: string; range: Range; lines: StoryLine[] };
export type EventView = { n: number; title: string; phase: number; segments: SegmentView[]; count: number };

/** Every ayah key the story's events cover, in event order. */
export const storyKeys = (events: StoryEvent[]) =>
  events.flatMap(e => e.segments.flatMap(({ surah, range: [lo, hi] }) => Array.from({ length: hi - lo + 1 }, (_, k) => `${surah}:${lo + k}`)));

export function buildStory(events: StoryEvent[], { names, ayah }: StoryText): EventView[] {
  return events.map(({ title, phase, segments }, i) => {
    const views = segments.map(({ surah, range: [lo, hi] }) => ({
      surah,
      name: plainName((names[surah] ?? '').replace(/\u0627\u0653/g, 'آ')).replace(/^سورة\s+/, ''),
      range: [lo, hi] as Range,
      lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
        const text = ayah(`${surah}:${lo + k}`);
        if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
        const { display, norm } = ayahWords(text, false);
        return { ayah: lo + k, text: display.join(' '), words: display, norm };
      }),
    }));
    return { n: i + 1, title, phase, segments: views, count: views.reduce((t, v) => t + v.lines.length, 0) };
  });
}

/** The numbers the page's summary shows. */
export const storySummary = (events: EventView[]) => ({
  events: events.length,
  ayat: events.reduce((t, e) => t + e.count, 0),
  surahs: new Set(events.flatMap(e => e.segments.map(g => g.surah))).size,
});

/** One surah's part in an event: its segments in that surah in ayah order, gathered where the surah first comes in the event. */
export type Place = { surah: number; name: string; count: number; segments: SegmentView[] };

export function placesOf(event: EventView): Place[] {
  const bySurah = new Map<number, Place>();
  for (const segment of event.segments) {
    const place = bySurah.get(segment.surah) ?? { surah: segment.surah, name: segment.name, count: 0, segments: [] };
    place.segments.push(segment);
    place.count += segment.lines.length;
    bySurah.set(segment.surah, place);
  }
  for (const place of bySurah.values()) place.segments.sort((a, b) => a.range[0] - b.range[0]);
  return [...bySurah.values()];
}

/** The map of a story: a row for every surah that tells part of it, in mushaf order, and its place in each event. */
export type StoryMap = { surahs: { surah: number; name: string }[]; places: Place[][]; most: number };

export function storyMap(events: EventView[]): StoryMap {
  const places = events.map(placesOf);
  const names = new Map(places.flat().map(p => [p.surah, p.name]));
  const surahs = [...names].sort(([a], [b]) => a - b).map(([surah, name]) => ({ surah, name }));
  return { surahs, places, most: Math.max(1, ...places.flat().map(p => p.count)) };
}

export const placeIn = (map: StoryMap, event: number, surah: number) => map.places[event].find(p => p.surah === surah);

/** A dot's diameter: the smallest for one ayah, the largest for the most ayat any place has, by area in between. */
export const dotSize = (count: number, most: number, smallest: number, largest: number) =>
  Math.round(smallest + (largest - smallest) * Math.sqrt(Math.max(0, count - 1) / Math.max(1, most - 1)));

/**
 * Which words of an event's places sit in a run of two or more words that another surah's place in the same event
 * also has, by place, segment, line and word. Lone common words (من، قال) stay plain.
 */
export function sharedWords(places: Place[]): boolean[][][][] {
  const pairs = places.map(p => new Set(p.segments.flatMap(g => g.lines.flatMap(({ norm }) => norm.slice(1).map((w, k) => `${norm[k]} ${w}`)))));
  return places.map((p, i) => p.segments.map(g => g.lines.map(({ norm }) => {
    const inOther = (k: number) => k >= 0 && k + 1 < norm.length && pairs.some((other, j) => j !== i && other.has(`${norm[k]} ${norm[k + 1]}`));
    return norm.map((_, k) => inOther(k - 1) || inOther(k));
  })));
}

/** The ayah range of a segment, as «٣–١٣» or «١١». */
export const rangeText = ([lo, hi]: Range) => (hi > lo ? `${num(lo)}–${num(hi)}` : num(lo));
