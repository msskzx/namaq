import { describe, expect, it } from 'vitest';
import { journalRows, juzRow, keptJuz, type JournalEntry } from './journal';

const kept: JournalEntry[] = [
  { id: 'hadith', kind: 'saved', at: 5 },
  { id: '112:2', kind: 'forgotten', at: 3, ayah: '112:2' },
  { id: 'ayah:2:255', kind: 'saved', at: 4, ayah: '2:255' },
  { id: '2:255', kind: 'note', at: 9, ayah: '2:255' },
  { id: '2:3', kind: 'forgotten', at: 1, ayah: '2:3' },
  { id: 'battle', kind: 'saved', at: 8 },
];

describe('the journal in the mushaf order', () => {
  const rows = journalRows(kept);
  const ids = rows.map(row => (row.row === 'entry' ? row.entry.id : row.row === 'surah' ? `surah ${row.surah}` : 'others'));

  it('puts each surah\'s name before its entries, the surahs and ayat in order, and what has no ayah after them, latest first', () => {
    expect(ids).toEqual(['surah 2', '2:3', '2:255', 'ayah:2:255', 'surah 112', '112:2', 'others', 'battle', 'hadith']);
  });

  it('a tap on a juz goes to the first thing kept in it, and only juz with something kept are marked', () => {
    // البقرة ٢٥٥ is in the third juz, after the surah's header (which belongs to the first).
    expect(rows[juzRow(rows, 3)]).toMatchObject({ row: 'entry', entry: { id: '2:255' } });
    expect(juzRow(rows, 30)).toBe(ids.indexOf('surah 112'));
    expect(juzRow(rows, 10)).toBe(-1);
    expect([...keptJuz(rows)].sort((a, b) => a - b)).toEqual([1, 3, 30]);
  });
});
