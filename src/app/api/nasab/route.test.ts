import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, findMany } = vi.hoisted(() => ({ getSession: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/neo4j', () => ({ getSession }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany } } }));

import { GET } from './route';

const request = (query: string) => new Request(`http://localhost/api/nasab${query}`);
const row = (slug: string, name: string, fathers: string[], isCompanion = false, sex: string | null = null) => ({
  get: (key: string) => ({ slug, name, fathers, isCompanion, sex })[key],
});

describe('GET /api/nasab', () => {
  beforeEach(() => {
    getSession.mockReset();
    findMany.mockReset().mockResolvedValue([]);
  });

  it('returns nothing without a person, and does not touch the database', async () => {
    const response = await GET(request(''));
    expect(await response.json()).toEqual({ people: [], subjects: [] });
    expect(getSession).not.toHaveBeenCalled();
  });

  it('walks FATHER edges only, for every requested person in one query', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });
    await GET(request('?person=ali&person=umar'));
    const [query, params] = run.mock.calls[0];
    expect(run).toHaveBeenCalledTimes(1);
    expect(query).toContain('<-[:FATHER*0..]-');
    expect(query).not.toMatch(/MOTHER|SON|DAUGHTER/);
    expect(query).toContain("(a)-[:HOLDS_TITLE]->(:Title {slug: 'companion'})");
    expect(params).toEqual({ slugs: ['ali', 'umar'], descendants: false });
  });

  it.each([
    ['?person=ali&descendants=1', true],
    ['?person=ali&descendants=true', false],
    ['?person=ali&descendants=0', false],
  ])('walks FATHER edges downward only for descendants=1 (%s)', async (query, descendants) => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });
    await GET(request(query));
    expect(run.mock.calls[0][1]).toEqual({ slugs: ['ali'], descendants });
  });

  it('reports the people found and drops subjects the graph does not hold', async () => {
    const run = vi.fn().mockResolvedValue({ records: [row('ali', 'علي', ['abu-talib']), row('abu-talib', 'أبو طالب', [])] });
    getSession.mockReturnValue({ run });
    const body = await (await GET(request('?person=ali&person=nobody'))).json();
    expect(body.subjects).toEqual(['ali']);
    expect(body.people).toEqual([
      { slug: 'ali', name: 'علي', fathers: ['abu-talib'], sex: null, isCompanion: false },
      { slug: 'abu-talib', name: 'أبو طالب', fathers: [], sex: null, isCompanion: false },
    ]);
  });

  it('uses profile sex before graph sex and keeps graph-only Companion metadata', async () => {
    getSession.mockReturnValue({ run: vi.fn().mockResolvedValue({ records: [
      row('ali', 'علي', [], true),
      row('fatima', 'فاطمة', ['ali'], true, 'MALE'),
      row('graph-only', 'امرأة', [], true, 'FEMALE'),
    ] }) });
    findMany.mockResolvedValue([{ slug: 'ali', sex: 'MALE' }, { slug: 'fatima', sex: 'FEMALE' }]);
    const body = await (await GET(request('?person=ali&descendants=1'))).json();
    expect(body.people).toMatchObject([
      { sex: 'MALE', isCompanion: true },
      { sex: 'FEMALE', isCompanion: true },
      { sex: 'FEMALE', isCompanion: true },
    ]);
  });

  it('answers 500 when the database is not configured', async () => {
    getSession.mockReturnValue(null);
    expect((await GET(request('?person=ali'))).status).toBe(500);
  });
});
