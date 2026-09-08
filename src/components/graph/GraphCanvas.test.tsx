import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import GraphCanvas from './GraphCanvas';
import { GraphData } from '@/types/graph';

const nav = vi.hoisted(() => {
  let url = '/graphs';
  const listeners = new Set<() => void>();
  const setUrl = (next: string) => { url = next; listeners.forEach(listener => listener()); };
  return {
    getUrl: () => url,
    setUrl,
    push: vi.fn(setUrl),
    replace: vi.fn(setUrl),
    subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); },
  };
});
vi.mock('next/navigation', async () => {
  const react = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ push: nav.push, replace: nav.replace }),
    usePathname: () => '/graphs',
    useSearchParams: () => {
      const url = react.useSyncExternalStore(nav.subscribe, nav.getUrl);
      return react.useMemo(() => new URLSearchParams(url.split('?')[1]), [url]);
    },
  };
});
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('./GraphSearch', () => ({ default: () => null }));
// A ref-forwarding stub exposing the same camera methods GraphCanvas drives
// (centerAt/zoom/zoomToFit/graph2ScreenCoords), so the camera effects in
// GraphCanvas.tsx (docs/graph-layout-plan.md's Phase three/four) are
// observable directly instead of mocked away entirely -- graph2ScreenCoords
// assumes zoom 1 and no camera offset (screen coords == world coords),
// which is enough to distinguish "on screen" from "nowhere near it".
const camera = vi.hoisted(() => ({
  centerAt: vi.fn(),
  zoom: vi.fn(() => 1),
  zoomToFit: vi.fn(),
  graph2ScreenCoords: vi.fn((x: number, y: number) => ({ x, y })),
}));
vi.mock('./GraphSurface', () => ({
  default: React.forwardRef(function GraphSurfaceStub({ data }: { data: GraphData }, ref: React.Ref<typeof camera>) {
    React.useImperativeHandle(ref, () => camera);
    return <div data-testid="graph">{data.nodes.map(node => node.slug).sort().join(',')}</div>;
  }),
  kindFillColor: () => '#fff',
}));

const root = 'prophet-muhammad';
// x/y placed well within a default jsdom viewport (~1024x768), so a
// selection lands "comfortably visible" by default; 'grandfather' sits far
// off-screen instead, for the one test that needs an obscured selection.
const dataset: GraphData = {
  nodes: [root, 'wife', 'father', 'wife-father', 'grandfather', 'isolated'].map(slug => ({
    id: `person:${slug}`, slug, label: slug, group: 1, type: 'person',
    x: slug === 'grandfather' ? 100000 : 400,
    y: slug === 'grandfather' ? 100000 : 300,
  })),
  links: [
    ['wife', root, 'WIFE'],
    ['father', root, 'FATHER'],
    ['wife-father', 'wife', 'FATHER'],
    ['grandfather', 'father', 'FATHER'],
  ].map(([source, target, label]) => ({ source: `person:${source}`, target: `person:${target}`, label, value: 1 })),
};
const params = () => new URL(nav.getUrl(), 'http://localhost').searchParams;
const graph = () => screen.getByTestId('graph').textContent;
const mount = () => render(<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}><GraphCanvas /></SWRConfig>);

