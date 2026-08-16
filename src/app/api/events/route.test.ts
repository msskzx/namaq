import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { event: { findMany } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/events${query}`);
}

describe('GET /api/events', () => {
  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([]);
  });

  it('lists events ordered by year with a default take of 20', async () => {
    await GET(request(''));

    const call = findMany.mock.calls[0][0];
    expect(call.where).toEqual({});
    expect(call.orderBy).toEqual([{ hijriYear: 'asc' }, { gregorianYear: 'asc' }]);
    expect(call.take).toBe(20);
  });

  it('filters by event type', async () => {
    await GET(request('?type=BATTLE'));

    expect(findMany.mock.calls[0][0].where).toEqual({ type: 'BATTLE' });
  });

  it('searches name, transliterated name, and description', async () => {
    await GET(request('?search=badr'));

    expect(findMany.mock.calls[0][0].where.OR).toEqual([
      { name: { contains: 'badr', mode: 'insensitive' } },
      { nameTransliterated: { contains: 'badr', mode: 'insensitive' } },
      { description: { contains: 'badr', mode: 'insensitive' } },
    ]);
  });

  it('merges a year filter into an existing search OR clause', async () => {
    await GET(request('?search=badr&year=2'));

    const where = findMany.mock.calls[0][0].where;
    expect(where.OR).toHaveLength(5);
    expect(where.OR).toEqual(
      expect.arrayContaining([{ hijriYear: 2 }, { gregorianYear: 2 }])
    );
  });

  it('ignores a non-numeric year', async () => {
    await GET(request('?year=not-a-number'));

    expect(findMany.mock.calls[0][0].where.OR).toBeUndefined();
  });

  it('caps the requested limit at 100', async () => {
    await GET(request('?limit=500'));

    expect(findMany.mock.calls[0][0].take).toBe(100);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET(request(''));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch events' });
  });
});
