import type { WordGroup } from './readerPage';

/** Lines of the ayah before that a slice shows at most (owner, 2026-11-14: the recall card shows the mushaf around the ayah). */
export const CONTEXT_LINES = 2;

type Item = { line: unknown } | { surah: number } | { basmala: true } | object;

/**
 * The rows of a mushaf page that show an ayah as the page sets it, with a little of what comes before: up to
 * CONTEXT_LINES lines of the ayah before it, or a surah's title and basmala when the ayah opens its surah, then every line
 * of the ayah. `before` is true when the ayah before is on the previous page (an ayah never runs across two pages), so the
 * previous page's last lines go above. `lines` are the page's groups (pageGroups), `items` its rows.
 */
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

/** The last rows of a page that show the end of its last ayah: its last CONTEXT_LINES lines. */
export function pageEnd(items: readonly Item[]): { from: number; to: number } {
  const lineRows = items.flatMap((item, at) => ('line' in item ? [at] : []));
  return { from: lineRows[Math.max(0, lineRows.length - CONTEXT_LINES)] ?? 0, to: items.length - 1 };
}

/** A page's first rows, as the home page's reading card shows them: `count` ayah lines, with any surah title or basmala among them. */
export function pageTop(items: readonly Item[], count = 3): { from: number; to: number } {
  const lineRows = items.flatMap((item, at) => ('line' in item ? [at] : []));
  return { from: 0, to: lineRows[Math.min(count, lineRows.length) - 1] ?? items.length - 1 };
}
