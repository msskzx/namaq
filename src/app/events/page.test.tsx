// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import EventsPage from './page';

const nav = vi.hoisted(() => {
  let url = '/events';
  const listeners = new Set<() => void>();
  const replaceCalls: string[] = [];
  return {
    replaceCalls,
    getUrl: () => url,
    setUrl: (next: string) => { url = next; listeners.forEach((listener) => listener()); },
    subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); },
    reset: (initial: string) => { url = initial; replaceCalls.length = 0; },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ replace: (next: string) => { nav.replaceCalls.push(next); nav.setUrl(next); } }),
    usePathname: () => '/events',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(nav.subscribe, () => nav.getUrl().split('?')[1] ?? '', () => nav.getUrl().split('?')[1] ?? '');
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

const { fetchJson } = vi.hoisted(() => ({ fetchJson: vi.fn() }));
vi.mock('@/lib/swr', () => ({ fetcher: (url: string) => fetchJson(url) }));

const base = { hijriPeriod: null, location: null, locationTransliterated: null };
const items = [
  { ...base, id: '1', slug: 'hijra', kind: 'event', name: 'الهجرة', nameTransliterated: 'Hijra', hijriYear: 1 },
  { ...base, id: '2', slug: 'badr', kind: 'ghazwah', name: 'غَزْوَةُ بَدْرٍ', nameTransliterated: 'Badr', hijriYear: 2 },
  { ...base, id: '3', slug: 'qatan', kind: 'sariyyah', name: 'سرية قطن', nameTransliterated: 'Qatan', hijriYear: 4 },
];

function renderPage() {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <EventsPage />
    </SWRConfig>,
  );
}

describe('the events page', () => {
  beforeEach(() => {
    nav.reset('/events');
    fetchJson.mockReset();
    fetchJson.mockResolvedValue(items);
  });
  afterEach(cleanup);

  it('lists events and battles together and links each to its own detail route', async () => {
    renderPage();

    const links = (await screen.findAllByRole('link')).map((link) => link.getAttribute('href'));
    expect(links).toEqual(['/events/hijra', '/battles/badr', '/battles/qatan']);
  });

  it('filters by the selected kinds and writes them to the URL', async () => {
    renderPage();
    await screen.findByText('Hijra');

    fireEvent.click(screen.getByRole('button', { name: 'Ghazwah' }));
    await waitFor(() => expect(screen.queryByText('Hijra')).toBeNull());
    expect(screen.getByText('Badr')).toBeTruthy();
    expect(nav.replaceCalls.at(-1)).toBe('/events?type=ghazwah');

    fireEvent.click(screen.getByRole('button', { name: 'Event' }));
    expect(await screen.findByText('Hijra')).toBeTruthy();
    expect(nav.replaceCalls.at(-1)).toBe('/events?type=ghazwah%2Cevent');
  });

  it('restores kind and search from the URL and searches ignoring diacritics', async () => {
    nav.setUrl('/events?type=ghazwah,sariyyah&q=%D8%A8%D8%AF%D8%B1');
    renderPage();

    expect(await screen.findByText('Badr')).toBeTruthy();
    expect(screen.queryByText('Qatan')).toBeNull();
    expect((screen.getByPlaceholderText('Search by name or place') as HTMLInputElement).value).toBe('بدر');
  });

  it('says so when nothing matches', async () => {
    renderPage();
    await screen.findByText('Hijra');

    fireEvent.change(screen.getByPlaceholderText('Search by name or place'), { target: { value: 'zzz' } });

    expect(await screen.findByText('Nothing matches.')).toBeTruthy();
  });
});
