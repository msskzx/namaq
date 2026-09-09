import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, findUnique } = vi.hoisted(() => ({ findMany: vi.fn(), findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { sourceAccount: { findMany }, sourceAccountPage: { findUnique } },
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
  volume: '1',
  extractionUrl: 'https://shamela.ws/book/10906/1431',
  source: { slug: 'siyar-alam-al-nubala-risalah', title: 'سير أعلام النبلاء' },
  _count: { pages: 19 },
};

const hilya = { ...siyar, id: 'account-hilya', source: { slug: 'hilyat-al-awliya', title: 'حلية الأولياء' }, _count: { pages: 3 } };

const page = { sequence: 1, printedPage: '5', bodyMarkdown: 'نص', notesMarkdown: null, extractionUrl: null };

describe('GET /api/people/[slug]/accounts', () => {
  beforeEach(() => {
    findMany.mockReset();
    findUnique.mockReset();
    findMany.mockResolvedValue([siyar]);
    findUnique.mockResolvedValue(page);
  });

  it('serves the first account and its first page by default', async () => {
    const body = await (await call('abu-ubaydah-ibn-al-jarrah')).json();

    expect(body.account.id).toBe('account-siyar');
    expect(body.account.pageCount).toBe(19);
    expect(body.page).toEqual(page);
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId_sequence: { accountId: 'account-siyar', sequence: 1 } },
      }),
    );
  });

  it('lists every account so the reader can switch book', async () => {
    findMany.mockResolvedValue([siyar, hilya]);

    const body = await (await call('abu-ubaydah-ibn-al-jarrah')).json();

    expect(body.accounts.map((account: { id: string }) => account.id)).toEqual(['account-siyar', 'account-hilya']);
  });

  it('serves the requested account and page', async () => {
    findMany.mockResolvedValue([siyar, hilya]);

    await call('abu-ubaydah-ibn-al-jarrah', '?account=account-hilya&page=3');

    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId_sequence: { accountId: 'account-hilya', sequence: 3 } },
      }),
    );
  });

  it('reports no accounts as an empty result, not an error', async () => {
    findMany.mockResolvedValue([]);

    const response = await call('someone');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ accounts: [], account: null, page: null });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('rejects an account that does not belong to this person', async () => {
    const response = await call('abu-ubaydah-ibn-al-jarrah', '?account=account-elsewhere');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Unknown account for this person' });
  });

  it('rejects a page beyond the account', async () => {
    findUnique.mockResolvedValue(null);

    const response = await call('abu-ubaydah-ibn-al-jarrah', '?page=99');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Page 99 is outside this account', pageCount: 19 });
  });

  it.each(['0', '-2', 'abc'])('rejects page=%s', async (value) => {
    const response = await call('abu-ubaydah-ibn-al-jarrah', `?page=${value}`);

    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('reports a database failure as a failure', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await call('abu-ubaydah-ibn-al-jarrah');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch source accounts' });
  });
});
