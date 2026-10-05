import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, findMany, findPeople, findEntries, findSpans } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findMany: vi.fn(),
  findPeople: vi.fn(),
  findEntries: vi.fn(),
  findSpans: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    person: { findUnique, findMany: findPeople },
    historicalClaim: { findMany },
    modelProfileEntry: { findMany: findEntries },
    modelSpan: { findMany: findSpans },
  },
}));

import { GET } from './route';
import { utteranceSelect } from '@/lib/utteranceSelect';

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
    findEntries.mockReset();
    findEntries.mockResolvedValue([]);
    findSpans.mockReset();
    findSpans.mockResolvedValue([]);
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
        virtues: { orderBy: { position: 'asc' } },
        participations: { include: { battle: true } },
        events: true,
        ayat: { include: { surah: true } },
        said: { select: utteranceSelect, orderBy: { slug: 'asc' } },
        spokenAbout: { select: utteranceSelect, orderBy: { slug: 'asc' } },
      },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: { subjectKind: 'PERSON', subjectSlug: 'prophet-muhammad' },
      include: {
        citations: { include: { source: true, passage: { include: { page: { include: { volume: true } } } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual({
      ...person,
      claims: claims.map((c) => ({ ...c, relatedSubjectName: null })),
      modelEntries: [],
      modelSpans: [],
    });
  });

  it('adds the values read from the book, with the spans they cite', async () => {
    findUnique.mockResolvedValue({ id: '1', slug: 'az-zubayr-ibn-al-awwam', name: 'الزبير' });
    findEntries.mockResolvedValue([
      { unit: 'u1', assertionId: 'a_kunya', agent: 'az-zubayr-ibn-al-awwam', spanIds: ['sp_kunya'] },
    ]);
    findSpans.mockResolvedValue([{ unit: 'u1', spanId: 'sp_kunya', witness: 'w', volume: 4, page: '41' }]);

    const { _request, params } = request('az-zubayr-ibn-al-awwam');
    const body = await (await GET(_request, { params })).json();

    expect(findEntries).toHaveBeenCalledWith({
      where: { agent: 'az-zubayr-ibn-al-awwam' },
      orderBy: [{ predicate: 'asc' }, { assertionId: 'asc' }],
    });
    expect(findSpans).toHaveBeenCalledWith({ where: { OR: [{ unit: 'u1', spanId: 'sp_kunya' }] } });
    expect(body.modelEntries).toHaveLength(1);
    expect(body.modelSpans).toHaveLength(1);
  });

  it('does not ask for spans when a person has no model entries', async () => {
    findUnique.mockResolvedValue({ id: '1', slug: 'x', name: 'x' });
    const { _request, params } = request('x');
    await GET(_request, { params });
    expect(findSpans).not.toHaveBeenCalled();
  });

  it('still returns the person when the model tables are unavailable', async () => {
    findUnique.mockResolvedValue({ id: '1', slug: 'x', name: 'x' });
    findEntries.mockRejectedValue(new Error('relation "model_profile_entries" does not exist'));
    const { _request, params } = request('x');
    const response = await GET(_request, { params });
    expect(response.status).toBe(200);
    expect((await response.json()).modelEntries).toEqual([]);
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
