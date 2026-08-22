import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock('@/lib/neo4j', () => ({ getSession }));

import { GET } from './route';

function node(identity: number, slug: string, name: string) {
  return { identity: { toString: () => String(identity) }, properties: { slug, name } };
}

function rel(type: string, properties: Record<string, unknown> = {}) {
  return { type, properties };
}

function record(fields: Record<string, unknown>) {
  return { keys: Object.keys(fields), get: (key: string) => fields[key] };
}

describe('GET /api/graph/battles', () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it('returns 500 without hitting the database when config is missing', async () => {
    getSession.mockReturnValue(null);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Database configuration is missing' });
  });

  it('returns 500 when the query fails', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'));
    getSession.mockReturnValue({ run });

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch battles graph data' });
  });

  it('builds a bipartite graph of every battle and its participants, including status', async () => {
    const badr = node(1, 'badr', 'غزوة بدر');
    const uhud = node(2, 'uhud', 'غزوة أحد');
    const ali = node(3, 'ali-ibn-abi-talib', 'Ali');
    const hamzah = node(4, 'hamzah-ibn-abd-al-muttalib', 'Hamzah');

    const run = vi.fn().mockResolvedValue({
      records: [
        record({ node: badr, relationship: rel('PARTICIPATED_IN', { status: [] }), related: ali }),
        record({ node: badr, relationship: rel('PARTICIPATED_IN', { status: ['MARTYRED'] }), related: hamzah }),
        // Uhud has no synced participants yet, but should still appear.
        record({ node: uhud, relationship: null, related: null }),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET();
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(1);
    const [query] = run.mock.calls[0];
    expect(query).toContain('MATCH (battle:Battle)');
    expect(query).toContain('OPTIONAL MATCH (person:Person)-[relationship:PARTICIPATED_IN]->(battle)');

    expect(body.nodes).toHaveLength(4);
    expect(body.nodes).toEqual(expect.arrayContaining([
      { id: '1', label: 'غزوة بدر', slug: 'badr', group: 1, type: 'battle' },
      { id: '2', label: 'غزوة أحد', slug: 'uhud', group: 1, type: 'battle' },
      { id: '3', label: 'Ali', slug: 'ali-ibn-abi-talib', group: 2, type: 'person' },
      { id: '4', label: 'Hamzah', slug: 'hamzah-ibn-abd-al-muttalib', group: 2, type: 'person' },
    ]));

    expect(body.links).toEqual(expect.arrayContaining([
      { source: '3', target: '1', label: 'PARTICIPATED_IN', value: 1, status: [] },
      { source: '4', target: '1', label: 'PARTICIPATED_IN', value: 1, status: ['MARTYRED'] },
    ]));
    expect(body.links).toHaveLength(2);
  });
});
