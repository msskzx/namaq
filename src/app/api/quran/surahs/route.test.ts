import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany } } }));

import { GET } from './route';

describe('GET /api/quran/surahs', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('lists surahs ordered by number', async () => {
    const surahs = [{ id: '1', number: 1, name: 'الفاتحة' }];
    findMany.mockResolvedValue(surahs);

    const response = await GET();
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { number: 'asc' } })
    );
    expect(response.status).toBe(200);
    expect(body).toEqual(surahs);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch surahs' });
  });
});
