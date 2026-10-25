// docs/plans/quran-similar-ayat.md
import type { ReactNode } from 'react';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import { ayahInRange, type CompareRange } from '@/lib/quran/compareRange';
import type { SimilarPair, Span } from '@/lib/quran/similar';
import similar from './similar.json';
import { SimilarList } from './SimilarList';

const PAIRS = similar.pairs as SimilarPair[];
const flip = (p: SimilarPair): SimilarPair => ({ ...p, a: p.b, b: p.a, marksA: p.marksB, marksB: p.marksA });

const NO_RANGE: CompareRange = { unit: 'juz', range: null };
const inRange = (p: SimilarPair, range: CompareRange) => ayahInRange(p.a[0], p.a[1], range) && ayahInRange(p.b[0], p.b[1], range);

export const similarSurahPairs = (range = NO_RANGE) => PAIRS.filter(p => inRange(p, range)).map((p): [number, number] => [p.a[0], p.b[0]]);

export function similarFor(surah: number, other?: number, range = NO_RANGE): SimilarPair[] {
  return PAIRS
    .filter(p => inRange(p, range))
    .filter(p => other === undefined ? p.a[0] === surah || p.b[0] === surah : (p.a[0] === surah && p.b[0] === other) || (p.a[0] === other && p.b[0] === surah))
    .map(p => (p.a[0] === surah ? p : flip(p)))
    .sort((p, q) => p.a[1] - q.a[1] || q.score - p.score);
}

type Ranges = { a: { from: number; to: number }; b: { from: number; to: number } };
const touches = ([, from, to]: Span, r: { from: number; to: number }) => from <= r.to && to >= r.from;

export function similarIn(surah: number, other?: number, ranges?: Ranges, range = NO_RANGE): SimilarPair[] {
  const fits = (p: SimilarPair) => !ranges || (touches(p.a, ranges.a) && touches(p.b, ranges.b));
  return similarFor(surah, other, range).flatMap(p => (fits(p) ? [p] : surah === other && fits(flip(p)) ? [flip(p)] : []));
}

export default async function SimilarAyat({ surah, other, within = false, ranges, range, controls, query = {} }: { surah: number; other?: number; within?: boolean; ranges?: Ranges; range?: CompareRange; controls?: ReactNode; query?: Record<string, string> }) {
  const pairs = similarIn(surah, within ? surah : other, ranges, range);
  const wanted = new Map<number, Set<number>>();
  for (const p of pairs) for (const [s, from, to] of [p.a, p.b]) for (let k = from; k <= to; k++) wanted.set(s, (wanted.get(s) ?? new Set()).add(k));
  const rows = wanted.size === 0 ? [] : await prisma.ayah.findMany({
    where: { OR: [...wanted].map(([s, ayat]) => ({ surah: { number: s }, number: { in: [...ayat] } })) },
    select: { number: true, text: true, surah: { select: { number: true } } },
  });
  const surahs = await prisma.surah.findMany({ where: { number: { in: [...new Set([...wanted.keys(), surah, other ?? surah])] } }, select: { number: true, name: true } });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1 && r.surah.number !== 1 && r.surah.number !== 9).display.join(' ')]));
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  return <SimilarList pairs={pairs} ayat={ayat} names={names} pair={other !== undefined} within={within} controls={controls} query={query} filtered={Boolean(range?.range)} surahs={[surah, other ?? surah]} />;
}
