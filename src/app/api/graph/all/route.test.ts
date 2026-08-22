import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, findManyPerson, findManyTitle } = vi.hoisted(() => ({
  getSession: vi.fn(),
  findManyPerson: vi.fn(),
  findManyTitle: vi.fn(),
}));
vi.mock('@/lib/neo4j', () => ({ getSession }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany: findManyPerson }, title: { findMany: findManyTitle } } }));

import { GET } from './route';

function node(slug: string, name: string) {
  return { properties: { slug, name } };
}

function rel(type: string, properties: Record<string, unknown> = {}) {
  return { type, properties };
}

function record(fields: Record<string, unknown>) {
  return { keys: Object.keys(fields), get: (key: string) => fields[key] };
}

describe('GET /api/graph/all', () => {
  beforeEach(() => {
    getSession.mockReset();
    findManyPerson.mockReset();
    findManyTitle.mockReset();
    findManyPerson.mockResolvedValue([]);
    findManyTitle.mockResolvedValue([]);
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

  it('merges people, battles, and titles into one graph, deduping shared people by slug', async () => {
    const muhammad = node('prophet-muhammad', 'Muhammad');
    const ali = node('ali-ibn-abi-talib', 'Ali');
    const badr = node('badr', 'غزوة بدر');

    const run = vi.fn()
      .mockResolvedValueOnce({
        records: [
          record({ node: muhammad, relationship: rel('FATHER'), related: ali }),
        ],
      })
      .mockResolvedValueOnce({
        records: [
          record({ node: badr, relationship: rel('PARTICIPATED_IN', { status: ['MARTYRED'] }), related: ali }),
        ],
      });
    getSession.mockReturnValue({ run });

    findManyTitle.mockResolvedValue([
      {
        slug: 'commander',
        name: 'Commander',
        people: [{ name: 'Ali', slug: 'ali-ibn-abi-talib', nasabRank: 2 }],
      },
    ]);
    findManyPerson.mockResolvedValue([
      { slug: 'prophet-muhammad', nasabRank: 1 },
      { slug: 'ali-ibn-abi-talib', nasabRank: 2 },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);

    // Ali comes from both the family graph and the battle graph but appears once.
    expect(body.nodes).toHaveLength(4);
    expect(body.nodes).toEqual(expect.arrayContaining([
      { id: 'person:prophet-muhammad', label: 'Muhammad', slug: 'prophet-muhammad', group: 1, type: 'person', nasabRank: 1 },
      { id: 'person:ali-ibn-abi-talib', label: 'Ali', slug: 'ali-ibn-abi-talib', group: 1, type: 'person', nasabRank: 2 },
      { id: 'battle:badr', label: 'غزوة بدر', slug: 'badr', group: 1, type: 'battle' },
      { id: 'title:commander', label: 'Commander', slug: 'commander', group: 1, type: 'title' },
    ]));

    expect(body.links).toEqual(expect.arrayContaining([
      { source: 'person:prophet-muhammad', target: 'person:ali-ibn-abi-talib', label: 'FATHER', value: 1 },
      { source: 'person:ali-ibn-abi-talib', target: 'battle:badr', label: 'PARTICIPATED_IN', value: 1, status: ['MARTYRED'] },
      { source: 'person:ali-ibn-abi-talib', target: 'title:commander', label: 'HAS_TITLE', value: 1 },
    ]));
    expect(body.links).toHaveLength(3);
  });
});
