import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, findMany } = vi.hoisted(() => ({ getSession: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/neo4j', () => ({ getSession }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany } } }));

import { GET } from './route';

// Minimal stand-ins for the shapes the route reads off neo4j-driver values:
// nodes (`.identity`/`.properties`), relationships (`.type`), records
// (`.keys`/`.get`), and paths (`.segments`).
function node(identity: number, slug: string, name: string) {
  return { identity: { toString: () => String(identity) }, properties: { slug, name } };
}

function rel(type: string) {
  return { type };
}

function record(fields: Record<string, unknown>) {
  return { keys: Object.keys(fields), get: (key: string) => fields[key] };
}

function pathRecord(segments: Array<{ start: unknown; end: unknown; relationship: unknown }>) {
  return record({ path: { segments } });
}

function request(query: string) {
  return new Request(`http://localhost/api/graph${query}`);
}

describe('GET /api/graph', () => {
  beforeEach(() => {
    getSession.mockReset();
    findMany.mockReset();
    findMany.mockResolvedValue([]);
  });

  it('returns 500 without hitting the database when config is missing', async () => {
    getSession.mockReturnValue(null);

    const response = await GET(request(''));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Database configuration is missing' });
  });

  it('returns 500 when the query fails', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'));
    getSession.mockReturnValue({ run });

    const response = await GET(request('?person=prophet-muhammad'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch graph data' });
  });

  it('fetches every person with no query params', async () => {
    const a = node(1, 'a', 'Person A');
    const b = node(2, 'b', 'Person B');
    const c = node(3, 'c', 'Person C');
    const run = vi.fn().mockResolvedValue({
      records: [
        record({ node: a, relationship: rel('SON'), related: b }),
        record({ node: c, relationship: null, related: null }),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request(''));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('MATCH (node:Person)');
    expect(query).toContain('OPTIONAL MATCH (node)-[relationship]->(related:Person)');
    expect(params).toBeUndefined();

    expect(body.nodes).toHaveLength(3);
    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual(['a', 'b', 'c']);
    expect(body.links).toEqual([{ source: '1', target: '2', label: 'SON', value: 1 }]);
  });

  it('attaches nasabRank from PostgreSQL by slug, defaulting to null when unranked', async () => {
    const a = node(1, 'a', 'Person A');
    const b = node(2, 'b', 'Person B');
    const run = vi.fn().mockResolvedValue({
      records: [record({ node: a, relationship: rel('SON'), related: b })],
    });
    getSession.mockReturnValue({ run });
    findMany.mockResolvedValue([{ slug: 'a', nasabRank: 3 }]);

    const response = await GET(request(''));
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      where: { slug: { in: ['a', 'b'] } },
      select: { slug: true, nasabRank: true },
    });
    const bySlug = Object.fromEntries(body.nodes.map((n: { slug: string; nasabRank: number | null }) => [n.slug, n.nasabRank]));
    expect(bySlug).toEqual({ a: 3, b: null });
  });

  it('scopes to a single hop when focus is set', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const related = node(2, 'khadijah', 'Khadijah');
    const run = vi.fn().mockResolvedValue({
      records: [record({ node: focusNode, relationship: rel('WIFE'), related })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('MATCH (node:Person {slug: $focus})');
    expect(query).toContain('OPTIONAL MATCH (node)-[relationship]-(related:Person)');
    expect(params).toEqual({ focus: 'prophet-muhammad' });

    expect(body.nodes).toHaveLength(2);
    expect(body.links).toEqual([{ source: '1', target: '2', label: 'WIFE', value: 1 }]);
  });

  it('walks up to 3 hops for a person search and parses every path segment', async () => {
    const muhammad = node(1, 'prophet-muhammad', 'Muhammad');
    const aisha = node(2, 'aisha', 'Aisha');
    const abuBakr = node(3, 'abu-bakr', 'Abu Bakr');

    // A 2-hop path: prophet-muhammad -[WIFE]-> aisha -[DAUGHTER]<- abu-bakr,
    // i.e. the exact shape that lets an unrelated person's relation leak into
    // a person-scoped fetch.
    const run = vi.fn().mockResolvedValue({
      records: [
        pathRecord([
          { start: muhammad, end: aisha, relationship: rel('WIFE') },
          { start: abuBakr, end: aisha, relationship: rel('DAUGHTER') },
        ]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?person=prophet-muhammad'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $persons AS personSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: personSlug})-[*1..3]-(p2:Person)');
    expect(params).toEqual({ persons: ['prophet-muhammad'] });

    expect(body.nodes).toHaveLength(3);
    expect(body.links).toEqual([
      { source: '1', target: '2', label: 'WIFE', value: 1 },
      { source: '3', target: '2', label: 'DAUGHTER', value: 1 },
    ]);
  });

  it('dedupes repeated links across overlapping paths', async () => {
    const a = node(1, 'a', 'A');
    const b = node(2, 'b', 'B');
    const run = vi.fn().mockResolvedValue({
      records: [
        pathRecord([{ start: a, end: b, relationship: rel('SON') }]),
        pathRecord([{ start: a, end: b, relationship: rel('SON') }]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?person=a'));
    const body = await response.json();

    expect(body.links).toHaveLength(1);
  });

  it('collects multiple requested persons into a single UNWIND query', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?person=a&person=b'));

    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][1]).toEqual({ persons: ['a', 'b'] });
  });

  it('walks ancestor SON chains for ancestorsOf', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=prophet-muhammad'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $ancestors AS ancestorSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON*]->(p2:Person)');
    expect(params).toEqual({ ancestors: ['prophet-muhammad'] });
  });

  it('combines person and ancestorsOf queries with UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?person=a&ancestorsOf=b'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain(' UNION ');
    expect(query).toContain('MATCH path = (p1:Person {slug: personSlug})-[*1..3]-(p2:Person)');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON*]->(p2:Person)');
    expect(params).toEqual({ persons: ['a'], ancestors: ['b'] });
  });
});
