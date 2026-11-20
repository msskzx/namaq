import { describe, expect, it } from 'vitest';
import { dayNumber } from '@shared/dailyPick';
import { GET } from './route';

const today = dayNumber(new Date());

const get = async (query: string) => (await GET(new Request(`http://localhost/api/home/feed?${query}`))).json();

describe('GET /api/home/feed', () => {
  it('lists the coming pairs and trees, then sends the picked ones', async () => {
    const ids = await get(`day=${today}`);
    expect(ids.pairs.length).toBe(60);
    expect(ids.pairs[0]).toBeTruthy();
    expect(ids.trees[0]).toBeTruthy();
    expect(ids.pairKeys[0].length).toBeGreaterThan(1);
    expect(ids.treeKeys[0][0]).toMatch(/^\d+:\d+$/);
    const content = await get(`day=${today}&p=0,1&t=0`);
    expect(content.pairs.map((pair: { id: string }) => pair.id)).toEqual(ids.pairs.slice(0, 2));
    expect(content.trees[0].id).toBe(ids.trees[0]);
  });

  it('lists further on as the feed grows, and sends pairs past the first 60', async () => {
    const ids = await get(`day=${today}&n=180`);
    expect(ids.pairs.length).toBe(180);
    const content = await get(`day=${today}&p=150,179`);
    expect(content.pairs.map((pair: { id: string }) => pair.id)).toEqual([ids.pairs[150], ids.pairs[179]]);
    for (const n of ['59', '61', '0', 'x', String(100 * 60 + 60)]) expect((await GET(new Request(`http://localhost/api/home/feed?day=${today}&n=${n}`))).status).toBe(400);
  });

  it('sends a page slice', async () => {
    const slice = await get('page=294');
    expect(slice.surah).toBe(18);
  });

  it('refuses a bad day or page', async () => {
    expect((await GET(new Request('http://localhost/api/home/feed?day=x'))).status).toBe(400);
    expect((await GET(new Request('http://localhost/api/home/feed?page=700'))).status).toBe(400);
    expect((await GET(new Request(`http://localhost/api/home/feed?day=${today + 100}`))).status).toBe(400);
  });

  it('lists the items of a kind from where the day starts, and continues just after a story opened from the feed (owner 2026-11-19)', async () => {
    const ids: string[] = await get(`day=${today}&items=sira&n=3`);
    expect(ids).toHaveLength(3);
    expect(await get(`day=${today}&items=sira&n=2&after=${encodeURIComponent(ids[0])}`)).toEqual(ids.slice(1, 3));
    expect((await GET(new Request(`http://localhost/api/home/feed?day=${today}&items=pair&n=3`))).status).toBe(400);
  });
});
