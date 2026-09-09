// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import SourceAccountReader from './SourceAccountReader';

// A minimal stand-in for next/navigation's router/searchParams. useSearchParams
// must return a stable reference per unique search string or effects keyed on it
// misbehave — see src/components/graph/GraphSearch.test.tsx.
const nav = vi.hoisted(() => {
  let url = '/people/abu-ubaydah-ibn-al-jarrah';
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
    usePathname: () => '/people/abu-ubaydah-ibn-al-jarrah',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(
        nav.subscribe,
        () => nav.getUrl().split('?')[1] ?? '',
        () => nav.getUrl().split('?')[1] ?? '',
      );
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

const { fetchJson } = vi.hoisted(() => ({ fetchJson: vi.fn() }));
vi.mock('@/lib/swr', () => ({ fetcher: (url: string) => fetchJson(url) }));

function account(overrides: Record<string, unknown> = {}) {
  return {
    id: 'account-siyar',
    subjectKind: 'PERSON',
    subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
    entryIdentifier: '1',
    titleArabic: null,
    volume: '1',
    extractionUrl: 'https://shamela.ws/book/10906/1431',
    pageCount: 19,
    source: { title: 'سير أعلام النبلاء', edition: 'الطبعة الثالثة' },
    ...overrides,
  };
}

function page(overrides: Record<string, unknown> = {}) {
  return {
    sequence: 1,
    printedPage: '5',
    bodyMarkdown: 'الفقرة الأولى\n\nالفقرة الثانية',
    notesMarkdown: null,
    extractionUrl: 'https://shamela.ws/book/10906/1431',
    ...overrides,
  };
}

function respondWith(body: unknown) {
  fetchJson.mockImplementation(async () => body);
}

// Each render gets its own SWR cache so one test's response cannot satisfy the
// next test's identical request key.
function renderReader(slug = 'abu-ubaydah-ibn-al-jarrah') {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <SourceAccountReader slug={slug} />
    </SWRConfig>,
  );
}

describe('SourceAccountReader', () => {
  beforeEach(() => {
    nav.reset('/people/abu-ubaydah-ibn-al-jarrah');
    fetchJson.mockReset();
    respondWith({ accounts: [account()], account: account(), page: page() });
  });

  afterEach(cleanup);

  it('renders the stored page as separate paragraphs', async () => {
    renderReader();

    expect(await screen.findByText('الفقرة الأولى')).toBeTruthy();
    expect(screen.getByText('الفقرة الثانية')).toBeTruthy();
  });

  it('keeps the source text right-to-left while the interface is English', async () => {
    const { container } = renderReader();

    await screen.findByText('الفقرة الأولى');

    expect(container.querySelector('article')?.getAttribute('dir')).toBe('rtl');
    expect(screen.getByText('Previous')).toBeTruthy();
  });

  it('asks for the page named in the URL', async () => {
    nav.setUrl('/people/abu-ubaydah-ibn-al-jarrah?page=7');
    respondWith({ accounts: [account()], account: account(), page: page({ sequence: 7, printedPage: '11' }) });

    renderReader();

    await waitFor(() => expect(fetchJson).toHaveBeenCalledWith(expect.stringContaining('page=7')));
  });

  it('puts the page it moves to in the URL', async () => {
    renderReader();
    fireEvent.click(await screen.findByText('Next'));

    await waitFor(() => expect(nav.replaceCalls.at(-1)).toContain('page=2'));
  });

  it('cannot page back from the first page or on past the last', async () => {
    renderReader();

    const previous = (await screen.findByText('Previous')).closest('button');
    expect(previous?.hasAttribute('disabled')).toBe(true);

    cleanup();
    respondWith({ accounts: [account()], account: account(), page: page({ sequence: 19 }) });
    renderReader();

    const next = (await screen.findByText('Next')).closest('button');
    expect(next?.hasAttribute('disabled')).toBe(true);
  });

  it('offers no book selector when only one account exists', async () => {
    const { container } = renderReader();

    await screen.findByText('الفقرة الأولى');

    // Only the printed-page jump remains.
    expect(container.querySelectorAll('select')).toHaveLength(1);
  });

  it('switches book and returns to that account\'s first page', async () => {
    const hilya = account({ id: 'account-hilya', pageCount: 3, source: { title: 'حلية الأولياء', edition: null } });
    respondWith({ accounts: [account(), hilya], account: account(), page: page() });

    const { container } = renderReader();

    await screen.findByText('الفقرة الأولى');
    const bookSelect = container.querySelectorAll('select')[0];
    fireEvent.change(bookSelect, { target: { value: 'account-hilya' } });

    await waitFor(() => {
      expect(nav.replaceCalls.at(-1)).toContain('book=account-hilya');
      expect(nav.replaceCalls.at(-1)).toContain('page=1');
    });
  });

  it('shows the edition notes apart from the work text', async () => {
    respondWith({
      accounts: [account()],
      account: account(),
      page: page({ notesMarkdown: '(١) انظر الطبقات' }),
    });

    renderReader();

    expect(await screen.findByText("The editor's notes")).toBeTruthy();
    expect(screen.getByText('(١) انظر الطبقات')).toBeTruthy();
  });

  it('renders nothing when the person has no source account', async () => {
    respondWith({ accounts: [], account: null, page: null });

    const { container } = renderReader('someone');

    await waitFor(() => expect(container.textContent).not.toContain('Loading'));
    expect(container.querySelector('article')).toBeNull();
  });

  it('reports a failed fetch instead of looking like absent evidence', async () => {
    fetchJson.mockRejectedValue(new Error('boom'));

    renderReader();

    expect(await screen.findByText('The source text could not be loaded')).toBeTruthy();
  });

  it('does not execute markup that appears in the source text', async () => {
    respondWith({
      accounts: [account()],
      account: account(),
      page: page({ bodyMarkdown: '<img src=x onerror="window.__pwned = true">' }),
    });

    const { container } = renderReader();

    await screen.findByText('<img src=x onerror="window.__pwned = true">');
    expect(container.querySelector('img')).toBeNull();
  });
});
