import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, count } = vi.hoisted(() => ({ findMany: vi.fn(), count: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { historicalClaim: { findMany }, sourceAccount: { count } },
}));

import { GET } from './route';

function call(kind: string, slug: string) {
  return GET(new Request(`http://localhost/api/subjects/${kind}/${slug}/references`), {
    params: Promise.resolve({ kind, slug }),
  });
}

describe('GET /api/subjects/[kind]/[slug]/references', () => {
  beforeEach(() => {
    findMany.mockReset();
    count.mockReset();
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
  });

  it('serves evidence for a person', async () => {
    const claims = [{ id: 'c1', reviewStatus: 'NOT_REVIEWED', citations: [] }];
    findMany.mockResolvedValue(claims);
    count.mockResolvedValue(1);

    const response = await call('person', 'abu-ubaydah-ibn-al-jarrah');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      subjectKind: 'PERSON',
      subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
      claims,
      accountCount: 1,
    });
  });

  it.each(['title', 'battle', 'event'])('serves evidence for a %s', async (kind) => {
    const response = await call(kind, 'some-slug');

    expect(response.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { subjectKind: kind.toUpperCase(), subjectSlug: 'some-slug' } }),
    );
  });

  it('serves a subject that has no profile row without consulting one', async () => {
    const response = await call('person', 'graph-only-person');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ claims: [], accountCount: 0 });
  });

  it('returns claims at every review status', async () => {
    findMany.mockResolvedValue([
      { id: 'a', reviewStatus: 'NOT_REVIEWED', citations: [] },
      { id: 'b', reviewStatus: 'IN_REVIEW', citations: [] },
      { id: 'c', reviewStatus: 'REVIEWED', citations: [] },
    ]);

    const body = await (await call('person', 'someone')).json();

    expect(body.claims.map((claim: { reviewStatus: string }) => claim.reviewStatus)).toEqual([
      'NOT_REVIEWED',
      'IN_REVIEW',
      'REVIEWED',
    ]);
    expect(findMany.mock.calls[0][0].where).not.toHaveProperty('reviewStatus');
  });

  it('rejects an unknown subject kind', async () => {
    const response = await call('planet', 'mars');

    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('reports a database failure as a failure, not as absent evidence', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await call('person', 'someone');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch references' });
  });
});
