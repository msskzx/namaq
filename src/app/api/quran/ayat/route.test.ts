import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findFirst, findMany } = vi.hoisted(() => ({ findFirst: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { ayah: { findFirst, findMany } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/quran/ayat${query}`);
}

describe('GET /api/quran/ayat', () => {
  beforeEach(() => {
    findFirst.mockReset();
    findMany.mockReset();
  });

  it('returns 400 when no pairs are provided', async () => {
    const response = await GET(request(''));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Provide surah:ayah parameters' });
  });

  it('drops malformed tokens, leaving no pairs', async () => {
    const response = await GET(request('?q=abc:def'));

    expect(response.status).toBe(400);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns 400 for an out-of-range surah number', async () => {
    const response = await GET(request('?q=115:1'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid surah or ayah number in query' });
  });

  it('fetches a single ayah by surah:ayah', async () => {
    const ayah = { id: '1', number: 1, surah: { number: 1 } };
    findFirst.mockResolvedValue(ayah);

    const response = await GET(request('?q=1:1'));
    const body = await response.json();

    expect(findFirst).toHaveBeenCalledWith({
      where: { number: 1, surah: { number: 1 } },
      include: { surah: expect.any(Object) },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(ayah);
  });

  it('returns 404 when the single requested ayah is not found', async () => {
    findFirst.mockResolvedValue(null);

    const response = await GET(request('?q=1:1'));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Ayah not found' });
  });

  it('fetches multiple ayat with OR and orders by global number', async () => {
    const ayat = [{ id: '1' }, { id: '2' }];
    findMany.mockResolvedValue(ayat);

    const response = await GET(request('?q=1:1,2:2'));
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      where: { OR: [{ number: 1, surah: { number: 1 } }, { number: 2, surah: { number: 2 } }] },
      include: { surah: expect.any(Object) },
      orderBy: { globalNumber: 'asc' },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(ayat);
  });

  it('returns 404 when none of the multiple requested ayat are found', async () => {
    findMany.mockResolvedValue([]);

    const response = await GET(request('?q=1:1,2:2'));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Ayat not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findFirst.mockRejectedValue(new Error('boom'));

    const response = await GET(request('?q=1:1'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch ayah(s)' });
  });
});
