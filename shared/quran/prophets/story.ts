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

export type StoryLine = { ayah: number; text: string };
export type SegmentView = { surah: number; name: string; range: Range; lines: StoryLine[] };
export type EventView = { n: number; title: string; phase: number; segments: SegmentView[]; count: number };

/** Every ayah key the story's events cover, in event order. */
export const storyKeys = (events: StoryEvent[]) =>
  events.flatMap(e => e.segments.flatMap(({ surah, range: [lo, hi] }) => Array.from({ length: hi - lo + 1 }, (_, k) => `${surah}:${lo + k}`)));

export function buildStory(events: StoryEvent[], { names, ayah }: StoryText): EventView[] {
  return events.map(({ title, phase, segments }, i) => {
    const views = segments.map(({ surah, range: [lo, hi] }) => ({
      surah,
      name: plainName(names[surah] ?? '').replace(/^سورة\s+/, ''),
      range: [lo, hi] as Range,
      lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
        const text = ayah(`${surah}:${lo + k}`);
        if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
        return { ayah: lo + k, text: ayahWords(text, false).display.join(' ') };
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
