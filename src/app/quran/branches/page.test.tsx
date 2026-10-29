// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { branchesHref } from '@/lib/quran/branches';

const params = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/quran/branches',
  useSearchParams: () => params,
  redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); },
}));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: vi.fn(async () => []) } } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(cleanup);
const open = (values: Record<string, string>) => QuranBranchesPage({ searchParams: Promise.resolve(values) });

describe('Quran branch trees', () => {
  it('canonicalizes a legacy opening URL to its unified tree', async () => {
    await expect(open({ o: 'فذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون', scope: 'opening' }))
      .rejects.toThrow(`REDIRECT ${branchesHref('ذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون')}`);
  });

  it('does not render an opening-or-inside filter', async () => {
    render(await open({}));
    expect(screen.getByRole('heading', { name: 'أشجار العبارات المشتركة' })).toBeTruthy();
    expect(screen.queryByText('أول الآية')).toBeNull();
    expect(screen.queryByText('داخل الآية')).toBeNull();
    expect(within(screen.getByRole('list', { name: 'المتشابهات' })).getAllByRole('region', { name: 'شجرة العبارات المشتركة' })).toHaveLength(10);
  });
});
