import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, getSession } = vi.hoisted(() => ({ findMany: vi.fn(), getSession: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany } } }));
vi.mock('@/lib/neo4j', () => ({ getSession }));

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

function record(fields: Record<string, unknown>) {
  return { get: (key: string) => fields[key] };
}

describe('GET /api/people/suggest', () => {
  beforeEach(() => {
    findMany.mockReset();
    getSession.mockReset();
    getSession.mockReturnValue(null); // no Neo4j session unless a test opts in
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
    expect(body.data[0]).toMatchObject({ slug: 'prophet-muhammad', match: 'exact', hasProfile: true });
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

  it('merges in a graph-only person (no PostgreSQL row) with hasProfile: false', async () => {
    findMany.mockResolvedValue([person('prophet-muhammad', 'محمد')]);
    const run = vi.fn().mockResolvedValue({
      records: [record({ slug: 'malik-ibn-thalabah', name: 'Malik ibn Thalabah', nasabRank: null })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?q=malik'));
    const body = await response.json();

    expect(body.data).toEqual([
      expect.objectContaining({ slug: 'malik-ibn-thalabah', id: 'malik-ibn-thalabah', fullName: null, hasProfile: false, match: 'exact' }),
    ]);
  });

  it('does not duplicate a person who has both a PostgreSQL row and a Neo4j node', async () => {
    findMany.mockResolvedValue([person('prophet-muhammad', 'محمد')]);
    const run = vi.fn().mockResolvedValue({
      records: [record({ slug: 'prophet-muhammad', name: 'محمد', nasabRank: 1 })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?q=محمد'));
    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({ slug: 'prophet-muhammad', hasProfile: true });
  });

  it('degrades to PostgreSQL-only results when there is no Neo4j session', async () => {
    findMany.mockResolvedValue([person('prophet-muhammad', 'محمد')]);
    getSession.mockReturnValue(null);

    const response = await GET(request('?q=محمد'));

    expect(response.status).toBe(200);
    expect((await response.json()).data).toHaveLength(1);
  });
});
