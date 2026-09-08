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

// `direction` is the relationship's own true stored start/end identity
// (a node's `.identity`, e.g. `hasan.identity`) -- distinct from a path
// segment's start/end, which reflect the direction the Cypher pattern was
// *walked* in and can differ from it (see the descendantsOf test below).
// Only path-based (pathRecord) usages need this; the flat node/related/
// relationship records (focus, battle) don't read rel.start/rel.end.
function rel(type: string, properties: Record<string, unknown> = {}, direction?: { start: unknown; end: unknown }) {
  return { type, properties, start: direction?.start, end: direction?.end };
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

// Every response shape now makes one extra `session.run` call after its
// main query: attachNeo4jLayout's shared, batched coordinate lookup (see
// route.ts). A plain `vi.fn().mockResolvedValueOnce(...)` per test would
// need updating at every call site just to keep that call from blowing up
// on an unmocked shape -- this smart base implementation (queued `Once`
// responses still take priority for the main query/queries) answers it
// generically instead, using whichever `type`/`slug` subjects it's asked
// about, with a fixed (0, 0) position wherever a specific test doesn't
// care about the actual coordinate values.
function createRun() {
  return vi.fn(async (query: string, params?: Record<string, unknown>) => {
    if (typeof query === 'string' && query.includes('n.layoutX')) {
      const subjects = (params?.subjects ?? []) as { type: string; slug: string }[];
      return { records: subjects.map((s) => record({ type: s.type, slug: s.slug, layoutX: 0, layoutY: 0 })) };
    }
    return { records: [] };
  });
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
    const run = createRun()
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
      })
      .mockResolvedValueOnce({
        records: [
          record({ type: 'person', slug: 'prophet-muhammad', layoutX: 10, layoutY: 20 }),
          record({ type: 'person', slug: 'ali-ibn-abi-talib', layoutX: 15, layoutY: 25 }),
          record({ type: 'battle', slug: 'badr', layoutX: 100, layoutY: 200 }),
          record({ type: 'title', slug: 'commander', layoutX: 0, layoutY: 0 }),
          record({ type: 'event', slug: 'hijra', layoutX: -50, layoutY: -60 }),
        ],
      });
    getSession.mockReturnValue({ run });

    findMany.mockResolvedValue([
      { slug: 'prophet-muhammad', nasabRank: 1, graphRank: 1, clusterId: 0 },
      { slug: 'ali-ibn-abi-talib', nasabRank: 2, graphRank: 3, clusterId: 0 },
    ]);
    findManyBattle.mockResolvedValue([{ slug: 'badr', graphRank: 2, clusterId: 1 }]);
    findManyTitle.mockResolvedValue([{ slug: 'commander', graphRank: 5, clusterId: 0 }]);
    findManyEvent.mockResolvedValue([{ slug: 'hijra', graphRank: 4, clusterId: 2 }]);

    const response = await GET(request(''));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(3);
    expect(run.mock.calls[0][0]).toContain('WHERE n:Person OR n:Battle OR n:Title OR n:Event');
    expect(run.mock.calls[1][0]).toContain('MATCH (a)-[r]->(b)');
    expect(run.mock.calls[2][0]).toContain('n.layoutX');

    expect(body.nodes).toEqual(expect.arrayContaining([
      { id: 'person:prophet-muhammad', label: 'Muhammad', slug: 'prophet-muhammad', group: 1, type: 'person', nasabRank: 1, graphRank: 1, clusterId: 0, x: 10, y: 20, fx: 10, fy: 20 },
      { id: 'person:ali-ibn-abi-talib', label: 'Ali', slug: 'ali-ibn-abi-talib', group: 1, type: 'person', nasabRank: 2, graphRank: 3, clusterId: 0, x: 15, y: 25, fx: 15, fy: 25 },
      { id: 'battle:badr', label: 'غزوة بدر', slug: 'badr', group: 1, type: 'battle', graphRank: 2, clusterId: 1, x: 100, y: 200, fx: 100, fy: 200 },
      { id: 'title:commander', label: 'Commander', slug: 'commander', group: 1, type: 'title', graphRank: 5, clusterId: 0, x: 0, y: 0, fx: 0, fy: 0 },
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
    const run = createRun()
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
    const run = createRun()
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
    const run = createRun().mockResolvedValueOnce({
      records: [record({ node: focusNode, relationship: rel('WIFE', {}, { start: focusNode.identity, end: related.identity }), related })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('MATCH (node:Person {slug: $focus})');
    expect(query).toContain('OPTIONAL MATCH (node)-[relationship]-(related:Person)');
    expect(params).toEqual({ focus: 'prophet-muhammad' });

    expect(body.nodes).toHaveLength(2);
    expect(body.links).toEqual([{ source: 'person:prophet-muhammad', target: 'person:khadijah', label: 'WIFE', value: 1 }]);
  });

  it('renders a focus-query relationship using its true stored direction, not the anchor/neighbor query shape', async () => {
    const battleNode = node(1, 'badr', 'غزوة بدر', ['Battle']);
    const participant = node(2, 'ali-ibn-abi-talib', 'Ali');
    const run = createRun().mockResolvedValueOnce({
      // The Cypher pattern is undirected (`-[relationship]-`), and `node`
      // here is the Battle even though the relationship is truly stored
      // Person -[:PARTICIPATED_IN]-> Battle -- the response must still
      // reflect that true direction, not "anchor -> neighbor".
      records: [record({
        node: battleNode,
        relationship: rel('PARTICIPATED_IN', {}, { start: participant.identity, end: battleNode.identity }),
        related: participant,
      })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=badr'));
    const body = await response.json();

    expect(body.links).toEqual([
      { source: 'person:ali-ibn-abi-talib', target: 'battle:badr', label: 'PARTICIPATED_IN', value: 1 },
    ]);
  });

  it('drops excluded relation types (and their now-unreached related nodes) from a focus response', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const wife = node(2, 'khadijah', 'Khadijah');
    const companion = node(3, 'abu-bakr', 'Abu Bakr');
    const run = createRun().mockResolvedValueOnce({
      records: [
        record({ node: focusNode, relationship: rel('WIFE', {}, { start: focusNode.identity, end: wife.identity }), related: wife }),
        record({ node: focusNode, relationship: rel('COMPANION_OF'), related: companion }),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad&excludeRelation=COMPANION_OF&excludeRelation=ACCOMPANIED_BY'));
    const body = await response.json();

    // The focus node itself, and any relation not excluded, are kept; the
    // companion relation and the companion-only related node are dropped.
    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual(['khadijah', 'prophet-muhammad']);
    expect(body.links).toEqual([{ source: 'person:prophet-muhammad', target: 'person:khadijah', label: 'WIFE', value: 1 }]);
  });

  it('keeps the focus node even when every one of its relations is excluded', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const companion = node(2, 'abu-bakr', 'Abu Bakr');
    const run = createRun().mockResolvedValueOnce({
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
    const run = createRun().mockResolvedValueOnce({
      records: [
        pathRecord([
          { start: muhammad, end: aisha, relationship: rel('WIFE', {}, { start: muhammad.identity, end: aisha.identity }) },
          { start: abuBakr, end: aisha, relationship: rel('DAUGHTER', {}, { start: abuBakr.identity, end: aisha.identity }) },
        ]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?person=prophet-muhammad'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $persons AS personSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: personSlug})-[*1]-(p2:Person)');
    expect(params).toEqual({ persons: ['prophet-muhammad'] });

    expect(body.nodes).toHaveLength(3);
    expect(body.links).toEqual([
      { source: 'person:prophet-muhammad', target: 'person:aisha', label: 'WIFE', value: 1 },
      { source: 'person:abu-bakr', target: 'person:aisha', label: 'DAUGHTER', value: 1 },
    ]);
  });

  it('dedupes repeated links across overlapping paths', async () => {
    const a = node(1, 'a', 'A');
    const b = node(2, 'b', 'B');
    const son = () => rel('SON', {}, { start: a.identity, end: b.identity });
    const run = createRun().mockResolvedValueOnce({
      records: [
        pathRecord([{ start: a, end: b, relationship: son() }]),
        pathRecord([{ start: a, end: b, relationship: son() }]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?person=a'));
    const body = await response.json();

    expect(body.links).toHaveLength(1);
  });

  // descendantsOf walks `(root)<-[:SON|DAUGHTER*]-(descendant)` -- backward
  // relative to how SON/DAUGHTER edges are actually stored (child ->
  // parent). Neo4j still reports each path segment's start/end in the
  // direction the pattern was *walked* (root -> descendant), which is the
  // opposite of the relationship's own true start/end (descendant ->
  // root). Using the segment's direction for the rendered link would
  // attribute the SON/DAUGHTER label to the root, reading as "root is SON
  // of descendant" -- backwards.
  it('renders a descendantsOf edge using the relationship\'s true direction, not the path-walk direction', async () => {
    const ali = node(1, 'ali-ibn-abi-talib', 'Ali');
    const hasan = node(2, 'al-hasan-ibn-ali', 'Hasan');
    const run = createRun().mockResolvedValueOnce({
      records: [
        // Segment walked root (ali) -> descendant (hasan), but the SON
        // edge is truly stored hasan -[:SON]-> ali (hasan is Ali's son).
        pathRecord([{ start: ali, end: hasan, relationship: rel('SON', {}, { start: hasan.identity, end: ali.identity }) }]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?descendantsOf=ali-ibn-abi-talib'));
    const body = await response.json();

    expect(body.links).toEqual([
      { source: 'person:al-hasan-ibn-ali', target: 'person:ali-ibn-abi-talib', label: 'SON', value: 1 },
    ]);
  });

  it('collects multiple requested persons into a single UNWIND query', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?person=a&person=b'));

    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][1]).toEqual({ persons: ['a', 'b'] });
  });

  it('walks FATHER-only chains for ancestorsOf (nasab is patrilineal)', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=prophet-muhammad'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $ancestors AS ancestorSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)');
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
    const run = createRun().mockResolvedValueOnce({
      records: [record({
        node: battle,
        relationship: rel('PARTICIPATED_IN', { status: ['MARTYRED'] }, { start: participant.identity, end: battle.identity }),
        related: participant,
      })],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?battle=badr'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
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
    // True stored direction is Person -[:PARTICIPATED_IN]-> Battle, matching
    // the Cypher pattern's own `(node)<-[relationship]-(related)` arrow --
    // the participant is the source, the battle is the target.
    expect(body.links).toEqual([
      { source: 'person:ali-ibn-abi-talib', target: 'battle:badr', label: 'PARTICIPATED_IN', value: 1, status: ['MARTYRED'] },
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
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)');
    expect(params).toEqual({ persons: ['a'], ancestors: ['b'] });
  });

  it('combines ancestorsOf and descendantsOf queries with UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=a&descendantsOf=a'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain(' UNION ');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)');
    expect(query).toContain('MATCH path = (p1:Person {slug: descendantSlug})<-[r:SON|DAUGHTER*]-(p2:Person)');
    expect(params).toEqual({ ancestors: ['a'], descendants: ['a'] });
  });

  it('returns edges of the requested types touching a subject regardless of raw stored direction', async () => {
    const muhammad = node(1, 'prophet-muhammad', 'Muhammad');
    const khadijah = node(2, 'khadijah', 'Khadijah');
    const aisha = node(3, 'aisha', 'Aisha');
    const run = createRun().mockResolvedValueOnce({
      records: [
        record({
          node: muhammad,
          relationship: rel('WIFE', {}, { start: muhammad.identity, end: khadijah.identity }),
          related: khadijah,
        }),
        record({
          node: muhammad,
          relationship: rel('WIFE', {}, { start: muhammad.identity, end: aisha.identity }),
          related: aisha,
        }),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(
      request('?relationSubjects=person:prophet-muhammad&relationTypes=WIFE')
    );
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $relationSubjects AS subject');
    expect(query).toContain('WHERE relationship IS NULL OR type(relationship) IN $relationTypes');
    expect(params).toEqual({
      relationSubjects: [{ kind: 'person', slug: 'prophet-muhammad' }],
      relationTypes: ['WIFE'],
    });

    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual([
      'aisha',
      'khadijah',
      'prophet-muhammad',
    ]);
    expect(body.links).toEqual(expect.arrayContaining([
      { source: 'person:prophet-muhammad', target: 'person:khadijah', label: 'WIFE', value: 1 },
      { source: 'person:prophet-muhammad', target: 'person:aisha', label: 'WIFE', value: 1 },
    ]));
    expect(body.links).toHaveLength(2);
  });

  it('combines a relationSubjects/relationTypes query with another query param via UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?battle=badr&relationSubjects=person:prophet-muhammad&relationTypes=WIFE'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain(' UNION ');
    expect(query).toContain('MATCH (node:Battle {slug: battleSlug})');
    expect(query).toContain('UNWIND $relationSubjects AS subject');
    expect(params).toEqual({
      battles: ['badr'],
      relationSubjects: [{ kind: 'person', slug: 'prophet-muhammad' }],
      relationTypes: ['WIFE'],
    });
  });

  it('walks a both-parents ancestors chain, including a grandparent reachable only through a MOTHER edge', async () => {
    const aisha = node(1, 'aisha', 'Aisha');
    const ummRuman = node(2, 'umm-ruman', 'Umm Ruman');
    const ummRumansFather = node(3, 'uwaymir', 'Uwaymir');
    const run = createRun().mockResolvedValueOnce({
      records: [
        pathRecord([
          { start: aisha, end: ummRuman, relationship: rel('MOTHER', {}, { start: ummRuman.identity, end: aisha.identity }) },
          { start: ummRuman, end: ummRumansFather, relationship: rel('FATHER', {}, { start: ummRumansFather.identity, end: ummRuman.identity }) },
        ]),
      ],
    });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?ancestorsOfBothParents=aisha'));
    const body = await response.json();

    expect(run).toHaveBeenCalledTimes(2);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $ancestorsBothParents AS ancestorSlug');
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER|MOTHER*]-(p2:Person)');
    expect(params).toEqual({ ancestorsBothParents: ['aisha'] });

    expect(body.nodes.map((n: { slug: string }) => n.slug).sort()).toEqual(['aisha', 'umm-ruman', 'uwaymir']);
    expect(body.links).toEqual(expect.arrayContaining([
      { source: 'person:umm-ruman', target: 'person:aisha', label: 'MOTHER', value: 1 },
      { source: 'person:uwaymir', target: 'person:umm-ruman', label: 'FATHER', value: 1 },
    ]));
  });

  it('does not let ancestorsOf (paternal-only) include a maternal-line ancestor', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=aisha'));

    expect(run).toHaveBeenCalledTimes(1);
    const [query] = run.mock.calls[0];
    expect(query).toContain('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)');
    expect(query).not.toContain('MOTHER');
  });

  it('runs a path-shaped query (ancestorsOf) and a node-shaped query (relationSubjects) as separate calls instead of one mismatched UNION', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    const response = await GET(
      request('?ancestorsOf=aisha&relationSubjects=person:aisha&relationTypes=WIFE')
    );

    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalledTimes(2);
    const queries = run.mock.calls.map(([query]) => query as string);
    expect(queries.some((query) => query.includes('MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)'))).toBe(true);
    expect(queries.some((query) => query.includes('UNWIND $relationSubjects AS subject'))).toBe(true);
    for (const query of queries) expect(query).not.toContain(' UNION ');
  });

  it('attaches saved Neo4j coordinates to a scoped (focus) response, keyed by type and slug', async () => {
    const focusNode = node(1, 'prophet-muhammad', 'Muhammad');
    const related = node(2, 'khadijah', 'Khadijah');
    const run = vi.fn()
      .mockResolvedValueOnce({
        records: [record({ node: focusNode, relationship: rel('WIFE', {}, { start: focusNode.identity, end: related.identity }), related })],
      })
      .mockResolvedValueOnce({
        records: [
          record({ type: 'person', slug: 'prophet-muhammad', layoutX: 1, layoutY: 2 }),
          record({ type: 'person', slug: 'khadijah', layoutX: 3, layoutY: 4 }),
        ],
      });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=prophet-muhammad'));
    const body = await response.json();

    expect(run.mock.calls[1][0]).toContain('n.layoutX');
    expect(run.mock.calls[1][1]).toEqual({
      subjects: [{ type: 'person', slug: 'prophet-muhammad' }, { type: 'person', slug: 'khadijah' }],
    });
    expect(body.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: 'prophet-muhammad', x: 1, y: 2, fx: 1, fy: 2 }),
      expect.objectContaining({ slug: 'khadijah', x: 3, y: 4, fx: 3, fy: 4 }),
    ]));
  });

  it('preserves a valid (0, 0) coordinate rather than treating it as missing', async () => {
    const focusNode = node(1, 'a', 'A');
    const run = vi.fn()
      .mockResolvedValueOnce({ records: [record({ node: focusNode, relationship: null, related: null })] })
      .mockResolvedValueOnce({ records: [record({ type: 'person', slug: 'a', layoutX: 0, layoutY: 0 })] });
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=a'));
    const body = await response.json();

    expect(body.nodes).toEqual([expect.objectContaining({ slug: 'a', x: 0, y: 0, fx: 0, fy: 0 })]);
  });

  it('returns a recoverable error, not partial/omitted data, when a subject has no saved position', async () => {
    const focusNode = node(1, 'a', 'A');
    const run = vi.fn()
      .mockResolvedValueOnce({ records: [record({ node: focusNode, relationship: null, related: null })] })
      .mockResolvedValueOnce({ records: [] }); // no matching Neo4j row -- layout genuinely missing
    getSession.mockReturnValue({ run });

    const response = await GET(request('?focus=a'));

    expect(response.status).toBe(500);
    expect((await response.json()).error).toContain('Graph layout is incomplete');
  });

  it('does not run the coordinate lookup at all when the response has no nodes', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });

    await GET(request('?ancestorsOf=nobody'));

    expect(run).toHaveBeenCalledTimes(1);
  });
});
