// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import GraphSearch from './GraphSearch';

// A minimal stand-in for next/navigation's router/searchParams.
const nav = vi.hoisted(() => {
  let url = '/graphs';
  const listeners = new Set<() => void>();
  const replaceCalls: string[] = [];
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
    replaceCalls,
    reset: (initial: string) => {
      url = initial;
      replaceCalls.length = 0;
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({
      replace: (next: string) => {
        nav.replaceCalls.push(next);
        nav.setUrl(next);
      },
      push: (next: string) => {
        nav.replaceCalls.push(next);
        nav.setUrl(next);
      },
    }),
    usePathname: () => '/graphs',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(
        nav.subscribe,
        () => nav.getUrl().split('?')[1] ?? '',
        () => nav.getUrl().split('?')[1] ?? ''
      );
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

const suggestion = {
  id: '1',
  slug: 'prophet-muhammad',
  name: 'Prophet Muhammad',
  fullName: null,
  nameTransliterated: null,
  match: 'exact' as const,
};

beforeEach(() => {
  nav.reset('/graphs');
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const href = typeof input === 'string' ? input : input.toString();
    const query = new URL(href, 'http://localhost').searchParams.get('q') ?? '';
    const data = query.toLowerCase().includes('muhammad') || query === suggestion.slug ? [suggestion] : [];
    return { ok: true, json: async () => ({ data }) } as Response;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('GraphSearch', () => {
  it('has no mode dropdown', () => {
    render(<GraphSearch />);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('adds the picked person as an additional `subject` root and selects them', async () => {
    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Muhammad' } });

    const option = await screen.findByText('Prophet Muhammad');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('subject=person%3Aprophet-muhammad'));
    expect(nav.getUrl()).toContain('selected=prophet-muhammad');
  });

  it('does not duplicate an already-present root when picked again', async () => {
    nav.reset('/graphs?subject=person%3Aprophet-muhammad');

    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Muhammad' } });
    const option = await screen.findByText('Prophet Muhammad');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('selected=prophet-muhammad'));
    const subjectCount = (nav.getUrl().match(/subject=/g) ?? []).length;
    expect(subjectCount).toBe(1);
  });

  it('preserves existing exploration state (expand/filter params) when adding a root', async () => {
    nav.reset('/graphs?expand=person%3Aprophet-muhammad%3AWIFE');

    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Muhammad' } });
    const option = await screen.findByText('Prophet Muhammad');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('subject=person%3Aprophet-muhammad'));
    expect(nav.getUrl()).toContain('expand=person%3Aprophet-muhammad%3AWIFE');
  });
});

describe('GraphSearch node search', () => {
  const battleNode = { id: '1', label: 'Battle of Badr', slug: 'battle-of-badr', group: 1, type: 'battle' };

  it('offers a non-person node from `nodes` alongside Postgres person matches', async () => {
    render(<GraphSearch nodes={[battleNode]} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });

    expect(await screen.findByText('Battle of Badr')).toBeTruthy();
  });

  it('selecting a non-person node sets ?selected=<slug>, not ?subject=', async () => {
    render(<GraphSearch nodes={[battleNode]} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });
    const option = await screen.findByText('Battle of Badr');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('selected=battle-of-badr'));
    expect(nav.getUrl()).not.toContain('subject=');
  });
});
