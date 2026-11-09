// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { groups } from '@shared/quran/mutashabih/data';
import { readBookmarks } from '@shared/bookmarks';
import { textHolds } from '@shared/quran/branches';

const navigation = vi.hoisted(() => ({ search: '', push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), params: new Map<string, URLSearchParams>() }));
vi.mock('next/navigation', () => ({
  useRouter: () => navigation,
  usePathname: () => '/quran/branches',
  useSearchParams: () => {
    if (!navigation.params.has(navigation.search)) navigation.params.set(navigation.search, new URLSearchParams(navigation.search));
    return navigation.params.get(navigation.search)!;
  },
  redirect: (href: string) => { throw new Error(`REDIRECT ${href}`); },
}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock('@/lib/quran/surahList', () => ({ surahList: async () => [{ number: 2, name: 'البقرة' }, { number: 7, name: 'الأعراف' }] }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock('@/components/common/NavBar', () => ({
  useDesktopRail: () => null,
  NavActions: ({ children }: { children: ReactNode }) => <div data-testid="nav-actions">{children}</div>,
  NavButtons: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  for (const [method, newState] of [['showPopover', 'open'], ['hidePopover', 'closed']]) {
    Object.defineProperty(HTMLElement.prototype, method, { configurable: true, value() {
      this.dispatchEvent(Object.assign(new Event('toggle'), { newState }));
    } });
  }
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
  navigation.search = '';
});

async function visit(values: Record<string, string>) {
  let params = values;
  for (let redirects = 0; redirects < 5; redirects++) {
    navigation.search = new URLSearchParams(params).toString();
    window.history.replaceState(null, '', `/quran/branches?${navigation.search}`);
    try {
      return render(await QuranBranchesPage({ searchParams: Promise.resolve(params) }));
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith('REDIRECT ')) throw error;
      params = Object.fromEntries(new URL(error.message.slice(9), 'http://localhost').searchParams);
    }
  }
  throw new Error('Branch URL did not settle after five redirects');
}

const paramsOf = (href: string) => Object.fromEntries(new URL(href, 'http://localhost').searchParams);
const visibleKeys = () => [...new Set([...screen.getByRole('region', { name: 'شجرة العبارات المشتركة' }).querySelectorAll('[data-keys]')]
  .filter(element => !element.closest('[data-tree-neighbour]'))
  .flatMap(element => element.getAttribute('data-keys')!.split(' ')))].sort();
const citedGroup = (id: string) => groups.find(group => group.citations.some(citation => citation.id === id))!;

describe('branch exploration acceptance', () => {
  it('starts with mutashabeh and pondering, leaves word trees off, and applies purpose drafts only on Apply', async () => {
    await visit({});
    fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
    const form = screen.getByRole('form', { name: 'تصفية', hidden: true });
    const mutashabeh = within(form).getByRole('button', { name: 'متشابهات', hidden: true });
    const pondering = within(form).getByRole('button', { name: 'تدبّر', hidden: true });
    const words = within(form).getByRole('button', { name: 'أشجار الكلمات', hidden: true });
    expect(mutashabeh.getAttribute('aria-pressed')).toBe('true');
    expect(pondering.getAttribute('aria-pressed')).toBe('true');
    expect(words.getAttribute('aria-pressed')).toBe('false');
    expect(within(form).queryByRole('button', { name: /تذكير وتأنيث/, hidden: true })).toBeNull();
    fireEvent.click(words);
    expect(navigation.replace).not.toHaveBeenCalled();
    fireEvent.click(within(form).getByRole('button', { name: 'تطبيق', hidden: true }));
    expect(paramsOf(navigation.replace.mock.calls[0][0]).categories.split(',').sort()).toEqual(['mutashabeh', 'pondering', 'words']);
  });

  it('keeps the sourced 2:58 and 7:161 comparison without a singular/plural chip', async () => {
    await visit({ o: citedGroup('K04').id });
    expect(visibleKeys()).toEqual(expect.arrayContaining(['2:58', '7:161']));
    expect(screen.queryByRole('button', { name: 'جمع وإفراد' })).toBeNull();
    expect(screen.queryByText(/امتداد نمق/)).toBeNull();
  });

  it('searches the studied expression and visits each surviving comparison once', async () => {
    await visit({ q: 'علي هدي' });
    const seen: string[] = [];
    const progress = screen.getByRole('progressbar');
    const count = Number(progress.getAttribute('max'));
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index++) {
      expect(screen.getByRole('progressbar').getAttribute('value')).toBe(String(index + 1));
      const keys = visibleKeys();
      expect(keys.length).toBeGreaterThan(1);
      const shared = [...screen.getByRole('region', { name: 'شجرة العبارات المشتركة' }).querySelectorAll('[data-node][data-keys]')]
        .filter(element => !element.closest('[data-tree-neighbour]') && element.getAttribute('data-keys')!.split(' ').length === keys.length)
        .map(element => element.querySelector('.font-quran')?.textContent ?? '');
      expect(shared.some(text => textHolds(text, 'علي هدي'))).toBe(true);
      seen.push(keys.join(','));
      const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
      if (index === count - 1) {
        expect(within(steps).getByRole('button', { name: 'الشجرة التالية' }).hasAttribute('disabled')).toBe(true);
      } else {
        const href = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
        cleanup();
        await visit(paramsOf(href));
      }
    }
    expect(new Set(seen).size).toBe(count);
  });

  it('opens a legacy group URL and preserves its saved bookmark', async () => {
    const oldId = 'group:2:1,3:1,29:1,30:1,31:1,32:1';
    const bookmark = { id: oldId, text: 'الم', href: `/quran/branches?o=${encodeURIComponent(oldId)}`, savedAt: 1 };
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    await visit({ o: oldId, b: oldId });
    expect(visibleKeys()).toEqual(expect.arrayContaining(['2:1', '3:1', '29:1', '30:1', '31:1', '32:1']));
    expect(screen.getByRole('progressbar').getAttribute('max')).toBe('1');
    expect(readBookmarks()).toEqual([bookmark]);
    expect(screen.getByRole('button', { name: 'إزالة من المحفوظة' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('resolves the same short comparison ID with filters on and off', async () => {
    const id = citedGroup('K02').id;
    expect(id.length).toBeLessThan(70);
    await visit({ o: id });
    const original = visibleKeys();
    const originalId = document.querySelector('[data-connection-group]')?.getAttribute('data-connection-group');
    expect(originalId).toBe(id);
    cleanup();
    await visit({ o: id, categories: 'mutashabeh', surahs: '2' });
    expect(visibleKeys()).toEqual(original);
    expect(document.querySelector('[data-connection-group]')?.getAttribute('data-connection-group')).toBe(id);
  });

  it('includes word trees when explicitly selected', async () => {
    await visit({ categories: 'words' });
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(visibleKeys().length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
    const form = screen.getByRole('form', { name: 'تصفية', hidden: true });
    expect(within(form).getByRole('button', { name: 'أشجار الكلمات', hidden: true }).getAttribute('aria-pressed')).toBe('true');
    expect(within(form).getByRole('button', { name: 'متشابهات', hidden: true }).getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps applied categories and surahs on subtree links while clearing the search', async () => {
    await visit({ o: 'لا اثم عليه', categories: 'mutashabeh,pondering', surahs: '2', q: 'لا' });
    const links = screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const params = paramsOf(link.getAttribute('href')!);
      expect(params.categories).toBe('mutashabeh,pondering');
      expect(params.surahs).toBe('2');
      expect(params.q).toBeUndefined();
    }
    const href = links[0].getAttribute('href')!;
    cleanup();
    await visit(paramsOf(href));
    expect(visibleKeys().length).toBeGreaterThan(1);
  });
});
