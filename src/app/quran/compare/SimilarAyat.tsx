// docs/plans/quran-similar-ayat.md
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import type { SimilarPair, Span } from '@/lib/quran/similar';
import similar from './similar.json';
import { SimilarList } from './SimilarList';

const PAIRS = similar.pairs as SimilarPair[];
const flip = (p: SimilarPair): SimilarPair => ({ ...p, a: p.b, b: p.a, marksA: p.marksB, marksB: p.marksA });

export function similarFor(surah: number, other?: number): SimilarPair[] {
  return PAIRS
    .filter(p => other === undefined ? p.a[0] === surah || p.b[0] === surah : (p.a[0] === surah && p.b[0] === other) || (p.a[0] === other && p.b[0] === surah))
    .map(p => (p.a[0] === surah ? p : flip(p)))
    .sort((p, q) => p.a[1] - q.a[1] || q.score - p.score);
}

type Ranges = { a: { from: number; to: number }; b: { from: number; to: number } };
const inside = ([, from, to]: Span, r: { from: number; to: number }) => from >= r.from && to <= r.to;

export default async function SimilarAyat({ surah, other, ranges }: { surah: number; other?: number; ranges?: Ranges }) {
  const pairs = similarFor(surah, other).filter(p => !ranges || (inside(p.a, ranges.a) && inside(p.b, ranges.b)));
  const wanted = new Map<number, Set<number>>();
  for (const p of pairs) for (const [s, from, to] of [p.a, p.b]) for (let k = from; k <= to; k++) wanted.set(s, (wanted.get(s) ?? new Set()).add(k));
  const rows = wanted.size === 0 ? [] : await prisma.ayah.findMany({
    where: { OR: [...wanted].map(([s, ayat]) => ({ surah: { number: s }, number: { in: [...ayat] } })) },
    select: { number: true, text: true, surah: { select: { number: true } } },
  });
  const surahs = await prisma.surah.findMany({ where: { number: { in: [...wanted.keys()] } }, select: { number: true, name: true } });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1 && r.surah.number !== 1 && r.surah.number !== 9).display.join(' ')]));
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  return <SimilarList pairs={pairs} ayat={ayat} names={names} pair={other !== undefined} />;
}