beforeEach(() => {
  vi.clearAllMocks();
  nav.setUrl('/graphs');
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    if (input.includes('/api/people/')) {
      return { ok: true, json: async () => ({ fullName: 'محمد بن عبد الله', titles: [{ name: 'رسول الله', slug: 'messenger-of-allah' }] }) };
    }
    const subjects = new URL(input).searchParams.getAll('relationSubjects');
    const links = subjects.length ? dataset.links.filter(link => subjects.includes(String(link.source)) || subjects.includes(String(link.target))) : dataset.links;
    const ids = new Set([...subjects, ...links.flatMap(link => [link.source, link.target])]);
    const nodes = subjects.length ? dataset.nodes.filter(node => ids.has(node.id)) : dataset.nodes;
    return { ok: true, json: async () => ({ nodes, links }) };
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('starts selected, then uses the same counted controls globally without changing local expansions', async () => {
  // A pre-existing subject in the URL opts out of the fresh-visit
  // auto-expansion (see the dedicated test for that below), reconstructing
  // this test's own starting point: selected, nothing expanded yet.
  nav.setUrl(`/graphs?subject=person:${root}&selected=${root}`);
  mount();
  fireEvent.click(await screen.findByRole('button', { name: 'Wife (1)' }));
  await waitFor(() => expect(graph()).toContain('wife'));
  expect(params().getAll('expand')).toEqual([`person:${root}:WIFE`]);
  fireEvent.click(screen.getByRole('button', { name: 'Deselect' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Father (2)' }));
  await waitFor(() => expect(graph()).toBe('father,prophet-muhammad,wife,wife-father'));
  expect(params().getAll('filter')).toEqual(['FATHER']);
  expect(params().getAll('expand')).toEqual([`person:${root}:WIFE`]);
  expect(screen.getByRole('status').textContent).toContain('Show 2 new subjects');
  fireEvent.click(screen.getByRole('button', { name: root }));
  expect(screen.getByRole('button', { name: 'Father (1)' }).getAttribute('aria-pressed')).toBe('false');
  expect(params().getAll('filter')).toEqual(['FATHER']);
});

it('offers Show additions after growth, clears it on click, and offers no stale one after a collapse with no growth', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&selected=${root}`);
  mount();
  fireEvent.click(await screen.findByRole('button', { name: 'Wife (1)' }));
  await waitFor(() => expect(graph()).toContain('wife'));
  const showButton = await screen.findByRole('button', { name: /Show \d+ new subjects?/ });
  fireEvent.click(showButton);
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Wife (1)' }));
  await waitFor(() => expect(graph()).toBe(root));
  expect(screen.queryByRole('status')).toBeNull();
});

it('keeps the cap after off/on and restores filters from the URL', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&expand=person:${root}:WIFE&filter=FATHER`);
  const view = mount();
  await waitFor(() => expect(graph()).toBe('father,prophet-muhammad,wife,wife-father'));
  fireEvent.click(screen.getByRole('button', { name: 'Father (3)' }));
  await waitFor(() => expect(graph()).toBe('prophet-muhammad,wife'));
  fireEvent.click(screen.getByRole('button', { name: 'Father (2)' }));
  await waitFor(() => expect(graph()).toBe('father,prophet-muhammad,wife,wife-father'));
  view.unmount();
  mount();
  await waitFor(() => expect(graph()).not.toContain('grandfather'));
});

it('unions the full graph, preserves exploration state and makes Start over undoable', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&expand=person:${root}:WIFE&filter=FATHER&selected=wife`);
  mount();
  await screen.findByRole('button', { name: 'Show full graph' });
  fireEvent.click(screen.getByRole('button', { name: 'Show full graph' }));
  await waitFor(() => expect(graph()).toContain('grandfather'));
  expect(graph()).toContain('isolated');
  expect(params().get('full')).toBe('1');
  expect(params().get('selected')).toBe('wife');
  expect(params().getAll('expand')).toEqual([`person:${root}:WIFE`]);
  const beforeReset = nav.getUrl();
  fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
  await waitFor(() => expect(graph()).toBe(root));
  expect(params().has('filter')).toBe(false);
  expect(params().has('expand')).toBe(false);
  expect(params().has('full')).toBe(false);
  expect(params().has('kind')).toBe(false);
  expect(params().get('selected')).toBe(root);
  expect(nav.push).toHaveBeenLastCalledWith(nav.getUrl(), { scroll: false });
  act(() => nav.setUrl(beforeReset));
  await waitFor(() => expect(graph()).toContain('grandfather'));
  expect(params().getAll('filter')).toEqual(['FATHER']);
});

it('auto-expands the default subject\'s direct relations on a fresh visit', async () => {
  mount();
  await waitFor(() => expect(graph()).toBe(`father,${root},wife`));
  expect(params().getAll('expand').sort()).toEqual([`person:${root}:FATHER`, `person:${root}:WIFE`]);
  expect((await screen.findByRole('button', { name: 'Wife (1)' })).getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('button', { name: 'Father (1)' }).getAttribute('aria-pressed')).toBe('true');
});

it('turning off one direct relation after All direct relations leaves the rest expanded', async () => {
  mount();
  await waitFor(() => expect(graph()).toBe(`father,${root},wife`));
  fireEvent.click(screen.getByRole('button', { name: 'Wife (1)' }));
  await waitFor(() => expect(graph()).toBe(`father,${root}`));
  expect(params().getAll('expand')).toEqual([`person:${root}:FATHER`]);
  expect(screen.getByRole('button', { name: 'Father (1)' }).getAttribute('aria-pressed')).toBe('true');
});

it('toggling a node kind does not erase existing expansion choices', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&expand=person:${root}:WIFE&selected=${root}`);
  mount();
  await waitFor(() => expect(graph()).toContain('wife'));
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
  fireEvent.click(await screen.findByRole('switch', { name: 'Show Battles & Expeditions' }));
  expect(params().getAll('expand')).toEqual([`person:${root}:WIFE`]);
  fireEvent.click(screen.getByRole('switch', { name: 'Hide Battles & Expeditions' }));
  expect(params().getAll('expand')).toEqual([`person:${root}:WIFE`]);
});

it('shows the fetched full name and titles once the selected person\'s preview loads', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&selected=${root}`);
  mount();
  await screen.findByRole('heading', { name: root });
  await screen.findByRole('heading', { name: 'محمد بن عبد الله' });
  expect(screen.getByText('رسول الله')).toBeTruthy();
});

// The camera effects below settle their initial framing after a 300ms
// timeout (see GraphCanvas.tsx) -- waiting it out and clearing the spy
// isolates each test's own assertion from that unrelated initial call.
const settleInitialFraming = () => new Promise(resolve => setTimeout(resolve, 350));

it('keeps the camera steady when selecting an already on-screen subject', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&expand=person:${root}:WIFE&selected=${root}`);
  mount();
  await waitFor(() => expect(graph()).toContain('wife'));
  await settleInitialFraming();
  camera.centerAt.mockClear();

  fireEvent.click(screen.getByRole('button', { name: 'wife' }));
  await waitFor(() => expect(params().get('selected')).toBe('wife'));
  expect(camera.centerAt).not.toHaveBeenCalled();
});

