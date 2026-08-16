import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findFirst } } }));

import { GET } from './route';

function call(slug: string) {
  return GET(new Request(`http://localhost/api/quran/surahs/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('GET /api/quran/surahs/[slug]', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it.each(['0', '115', 'abc'])('returns 400 for an invalid surah number "%s"', async (slug) => {
    const response = await call(slug);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid surah number' });
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns the surah with its ayat ordered by number', async () => {
    const surah = { id: '1', number: 1, ayat: [] };
    findFirst.mockResolvedValue(surah);

    const response = await call('1');
    const body = await response.json();

    expect(findFirst).toHaveBeenCalledWith({
      where: { number: 1 },
      include: { ayat: { orderBy: { number: 'asc' } } },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(surah);
  });

  it('returns 404 when no surah matches the number', async () => {
    findFirst.mockResolvedValue(null);

    const response = await call('1');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Surah not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findFirst.mockRejectedValue(new Error('boom'));

    const response = await call('1');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch surah' });
  });
});
