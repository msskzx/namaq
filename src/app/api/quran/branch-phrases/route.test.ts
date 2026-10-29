import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

function search(query: Record<string, string>) {
  return GET(new NextRequest(`http://localhost/api/quran/branch-phrases?${new URLSearchParams(query)}`));
}

describe('branch phrase suggestions', () => {
  it('finds internal wording and identifies its tree kind without sending the inventory', async () => {
    const response = search({ q: 'متنا وكنا ترابا', scope: 'inside' });
    const body = await response.json();
    expect(body.suggestions.length).toBeGreaterThan(0);
    expect(body.suggestions.length).toBeLessThanOrEqual(10);
    expect(body.suggestions.every((suggestion: { kind: string }) => suggestion.kind === 'inside')).toBe(true);
    expect(body.suggestions.some((suggestion: { count: number }) => suggestion.count === 5)).toBe(true);
    expect(Object.keys(body)).toEqual(['suggestions']);
    expect(response.headers.get('cache-control')).toContain('max-age=3600');
  });

  it('keeps internal trees out of opening-only search', async () => {
    const response = search({ q: 'وقعت الواقعة', scope: 'opening' });
    expect((await response.json()).suggestions).toEqual([]);
  });

  it('filters occurrences by juz before offering a shared phrase', async () => {
    const response = search({ q: 'متنا وكنا ترابا', scope: 'inside', juzFrom: '30', juzTo: '30' });
    expect((await response.json()).suggestions).toEqual([]);
  });

  it('returns no inventory for an empty query', async () => {
    expect((await search({ scope: 'all' }).json()).suggestions).toEqual([]);
  });
});

it('normalizes unknown scopes to the all-scope inventory', async () => {
  const all = await search({ scope: 'all', q: 'وقعت الواقعة' }).json();
  expect(await search({ scope: 'unknown', q: 'وقعت الواقعة' }).json()).toEqual(all);
});
