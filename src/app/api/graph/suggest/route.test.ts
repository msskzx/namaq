import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, getSession } = vi.hoisted(() => ({ findMany: vi.fn(), getSession: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany } } }));
vi.mock('@/lib/neo4j', () => ({ getSession }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/graph/suggest${query}`);
}

function record(fields: Record<string, unknown>) {
  return { get: (key: string) => fields[key] };
}

function subject(labels: string[], slug: string, name: string, extra: Record<string, unknown> = {}) {
  return record({
    labels,
    slug,
    name,
    fullName: null,
    nameTransliterated: null,
    graphRank: null,
    ...extra,
  });
}

const UMAR = subject(['Person'], 'umar-ibn-al-khattab', 'عمر بن الخطاب', {
  nameTransliterated: 'Umar ibn al-Khattab',
  graphRank: 2,
});
const BADR = subject(['Battle'], 'badr', 'غزوة بدر', { nameTransliterated: 'Ghazwat Badr', graphRank: 12 });
const COMPANION = subject(['Title'], 'sahabi', 'صحابي', { nameTransliterated: 'Sahabi', graphRank: 8 });
const HIJRA = subject(['Event'], 'hijra', 'الهجرة', { nameTransliterated: 'Al-Hijra', graphRank: 30 });

function sessionReturning(records: ReturnType<typeof record>[]) {
  const run = vi.fn().mockResolvedValue({ records });
  getSession.mockReturnValue({ run });
  return run;
}

describe('GET /api/graph/suggest', () => {
  beforeEach(() => {
    findMany.mockReset();
    getSession.mockReset();
    findMany.mockResolvedValue([]);
  });

  it('returns an empty list without touching either store when q is blank', async () => {
    const response = await GET(request('?q=%20'));

    expect(getSession).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ data: [] });
  });

  it('returns matches of all four kinds, each with an explicit kind and hasProfile', async () => {
    sessionReturning([UMAR, BADR, COMPANION, HIJRA]);
    findMany.mockResolvedValue([{ slug: 'umar-ibn-al-khattab' }]);

    const response = await GET(request('?q=a'));
    const body = await response.json();

    const byKind = Object.fromEntries(body.data.map((entry: { kind: string; slug: string }) => [entry.kind, entry.slug]));
    expect(byKind).toEqual({
      person: 'umar-ibn-al-khattab',
      battle: 'badr',
      title: 'sahabi',
      event: 'hijra',
    });
    for (const entry of body.data) {
      expect(entry).toMatchObject({ hasProfile: true });
      expect(entry.id).toBe(`${entry.kind}:${entry.slug}`);
    }
  });

  it('marks a person with no PostgreSQL row hasProfile: false, and a non-person true', async () => {
    sessionReturning([
      subject(['Person'], 'malik-ibn-thalabah', 'Malik ibn Thalabah'),
      BADR,
    ]);
    findMany.mockResolvedValue([]);

    const body = await (await GET(request('?q=a'))).json();
    const bySlug = Object.fromEntries(
      body.data.map((entry: { slug: string; hasProfile: boolean }) => [entry.slug, entry.hasProfile])
    );

    expect(bySlug).toEqual({ 'malik-ibn-thalabah': false, badr: true });
    expect(findMany).toHaveBeenCalledWith({
      where: { slug: { in: ['malik-ibn-thalabah'] } },
      select: { slug: true },
    });
  });

  it('finds a graph-only person by their fullName, which the people endpoint never sees', async () => {
    sessionReturning([
      subject(['Person'], 'malik-ibn-thalabah', 'مالك', {
        fullName: 'مالك بن ثعلبة بن فهم',
      }),
    ]);

    const body = await (await GET(request('?q=ثعلبة'))).json();

    expect(body.data).toEqual([
      expect.objectContaining({ slug: 'malik-ibn-thalabah', kind: 'person', hasProfile: false, match: 'exact' }),
    ]);
  });

  it('orders by match quality first, then graphRank', async () => {
    sessionReturning([
      subject(['Battle'], 'khandaq', 'الخندق', { nameTransliterated: 'Al-Khandaq', graphRank: 40 }),
      subject(['Title'], 'khandaq-title', 'الخندق', { nameTransliterated: 'Al-Khandaq', graphRank: 8 }),
      subject(['Person'], 'khandaq-adjacent', 'X', { nameTransliterated: 'Man of Al-Khandaq lineage', graphRank: 1 }),
    ]);

    const body = await (await GET(request('?q=Al-Khandaq'))).json();

    expect(body.data.map((entry: { slug: string }) => entry.slug)).toEqual([
      'khandaq-title',
      'khandaq',
      'khandaq-adjacent',
    ]);
  });

  it('clamps limit to the 1-20 range', async () => {
    sessionReturning(
      Array.from({ length: 30 }, (_, i) => subject(['Person'], `person-${i}`, 'Ahmad'))
    );

    const body = await (await GET(request('?q=ahmad&limit=100'))).json();

    expect(body.data).toHaveLength(20);
  });

  it('skips a node missing the slug or name it would be matched on', async () => {
    sessionReturning([
      subject(['Person'], 'ahmad-ibn-hanbal', 'Ahmad'),
      subject(['Person'], '', 'Ahmad'),
      subject(['Battle'], 'ahmad-battle', ''),
      subject(['Charity'], 'ahmad-charity', 'Ahmad'),
    ]);

    const body = await (await GET(request('?q=ahmad'))).json();

    expect(body.data.map((entry: { slug: string }) => entry.slug)).toEqual(['ahmad-ibn-hanbal']);
  });

  it('degrades to an empty list, not an error, when Neo4j is unreachable', async () => {
    getSession.mockReturnValue(null);

    const response = await GET(request('?q=badr'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: [] });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns 500 when the Neo4j query itself fails', async () => {
    getSession.mockReturnValue({ run: vi.fn().mockRejectedValue(new Error('boom')) });

    const response = await GET(request('?q=badr'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch graph suggestions' });
  });
});
