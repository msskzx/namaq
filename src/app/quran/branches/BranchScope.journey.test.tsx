// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';

const searches = new Map<string, URLSearchParams>();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/quran/branches',
  useSearchParams: () => {
    const search = window.location.search;
    if (!searches.has(search)) searches.set(search, new URLSearchParams(search));
    return searches.get(search)!;
  },
  redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); },
}));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: vi.fn(async () => [{ number: 56, name: 'الواقعة' }, { number: 69, name: 'الحاقة' }]) } } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));
afterEach(cleanup);

async function page(params: Record<string, string>) {
  window.history.replaceState(null, '', `/quran/branches?${new URLSearchParams(params)}`);
  return QuranBranchesPage({ searchParams: Promise.resolve(params) });
}

describe('phrase position browsing', () => {
  it('defaults to all, then retains search and juz when following the inside scope link', async () => {
    const { rerender } = render(await page({ q: 'وقعت الواقعة', juzFrom: '1', juzTo: '30' }));
    const scope = screen.getByRole('group', { name: 'موضع العبارة' });
    expect(within(scope).getByRole('link', { name: 'الكل', current: 'page' })).toBeTruthy();
    const href = new URL(within(scope).getByRole('link', { name: 'داخل الآية' }).getAttribute('href')!, 'http://localhost');
    expect(href.searchParams.get('scope')).toBe('inside');
    expect(href.searchParams.get('q')).toBe('وقعت الواقعة');
    expect(href.searchParams.get('juzFrom')).toBe('1');
    expect(href.searchParams.has('p')).toBe(false);
    rerender(await page(Object.fromEntries(href.searchParams)));
    expect(within(screen.getByRole('group', { name: 'موضع العبارة' })).getByRole('link', { name: 'داخل الآية', current: 'page' })).toBeTruthy();
    const list = screen.getByRole('list', { name: 'المتشابهات' });
    expect(within(list).getAllByText('داخل الآية').length).toBeGreaterThan(0);
    expect(within(list).queryByText('أول الآية')).toBeNull();
    expect(list.textContent).toContain('وَقَعَتِ');
  });

  it('clears a focused phrase when changing scope and preserves the selected juz range', async () => {
    render(await page({ o: 'ان المتقين', juzFrom: '25', juzTo: '30', scope: 'opening', c: '1' }));
    const scope = screen.getByRole('group', { name: 'موضع العبارة' });
    const href = new URL(within(scope).getByRole('link', { name: 'داخل الآية' }).getAttribute('href')!, 'http://localhost');
    expect(href.searchParams.get('scope')).toBe('inside');
    expect(href.searchParams.get('juzFrom')).toBe('25');
    expect(href.searchParams.has('o')).toBe(false);
    expect(href.searchParams.has('kind')).toBe(false);
  });

  it('does not show a legacy opening under the inside-only scope', async () => {
    render(await page({ o: 'ان المتقين', scope: 'inside' }));
    expect(screen.getByRole('status').textContent).toContain('لا تطابق العبارة المطلوبة');
    expect(screen.queryByRole('region', { name: 'شجرة الفواتح' })).toBeNull();
  });
});
