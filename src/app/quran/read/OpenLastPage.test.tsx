// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { cleanup, render as rtlRender } from '@testing-library/react';
import { LanguageProvider } from '@/components/language/LanguageContext';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, push: vi.fn(), prefetch: vi.fn() }), useSearchParams: () => new URLSearchParams() }));

import OpenLastPage from './OpenLastPage';
import ReaderView from './ReaderView';

const render = (ui: ReactElement) => rtlRender(ui, { wrapper: LanguageProvider });

afterEach(() => { cleanup(); replace.mockClear(); localStorage.clear(); });

describe('/quran/read', () => {
  it('opens straight on page 1 the first time', () => {
    render(<OpenLastPage />);
    expect(replace).toHaveBeenCalledWith('/quran/read/1');
  });

  it('opens on the page last read, and ignores a damaged value', () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    const { unmount } = render(<ReaderView page={293} pages={[{ page: 293, data: { juz: 15, items: [{ line: ['مِن', 5] }] }, top: 18 }]} names={{}} />);
    unmount();
    render(<OpenLastPage />);
    expect(replace).toHaveBeenLastCalledWith('/quran/read/293');
    cleanup();
    localStorage.setItem('quran-reader-page', '999');
    render(<OpenLastPage />);
    expect(replace).toHaveBeenLastCalledWith('/quran/read/1');
    vi.unstubAllGlobals();
  });
});
