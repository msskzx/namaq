import { describe, expect, it } from 'vitest';
import { GET } from './route';

const get = (query: string) => GET(new Request(`http://localhost/api/tarajim${query}`));

describe('GET /api/tarajim', () => {
  it('sends a ties ring, a nasab tree, virtues and a search, and refuses what it does not know', async () => {
    const ties = await (await get('?ties=az-zubayr-ibn-al-awwam')).json();
    expect(ties.name).toContain('الزبير');
    expect(ties.groups.length).toBeGreaterThan(0);
    expect(ties.groups[0].ties[0].word.length).toBeGreaterThan(0);
    const nasab = await (await get('?nasab=az-zubayr-ibn-al-awwam,prophet-muhammad')).json();
    expect(nasab.people).toHaveLength(2);
    expect(nasab.meetings[0].at).toBeTruthy();
    expect((await (await get('?nasab=az-zubayr-ibn-al-awwam,prophet-muhammad&meetings=0')).json()).meetings).toEqual([]);
    const virtues = await (await get('?virtues=az-zubayr-ibn-al-awwam,nobody')).json();
    expect(virtues).toHaveLength(1);
    expect((await (await get('?q=الزبير')).json()).some((p: { slug: string }) => p.slug === 'az-zubayr-ibn-al-awwam')).toBe(true);
    expect((await get('?ties=nobody')).status).toBe(404);
    expect((await get('')).status).toBe(400);
  });
});
