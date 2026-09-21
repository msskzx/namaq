import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findFirst, findMany } = vi.hoisted(() => ({ findFirst: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { sourceAccount: { findFirst }, sourceAccountPage: { findMany } },
}));

import { GET } from './route';

function call(slug: string, query = '') {
  return GET(new Request(`http://localhost/api/people/${slug}/accounts/sections${query}`), {
    params: Promise.resolve({ slug }),
  });
}

describe('GET /api/people/[slug]/accounts/sections', () => {
  beforeEach(() => {
    findFirst.mockReset();
    findMany.mockReset();
  });

  it('requires an account', async () => {
    const response = await call('abu-ubaydah-ibn-al-jarrah');

    expect(response.status).toBe(400);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('rejects an account that does not belong to this person', async () => {
    findFirst.mockResolvedValue(null);

    const response = await call('abu-ubaydah-ibn-al-jarrah', '?account=account-elsewhere');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Unknown account for this person' });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('collects every heading across the account\'s pages, in page order', async () => {
    findFirst.mockResolvedValue({ id: 'account-siyar' });
    findMany.mockResolvedValue([
      { sequence: 1, printedPage: '29', bodyMarkdown: '[الباب الأول:]\n\nنص.' },
      { sequence: 2, printedPage: '30', bodyMarkdown: 'نص بلا عنوان.' },
      { sequence: 3, printedPage: '31', bodyMarkdown: '[الباب الثاني:]\n\nنص آخر.' },
    ]);

    const body = await (await call('abu-ubaydah-ibn-al-jarrah', '?account=account-siyar')).json();

    expect(body.sections).toEqual([
      { sequence: 1, printedPage: '29', heading: 'الباب الأول' },
      { sequence: 3, printedPage: '31', heading: 'الباب الثاني' },
    ]);
  });

  it('reports a database failure as a failure', async () => {
    findFirst.mockRejectedValue(new Error('boom'));

    const response = await call('abu-ubaydah-ibn-al-jarrah', '?account=account-siyar');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch the section index' });
  });
});
