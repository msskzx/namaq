// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { normalizeWord } from '@/lib/quran/normalize';
import { branchesHref } from '@/lib/quran/branches';
import { prisma } from '@/lib/prisma';
import QuranBranchesPage from './page';

const params = new URLSearchParams();
const router = { push: vi.fn(), replace: vi.fn() };
vi.mock('next/navigation', () => ({ useRouter: () => router, usePathname: () => '/quran/branches', useSearchParams: () => params, redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); } }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: vi.fn(async () => []) } } }));
const { loadReaderAyat } = vi.hoisted(() => ({ loadReaderAyat: vi.fn(async () => [{ key: '15:44', page: 265, words: ['لَهَا', 'سَبْعَةُ', 'أَبْوَٰبٍ'] }, { key: '15:45', page: 265, words: ['إِنَّ', 'ٱلْمُتَّقِينَ'] }, { key: '15:46', page: 265, words: ['ٱدْخُلُوهَا', 'بِسَلَـٰمٍ'] }, { key: '15:47', page: 265, words: ['وَنَزَعْنَا', 'مَا'] }]) }));
vi.mock('@/lib/quran/ayahContext', async importOriginal => ({ ...await importOriginal<typeof import('@/lib/quran/ayahContext')>(), loadReaderAyat }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(cleanup);
const open = (params: Record<string, string>) => {
  window.history.replaceState(null, '', `/quran/branches?${new URLSearchParams(params)}`);
  return QuranBranchesPage({ searchParams: Promise.resolve(params) });
};

describe('Quran branches range selection', () => {
  it('opens a named family from navigation and keeps its name outside Quran tree nodes', async () => {
    render(await open({ o: 'family:musabbihat' }));
    const navigation = screen.getByRole('navigation', { name: 'مجموعات فواتح السور' });
    expect(navigation.textContent).toContain('الحواميم');
    expect(navigation.textContent).toContain('المسبحات');
    expect(screen.getByRole('link', { name: 'المسبحات' }).getAttribute('href')).toBe(branchesHref('family:musabbihat'));
    const tree = screen.getByRole('region', { name: 'شجرة الفواتح' });
    expect(tree.textContent).not.toContain('المسبحات');
    expect(tree.textContent).toContain('سُبْحَـٰنَ');
    expect(normalizeWord(tree.textContent ?? '')).toContain('يسبح');
  });

  it('returns the complete named family when its name is submitted as a search', async () => {
    render(await open({ q: 'الحواميم' }));
    expect(screen.getByRole('link', { name: /الشجرة كاملة: الحواميم/ }).getAttribute('href')).toBe(branchesHref('family:hawamim'));
    expect(screen.getByRole('region', { name: 'شجرة الفواتح' }).textContent).toContain('عٓسٓقٓ');
  });

  it('sends the surrounding ayat with a tree that opens with the switch on, and loads nothing for it otherwise', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const { container, unmount } = render(await open({ o: 'ان المتقين', c: '1' }));
    expect(screen.getByText('لَهَا سَبْعَةُ أَبْوَٰبٍ').closest('[data-ctx]')?.getAttribute('data-ctx')).toBe('15:45');
    // 15:45 and 51:15 are the same ayah, so the tree already runs 15:45 into 15:46: the box after it is 15:47.
    expect(screen.getByText('وَنَزَعْنَا مَا').closest('[data-ctx]')?.getAttribute('data-ctx')).toBe('15:45');
    expect(fetch).not.toHaveBeenCalled();
    unmount();
    loadReaderAyat.mockClear();
    render(await open({ o: 'ان المتقين' }));
    expect(loadReaderAyat).not.toHaveBeenCalled();
    expect(container.querySelector('[data-ctx]')).toBeNull();
    vi.unstubAllGlobals();
  });

  it('draws the switch from the address again when the page moves to another phrase', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: {}, after: {} }) }));
    const { rerender } = render(await open({ o: 'ان المتقين' }));
    fireEvent.click(screen.getByRole('switch'));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    rerender(await open({ o: 'قال رب' }));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(false);
    rerender(await open({ o: 'ان المتقين', c: '1' }));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('switch'));
    rerender(await open({ o: 'ان المتقين', c: '1', juzFrom: '1', juzTo: '29' }));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    vi.unstubAllGlobals();
  });

  it('shows no matches instead of another opening for an explicit unavailable phrase', async () => {
    render(await open({ o: 'ان المتقين', juzFrom: '30', juzTo: '30' }));
    expect(screen.getByRole('status').textContent).toContain('لا تطابق العبارة المطلوبة');
    expect(screen.queryByRole('region', { name: 'شجرة الفواتح' })).toBeNull();
    expect(screen.queryByRole('navigation', { name: 'عبارات أعم' })).toBeNull();
  });

  it('preserves an unavailable phrase in a legacy range request rather than choosing a fallback', async () => {
    await expect(open({ o: 'ان المتقين', juzFrom: '30', juzTo: '30', apply: 'juz', w: 'إِنَّ' })).rejects.toThrow(`REDIRECT ${branchesHref('ان المتقين', { from: 30, to: 30 })}`);
  });

  it('canonicalizes legacy list links and drops their unused phrase', async () => {
    await expect(open({ o: 'ان المتقين', juzFrom: '25', juzTo: '30', v: 'list', g: 'opening', p: '2' })).rejects.toThrow(`REDIRECT ${branchesHref('', { from: 25, to: 30 }, { grouped: true, page: 2 })}`);
  });

  it.each(['', 'opening'])('keeps pagination filters and a page-start target for arrangement %s', async g => {
    const { container } = render(await open({ juzFrom: '25', juzTo: '30', p: '2', g }));
    const links = [...screen.getByRole('navigation', { name: 'التنقل بين الصفحات' }).querySelectorAll('a')];
    expect(links).toHaveLength(2);
    for (const link of links) {
      const href = new URL(link.href);
      expect(container.querySelector('#quran-branches')).toBeTruthy();
      expect(href.searchParams.get('juzFrom')).toBe('25');
      expect(href.searchParams.get('g') ?? '').toBe(g);
      expect(href.searchParams.has('o')).toBe(false);
      expect(href.searchParams.has('v')).toBe(false);
    }
  });

  it('opens the list instead of selecting a phrase when no opening was requested', async () => {
    render(await open({ juzFrom: '30', juzTo: '30' }));
    expect(screen.getByRole('list', { name: 'المتشابهات' }).children).toHaveLength(10);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('link', { name: 'العودة إلى القائمة' })).toBeNull();
  });

  it('shows the trees matching a search ten to a page, keeping it in the page links', async () => {
    render(await open({ q: 'قال' }));
    expect(screen.getByRole('list', { name: 'المتشابهات' }).children).toHaveLength(10);
    expect(screen.getByText(/مجموعة تطابق «قال»/)).toBeTruthy();
    const links = [...screen.getByRole('navigation', { name: 'التنقل بين الصفحات' }).querySelectorAll('a')];
    expect(links.every(link => new URL(link.href).searchParams.get('q') === 'قال')).toBe(true);
  });

  it('links the whole tree when the search is itself a shared phrase', async () => {
    render(await open({ q: 'قال رب', g: 'opening' }));
    const href = new URL(screen.getAllByRole('link', { name: /الشجرة كاملة: / })[0].getAttribute('href')!, 'http://x');
    expect(href.searchParams.get('o')).toBe('قال رب');
    expect(href.searchParams.get('g')).toBe('opening');
    expect(href.searchParams.has('q')).toBe(false);
  });

  it('says so when nothing matches, without the list', async () => {
    render(await open({ q: 'كهيعص' }));
    expect(screen.getByText('لا مجموعة تطابق «كهيعص».')).toBeTruthy();
    expect(screen.queryByRole('list', { name: 'المتشابهات' })).toBeNull();
  });

  it('keeps start matches first when the results are grouped by opening', async () => {
    render(await open({ q: 'قال', g: 'opening' }));
    const headings = within(screen.getByRole('list', { name: 'الفواتح' })).getAllByRole('heading', { level: 2 }).map(heading => heading.textContent ?? '');
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0]).toMatch(/^قَالَ|^قَالُ/);
  });

  it('lists the surahs beside the trees and keeps only the trees with an ayah from the picked one', async () => {
    vi.mocked(prisma.surah.findMany).mockResolvedValueOnce([{ number: 1, name: 'الفاتحة' }, { number: 2, name: 'البقرة' }, { number: 112, name: 'الإخلاص' }] as never);
    const { container } = render(await open({ s: '2', g: 'opening' }));
    const pane = screen.getByRole('complementary', { name: 'السور' });
    const current = within(pane).getByRole('link', { current: 'page' });
    expect(current.textContent).toContain('البقرة');
    expect(new URL(current.getAttribute('href')!, 'http://x').searchParams.get('s')).toBe('2');
    expect(within(pane).getByRole('link', { name: /كل السور/ }).getAttribute('href')).toBe(branchesHref('', undefined, { grouped: true }));
    const trees = [...container.querySelectorAll('[data-tree]')];
    expect(trees.length).toBeGreaterThan(0);
    expect(trees.every(tree => [...tree.querySelectorAll('[data-keys]')].some(node => node.getAttribute('data-keys')!.split(' ').some(key => key.startsWith('2:'))))).toBe(true);
    const pages = [...screen.getByRole('navigation', { name: 'التنقل بين الصفحات' }).querySelectorAll('a')];
    expect(pages.every(link => new URL(link.href).searchParams.get('s') === '2')).toBe(true);
  });

  it('ignores a surah outside the mushaf', async () => {
    render(await open({ s: '200' }));
    expect(screen.getByRole('list', { name: 'المتشابهات' }).children).toHaveLength(10);
  });

  it('keeps the chapter families in the pane on every page', async () => {
    render(await open({}));
    expect(within(screen.getByRole('complementary', { name: 'السور' })).getByRole('navigation', { name: 'مجموعات فواتح السور' })).toBeTruthy();
  });

  it('lists only the tree\'s own surahs on a tree page, each lighting its ayat and linking to its trees', async () => {
    vi.mocked(prisma.surah.findMany).mockResolvedValueOnce([14, 15, 16, 43, 44, 45, 50, 51, 52, 53, 54, 55, 76, 77, 78].map(number => ({ number, name: `س${number}` })) as never);
    const { container } = render(await open({ o: 'ان المتقين' }));
    const pane = screen.getByRole('complementary', { name: 'السور' });
    const surahs = within(pane).getAllByRole('link', { name: /س\d+/ }).map(link => link.textContent!.match(/س(\d+)/)![1]);
    const inTree = new Set([...container.querySelectorAll('[data-tree] [data-node]')].flatMap(node => node.getAttribute('data-keys')!.split(' ')).map(key => key.split(':')[0]));
    expect(new Set(surahs)).toEqual(inTree);
    const link = within(pane).getAllByRole('link', { name: /س\d+/ })[0];
    expect(new URL(link.getAttribute('href')!, 'http://x').searchParams.get('s')).toBe(surahs[0]);
    expect(new URL(link.getAttribute('href')!, 'http://x').searchParams.has('o')).toBe(false);
    fireEvent.click(within(pane).getByRole('button', { name: `إظهار المسار: س${surahs[0]}` }));
    const lit = [...container.querySelectorAll('[data-tree] [data-lit]')];
    expect(lit.length).toBeGreaterThan(1);
    expect(lit.every(node => node.getAttribute('data-keys')!.split(' ').some(key => key.startsWith(`${surahs[0]}:`)))).toBe(true);
  });
});
