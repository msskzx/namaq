import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, findMany, findPeople } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findMany: vi.fn(),
  findPeople: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: { person: { findUnique, findMany: findPeople }, historicalClaim: { findMany } },
}));

import { GET } from './route';

function request(slug: string) {
  return {
    _request: new Request(`http://localhost/api/people/${slug}`),
    params: Promise.resolve({ slug }),
  };
}

describe('GET /api/people/[slug]', () => {
  beforeEach(() => {
    findUnique.mockReset();
    findMany.mockReset();
    findMany.mockResolvedValue([]);
    findPeople.mockReset();
    findPeople.mockResolvedValue([]);
  });

  it('returns the person with related titles, participations, events, ayat, and claims', async () => {
    const person = { id: '1', slug: 'prophet-muhammad', name: 'محمد' };
    const claims = [{ id: 'c1', subjectSlug: 'prophet-muhammad', relatedSubjectSlug: null, citations: [] }];
    findUnique.mockResolvedValue(person);
    findMany.mockResolvedValue(claims);

    const { _request, params } = request('prophet-muhammad');
    const response = await GET(_request, { params });
    const body = await response.json();

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: 'prophet-muhammad' },
      include: {
        titles: true,
        participations: { include: { battle: true } },
        events: true,
        ayat: { include: { surah: true } },
      },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: { subjectKind: 'PERSON', subjectSlug: 'prophet-muhammad' },
      include: { citations: { include: { source: true, passage: { include: { page: true } } } } },
      orderBy: { updatedAt: 'desc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual({ ...person, claims: claims.map((c) => ({ ...c, relatedSubjectName: null })) });
  });

  it('returns 404 when no person matches the slug', async () => {
    findUnique.mockResolvedValue(null);

    const { _request, params } = request('missing');
    const response = await GET(_request, { params });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findUnique.mockRejectedValue(new Error('boom'));

    const { _request, params } = request('prophet-muhammad');
    const response = await GET(_request, { params });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch person' });
  });
});
