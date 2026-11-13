import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

const search = async (q: string) => (await GET(new NextRequest(`http://localhost/api/search?q=${encodeURIComponent(q)}`)).json()).groups as { kind: string; hits: Record<string, unknown>[] }[];

describe('/api/search', () => {
  it('lists the surah first, then the other groups', async () => {
    const groups = await search('الأعراف');
    expect(groups[0]).toMatchObject({ kind: 'surah', hits: [{ number: 7 }] });
  });

  it('finds ayat, the word, trees, compare pages and events for «فرعون»', async () => {
    const kinds = (await search('فرعون')).map(group => group.kind);
    expect(kinds).toEqual(expect.arrayContaining(['ayah', 'word', 'tree', 'event']));
    expect(kinds).not.toContain('note');
  });

  it('returns nothing for an empty query', async () => {
    expect(await search(' ')).toEqual([]);
  });
});

describe('/api/search events', () => {
  it('offers only events the website story page shows', async () => {
    const { STORIES } = await import('@shared/quran/prophets/stories');
    const hits = (await search('موسى')).find(group => group.kind === 'event')?.hits ?? [];
    expect(hits.length).toBeGreaterThan(0);
    for (const hit of hits) expect(STORIES[hit.slug as string].events[hit.event as number].title).toBe(hit.title);
  });
});
