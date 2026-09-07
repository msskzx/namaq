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
