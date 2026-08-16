import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { battle: { findMany } } }));

import { GET } from './route';

describe('GET /api/battles', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('lists battles ordered by hijri year', async () => {
    const battles = [{ id: '1', slug: 'badr', name: 'بدر' }];
    findMany.mockResolvedValue(battles);

    const response = await GET();
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        nameTransliterated: true,
        slug: true,
        hijriYear: true,
        location: true,
        locationEn: true,
      },
      orderBy: { hijriYear: 'asc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(battles);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch battles' });
  });
});
