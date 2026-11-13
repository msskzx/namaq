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
    const content = await get(`day=${today}&p=0,1&t=0`);
    expect(content.pairs.map((pair: { id: string }) => pair.id)).toEqual(ids.pairs.slice(0, 2));
    expect(content.trees[0].id).toBe(ids.trees[0]);
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
});
