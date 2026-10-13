import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany } } }));

import { buildRepetition, type RepetitionInput } from '@/lib/quran/repetition';
import { GET } from './route';

const LETTERS = 'ابتثجحخ';
const MORE = 'دذرزسشص';
const word = (prefix: string, i: number) => `${prefix}${LETTERS[i % 7]}${MORE[Math.floor(i / 7) % 7]}`;
const span = (prefix: string, from: number, n: number) => Array.from({ length: n }, (_, k) => word(prefix, from + k));

const shared = span('ك', 0, 12).join(' ');
const refrain = span('ق', 0, 4).join(' ');

const rows = [
  {
    number: 1,
    name: 'Alpha',
    ayat: [
      { number: 1, text: `${refrain} ${span('ن', 0, 3).join(' ')}` },
      { number: 2, text: `${refrain} ${span('ي', 0, 3).join(' ')}` },
      { number: 3, text: shared },
    ],
  },
  {
    number: 2,
    name: 'Beta',
    ayat: [
      { number: 1, text: span('ل', 0, 5).join(' ') },
      { number: 2, text: shared },
    ],
  },
];

const expected: RepetitionInput = rows.map(s => ({ number: s.number, name: s.name, ayat: s.ayat.map(a => a.text) }));

describe('GET /api/quran/repetition', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with the buildRepetition result for the surahs read from the database', async () => {
    findMany.mockResolvedValue(rows);

    const response = await GET();

    expect(findMany).toHaveBeenCalledTimes(1);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { number: 'asc' } }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(buildRepetition(expected));
  });

  it('sets the exact Cache-Control header', async () => {
    findMany.mockResolvedValue(rows);

    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=86400, stale-while-revalidate=604800');
  });

  it('returns 500 with an error body when the database call fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch repetition' });
  });
});
