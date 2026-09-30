import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findVolume, findPages, findSpans, findPeople } = vi.hoisted(() => ({
  findVolume: vi.fn(),
  findPages: vi.fn(async () => [] as { printedPage: number; bodyMarkdown: string }[]),
  findSpans: vi.fn(async () => [] as unknown[]),
  findPeople: vi.fn(async () => [] as { slug: string; name: string }[]),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    sourceVolume: { findFirst: findVolume },
    sourcePage: { findMany: findPages },
    sourceAccountSpan: { findMany: findSpans },
    person: { findMany: findPeople },
  },
}));

import { volumeContents } from './sourceAccounts';

const volume = {
  id: 'volume-1',
  number: 4,
  name: 'سير أعلام النبلاء ج١',
  firstPrintedPage: 5,
  lastPrintedPage: 558,
  skippedPrintedPages: [],
};

describe('volumeContents', () => {
  beforeEach(() => {
    findVolume.mockReset().mockResolvedValue(volume);
    findPages.mockReset().mockResolvedValue([]);
    findSpans.mockReset().mockResolvedValue([]);
    findPeople.mockReset().mockResolvedValue([]);
  });

  it('returns null for a volume the source does not declare', async () => {
    findVolume.mockResolvedValue(null);

    expect(await volumeContents('siyar-risalah', 99)).toBeNull();
  });

  it('lists every stored page flatly, not nested under whose entry it belongs to', async () => {
    findPages.mockResolvedValue([
      { printedPage: 201, bodyMarkdown: 'نص أول' },
      { printedPage: 202, bodyMarkdown: 'نص ثانٍ' },
    ]);

    const contents = await volumeContents('siyar-risalah', 4);

    // Ordering itself is the query's own `orderBy: { printedPage: 'asc' }`
    // (not re-sorted here); what this checks is that the result is one flat
    // list of pages, not a list of accounts each holding their own pages.
    expect(contents!.items.map((item) => item.printedPage)).toEqual(['201', '202']);
    expect(findPages).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { printedPage: 'asc' } }),
    );
  });

  it("labels an entry by the account's own title, falling back to the subject's name then slug", async () => {
    findPages.mockResolvedValue([{ printedPage: 202, bodyMarkdown: 'نص' }]);
    findSpans.mockResolvedValue([
      {
        firstPrintedPage: 202,
        account: { id: 'acc-1', subjectKind: 'PERSON', subjectSlug: 'saeed-ibn-al-harith', titleArabic: null, entryIdentifier: '31' },
      },
    ]);
    findPeople.mockResolvedValue([{ slug: 'saeed-ibn-al-harith', name: 'سعيد بن الحارث' }]);

    const contents = await volumeContents('siyar-risalah', 4);

    expect(contents!.items[0].entries).toEqual([
      { accountId: 'acc-1', subjectKind: 'PERSON', subjectSlug: 'saeed-ibn-al-harith', label: 'سعيد بن الحارث' },
    ]);
  });

  it('reads every heading a page declares', async () => {
    findPages.mockResolvedValue([{ printedPage: 29, bodyMarkdown: '[الباب الأول:]\n\nنص.\n\n[الباب الثاني:]\n\nنص آخر.' }]);

    const contents = await volumeContents('siyar-risalah', 1);

    expect(contents!.items[0].headings).toEqual(['الباب الأول', 'الباب الثاني']);
  });

  it('lists more than one entry when a page is shared', async () => {
    findPages.mockResolvedValue([{ printedPage: 186, bodyMarkdown: 'نص' }]);
    findSpans.mockResolvedValue([
      { firstPrintedPage: 186, account: { id: 'acc-1', subjectKind: 'PERSON', subjectSlug: 'khalid-ibn-al-bukayr', titleArabic: null, entryIdentifier: '17' } },
      { firstPrintedPage: 186, account: { id: 'acc-2', subjectKind: 'PERSON', subjectSlug: 'iyas-ibn-al-bukayr', titleArabic: null, entryIdentifier: '18' } },
    ]);
    findPeople.mockResolvedValue([
      { slug: 'khalid-ibn-al-bukayr', name: 'خالد بن البكير' },
      { slug: 'iyas-ibn-al-bukayr', name: 'إياس بن البكير' },
    ]);

    const contents = await volumeContents('siyar-risalah', 4);

    expect(contents!.items[0].entries).toHaveLength(2);
  });
});
