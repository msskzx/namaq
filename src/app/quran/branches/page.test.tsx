// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import QuranBranchesPage from './page';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); } }));
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
    expect(screen.getByRole('group', { name: 'أكثر الفواتح تكرارًا' })).toBeTruthy();
  });

  it('updates the URL to the selected fallback when applying a range without the old phrase', async () => {
    await expect(open({ o: 'ان المتقين', juzFrom: '30', juzTo: '30', apply: 'juz', w: 'إِنَّ' })).rejects.toThrow(`REDIRECT ${branchesHref('اما من', { from: 30, to: 30 })}`);
  });

  it('keeps an available phrase and the list arrangement when applying a range', async () => {
    await expect(open({ o: 'ان المتقين', juzFrom: '25', juzTo: '30', apply: 'juz', v: 'list', g: 'opening' })).rejects.toThrow(`REDIRECT ${branchesHref('ان المتقين', { from: 25, to: 30 }, { list: true, grouped: true })}`);
  });

  it.each(['', 'opening'])('keeps pagination filters and a page-start target for arrangement %s', async g => {
    const { container } = render(await open({ o: 'ان المتقين', juzFrom: '25', juzTo: '30', v: 'list', p: '2', g }));
    const nav = screen.getByRole('navigation', { name: 'التنقل بين الصفحات' });
    const links = [...nav.querySelectorAll('a')];
    expect(links).toHaveLength(2);
    for (const link of links) {
      const href = new URL(link.href);
      expect(container.querySelector('#quran-branches')).toBeTruthy();
      expect(href.searchParams.get('juzFrom')).toBe('25');
      expect(href.searchParams.get('g') ?? '').toBe(g);
    }
  });

  it('selects a default when no opening was requested', async () => {
    render(await open({ juzFrom: '30', juzTo: '30' }));
    expect(screen.getByRole('region', { name: 'شجرة الفواتح' })).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
