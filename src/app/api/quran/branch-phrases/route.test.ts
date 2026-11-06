import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { phraseTreeId } from '@/lib/quran/mutashabih/identity';
import { buildPhraseGroups } from '@/lib/quran/phraseTrees';
import corpus from '@/app/quran/branches/trees.json';
import { GET } from './route';

const search = (query: Record<string, string>) => GET(new NextRequest(`http://localhost/api/quran/branch-phrases?${new URLSearchParams({ categories: 'words', ...query })}`));

describe('branch tree suggestions', () => {
  it('finds the focused shared expression instead of its broader absorbed parent', async () => {
    const { suggestions } = await search({ q: 'فذرهم يخوضوا ويلعبوا', juzFrom: '25', juzTo: '30' }).json();
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({ id: phraseTreeId(buildPhraseGroups(corpus.ayat).find(tree => tree.id === 'ذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون')!), count: 2 });
  });
  it('excludes a broad tree whose alias matches only two of its members', async () => {
    const { suggestions } = await search({ q: 'علي هدي' }).json();
    expect(suggestions.some((tree: { id: string }) => tree.id === 'اولاك هم')).toBe(false);
    expect(suggestions.some((tree: { id: string }) => tree.id === phraseTreeId(corpus.trees.find(tree => tree.id === 'لعلي هدي')!))).toBe(true);
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

  it('serves the whole inventory of a range once, for the browser to search, cached', async () => {
    const response = search({ all: '1' });
    const { phrases } = await response.json();
    expect(phrases.length).toBeGreaterThan(5000);
    expect(phrases[0]).toEqual(expect.objectContaining({ id: expect.any(String), text: expect.any(String), count: expect.any(Number) }));
    expect(response.headers.get('cache-control')).toContain('max-age=3600');
    const ranged = (await search({ all: '1', juzFrom: '25', juzTo: '30' }).json()).phrases;
    expect(ranged.length).toBeLessThan(phrases.length);
    expect(ranged.some((phrase: { id: string }) => phrase.id === phraseTreeId(corpus.trees.find(tree => tree.id === 'يومهم الذي')!))).toBe(true);
  });

  it('uses the same inventory regardless of retired scope parameters', async () => {
    expect(await search({ q: 'وقعت الواقعة', scope: 'opening' }).json()).toEqual(await search({ q: 'وقعت الواقعة', scope: 'inside' }).json());
  });

  it('honors applied category and chapter restrictions', async () => {
    expect((await search({ q: 'الم', categories: 'none', surahs: '114' }).json()).suggestions).toEqual([]);
  });

  it('keeps full-corpus IDs when applying a juz range', async () => {
    const full = (await search({ all: '1' }).json()).phrases;
    const scoped = (await search({ all: '1', juzFrom: '1', juzTo: '1' }).json()).phrases;
    const ids = new Set(full.map((phrase: { id: string }) => phrase.id));
    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.every((phrase: { id: string }) => ids.has(phrase.id))).toBe(true);
  });

  it('filters the unified inventory by juz', async () => {
    expect((await search({ q: 'متنا وكنا ترابا', juzFrom: '30', juzTo: '30' }).json()).suggestions).toEqual([]);
  });
});
