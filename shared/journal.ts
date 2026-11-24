/**
 * «مدونتي» in the mushaf's order (owner, 2026-11-24): everything the reader kept on an ayah (saved, forgotten, a note) under
 * its surah's name, the surahs in order, then what is kept elsewhere (hadith, tarajim, other cards), latest first.
 * Pure ordering; the cards themselves are drawn as on the homepage.
 */
import { juzOf } from './quran/juz';

export type JournalKind = 'saved' | 'forgotten' | 'note';
export type JournalEntry = { id: string; kind: JournalKind; at: number; ayah?: string };
export type JournalRow =
  | { row: 'surah'; surah: number; juz: number }
  | { row: 'others' }
  | { row: 'entry'; entry: JournalEntry; juz?: number };

const place = (key: string) => key.split(':').map(Number);
const KIND_ORDER: Record<JournalKind, number> = { forgotten: 0, note: 1, saved: 2 };

/** The rows of the journal: a surah's header before its first entry, the entries in ayah order, then the rest under one header. */
export function journalRows(entries: readonly JournalEntry[]): JournalRow[] {
  const onAyah = entries.filter(entry => entry.ayah).sort((a, b) => {
    const [x, y] = [place(a.ayah!), place(b.ayah!)];
    return x[0] - y[0] || x[1] - y[1] || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || b.at - a.at;
  });
  const elsewhere = entries.filter(entry => !entry.ayah).sort((a, b) => b.at - a.at);
  const rows: JournalRow[] = [];
  let surah = 0;
  for (const entry of onAyah) {
    const [number] = place(entry.ayah!);
    const juz = juzOf(entry.ayah!);
    if (number !== surah) rows.push({ row: 'surah', surah: (surah = number), juz });
    rows.push({ row: 'entry', entry, juz });
  }
  if (elsewhere.length) rows.push({ row: 'others' }, ...elsewhere.map(entry => ({ row: 'entry' as const, entry })));
  return rows;
}

/** Where the strip's tap on a juz goes: the first row that falls in it (a surah's header, or an entry if the surah began in an earlier juz). */
export function juzRow(rows: readonly JournalRow[], juz: number): number {
  return rows.findIndex(row => row.row !== 'others' && row.juz === juz);
}

/** The juz that hold anything kept, for the strip at the top. */
export const keptJuz = (rows: readonly JournalRow[]) => new Set(rows.flatMap(row => (row.row === 'entry' && row.juz ? [row.juz] : [])));
