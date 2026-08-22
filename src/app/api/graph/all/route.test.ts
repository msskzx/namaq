import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, findManyPerson, findManyBattle, findManyTitle, findManyEvent } = vi.hoisted(() => ({
  getSession: vi.fn(),
  findManyPerson: vi.fn(),
  findManyBattle: vi.fn(),
  findManyTitle: vi.fn(),
  findManyEvent: vi.fn(),
}));
vi.mock('@/lib/neo4j', () => ({ getSession }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    person: { findMany: findManyPerson },
    battle: { findMany: findManyBattle },
    title: { findMany: findManyTitle },
    event: { findMany: findManyEvent },
  },
}));

import { GET } from './route';

function record(fields: Record<string, unknown>) {
  return { keys: Object.keys(fields), get: (key: string) => fields[key] };
}

describe('GET /api/graph/all', () => {
  beforeEach(() => {
    getSession.mockReset();
    findManyPerson.mockReset();
    findManyBattle.mockReset();
    findManyTitle.mockReset();
    findManyEvent.mockReset();
    findManyPerson.mockResolvedValue([]);
    findManyBattle.mockResolvedValue([]);
    findManyTitle.mockResolvedValue([]);
    findManyEvent.mockResolvedValue([]);
  });

  it('returns 500 without hitting the database when config is missing', async () => {
    getSession.mockReturnValue(null);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Database configuration is missing' });
  });

  it('returns 500 when a query fails', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'));
    getSession.mockReturnValue({ run });

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch combined graph data' });
  });

  it('merges people, battles, titles, and events from one unified Neo4j graph, joining rank/cluster/layout from Postgres', async () => {
    const run = vi.fn()
      .mockResolvedValueOnce({
        records: [
          record({ labels: ['Person'], slug: 'prophet-muhammad', name: 'Muhammad' }),
          record({ labels: ['Person'], slug: 'ali-ibn-abi-talib', name: 'Ali' }),
          record({ labels: ['Battle'], slug: 'badr', name: 'غزوة بدر' }),
          record({ labels: ['Title'], slug: 'commander', name: 'Commander' }),
          record({ labels: ['Event'], slug: 'hijra', name: 'الهجرة' }),
        ],
      })
      .mockResolvedValueOnce({
        records: [
          record({ sourceLabels: ['Person'], sourceSlug: 'prophet-muhammad', relType: 'FATHER', status: null, targetLabels: ['Person'], targetSlug: 'ali-ibn-abi-talib' }),
          record({ sourceLabels: ['Person'], sourceSlug: 'ali-ibn-abi-talib', relType: 'PARTICIPATED_IN', status: ['MARTYRED'], targetLabels: ['Battle'], targetSlug: 'badr' }),
          record({ sourceLabels: ['Person'], sourceSlug: 'ali-ibn-abi-talib', relType: 'HOLDS_TITLE', status: null, targetLabels: ['Title'], targetSlug: 'commander' }),
          record({ sourceLabels: ['Person'], sourceSlug: 'prophet-muhammad', relType: 'INVOLVED_IN', status: null, targetLabels: ['Event'], targetSlug: 'hijra' }),
        ],
      });
    getSession.mockReturnValue({ run });

    findManyPerson.mockResolvedValue([
      { slug: 'prophet-muhammad', nasabRank: 1, graphRank: 1, clusterId: 0, layoutX: 10, layoutY: 20 },
      { slug: 'ali-ibn-abi-talib', nasabRank: 2, graphRank: 3, clusterId: 0, layoutX: 15, layoutY: 25 },
    ]);
    findManyBattle.mockResolvedValue([
      { slug: 'badr', graphRank: 2, clusterId: 1, layoutX: 100, layoutY: 200 },
    ]);
    findManyTitle.mockResolvedValue([
      { slug: 'commander', graphRank: 5, clusterId: 0, layoutX: null, layoutY: null },
    ]);
    findManyEvent.mockResolvedValue([
      { slug: 'hijra', graphRank: 4, clusterId: 2, layoutX: -50, layoutY: -60 },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);

    expect(body.nodes).toEqual(expect.arrayContaining([
      { id: 'person:prophet-muhammad', label: 'Muhammad', slug: 'prophet-muhammad', group: 1, type: 'person', nasabRank: 1, graphRank: 1, clusterId: 0, x: 10, y: 20, fx: 10, fy: 20 },
      { id: 'person:ali-ibn-abi-talib', label: 'Ali', slug: 'ali-ibn-abi-talib', group: 1, type: 'person', nasabRank: 2, graphRank: 3, clusterId: 0, x: 15, y: 25, fx: 15, fy: 25 },
      { id: 'battle:badr', label: 'غزوة بدر', slug: 'badr', group: 1, type: 'battle', graphRank: 2, clusterId: 1, x: 100, y: 200, fx: 100, fy: 200 },
      { id: 'title:commander', label: 'Commander', slug: 'commander', group: 1, type: 'title', graphRank: 5, clusterId: 0 },
      { id: 'event:hijra', label: 'الهجرة', slug: 'hijra', group: 1, type: 'event', graphRank: 4, clusterId: 2, x: -50, y: -60, fx: -50, fy: -60 },
    ]));
    expect(body.nodes).toHaveLength(5);

    expect(body.links).toEqual(expect.arrayContaining([
      { source: 'person:prophet-muhammad', target: 'person:ali-ibn-abi-talib', label: 'FATHER', value: 1 },
      { source: 'person:ali-ibn-abi-talib', target: 'battle:badr', label: 'PARTICIPATED_IN', value: 1, status: ['MARTYRED'] },
      { source: 'person:ali-ibn-abi-talib', target: 'title:commander', label: 'HOLDS_TITLE', value: 1 },
      { source: 'person:prophet-muhammad', target: 'event:hijra', label: 'INVOLVED_IN', value: 1 },
    ]));
    expect(body.links).toHaveLength(4);
  });

  it('drops a node whose labels do not match any known entity type', async () => {
    const run = vi.fn()
      .mockResolvedValueOnce({ records: [record({ labels: ['SomethingElse'], slug: 'ghost', name: 'Ghost' })] })
      .mockResolvedValueOnce({ records: [] });
    getSession.mockReturnValue({ run });

    const response = await GET();
    const body = await response.json();

    expect(body.nodes).toEqual([]);
  });
});
