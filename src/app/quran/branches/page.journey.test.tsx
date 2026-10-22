// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import QuranBranchesPage from './page';

const navigation = vi.hoisted(() => ({
  search: '',
  push: vi.fn(),
  replace: vi.fn(),
  params: new Map<string, URLSearchParams>(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/quran/branches',
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
  useSearchParams: () => {
    if (!navigation.params.has(navigation.search)) navigation.params.set(navigation.search, new URLSearchParams(navigation.search));
    return navigation.params.get(navigation.search);
  },
  redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); },
}));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [] } } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(() => {
  cleanup();
  navigation.search = '';
  navigation.push.mockClear();
  navigation.replace.mockClear();
});

const open = (params: Record<string, string>) => QuranBranchesPage({ searchParams: Promise.resolve(params) });

describe('Quran branches page journey', () => {
  it('opens the list with ten expanded entries and no legacy view selector', async () => {
    const { container } = render(await open({}));
    const entries = container.querySelectorAll('ul[aria-label="المتشابهات"] > li');

    expect(entries).toHaveLength(10);
    expect(screen.getByText('قواعد المطابقة')).toBeTruthy();
    expect(screen.getByText('فواتح شائعة')).toBeTruthy();
    expect(screen.queryByLabelText(/طريقة العرض|view mode/i)).toBeNull();
    expect(container.querySelector('.svg-inline--fa')).toBeNull();
    expect(container.querySelector('svg.lucide')).toBeTruthy();
  });

  it('keeps an explicit unavailable phrase from falling back to another tree', async () => {
    render(await open({ o: 'عبارة غير موجودة' }));

    expect(screen.getByRole('status').textContent).toContain('لا تطابق العبارة المطلوبة');
    expect(screen.queryByRole('region', { name: 'شجرة الفواتح' })).toBeNull();
  });

  it('offers both root partitions when a legacy phrase link is ambiguous', async () => {
    render(await open({ o: 'قال رب اني', g: 'opening', p: '3', juzFrom: '2', juzTo: '30' }));
    const choices = screen.getAllByRole('link').filter(link => {
      const url = new URL((link as HTMLAnchorElement).href);
      return url.searchParams.get('o') === 'قال رب اني' && url.searchParams.has('r');
    });

    expect(choices).toHaveLength(2);
    expect(choices.map(link => link.textContent)).toEqual(expect.arrayContaining([expect.stringMatching(/2|٢/), expect.stringMatching(/7|٧/)]));
    const urls = choices.map(link => new URL((link as HTMLAnchorElement).href));
    expect(urls.map(url => url.searchParams.get('o'))).toEqual(['قال رب اني', 'قال رب اني']);
    expect(urls.map(url => url.searchParams.get('r'))[0]).not.toBe(urls.map(url => url.searchParams.get('r'))[1]);
    for (const url of urls) {
      expect(url.searchParams.get('g')).toBe('opening');
      expect(url.searchParams.get('p')).toBe('3');
      expect(url.searchParams.get('juzFrom')).toBe('2');
      expect(url.searchParams.get('juzTo')).toBe('30');
      expect(url.searchParams.has('v')).toBe(false);
    }
  });

  it('strips legacy view and unused tree fields while retaining the list state', async () => {
    await expect(open({ v: 'list', o: 'unused phrase', w: 'unused spelling', g: 'opening', p: '3', juzFrom: '1', juzTo: '9' }))
      .rejects.toThrow(`REDIRECT ${branchesHref('', { from: 1, to: 9 }, { grouped: true, page: 3 })}`);
  });
});
