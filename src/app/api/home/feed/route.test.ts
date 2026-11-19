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

  it('sends the sira cards: a story in even batches with its ayat pages, a battle moment in odd ones', async () => {
    const cards = await get(`day=${today}&sira=0,1,2,3`);
    expect(cards.map((card: { slot: number; kind: string }) => [card.slot, card.kind])).toEqual([[0, 'sira'], [1, 'moment'], [2, 'sira'], [3, 'moment']]);
    const [story, moment] = cards;
    expect(story.report.moments.length).toBeGreaterThan(0);
    expect(story.pages.length).toBe(story.ayat.length);
    expect(moment.moment.quote).toBeTruthy();
    expect(moment.n).toBeGreaterThan(0);
    // The day turns the lists, the same day sends the same cards.
    expect(await get(`day=${today}&sira=0,1,2,3`)).toEqual(cards);
  });
});
