import { describe, expect, it, vi, beforeEach } from 'vitest';

const { findMany: orderingFindMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
const { findMany: eventFindMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
const { findMany: battleFindMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
const { findMany: claimFindMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    catalogOrdering: { findMany: orderingFindMany },
    event: { findMany: eventFindMany },
    battle: { findMany: battleFindMany },
    historicalClaim: { findMany: claimFindMany },
  },
}));

import { loadDerivedIntervals } from './derivedPlacements';

describe('loadDerivedIntervals', () => {
  beforeEach(() => {
    orderingFindMany.mockReset();
    eventFindMany.mockReset();
    battleFindMany.mockReset();
    claimFindMany.mockReset();
    claimFindMany.mockResolvedValue([]);
  });

  it('returns an empty Map when catalogOrdering table is missing (P2021)', async () => {
    orderingFindMany.mockRejectedValue({ code: 'P2021' });
    eventFindMany.mockResolvedValue([]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();
    expect(result).toEqual(new Map());
  });

  it('returns an empty Map when no orderings exist', async () => {
    orderingFindMany.mockResolvedValue([]);
    eventFindMany.mockResolvedValue([]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();
    expect(result).toEqual(new Map());
  });

  it('creates interval entries for undated events with placement constraints', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-a', later: 'event-b' }
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'First Event', nameTransliterated: 'First', hijriYear: 5 },
      { slug: 'event-b', name: 'Second Event', nameTransliterated: 'Second', hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();

    expect(result.has('event-b')).toBe(true);
    const interval = result.get('event-b')!;
    expect(interval.from).toEqual({
      slug: 'event-a',
      kind: 'event',
      name: 'First Event',
      nameTransliterated: 'First',
      year: 5,
    });
    expect(interval.to).toBeUndefined();
  });

  it('includes battles in intervals', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-y', later: 'battle-x' }
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-y', name: 'Undated Event', nameTransliterated: null, hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([
      { slug: 'battle-x', name: 'Ancient Battle', nameTransliterated: 'Ancient', hijriYear: 3 },
    ]);

    const result = await loadDerivedIntervals();

    expect(result.has('event-y')).toBe(true);
    const interval = result.get('event-y')!;
    expect(interval.to).toEqual({
      slug: 'battle-x',
      kind: 'battle',
      name: 'Ancient Battle',
      nameTransliterated: 'Ancient',
      year: 3,
    });
  });

  it('does not return entries for dated subjects', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-a', later: 'event-b' }
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'First', nameTransliterated: null, hijriYear: 5 },
      { slug: 'event-b', name: 'Second', nameTransliterated: null, hijriYear: 10 },
    ]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();
    expect(result.size).toBe(0);
  });

  it('places an event after a single dated premise', async () => {
    orderingFindMany.mockResolvedValue([{ earlier: 'event-a', later: 'event-b' }]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'First', nameTransliterated: null, hijriYear: 10 },
      { slug: 'event-b', name: 'Second', nameTransliterated: null, hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();

    expect(result.get('event-b')?.from?.year).toBe(10);
    expect(result.get('event-b')?.to).toBeUndefined();
  });

  it('leaves an event unplaced when its only premise has a contested year', async () => {
    orderingFindMany.mockResolvedValue([{ earlier: 'event-a', later: 'event-b' }]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'First', nameTransliterated: null, hijriYear: 5 },
      { slug: 'event-b', name: 'Second', nameTransliterated: null, hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([]);
    claimFindMany.mockResolvedValue([{ subjectSlug: 'event-a' }]);

    expect((await loadDerivedIntervals()).size).toBe(0);
  });

  it('leaves both events unplaced when the orderings form a cycle', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-a', later: 'event-b' },
      { earlier: 'event-b', later: 'event-a' },
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'A', nameTransliterated: null, hijriYear: null },
      { slug: 'event-b', name: 'B', nameTransliterated: null, hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([]);

    expect((await loadDerivedIntervals()).size).toBe(0);
  });

  it('answers no intervals when reading events fails, so the timeline still loads', async () => {
    orderingFindMany.mockResolvedValue([{ earlier: 'event-a', later: 'event-b' }]);
    eventFindMany.mockRejectedValue(new Error('down'));
    battleFindMany.mockResolvedValue([]);

    expect((await loadDerivedIntervals()).size).toBe(0);
  });

  it('handles events and battles in same query', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-a', later: 'battle-b' },
      { earlier: 'battle-b', later: 'event-c' }
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'Event A', nameTransliterated: null, hijriYear: 5 },
      { slug: 'event-c', name: 'Event C', nameTransliterated: null, hijriYear: 15 },
    ]);
    battleFindMany.mockResolvedValue([
      { slug: 'battle-b', name: 'Battle B', nameTransliterated: null, hijriYear: null },
    ]);

    const result = await loadDerivedIntervals();

    expect(result.has('battle-b')).toBe(true);
    const interval = result.get('battle-b')!;
    expect(interval.from?.slug).toBe('event-a');
    expect(interval.to?.slug).toBe('event-c');
  });

  it('uses nameTransliterated when provided', async () => {
    orderingFindMany.mockResolvedValue([
      { earlier: 'event-a', later: 'event-b' }
    ]);
    eventFindMany.mockResolvedValue([
      { slug: 'event-a', name: 'الحدث الأول', nameTransliterated: 'First Event', hijriYear: 5 },
      { slug: 'event-b', name: 'الحدث الثاني', nameTransliterated: null, hijriYear: null },
    ]);
    battleFindMany.mockResolvedValue([]);

    const result = await loadDerivedIntervals();

    const interval = result.get('event-b')!;
    expect(interval.from?.nameTransliterated).toBe('First Event');
  });
});
