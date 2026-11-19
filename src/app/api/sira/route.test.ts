import { describe, expect, it } from 'vitest';
import { STORIES, BATTLES } from '@/lib/stories';
import { GET } from './route';

const get = (query: string) => GET(new Request(`http://localhost/api/sira?${query}`));

describe('GET /api/sira', () => {
  it('sends a story with a list of mushaf pages for each of its ayat', async () => {
    const story = STORIES.find(each => each.ayat.length)!;
    const body = await (await get(`story=${story.slug}`)).json();
    expect(body.story.slug).toBe(story.slug);
    expect(body.ayat.length).toBe(story.ayat.length);
    expect(body.ayat[0][0].slice.to).toBeGreaterThanOrEqual(body.ayat[0][0].slice.from);
  });

  it('sends a battle, and nothing for a slug it does not know', async () => {
    expect((await (await get(`battle=${BATTLES[0].slug}`)).json()).battle.name).toBe(BATTLES[0].name);
    expect((await get('story=nothing')).status).toBe(404);
    expect((await get('')).status).toBe(404);
  });
});
