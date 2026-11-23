import { sectionAt, sectionStart, surahTopicsOf, type TopicSection } from './surahTopics';

/** Where a run of ayat lies along the surah, from 0 (its first ayah) to 1 (its last). */
export type RouteStretch = { title: string; from: number; to: number; at: number; end: number };

/**
 * An ayah's place in its surah as a line (owner, 2026-11-23, sketch quran-design/ayah-page «مسار السورة»): the sections
 * the Sharjah topical tafsir divides the surah into (surahTopics.ts) as stops, their smaller parts as ticks, and the
 * section and part the ayah falls in (`here`). Null for a surah the book does not divide.
 */
export function surahRoute(surah: number, ayah: number, count: number) {
  const topics = surahTopicsOf(surah);
  const section = sectionAt(surah, ayah);
  if (!topics || section < 0 || count < 2) return null;
  const place = (n: number) => (n - 1) / (count - 1);
  const stretch = (each: TopicSection, next?: TopicSection): RouteStretch | null => {
    const from = sectionStart(each);
    if (from === undefined) return null;
    const to = each.to ?? (next ? (sectionStart(next) ?? count + 1) - 1 : count);
    return { title: each.title, from, to, at: place(from), end: place(to) };
  };
  // By place in the book's list, as `section` counts: a section with no start of its own or of its parts has no stop.
  const stops = topics.sections.map((each, i) => stretch(each, topics.sections[i + 1]));
  const top = topics.sections[section];
  const parts = (top.parts ?? []).map((each, i, all) => stretch(each, all[i + 1])).filter((each): each is RouteStretch => !!each);
  const ticks = topics.sections.flatMap(each => (each.parts ?? []).slice(1).map(sectionStart)).filter((n): n is number => n !== undefined).map(place);
  // The book leaves a few ayat between two sections (al-An'am 21): those name no stretch, only their place on the line.
  const holds = (each: RouteStretch | null) => !!each && ayah >= each.from && ayah <= each.to;
  const here = parts.find(holds) ?? [stretch(top, topics.sections[section + 1])].find(holds) ?? null;
  return { stops, ticks, section, here, at: place(ayah), sections: topics.sections.length };
}
