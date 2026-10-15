'use client';

// docs/plans/quran-repetition-merge.md
import React from 'react';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import type { Repetition } from '@/lib/quran/repetition';

const CELL = 11;
const N = 114;
const SIZE = N * CELL;
const BARS = 72;
const TOP = BARS + 14;
const TICKS = [1, 20, 40, 60, 80, 100, 114];

export const LEVELS = [
  { from: 1, fill: 'fill-amber-200 dark:fill-amber-900' },
  { from: 10, fill: 'fill-amber-300 dark:fill-amber-800' },
  { from: 25, fill: 'fill-amber-400 dark:fill-amber-700' },
  { from: 60, fill: 'fill-amber-500 dark:fill-amber-500' },
  { from: 150, fill: 'fill-amber-700 dark:fill-amber-300' },
];

export const levelOf = (words: number) => LEVELS.reduce((at, l, i) => (words >= l.from ? i : at), 0);
const xOf = (n: number) => (N - n) * CELL;
const yOf = (n: number) => TOP + (n - 1) * CELL;

export type Pick = { s: number; t: number | null };

export function RepetitionMatrix({ data, totals, pick, onPick }: { data: Repetition; totals: Map<number, number>; pick: Pick | null; onPick: (p: Pick) => void }) {
  const name = (n: number) => plainName(data.surahs[n - 1]?.name ?? '');
  const max = Math.max(1, ...totals.values());
  const marked = (a: number, b: number) => pick !== null && (a === b ? pick.s === a && pick.t === null : (pick.s === a && pick.t === b) || (pick.s === b && pick.t === a));
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`-2 0 ${SIZE + 26} ${TOP + SIZE + 2}`} className="min-w-[640px] w-full max-w-[min(85vh,800px)] mx-auto" role="img" aria-label="مصفوفة السور: كل خلية عدد الكلمات المكررة بين سورتين">
        {data.surahs.map(s => {
          const h = ((totals.get(s.number) ?? 0) / max) * BARS;
          return h > 0 ? (
            <rect key={s.number} x={xOf(s.number)} y={BARS - h} width={CELL - 1} height={h} className={`cursor-pointer ${pick?.s === s.number ? 'fill-amber-700 dark:fill-amber-300' : 'fill-gray-400 dark:fill-gray-600'}`} onClick={() => onPick({ s: s.number, t: null })}>
              <title>{`${name(s.number)}: ${num(totals.get(s.number) ?? 0)} كلمة`}</title>
            </rect>
          ) : null;
        })}
        <rect x={0} y={TOP} width={SIZE} height={SIZE} className="fill-gray-100 dark:fill-gray-900 stroke-gray-300 dark:stroke-gray-700" />
        {pick && (
          <>
            <rect x={xOf(pick.s)} y={TOP} width={CELL} height={SIZE} className="fill-gray-300/50 dark:fill-white/10" />
            <rect x={0} y={yOf(pick.s)} width={SIZE} height={CELL} className="fill-gray-300/50 dark:fill-white/10" />
          </>
        )}
        {data.cells.flatMap(c => {
          const pairs = c.a === c.b ? [[c.a, c.b]] : [[c.a, c.b], [c.b, c.a]];
          return pairs.map(([col, row]) => (
            <rect key={`${col}:${row}`} x={xOf(col)} y={yOf(row)} width={CELL} height={CELL} className={`${LEVELS[levelOf(c.words)].fill} cursor-pointer ${marked(c.a, c.b) ? 'stroke-gray-900 dark:stroke-white stroke-[1.5px]' : ''}`} onClick={() => onPick({ s: Math.min(col, row), t: c.a === c.b ? null : Math.max(col, row) })}>
              <title>{c.a === c.b ? `${name(c.a)}: ${num(c.words)} كلمة مكررة` : `${name(c.a)} و${name(c.b)}: ${num(c.words)} كلمة مشتركة`}</title>
            </rect>
          ));
        })}
        {TICKS.map(n => (
          <React.Fragment key={n}>
            <text x={xOf(n) + CELL / 2} y={TOP - 3} textAnchor="middle" fontSize={7} className="fill-gray-600 dark:fill-gray-400">{num(n)}</text>
            <text x={SIZE + 3} y={yOf(n) + CELL - 1} fontSize={7} className="fill-gray-600 dark:fill-gray-400">{num(n)}</text>
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400" aria-label="مفتاح الألوان">
      {LEVELS.map((l, i) => (
        <span key={l.from} className="flex items-center gap-1">
          <svg width={12} height={12} aria-hidden="true"><rect width={12} height={12} className={l.fill} /></svg>
          {i === LEVELS.length - 1 ? `${num(l.from)} فأكثر` : `${num(l.from)} إلى ${num(LEVELS[i + 1].from - 1)}`}
        </span>
      ))}
    </div>
  );
}
