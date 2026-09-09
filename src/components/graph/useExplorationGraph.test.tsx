import React, { ReactNode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { useExplorationGraph } from './useExplorationGraph';
import { GraphData } from '@/types/graph';

const node = (slug: string, type = 'person') => ({ id: `${type}:${slug}`, slug, label: slug, group: 1, type });
const wrapper = ({ children }: { children: ReactNode }) => <SWRConfig value={{ provider: () => new Map(), shouldRetryOnError: false }}>{children}</SWRConfig>;
const options = {
  enabled: true,
  baseUrl: '/api/graph',
  kindParams: ['person', 'title'],
  selectedSlug: null,
  input: { roots: ['person:root'], expansions: [], globalFilters: [] },
};
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('unions full-dataset nodes with scoped roots, including isolated subjects', async () => {
  const fetch = vi.fn(async (input: string) => {
    const url = new URL(input);
    const scoped = url.searchParams.has('relationSubjects');
    return { ok: true, json: async () => ({ nodes: [node(scoped ? 'root' : 'isolated')], links: [] }) };
  });
  vi.stubGlobal('fetch', fetch);
  const { result } = renderHook(() => useExplorationGraph({ ...options, fullGraph: true }), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.data?.nodes.map(node => node.id)).toEqual(['person:root', 'person:isolated']);
  expect(result.current.visibleCount).toBe(2);
  const fullUrl = new URL(fetch.mock.calls[1][0]);
  expect(fullUrl.searchParams.getAll('kind')).toEqual(['person', 'title']);
  expect(fullUrl.searchParams.has('relationSubjects')).toBe(false);
});

it('does not count or reveal disabled kinds returned by scoped queries', async () => {
  const data: GraphData = {
    nodes: [node('root'), node('battle', 'battle')],
    links: [{ source: 'battle:battle', target: 'person:root', label: 'PARTICIPATED_IN', value: 1 }],
  };
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
  const { result } = renderHook(() => useExplorationGraph(options), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.edges).toEqual([]);
  expect(result.current.data?.nodes.map(node => node.id)).toEqual(['person:root']);
});

it('keeps fetching until the exploration stops growing, past the old six-round limit', async () => {
  // Alternating filters can walk deeper than any one filter's cap allows:
  // each introduction caps only its own relation type.
  const chain = [
    ['person:w1', 'person:root', 'WIFE'],
    ['person:f1', 'person:w1', 'FATHER'],
    ['person:w2', 'person:f1', 'WIFE'],
    ['person:f2', 'person:w2', 'FATHER'],
    ['person:w3', 'person:f2', 'WIFE'],
    ['person:f3', 'person:w3', 'FATHER'],
    ['person:w4', 'person:f3', 'WIFE'],
    ['person:f4', 'person:w4', 'FATHER'],
  ].map(([source, target, label]) => ({ source, target, label, value: 1 }));
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    const subjects = new URL(input).searchParams.getAll('relationSubjects');
    const links = chain.filter(link => subjects.includes(link.source) || subjects.includes(link.target));
    const ids = new Set([...subjects, ...links.flatMap(link => [link.source, link.target])]);
    return { ok: true, json: async () => ({ nodes: [...ids].map(id => node(id.split(':')[1])), links }) };
  }));

  const { result } = renderHook(
    () => useExplorationGraph({ ...options, input: { roots: ['person:root'], expansions: [], globalFilters: ['WIFE', 'FATHER'] } }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.data?.nodes.map(node => node.slug)).toContain('f4'));
});

it('reports the caps a global filter recorded, for the caller to persist', async () => {
  const links = [{ source: 'person:father', target: 'person:root', label: 'FATHER', value: 1 }];
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    const subjects = new URL(input).searchParams.getAll('relationSubjects');
    const matching = links.filter(link => subjects.includes(link.source) || subjects.includes(link.target));
    return { ok: true, json: async () => ({ nodes: [node('root'), node('father')], links: matching }) };
  }));

  const { result } = renderHook(
    () => useExplorationGraph({ ...options, input: { roots: ['person:root'], expansions: [], globalFilters: ['FATHER'] } }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.caps).toEqual([{ subject: 'person:father', relation: 'FATHER' }]));
});

it('surfaces a failed fetch and recovers through retry', async () => {
  let failing = true;
  vi.stubGlobal('fetch', vi.fn(async () => {
    if (failing) throw new Error('network down');
    return { ok: true, json: async () => ({ nodes: [node('root')], links: [] }) };
  }));

  const { result } = renderHook(() => useExplorationGraph(options), { wrapper });
  await waitFor(() => expect(result.current.error).toBeTruthy());
  expect(result.current.data).toBeUndefined();

  failing = false;
  result.current.retry();

  await waitFor(() => expect(result.current.data?.nodes.map(node => node.slug)).toEqual(['root']));
});
