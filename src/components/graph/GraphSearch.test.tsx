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

function graphSuggestion(kind: 'person' | 'title' | 'battle' | 'event', slug: string, name: string, hasProfile = true) {
  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    name,
    fullName: null,
    nameTransliterated: null,
    hasProfile,
    match: 'exact' as const,
  };
}

const suggestion = graphSuggestion('person', 'prophet-muhammad', 'Prophet Muhammad');
const badr = graphSuggestion('battle', 'badr', 'Battle of Badr');
const companionTitle = graphSuggestion('title', 'companion', 'Companion');

// /api/graph/suggest is now the only endpoint the component calls, so the
// stub answers from one pool covering every kind.
const POOL = [suggestion, badr, companionTitle];

beforeEach(() => {
  nav.reset('/graphs');
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const href = typeof input === 'string' ? input : input.toString();
    const url = new URL(href, 'http://localhost');
    const query = (url.searchParams.get('q') ?? '').toLowerCase();
    const data = url.pathname === '/api/graph/suggest' && query
      ? POOL.filter((entry) => entry.name.toLowerCase().includes(query) || entry.slug === query)
      : [];
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

describe('GraphSearch across kinds', () => {
  async function pick(typed: string, label: string) {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: typed } });
    const option = await screen.findByText(label);
    fireEvent.mouseDown(option);
  }

  it('offers a battle that is not in the current exploration at all', async () => {
    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });

    expect(await screen.findByText('Battle of Badr')).toBeTruthy();
  });

  // Replaces the old behavior, where a non-person node could only ever be
  // selected among nodes already on screen and so set `selected` alone.
  it('makes a non-person subject an exploration root, not just a selection', async () => {
    render(<GraphSearch />);

    await pick('badr', 'Battle of Badr');

    await waitFor(() => expect(nav.getUrl()).toContain('subject=battle%3Abadr'));
    expect(nav.getUrl()).toContain('selected=badr');
  });

  it('switches on a kind that was not active, keeping the previously active ones', async () => {
    render(<GraphSearch />);

    await pick('badr', 'Battle of Badr');

    await waitFor(() => expect(nav.getUrl()).toContain('kind=battle'));
    expect(nav.getUrl()).toContain('kind=person');
    expect(nav.getUrl()).toContain('kind=title');
  });

  it('leaves the kind params alone when the picked kind is already active', async () => {
    nav.reset('/graphs?kind=person&kind=battle');

    render(<GraphSearch />);
    await pick('badr', 'Battle of Badr');

    await waitFor(() => expect(nav.getUrl()).toContain('subject=battle%3Abadr'));
    expect(nav.getUrl().match(/kind=/g)).toHaveLength(2);
    expect(nav.getUrl()).not.toContain('kind=title');
  });

  it('reveals the Companion title, which has its own visibility flag rather than a kind', async () => {
    render(<GraphSearch />);

    await pick('companion', 'Companion');

    await waitFor(() => expect(nav.getUrl()).toContain('showCompanionTitle=1'));
    expect(nav.getUrl()).toContain('subject=title%3Acompanion');
    expect(nav.getUrl()).toContain('selected=companion');
  });

  it('does not set the Companion flag for any other title', async () => {
    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'badr' } });
    const option = await screen.findByText('Battle of Badr');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('subject=battle%3Abadr'));
    expect(nav.getUrl()).not.toContain('showCompanionTitle');
  });

  it('omits the Profile button for a graph-only person', async () => {
    const graphOnly = graphSuggestion('person', 'malik-ibn-thalabah', 'Malik ibn Thalabah', false);
    POOL.push(graphOnly);
    try {
      render(<GraphSearch />);

      fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'malik' } });
      await screen.findByText('Malik ibn Thalabah');

      expect(screen.queryByText('Profile')).toBeNull();
    } finally {
      POOL.pop();
    }
  });
});
