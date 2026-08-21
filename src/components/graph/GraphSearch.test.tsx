// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import GraphSearch from './GraphSearch';

// A minimal, *reactive* stand-in for next/navigation's router/searchParams.
// It must be reactive (subscribers re-render on change) for this test to be
// meaningful: the bug this file guards against is a feedback loop between
// GraphSearch's "URL -> state" and "state -> URL" effects, which only shows
// up when navigating actually changes what useSearchParams() returns.
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
  // Must reuse the *same* React module instance the component tree renders
  // with (via importActual, not require) — a second React copy breaks
  // useSyncExternalStore's subscription and produces bogus re-render loops
  // that look like, but are not, the bug under test.
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
      // Real Next.js hands back a stable object per unique search string.
      // A fresh URLSearchParams on every call would break dependency-array
      // comparisons in the component under test regardless of its own logic.
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

describe('GraphSearch URL sync', () => {
  it('settles on ?person=<slug> after picking a suggestion, and does not bounce back to no param', async () => {
    render(<GraphSearch />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Muhammad' } });

    const option = await screen.findByText('Prophet Muhammad');
    fireEvent.mouseDown(option);

    await waitFor(() => expect(nav.getUrl()).toContain('person=prophet-muhammad'));

    // Give any further queued effects a chance to run before asserting
    // the URL has actually settled rather than just having transiently
    // passed through the right value.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(nav.getUrl()).toContain('person=prophet-muhammad');

    const firstPersonSet = nav.replaceCalls.findIndex((entry) => entry.includes('person=prophet-muhammad'));
    const afterSelection = nav.replaceCalls.slice(firstPersonSet);
    expect(afterSelection.every((entry) => entry.includes('person=prophet-muhammad'))).toBe(true);
  });

  it('loads an existing ?person=<slug> from the URL on mount without removing it', async () => {
    nav.reset('/graphs?person=prophet-muhammad');

    render(<GraphSearch />);

    await screen.findByText('Prophet Muhammad');

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(nav.getUrl()).toContain('person=prophet-muhammad');
  });

  it('keeps ?person=<slug> (and unrelated params) on mount under Strict Mode double-invoked effects', async () => {
    // Strict Mode (which Next.js dev enables by default) double-invokes
    // effects on mount: a phantom instance kicks off its own person-lookup
    // fetch before being torn down. isHydratingRef guards against that
    // phantom fetch's resolution clobbering the real instance's state, and
    // against the write-back effect stripping `person` off the URL while a
    // lookup for it is still in flight. This test's synchronous mock nav
    // doesn't reproduce the exact async interleaving seen against the real
    // Next.js router (that was confirmed manually in-browser), but it does
    // guard the Strict Mode double-invoke path this fix targets.
    nav.reset('/graphs?relation=DAUGHTER&person=prophet-muhammad');

    render(
      <React.StrictMode>
        <GraphSearch />
      </React.StrictMode>
    );

    await screen.findByText('Prophet Muhammad');

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(nav.getUrl()).toContain('person=prophet-muhammad');
    expect(nav.getUrl()).toContain('relation=DAUGHTER');
  });
});
