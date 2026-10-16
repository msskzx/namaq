// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NasabView from './NasabView';

const nav = vi.hoisted(() => {
  let url = '/nasab';
  const listeners = new Set<() => void>();
  return {
    getUrl: () => url,
    setUrl: (next: string) => {
      url = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ push: nav.setUrl, replace: nav.setUrl }),
    usePathname: () => '/nasab',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(nav.subscribe, () => nav.getUrl().split('?')[1] ?? '', () => nav.getUrl().split('?')[1] ?? '');
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('@/components/graph/GraphSearch', () => ({ default: () => null }));

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (url: string) => ({
    ok: true,
    json: async () => ({
      people: [
        { slug: 'ali', name: 'علي بن أبي طالب', fathers: [] },
        ...(url.includes('descendants=1') ? [{ slug: 'hasan', name: 'الحسن بن علي', fathers: ['ali'] }] : []),
      ],
      subjects: ['ali'],
    }),
  }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const toggle = () => screen.getByRole('switch', { name: 'With descendants' }) as HTMLInputElement;

describe('NasabView descendants toggle', () => {
  it('is off by default and asks for fathers only', async () => {
    nav.setUrl('/nasab?subject=person:ali');
    render(<NasabView />);
    expect(toggle().checked).toBe(false);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/nasab?person=ali'));
    expect(await screen.findByRole('img', { name: 'Nasab tree' })).toBeTruthy();
    expect(screen.queryByText('الحسن')).toBeNull();
  });

  it('turning it on records it in the URL, keeps the subjects, and asks for descendants', async () => {
    nav.setUrl('/nasab?subject=person:ali');
    render(<NasabView />);
    fireEvent.click(toggle());
    expect(nav.getUrl()).toBe('/nasab?subject=person%3Aali&descendants=1');
    expect(toggle().checked).toBe(true);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/nasab?person=ali&descendants=1'));
    expect(await screen.findByText('الحسن')).toBeTruthy();
  });

  it('turning it off drops the flag from the URL', () => {
    nav.setUrl('/nasab?subject=person:ali&descendants=1');
    render(<NasabView />);
    expect(toggle().checked).toBe(true);
    fireEvent.click(toggle());
    expect(nav.getUrl()).toBe('/nasab?subject=person%3Aali');
  });
});
