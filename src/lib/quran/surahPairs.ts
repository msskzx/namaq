// docs/plans/quran-similar-ayat.md
export type SurahGroup = { surah: number; total: number; self: number; partners: { other: number; count: number }[] };

export function groupBySurah(pairs: [number, number][], surahs: number[] = []): SurahGroup[] {
  const groups = new Map<number, { self: number; partners: Map<number, number> }>();
  const group = (s: number) => groups.get(s) ?? groups.set(s, { self: 0, partners: new Map() }).get(s)!;
  surahs.forEach(group);
  for (const [a, b] of pairs) {
    if (a === b) {
      group(a).self++;
      continue;
    }
    for (const [s, o] of [[a, b], [b, a]]) group(s).partners.set(o, (group(s).partners.get(o) ?? 0) + 1);
  }
  return [...groups].map(([surah, g]) => {
    const partners = [...g.partners].map(([other, count]) => ({ other, count })).sort((p, q) => q.count - p.count || p.other - q.other);
    return { surah, self: g.self, partners, total: g.self + partners.reduce((n, p) => n + p.count, 0) };
  }).sort((p, q) => p.surah - q.surah);
}
