import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { title: { findMany } } }));

import { GET } from './route';

describe('GET /api/titles', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('lists titles ordered by name', async () => {
    findMany.mockResolvedValue([{ id: '1', slug: 'sahabi', name: 'صحابي', _count: { people: 3 } }]);

    const response = await GET();
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      select: { id: true, name: true, nameTransliterated: true, slug: true, _count: { select: { people: true } } },
      orderBy: { name: 'asc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: '1', slug: 'sahabi', name: 'صحابي', peopleCount: 3 }]);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch titles' });
  });
});
