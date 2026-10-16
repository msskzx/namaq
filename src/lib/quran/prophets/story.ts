import type { Range } from '../curatedShifts';
import { ayahWords, plainName } from '../normalize';

// docs/plans/quran-prophet-timelines.md
export type Segment = { surah: number; range: Range };
export type StoryEvent = { title: string; segments: Segment[]; phase: number };
export type Story = { intro: string; phases: readonly string[]; events: StoryEvent[] };

export const seg = (surah: number, lo: number, hi = lo): Segment => ({ surah, range: [lo, hi] });

export type StoryData = { names: Record<number, string>; ayat: Record<string, string> };
export type StoryLine = { ayah: number; text: string };
export type SegmentView = { surah: number; name: string; range: Range; lines: StoryLine[] };
export type EventView = { n: number; title: string; phase: number; segments: SegmentView[]; count: number };

export function buildStory(events: StoryEvent[], { names, ayat }: StoryData): EventView[] {
  return events.map(({ title, phase, segments }, i) => {
    const views = segments.map(({ surah, range: [lo, hi] }) => ({
      surah,
      name: plainName(names[surah] ?? ''),
      range: [lo, hi] as Range,
      lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
        const text = ayat[`${surah}:${lo + k}`];
        if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
        return { ayah: lo + k, text: ayahWords(text, false).display.join(' ') };
      }),
    }));
    return { n: i + 1, title, phase, segments: views, count: views.reduce((t, v) => t + v.lines.length, 0) };
  });
}
