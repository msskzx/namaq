// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import QuranBranchesPage from './page';

const params = new URLSearchParams();
const router = { push: vi.fn(), replace: vi.fn() };
vi.mock('next/navigation', () => ({ useRouter: () => router, usePathname: () => '/quran/branches', useSearchParams: () => params, redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); } }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [] } } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(cleanup);
const open = (params: Record<string, string>) => QuranBranchesPage({ searchParams: Promise.resolve(params) });

describe('Quran branches range selection', () => {
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
});
