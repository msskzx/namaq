import { describe, expect, it } from 'vitest';
import { volumeChapterRows } from './volumeChapters';

describe('volumeChapterRows', () => {
  it('drops a page with neither a heading nor an entry', () => {
    const rows = volumeChapterRows([
      { printedPage: '29', entries: [], headings: ['السيرة النبوية'] },
      { printedPage: '30', entries: [], headings: [] },
    ]);

    expect(rows.map((row) => row.item.printedPage)).toEqual(['29']);
  });

  it('titles a row by its lead heading over the entry that opens there', () => {
    const rows = volumeChapterRows([
      {
        printedPage: '32',
        entries: [{ accountId: 'a1', subjectKind: 'PERSON', subjectSlug: 'prophet-muhammad', label: 'محمد ﷺ' }],
        headings: ['مولده المبارك'],
      },
    ]);

    expect(rows[0].title).toBe('مولده المبارك');
  });

  it('falls back to the entry label when a page opens one with no heading of its own', () => {
    const rows = volumeChapterRows([
      {
        printedPage: '258',
        entries: [{ accountId: 'a2', subjectKind: 'PERSON', subjectSlug: 'al-kilabiyyah', label: 'الكلابية' }],
        headings: [],
      },
    ]);

    expect(rows[0].title).toBe('الكلابية');
  });
});
