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
  const replaceOptions: unknown[] = [];
  return {
    replaceOptions,
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
      replaceOptions.length = 0;
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({
      replace: (next: string, options?: unknown) => {
        nav.replaceCalls.push(next);
        nav.replaceOptions.push(options);
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
    source: { title: 'سير أعلام النبلاء', edition: 'الطبعة الثالثة', language: 'ar' },
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
      <SourceAccountReader basePath={`/api/people/${slug}`} />
    </SWRConfig>,
  );
}

describe('SourceAccountReader', () => {
  beforeEach(() => {
    nav.reset('/people/abu-ubaydah-ibn-al-jarrah');
    fetchJson.mockReset();
    localStorage.clear();
    respondWith({ accounts: [account()], account: account(), page: page() });
  });

  afterEach(cleanup);

  it('renders the stored page as separate paragraphs', async () => {
    renderReader();

    expect(await screen.findByText('الفقرة الأولى')).toBeTruthy();
    expect(screen.getByText('الفقرة الثانية')).toBeTruthy();
  });

  it('renders bracketed source headings without their brackets', async () => {
    respondWith({
      accounts: [account()], account: account(),
      page: page({ bodyMarkdown: '[إسلام ضماد:]\n\nنص الخبر.' }),
    });

    renderReader();

    expect(await screen.findByRole('heading', { name: 'إسلام ضماد' })).toBeTruthy();
    expect(screen.queryByText('[إسلام ضماد:]')).toBeNull();
    expect(screen.getByRole('heading', { name: 'إسلام ضماد' }).className).toContain('text-center');
  });

  it('shows the entry title once and leaves only the page number after the text', async () => {
    const entry = account({ titleArabic: 'السائب بن عثمان' });
    respondWith({
      accounts: [entry], account: entry,
      page: page({ bodyMarkdown: '[السائب بن عثمان]' }),
    });

    renderReader();

    expect(await screen.findByRole('heading', { name: 'السائب بن عثمان' })).toBeTruthy();
    expect(screen.getAllByText('السائب بن عثمان')).toHaveLength(1);
    expect(screen.getByText('p. 5').parentElement?.className).toContain('overflow-y-auto');
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

  it('shows the book page number in the page selector', async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const selected = account({ pageCount: 2 });
    respondWith({
      accounts: [selected], account: selected,
      page: page({ sequence: 1, printedPage: '158' }),
      pageNumbers: [
        { sequence: 1, printedPage: '158', volume: { number: 1 } },
        { sequence: 2, printedPage: '158', volume: { number: 2 } },
      ],
    });

    const { container } = renderReader();
    await screen.findByText('الفقرة الأولى');

    const select = container.querySelector('select[aria-label="Go to page"]') as HTMLSelectElement;
    expect(select.selectedOptions[0].textContent).toBe('158 · vol. 1');
    expect(select.options[1].textContent).toBe('158 · vol. 2');
    fireEvent.change(select, { target: { value: '2' } });
    expect(nav.replaceCalls.at(-1)).toContain('page=2');
  });

  it('brings the reader back into view when the page changes', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    renderReader();
    fireEvent.click(await screen.findByText('Next'));

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
  });

  it('leaves the browser to keep its own scroll position', async () => {
    renderReader();
    fireEvent.click(await screen.findByText('Next'));

    await waitFor(() => expect(nav.replaceOptions.at(-1)).toEqual({ scroll: false }));
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
    const hilya = account({ id: 'account-hilya', pageCount: 3, source: { title: 'حلية الأولياء', edition: null, language: 'ar' } });
    respondWith({ accounts: [account(), hilya], account: account(), page: page() });

    renderReader();

    await screen.findByText('الفقرة الأولى');
    fireEvent.click(screen.getByRole('button', { name: 'Read fullscreen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open index' }));
    const bookSelect = await screen.findByLabelText('Book');
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
    const notes = screen.getByText('(١) انظر الطبقات').closest('aside');
    expect(notes?.parentElement?.lastElementChild?.textContent).toBe('p. 5');
  });

  it("shows the section the reader is on, not a generic placeholder", async () => {
    fetchJson.mockImplementation(async (url: string) => {
      if (url.includes('/sections')) {
        return {
          sections: [
            { sequence: 1, printedPage: '5', heading: 'الباب الأول' },
            { sequence: 3, printedPage: '9', heading: 'الباب الثاني' },
          ],
        };
      }
      return { accounts: [account()], account: account(), page: page({ sequence: 4, printedPage: '10' }) };
    });

    renderReader();

    await screen.findByText('الفقرة الأولى');
    fireEvent.click(screen.getByRole('button', { name: 'Read fullscreen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open index' }));
    const indexSelect = await screen.findByLabelText('Sections') as HTMLSelectElement;
    await waitFor(() => expect(indexSelect.options.length).toBe(2));

    // Page 4 is past both headings, so the second one is the one open.
    expect(indexSelect.value).toBe('1');
    expect(screen.getByText('الباب الثاني').closest('option')?.selected).toBe(true);
  });

  it('keeps fullscreen in the URL and turns an Arabic page with the left arrow', async () => {
    renderReader();
    fireEvent.click(await screen.findByRole('button', { name: 'Read fullscreen' }));

    await waitFor(() => expect(nav.replaceCalls.at(-1)).toContain('fullscreen=1'));
    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    await waitFor(() => expect(nav.replaceCalls.at(-1)).toContain('page=2'));
  });

  it('uses the source language for left-to-right pages and keyboard turns', async () => {
    const englishAccount = account({ source: { title: 'A source', edition: null, language: 'en' } });
    respondWith({ accounts: [englishAccount], account: englishAccount, page: page() });
    const { container } = renderReader();

    await screen.findByText('الفقرة الأولى');
    expect(container.querySelector('article')?.getAttribute('dir')).toBe('ltr');
    expect(container.querySelector('article')?.getAttribute('lang')).toBe('en');
    fireEvent.click(await screen.findByRole('button', { name: 'Read fullscreen' }));
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    await waitFor(() => expect(nav.replaceCalls.at(-1)).toContain('page=2'));
  });

  it('saves reader font, size, and background on this device', async () => {
    renderReader();
    fireEvent.click(await screen.findByRole('button', { name: 'Read fullscreen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open reading settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sans' }));
    const size = screen.getByRole('slider', { name: 'Text size' });
    expect(size.getAttribute('min')).toBe('0');
    expect(size.getAttribute('max')).toBe('3');
    fireEvent.change(size, { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(JSON.parse(localStorage.getItem('namaq-reader-settings') ?? '{}')).toEqual({
      font: 'sans', size: 'xl', background: 'dark',
    });
    expect((screen.getByText('الفقرة الأولى').closest('div[style]') as HTMLDivElement)?.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('does not show the source host link below the page', async () => {
    renderReader();

    await screen.findByText('الفقرة الأولى');
    expect(screen.queryByText('This page on the host site')).toBeNull();
    expect(screen.queryByText('الصفحة على الموقع الناشر')).toBeNull();
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
