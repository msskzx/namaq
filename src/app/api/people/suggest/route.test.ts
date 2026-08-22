import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/people/suggest${query}`);
}

function person(slug: string, name: string) {
  return {
    id: slug,
    slug,
    name,
    fullName: null,
    nameTransliterated: null,
    nasabRank: null,
    _count: { titles: 0 },
  };
}

describe('GET /api/people/suggest', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('returns an empty list without querying the database when q is blank', async () => {
    const response = await GET(request('?q=%20'));
    const body = await response.json();

    expect(findMany).not.toHaveBeenCalled();
    expect(body).toEqual({ data: [] });
  });

  it('ranks matches and attaches the match type', async () => {
    findMany.mockResolvedValue([person('prophet-muhammad', 'محمد'), person('other', 'Other')]);

    const response = await GET(request('?q=محمد'));
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        slug: true,
        name: true,
        fullName: true,
        nameTransliterated: true,
        nasabRank: true,
        _count: { select: { titles: true } },
      },
    });
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({ slug: 'prophet-muhammad', match: 'exact' });
  });

  it('clamps limit to the 1-20 range', async () => {
    const people = Array.from({ length: 30 }, (_, i) => person(`person-${i}`, 'Ahmad'));
    findMany.mockResolvedValue(people);

    const response = await GET(request('?q=ahmad&limit=100'));
    const body = await response.json();

    expect(body.data).toHaveLength(20);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET(request('?q=ahmad'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch people suggestions' });
  });
});
