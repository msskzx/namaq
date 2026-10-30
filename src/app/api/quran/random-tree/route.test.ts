import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';
import { getHomePreviews } from '@/lib/homePreviewData';

vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: vi.fn(async () => [{ number: 2, name: 'البقرة' }]) } } }));
afterEach(() => vi.restoreAllMocks());

describe('random Quran tree', () => {
  it('excludes the current tree, supplies surah names and disables response caching', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { branches } = await getHomePreviews();
    const response = await GET(new Request(`http://localhost/api/quran/random-tree?${new URLSearchParams({ exclude: branches.id })}`));
    const next = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(next.id).not.toBe(branches.id);
    expect(next.names).toEqual({ 2: 'البقرة' });
    expect(next.count).toBeGreaterThanOrEqual(2);
  });
  it('returns a retryable error when names cannot be loaded', async () => {
    vi.mocked(prisma.surah.findMany).mockRejectedValueOnce(new Error('Unavailable'));
    expect((await GET(new Request('http://localhost/api/quran/random-tree'))).status).toBe(500);
  });
});
