import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, findMany, findManyBattle, findManyTitle, findManyEvent } = vi.hoisted(() => ({
  getSession: vi.fn(),
  findMany: vi.fn(),
  findManyBattle: vi.fn(),
  findManyTitle: vi.fn(),
  findManyEvent: vi.fn(),
}));
vi.mock('@/lib/neo4j', () => ({ getSession }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    person: { findMany },
    battle: { findMany: findManyBattle },
    title: { findMany: findManyTitle },
    event: { findMany: findManyEvent },
  },
}));

import { GET } from './route';

// Minimal stand-ins for the shapes the route reads off neo4j-driver values:
// nodes (`.identity`/`.properties`), relationships (`.type`), records
// (`.keys`/`.get`), and paths (`.segments`).
function node(identity: number, slug: string, name: string, labels: string[] = ['Person']) {
  return { identity: { toString: () => String(identity) }, properties: { slug, name }, labels };
}

function rel(type: string, properties: Record<string, unknown> = {}) {
  return { type, properties };
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
    findManyBattle.mockReset();
    findManyTitle.mockReset();
    findManyEvent.mockReset();
    findMany.mockResolvedValue([]);
    findManyBattle.mockResolvedValue([]);
    findManyTitle.mockResolvedValue([]);
    findManyEvent.mockResolvedValue([]);
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

  it('returns the full unified Person+Battle+Title+Event graph with no query params', async () => {
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

    findMany.mockResolvedValue([
      { slug: 'prophet-muhammad', nasabRank: 1, graphRank: 1, clusterId: 0, layoutX: 10, layoutY: 20 },
      { slug: 'ali-ibn-abi-talib', nasabRank: 2, graphRank: 3, clusterId: 0, layoutX: 15, layoutY: 25 },
    ]);
    findManyBattle.mockResolvedValue([{ slug: 'badr', graphRank: 2, clusterId: 1, layoutX: 100, layoutY: 200 }]);
    findManyTitle.mockResolvedValue([{ slug: 'commander', graphRank: 5, clusterId: 0, layoutX: null, layoutY: null }]);
    findManyEvent.mockResolvedValue([{ slug: 'hijra', graphRank: 4, clusterId: 2, layoutX: -50, layoutY: -60 }]);

    const response = await GET(request(''));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toContain('WHERE n:Person OR n:Battle OR n:Title OR n:Event');
    expect(run.mock.calls[1][0]).toContain('MATCH (a)-[r]->(b)');

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

    const response = await GET(request(''));
    const body = await response.json();

    expect(body.nodes).toEqual([]);
  });

  it('returns 500 when the default unified query fails', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'));
    getSession.mockReturnValue({ run });

    const response = await GET(request(''));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch graph data' });
  });

  it('kind=person&kind=battle returns only those kinds and the links directly between them', async () => {
    const run = vi.fn()
      .mockResolvedValueOnce({
        records: [
          record({ labels: ['Person'], slug: 'ali-ibn-abi-talib', name: 'Ali' }),
          record({ labels: ['Battle'], slug: 'badr', name: 'غزوة بدر' }),
          record({ labels: ['Title'], slug: 'commander', name: 'Commander' }),
        ],
      })
      .mockResolvedValueOnce({
        records: [
          record({ sourceLabels: ['Person'], sourceSlug: 'ali-ibn-abi-talib', relType: 'PARTICIPATED_IN', status: null, targetLabels: ['Battle'], targetSlug: 'badr' }),
          record({ sourceLabels: ['Person'], sourceSlug: 'ali-ibn-abi-talib', relType: 'HOLDS_TITLE', status: null, targetLabels: ['Title'], targetSlug: 'commander' }),
        ],
      });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?kind=person&kind=battle'));
    const body = await response.json();

    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual(['ali-ibn-abi-talib', 'badr']);
    // The HOLDS_TITLE link is dropped along with the excluded title node,
    // since a link can't reference a node the response doesn't include.
    expect(body.links).toEqual([
      { source: 'person:ali-ibn-abi-talib', target: 'battle:badr', label: 'PARTICIPATED_IN', value: 1 },
    ]);
  });

  it('ignores unrecognized kind values and treats an empty kind list as "every kind"', async () => {
    const run = vi.fn()
      .mockResolvedValueOnce({ records: [record({ labels: ['Person'], slug: 'a', name: 'A' })] })
      .mockResolvedValueOnce({ records: [] });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?kind=not-a-real-kind'));
    const body = await response.json();

    expect(body.nodes.map((n: { slug: string }) => n.slug)).toEqual(['a']);
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

  it('drops excluded relation types (and their now-unreached related nodes) from a focus response', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const wife = node(2, 'khadijah', 'Khadijah');
    const companion = node(3, 'abu-bakr', 'Abu Bakr');
    const run = vi.fn().mockResolvedValue({
      records: [
        record({ node: focusNode, relationship: rel('WIFE'), related: wife }),
        record({ node: focusNode, relationship: rel('COMPANION_OF'), related: companion }),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad&excludeRelation=COMPANION_OF&excludeRelation=ACCOMPANIED_BY'));
    const body = await response.json();

    // The focus node itself, and any relation not excluded, are kept; the
    // companion relation and the companion-only related node are dropped.
    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual(['khadijah', 'prophet-muhammad']);
    expect(body.links).toEqual([{ source: '1', target: '2', label: 'WIFE', value: 1 }]);
  });

  it('keeps the focus node even when every one of its relations is excluded', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const companion = node(2, 'abu-bakr', 'Abu Bakr');
    const run = vi.fn().mockResolvedValue({
      records: [record({ node: focusNode, relationship: rel('COMPANION_OF'), related: companion })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad&excludeRelation=COMPANION_OF'));
    const body = await response.json();

    expect(body.nodes.map((n: { slug: string }) => n.slug)).toEqual(['prophet-muhammad']);
    expect(body.links).toEqual([]);
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
    expect(query).toContain('MATCH path = (p1:Person {slug: personSlug})-[*1]-(p2:Person)');
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

  it('walks ancestor SON|DAUGHTER chains for ancestorsOf', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=prophet-muhammad'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $ancestors AS ancestorSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON|DAUGHTER*]->(p2:Person)');
    expect(params).toEqual({ ancestors: ['prophet-muhammad'] });
  });

  it('walks descendant SON|DAUGHTER chains, reversed, for descendantsOf', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?descendantsOf=prophet-muhammad'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $descendants AS descendantSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: descendantSlug})<-[r:SON|DAUGHTER*]-(p2:Person)');
    expect(params).toEqual({ descendants: ['prophet-muhammad'] });
  });

  it('collects multiple requested descendant roots into a single UNWIND query', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?descendantsOf=a&descendantsOf=b'));

    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][1]).toEqual({ descendants: ['a', 'b'] });
  });

  it('fetches a battle and its participants, including status', async () => {
    const battle = node(1, 'badr', 'غزوة بدر', ['Battle']);
    const participant = node(2, 'ali-ibn-abi-talib', 'Ali', ['Person']);
    const run = vi.fn().mockResolvedValue({
      records: [record({ node: battle, relationship: rel('PARTICIPATED_IN', { status: ['MARTYRED'] }), related: participant })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?battle=badr'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $battles AS battleSlug');
    expect(query).toContain('MATCH (node:Battle {slug: battleSlug})');
    expect(query).toContain('OPTIONAL MATCH (node)<-[relationship:PARTICIPATED_IN]-(related:Person)');
    expect(params).toEqual({ battles: ['badr'] });

    expect(body.nodes).toHaveLength(2);
    // Lowercased so it matches the 'person' | 'battle' | 'title' | 'event'
    // node kinds every other graph route/GraphCanvas's theme.node map use --
    // the raw Neo4j label ('Battle') would silently fail to match and fall
    // back to the default (person) fill color.
    expect(body.nodes.find((n: { slug: string }) => n.slug === 'badr').type).toBe('battle');
    expect(body.nodes.find((n: { slug: string }) => n.slug === 'ali-ibn-abi-talib').type).toBe('person');
    expect(body.links).toEqual([
      { source: '1', target: '2', label: 'PARTICIPATED_IN', value: 1, status: ['MARTYRED'] },
    ]);
  });

  it('collects multiple requested battles into a single UNWIND query', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?battle=badr&battle=uhud'));

    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][1]).toEqual({ battles: ['badr', 'uhud'] });
  });

  it('combines person and ancestorsOf queries with UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?person=a&ancestorsOf=b'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain(' UNION ');
    expect(query).toContain('MATCH path = (p1:Person {slug: personSlug})-[*1]-(p2:Person)');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON|DAUGHTER*]->(p2:Person)');
    expect(params).toEqual({ persons: ['a'], ancestors: ['b'] });
  });

  it('combines ancestorsOf and descendantsOf queries with UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=a&descendantsOf=a'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain(' UNION ');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON|DAUGHTER*]->(p2:Person)');
    expect(query).toContain('MATCH path = (p1:Person {slug: descendantSlug})<-[r:SON|DAUGHTER*]-(p2:Person)');
    expect(params).toEqual({ ancestors: ['a'], descendants: ['a'] });
  });
});
