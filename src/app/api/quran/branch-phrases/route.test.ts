import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

const search = (query: Record<string, string>) => GET(new NextRequest(`http://localhost/api/quran/branch-phrases?${new URLSearchParams(query)}`));

describe('branch tree suggestions', () => {
  it('finds the complete tree by wording absorbed from a smaller tree', async () => {
    const { suggestions } = await search({ q: 'فذرهم يخوضوا ويلعبوا', juzFrom: '25', juzTo: '30' }).json();
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({ id: 'يومهم الذي', count: 4 });
  });
  it('searches the unified tree inventory', async () => {
    const response = search({ q: 'وقعت الواقعة' });
    const body = await response.json();
    expect(body.suggestions.length).toBeGreaterThan(0);
    expect(body.suggestions.length).toBeLessThanOrEqual(10);
    expect(body.suggestions.some((tree: { count: number }) => tree.count === 2)).toBe(true);
    expect(body.suggestions.every((tree: { kind?: unknown }) => tree.kind === undefined)).toBe(true);
    expect(response.headers.get('cache-control')).toContain('max-age=3600');
  });

  it('uses the same inventory regardless of retired scope parameters', async () => {
    expect(await search({ q: 'وقعت الواقعة', scope: 'opening' }).json()).toEqual(await search({ q: 'وقعت الواقعة', scope: 'inside' }).json());
  });

  it('filters the unified inventory by juz', async () => {
    expect((await search({ q: 'متنا وكنا ترابا', juzFrom: '30', juzTo: '30' }).json()).suggestions).toEqual([]);
  });
});
