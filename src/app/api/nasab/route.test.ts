import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock('@/lib/neo4j', () => ({ getSession }));

import { GET } from './route';

const request = (query: string) => new Request(`http://localhost/api/nasab${query}`);
const row = (slug: string, name: string, fathers: string[]) => ({
  get: (key: string) => ({ slug, name, fathers })[key],
});

describe('GET /api/nasab', () => {
  beforeEach(() => getSession.mockReset());

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
    expect(params).toEqual({ slugs: ['ali', 'umar'], descendants: false });
  });

  it('also walks FATHER edges downward when descendants=1', async () => {
    const run = vi.fn().mockResolvedValue({ records: [] });
    getSession.mockReturnValue({ run });
    await GET(request('?person=ali&descendants=1'));
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('-[:FATHER*1..]->');
    expect(params).toEqual({ slugs: ['ali'], descendants: true });
  });

  it('reports the people found and drops subjects the graph does not hold', async () => {
    const run = vi.fn().mockResolvedValue({ records: [row('ali', 'علي', ['abu-talib']), row('abu-talib', 'أبو طالب', [])] });
    getSession.mockReturnValue({ run });
    const body = await (await GET(request('?person=ali&person=nobody'))).json();
    expect(body.subjects).toEqual(['ali']);
    expect(body.people).toEqual([
      { slug: 'ali', name: 'علي', fathers: ['abu-talib'] },
      { slug: 'abu-talib', name: 'أبو طالب', fathers: [] },
    ]);
  });

  it('answers 500 when the database is not configured', async () => {
    getSession.mockReturnValue(null);
    expect((await GET(request('?person=ali'))).status).toBe(500);
  });
});