it('pans (without an explicit zoom change) to reveal a selected subject that is far off-screen', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&expand=person:${root}:FATHER&expand=person:father:FATHER&selected=${root}`);
  mount();
  await waitFor(() => expect(graph()).toContain('grandfather'));
  await settleInitialFraming();
  camera.centerAt.mockClear();
  camera.zoom.mockClear();

  fireEvent.click(screen.getByRole('button', { name: 'grandfather' }));
  await waitFor(() => expect(camera.centerAt).toHaveBeenCalled());
  // zoom() is only ever read (no args) to compute the reveal pan here, never
  // set (2 args) -- Q2's "retaining zoom".
  expect(camera.zoom.mock.calls.every(call => call.length === 0)).toBe(true);
});

it('Fit graph frames every currently visible subject, unranked/graph-only ones included', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&selected=${root}`);
  mount();
  await screen.findByRole('button', { name: 'Fit graph' });
  camera.zoomToFit.mockClear();

  fireEvent.click(screen.getByRole('button', { name: 'Fit graph' }));

  expect(camera.zoomToFit).toHaveBeenCalledTimes(1);
  const [, , nodeFilter] = camera.zoomToFit.mock.calls[0];
  expect(nodeFilter).toBeUndefined();
});

it('Show additions frames the newly-added subjects plus what they connect to, then clears', async () => {
  nav.setUrl(`/graphs?subject=person:${root}&selected=${root}`);
  mount();
  fireEvent.click(await screen.findByRole('button', { name: 'Wife (1)' }));
  const showButton = await screen.findByRole('button', { name: /Show \d+ new subjects?/ });
  camera.zoomToFit.mockClear();

  fireEvent.click(showButton);

  expect(camera.zoomToFit).toHaveBeenCalledTimes(1);
  const [, , nodeFilter] = camera.zoomToFit.mock.calls[0];
  expect(nodeFilter({ id: 'person:wife' })).toBe(true);
  expect(nodeFilter({ id: `person:${root}` })).toBe(true);
  expect(nodeFilter({ id: 'person:father' })).toBe(false);
  expect(screen.queryByRole('button', { name: /Show \d+ new subjects?/ })).toBeNull();
});
