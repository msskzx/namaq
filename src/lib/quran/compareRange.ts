import { JUZ_STARTS, juzOf, parseJuzRange, type JuzRange } from './juz';

export type RangeUnit = 'juz' | 'surah';
export type CompareRange = { unit: RangeUnit; range: JuzRange | null };
type Query = Record<string, string | string[] | undefined>;

export const RANGE_KEYS = ['by', 'juzFrom', 'juzTo', 'surahFrom', 'surahTo'] as const;
export const RANGE_MAX: Record<RangeUnit, number> = { juz: JUZ_STARTS.length, surah: 114 };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

export function parseCompareRange(query: Query): CompareRange {
  const unit: RangeUnit = one(query.by) === 'surah' ? 'surah' : 'juz';
  const from = one(query[`${unit}From`]);
  const to = one(query[`${unit}To`]);
  if (unit === 'juz') return { unit, range: parseJuzRange(from, to) };
  if (!from && !to) return { unit, range: null };
  const clamp = (value: string | null, fallback: number) => {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
  };
  const [a, b] = [clamp(from, 1), clamp(to, 114)];
  return { unit, range: { from: Math.min(a, b), to: Math.max(a, b) } };
}

export function rangeParams({ unit, range }: CompareRange): Record<string, string> {
  return {
    ...(unit === 'surah' ? { by: 'surah' } : {}),
    ...(range ? { [`${unit}From`]: String(range.from), [`${unit}To`]: String(range.to) } : {}),
  };
}

export function ayahInRange(surah: number, ayah: number, { unit, range }: CompareRange) {
  if (!range) return true;
  const n = unit === 'juz' ? juzOf(`${surah}:${ayah}`) : surah;
  return n >= range.from && n <= range.to;
}

export function surahInRange(surah: number, { unit, range }: CompareRange) {
  if (!range) return true;
  if (unit === 'surah') return surah >= range.from && surah <= range.to;
  return juzOf(`${surah}:1`) <= range.to && juzOf(`${surah}:999`) >= range.from;
}
