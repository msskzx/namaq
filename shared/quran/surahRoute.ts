import { sectionAt, sectionStart, surahTopicsOf, type TopicSection } from './surahTopics';

export type RouteStretch = { title: string; from: number; to: number; at: number; end: number };

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
  const stops = topics.sections.map((each, i) => stretch(each, topics.sections[i + 1]));
  const top = topics.sections[section];
  const parts = (top.parts ?? []).map((each, i, all) => stretch(each, all[i + 1])).filter((each): each is RouteStretch => !!each);
  const ticks = topics.sections.flatMap(each => (each.parts ?? []).slice(1).map(sectionStart)).filter((n): n is number => n !== undefined).map(place);
  const holds = (each: RouteStretch | null) => !!each && ayah >= each.from && ayah <= each.to;
  const here = parts.find(holds) ?? [stretch(top, topics.sections[section + 1])].find(holds) ?? null;
  return { stops, ticks, section, here, at: place(ayah), sections: topics.sections.length };
}
