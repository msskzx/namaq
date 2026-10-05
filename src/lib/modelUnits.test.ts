import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, findMany } = vi.hoisted(() => ({ findUnique: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { modelUnit: { findUnique, findMany } } }));

import { loadUnitList, loadUnitView } from './modelUnits';

describe('loadUnitView', () => {
  beforeEach(() => {
    findUnique.mockReset();
    findMany.mockReset();
  });

  it('returns the stored view when the database has the unit', async () => {
    findUnique.mockResolvedValue({ view: { id: 'stored', reports: [] } });
    expect(await loadUnitView('bukhari-jibril')).toEqual({ id: 'stored', reports: [] });
  });

  it('falls back to the files when the unit is not in the database, or the table is missing', async () => {
    findUnique.mockResolvedValue(null);
    expect((await loadUnitView('bukhari-jibril'))?.id).toBe('bukhari-jibril');
    findUnique.mockImplementation(async () => {
      throw new Error('relation "model_units" does not exist');
    });
    expect((await loadUnitView('bukhari-jibril'))?.id).toBe('bukhari-jibril');
  });

  it('returns null for a unit neither source has', async () => {
    findUnique.mockResolvedValue(null);
    expect(await loadUnitView('nope')).toBeNull();
  });
});

describe('loadUnitList', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('lists the stored units when there are any', async () => {
    findMany.mockResolvedValue([{ unit: 'a', book: 'A' }]);
    expect(await loadUnitList()).toEqual([{ id: 'a', book: 'A' }]);
  });

  it('lists the files when the table is empty or missing', async () => {
    findMany.mockResolvedValue([]);
    expect((await loadUnitList()).map((u) => u.id).sort()).toEqual([
      'bukhari-jibril',
      'fath-iman-50',
      'muslim-jibril',
    ]);
    findMany.mockImplementation(async () => {
      throw new Error('missing');
    });
    expect(await loadUnitList()).toHaveLength(3);
  });
});
