// docs/plans/quran-repetition-merge.md
import type { Passage, Pos } from './passages';

export type PassageGroup = {
  passages: number[];
  places: { surah: number; from: Pos; to: Pos }[];
  surahs: number[];
  matched: number;
};

type Side = { from: Pos; to: Pos };

const cmp = (p: Pos, q: Pos) => p.ayah - q.ayah || p.word - q.word;
const overlap = (p: Side, q: Side) => p.from.surah === q.from.surah && cmp(p.from, q.to) <= 0 && cmp(q.from, p.to) <= 0;

export function groupPassages(passages: Passage[]): PassageGroup[] {
  const sides = passages.flatMap((p, i) => [{ i, side: p.a }, { i, side: p.b }]);
  const root = passages.map((_, i) => i);
  const find = (x: number): number => (root[x] === x ? x : (root[x] = find(root[x])));
  sides.forEach((s, x) => {
    for (const t of sides.slice(x + 1)) if (overlap(s.side, t.side)) root[find(s.i)] = find(t.i);
  });

  const members = new Map<number, number[]>();
  passages.forEach((_, i) => members.set(find(i), [...(members.get(find(i)) ?? []), i]));

  const groups = [...members.values()].map(ids => {
    const ranges = ids.flatMap(i => [passages[i].a, passages[i].b]).sort((p, q) => p.from.surah - q.from.surah || cmp(p.from, q.from));
    const merged: Side[] = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && overlap(last, r)) {
        if (cmp(r.to, last.to) > 0) last.to = r.to;
      } else merged.push({ from: r.from, to: r.to });
    }
    return {
      passages: ids,
      places: merged.map(m => ({ surah: m.from.surah, from: m.from, to: m.to })),
      surahs: [...new Set(merged.map(m => m.from.surah))].sort((p, q) => p - q),
      matched: Math.max(...ids.map(i => passages[i].matched)),
    };
  });
  const first = (g: PassageGroup) => g.places[0];
  return groups.sort((p, q) => q.matched - p.matched || first(p).surah - first(q).surah || cmp(first(p).from, first(q).from));
}
