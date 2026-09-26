import { beforeEach, describe, expect, it, vi } from 'vitest';

const { eventFindMany, battleFindMany } = vi.hoisted(() => ({ eventFindMany: vi.fn(), battleFindMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { event: { findMany: eventFindMany }, battle: { findMany: battleFindMany } } }));

import { GET } from './route';

describe('GET /api/timeline', () => {
  beforeEach(() => {
    eventFindMany.mockReset();
    battleFindMany.mockReset();
  });

  it('returns events and battles together, each with its kind', async () => {
    eventFindMany.mockResolvedValue([{ id: 'e', slug: 'hijra', name: 'الهجرة', nameTransliterated: null, hijriYear: 1, hijriPeriod: null, location: null, locationTransliterated: 'Medina' }]);
    battleFindMany.mockResolvedValue([
      { id: 'b1', slug: 'badr', name: 'بدر', nameTransliterated: 'Badr', hijriYear: 2, hijriPeriod: null, location: 'بدر', locationEn: 'Badr', engagement: 'GHAZWAH' },
      { id: 'b2', slug: 'qatan', name: 'قطن', nameTransliterated: null, hijriYear: 4, hijriPeriod: null, location: null, locationEn: null, engagement: 'SARIYYAH' },
      { id: 'b3', slug: 'yamamah', name: 'اليمامة', nameTransliterated: null, hijriYear: 11, hijriPeriod: null, location: null, locationEn: null, engagement: null },
    ]);

    const items = await (await GET()).json();

    expect(items.map((item: { slug: string; kind: string }) => [item.slug, item.kind])).toEqual([
      ['hijra', 'event'], ['badr', 'ghazwah'], ['qatan', 'sariyyah'], ['yamamah', 'battle'],
    ]);
    expect(items[1].locationTransliterated).toBe('Badr');
    expect(items[1]).not.toHaveProperty('engagement');
  });

  it('answers 500 when a query fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    eventFindMany.mockRejectedValue(new Error('down'));
    battleFindMany.mockResolvedValue([]);

    expect((await GET()).status).toBe(500);
  });
});
