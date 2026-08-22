import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, count } = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany, count } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/people${query}`);
}

function person(slug: string, name: string) {
  return { id: slug, slug, name, fullName: null, nameTransliterated: null, nasabRank: null, titles: [] };
}

describe('GET /api/people', () => {
  beforeEach(() => {
    findMany.mockReset();
    count.mockReset();
  });

  it('rejects an invalid page number', async () => {
    const response = await GET(request('?page=0'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid pagination parameters' });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('rejects an invalid limit', async () => {
    const response = await GET(request('?limit=0'));

    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('lists people ordered by name with pagination metadata when there is no search term', async () => {
    count.mockResolvedValue(2);
    findMany.mockResolvedValue([person('a', 'A'), person('b', 'B')]);

    const response = await GET(request(''));
    const body = await response.json();

    expect(count).toHaveBeenCalledWith({ where: {} });
    expect(findMany).toHaveBeenCalledWith({
      where: {},
      include: { titles: true },
      orderBy: [{ nasabRank: { sort: 'asc', nulls: 'last' } }, { titles: { _count: 'desc' } }, { name: 'asc' }],
      take: 12,
      skip: 0,
    });
    expect(body.data).toHaveLength(2);
    expect(body.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('filters by title slug', async () => {
    count.mockResolvedValue(0);
    findMany.mockResolvedValue([]);

    await GET(request('?title=sahabi'));

    expect(count).toHaveBeenCalledWith({ where: { titles: { some: { slug: 'sahabi' } } } });
  });

  it('ranks and paginates in-memory when a search term is given, without counting in the DB', async () => {
    findMany.mockResolvedValue([person('prophet-muhammad', 'محمد'), person('other', 'Other')]);

    const response = await GET(request('?search=محمد&limit=1'));
    const body = await response.json();

    expect(count).not.toHaveBeenCalled();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].slug).toBe('prophet-muhammad');
    expect(body.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('returns 500 when the database call fails', async () => {
    count.mockRejectedValue(new Error('boom'));

    const response = await GET(request(''));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch people data' });
  });
});
