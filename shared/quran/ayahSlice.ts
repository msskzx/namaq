import type { WordGroup } from './readerPage';

export const CONTEXT_LINES = 2;

type Item = { line: unknown } | { surah: number } | { basmala: true } | object;

export function ayahSlice(lines: readonly (WordGroup[] | null)[], items: readonly Item[], key: string): { from: number; to: number; before: boolean } | null {
  const holding = (wanted: string) => lines.flatMap((line, at) => (line?.some(group => `${group.surah}:${group.ayah}` === wanted && group.word) ? [at] : []));
  const own = holding(key);
  if (!own.length) return null;
  const [surah, ayah] = key.split(':').map(Number);
  const first = own[0];
  const to = own[own.length - 1];
  if (ayah === 1) {
    let from = first;
    while (from > 0 && !('line' in items[from - 1])) from--;
    return { from, to, before: false };
  }
  const previous = holding(`${surah}:${ayah - 1}`);
  if (!previous.length) return { from: first, to, before: true };
  return { from: Math.max(previous[0], first - CONTEXT_LINES), to, before: false };
}

export function pageEnd(items: readonly Item[]): { from: number; to: number } {
  const lineRows = items.flatMap((item, at) => ('line' in item ? [at] : []));
  return { from: lineRows[Math.max(0, lineRows.length - CONTEXT_LINES)] ?? 0, to: items.length - 1 };
}

export const READING_LINES = 8;

export function pageTop(items: readonly Item[], count = 3): { from: number; to: number } {
  const lineRows = items.flatMap((item, at) => ('line' in item ? [at] : []));
  return { from: 0, to: lineRows[Math.min(count, lineRows.length) - 1] ?? items.length - 1 };
}

export function rangeSlice(lines: readonly (WordGroup[] | null)[], items: readonly Item[], from: string, to: string): { from: number; to: number } | null {
  const [surah, first] = from.split(':').map(Number);
  const last = Number(to.split(':')[1]);
  const rows = lines.flatMap((line, at) => (line?.some(group => group.word && group.surah === surah && group.ayah !== undefined && group.ayah >= first && group.ayah <= last) ? [at] : []));
  if (!rows.length) return null;
  let start = rows[0];
  if (first === 1 && lines[start]?.some(group => group.word && group.surah === surah && group.ayah === 1)) {
    while (start > 0 && !('line' in items[start - 1])) start--;
  }
  return { from: start, to: rows[rows.length - 1] };
}
