import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findUnique } } }));

import { GET } from './route';

function request(slug: string) {
  return {
    _request: new Request(`http://localhost/api/people/${slug}/preview`),
    params: Promise.resolve({ slug }),
  };
}

describe('GET /api/people/[slug]/preview', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns only the full name and titles', async () => {
    const preview = { fullName: 'محمد بن عبد الله', titles: [{ name: 'رسول الله', slug: 'messenger-of-allah' }] };
    findUnique.mockResolvedValue(preview);

    const { _request, params } = request('prophet-muhammad');
    const response = await GET(_request, { params });
    const body = await response.json();

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: 'prophet-muhammad' },
      select: { fullName: true, titles: { select: { name: true, slug: true } } },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(preview);
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
    expect(await response.json()).toEqual({ error: 'Failed to fetch person preview' });
  });
});
