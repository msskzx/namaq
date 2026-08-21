import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { ayah: { findMany } } }));

import { GET } from './route';

function call(slug: string) {
  return GET(new Request(`http://localhost/api/quran/pages/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('GET /api/quran/pages/[slug]', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it.each(['0', '605', 'abc'])('returns 400 for an invalid page number "%s"', async (slug) => {
    const response = await call(slug);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid page number' });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns the ayat on the page ordered by global number', async () => {
    const ayat = [{ id: '1', page: 1 }, { id: '2', page: 1 }];
    findMany.mockResolvedValue(ayat);

    const response = await call('1');
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      where: { page: 1 },
      orderBy: { globalNumber: 'asc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(ayat);
  });

  it('returns 200 with an empty list when the page has no ayat', async () => {
    findMany.mockResolvedValue([]);

    const response = await call('1');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await call('1');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch ayah' });
  });
});
