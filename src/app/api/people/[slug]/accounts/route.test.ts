import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findAccounts, findAccount, findSpans, findVolumes, findPage, findPeople } = vi.hoisted(() => ({
  findAccounts: vi.fn(),
  // readPage/readPages/sectionIndex each resolve the account's own sourceId
  // and extractionUrl before touching its spans or the store.
  findAccount: vi.fn(),
  // ...then read the spans (one per volume the entry's pages fall in) that
  // translate a 1-based `sequence` into a real `(volume, printedPage)`.
  findSpans: vi.fn(async () => [] as unknown[]),
  // ...and the source's volumes, to turn a volume number into its row id.
  findVolumes: vi.fn(async () => [] as { id: string; number: number }[]),
  findPage: vi.fn(),
  // listAccounts resolves each PERSON subject's own name so a reader that does
  // not already know whose entry it is can label it with something but a slug.
  findPeople: vi.fn(async () => []),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    sourceAccount: { findMany: findAccounts, findUnique: findAccount, findFirst: vi.fn() },
    sourceAccountSpan: { findMany: findSpans },
    sourceVolume: { findMany: findVolumes },
    sourcePage: { findUnique: findPage },
    person: { findMany: findPeople },
  },
}));

import { GET } from './route';

function call(slug: string, query = '') {
  return GET(new Request(`http://localhost/api/people/${slug}/accounts${query}`), {
    params: Promise.resolve({ slug }),
  });
}

const siyar = {
  id: 'account-siyar',
  subjectKind: 'PERSON',
  subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
  entryIdentifier: '1',
  titleArabic: null,
  extractionUrl: 'https://shamela.ws/book/10906/1431',
  source: { slug: 'siyar-alam-al-nubala-risalah', title: 'سير أعلام النبلاء' },
  spans: [{ firstPrintedPage: 5, lastPrintedPage: 23, volume: { number: 1, name: null } }],
};

const hilya = {
  ...siyar,
  id: 'account-hilya',
  source: { slug: 'hilyat-al-awliya', title: 'حلية الأولياء' },
  spans: [{ firstPrintedPage: 1, lastPrintedPage: 3, volume: { number: 1, name: null } }],
};

const storePage = { printedPage: 5, bodyMarkdown: 'نص', notesMarkdown: null, extractionUrl: null, passages: [] };

describe('GET /api/people/[slug]/accounts', () => {
  beforeEach(() => {
    findAccounts.mockReset().mockResolvedValue([siyar]);
    findAccount.mockReset().mockResolvedValue({ sourceId: 'source-siyar', extractionUrl: siyar.extractionUrl });
    findSpans.mockReset().mockResolvedValue(siyar.spans);
    findVolumes.mockReset().mockResolvedValue([{ id: 'volume-1', number: 1 }]);
    findPage.mockReset().mockResolvedValue(storePage);
  });

  it('serves the first account and its first page by default', async () => {
    const body = await (await call('abu-ubaydah-ibn-al-jarrah')).json();

    expect(body.account.id).toBe('account-siyar');
    expect(body.account.pageCount).toBe(19);
    expect(body.page).toEqual({ ...storePage, printedPage: '5', sequence: 1, extractionUrl: siyar.extractionUrl });
    expect(findPage).toHaveBeenCalledWith(
      expect.objectContaining({ where: { volumeId_printedPage: { volumeId: 'volume-1', printedPage: 5 } } }),
    );
  });

  it('lists every account so the reader can switch book', async () => {
    findAccounts.mockResolvedValue([siyar, hilya]);

    const body = await (await call('abu-ubaydah-ibn-al-jarrah')).json();

    expect(body.accounts.map((account: { id: string }) => account.id)).toEqual(['account-siyar', 'account-hilya']);
  });

  it('serves the requested account and page', async () => {
    findAccounts.mockResolvedValue([siyar, hilya]);
    findSpans.mockResolvedValue(hilya.spans);

    await call('abu-ubaydah-ibn-al-jarrah', '?account=account-hilya&page=3');

    expect(findPage).toHaveBeenCalledWith(
      expect.objectContaining({ where: { volumeId_printedPage: { volumeId: 'volume-1', printedPage: 3 } } }),
    );
  });

  it('returns printed page labels with their volume for reader navigation', async () => {
    const body = await (await call('abu-ubaydah-ibn-al-jarrah')).json();

    expect(body.pageNumbers).toEqual(
      Array.from({ length: 19 }, (_, index) => ({ sequence: index + 1, printedPage: String(5 + index), volume: { number: 1 } })),
    );
  });

  it('reports no accounts as an empty result, not an error', async () => {
    findAccounts.mockResolvedValue([]);

    const response = await call('someone');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ accounts: [], account: null, page: null });
    expect(findPage).not.toHaveBeenCalled();
  });

  it('rejects an account that does not belong to this person', async () => {
    const response = await call('abu-ubaydah-ibn-al-jarrah', '?account=account-elsewhere');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Unknown account for this person' });
  });

  it('rejects a page beyond the account', async () => {
    findPage.mockResolvedValue(null);

    const response = await call('abu-ubaydah-ibn-al-jarrah', '?page=99');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Page 99 is outside this account', pageCount: 19 });
  });

  it.each(['0', '-2', 'abc'])('rejects page=%s', async (value) => {
    const response = await call('abu-ubaydah-ibn-al-jarrah', `?page=${value}`);

    expect(response.status).toBe(400);
    expect(findAccounts).not.toHaveBeenCalled();
  });

  it('reports a database failure as a failure', async () => {
    findAccounts.mockRejectedValue(new Error('boom'));

    const response = await call('abu-ubaydah-ibn-al-jarrah');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch source accounts' });
  });
});
