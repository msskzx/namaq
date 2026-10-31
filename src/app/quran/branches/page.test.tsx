vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { Children, isValidElement, type ReactNode } from 'react';
import CompareLayout from '../compare/CompareLayout';
import { branchesHref, type BranchAyah } from '@/lib/quran/branches';
import { buildTreeGroups } from '@/lib/quran/phraseTrees';
import { inJuzRange } from '@/lib/quran/juz';
import { num } from '@/lib/quran/arabicNumber';
import data from './trees.json';

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
  it('shows an ayah boundary between continuations without a separate phrase node', async () => {
    render(await open({ o: 'يومهم الذي', juzFrom: '25', juzTo: '30', p: '3' }));
    expect(screen.getByText('۝').closest('[data-node]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'إظهار المسار: ۝' })).toBeNull();
    expect(screen.getByText(/^وَهُوَ ٱلَّذِى فِى ٱلسَّمَآءِ/)).toBeTruthy();
    expect(screen.getByText(/^يَوْمَ يَخْرُجُونَ مِنَ ٱلْأَجْدَاثِ/)).toBeTruthy();
    expect(screen.getByText('فِيهِ يُصْعَقُونَ')).toBeTruthy();
  });
  it('suggests the retained tree when typing absorbed wording', async () => {
    render(await open({ juzFrom: '25', juzTo: '30', s: '43' }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'فذرهم يخوضوا ويلعبوا' } });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('يَوْمَهُمُ ٱلَّذِى');
  });

  it('keeps zoom links to an absorbed phrase after an ayah ending', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = branchesHref('ان الله غفور رحيم', undefined, { occurrences: ['2:173:21', '2:182:12'] });
    expect(screen.getAllByRole('link', { name: 'عرض هذا الجزء من الشجرة وحده' }).some(link => link.getAttribute('href') === href)).toBe(true);
  });
  it('shows the فذرهم passages together once in the reported range and surah', async () => {
    render(await open({ juzFrom: '25', juzTo: '30', s: '43', q: 'فذرهم يخوضوا ويلعبوا' }));
    const list = screen.getByRole('list', { name: 'المتشابهات' });
    const trees = within(list).getAllByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(trees).toHaveLength(1);
    expect(within(trees[0]).getAllByText(/^فَذَرْهُمْ/)).toHaveLength(2);
    expect(within(trees[0]).queryByText('ف')).toBeNull();
    expect(trees[0].textContent).toContain('٥٢:٤٥');
    expect(trees[0].textContent).toContain('٧٠:٤٢');
    expect(trees[0].textContent).toContain('٤٣:٨٣');
  });
  it('gives the server-created sidebar a stable identity among client layout children', async () => {
    const panes: ReactNode[] = [];
    const visit = (nodes: ReactNode) => Children.forEach(nodes, node => {
      if (!isValidElement<{ children?: ReactNode; pane?: ReactNode }>(node)) return;
      if (node.type === CompareLayout) panes.push(node.props.pane);
      visit(node.props.children);
    });
    visit(await open({}));
    expect(panes).toHaveLength(1);
    expect(panes.every(pane => isValidElement(pane) && pane.key !== null)).toBe(true);
  });
  it('canonicalizes a legacy opening URL to its unified tree', async () => {
    await expect(open({ o: 'فذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون', scope: 'opening' }))
      .rejects.toThrow(`REDIRECT ${branchesHref('ذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون')}`);
  });

  it('keeps whole first-word variants in a focused tree', async () => {
    render(await open({ o: 'يقيمون الصلوه', at: '2:3:3,8:3:1' }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(tree.textContent).toContain('وَيُقِيمُونَ');
    expect(within(tree).getAllByText(/يُقِيمُونَ$/)).toHaveLength(2);
    expect(within(tree).queryByText('و')).toBeNull();
  });

  it('does not render an opening-or-inside filter', async () => {
    render(await open({}));
    expect(screen.getByRole('heading', { name: 'متشابهات القرآن' })).toBeTruthy();
    expect(screen.queryByText('أول الآية')).toBeNull();
    expect(screen.queryByText('داخل الآية')).toBeNull();
    expect(within(screen.getByRole('list', { name: 'المتشابهات' })).getAllByRole('region', { name: 'شجرة العبارات المشتركة' })).toHaveLength(10);
  });

  it('steps to the neighbouring trees in list order, keeping the juz range', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(branchesHref(trees[0].id, juz));
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(trees[2].id, juz));
    expect(steps.textContent).toContain(`${num(2)} / ${num(trees.length)}`);
  });

  it('disables the previous step on the first tree', async () => {
    render(await open({ o: data.trees[0].id }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(data.trees[1].id));
  });

  it('steps through the trees a surah filter leaves, keeping the filter', async () => {
    render(await open({ juzFrom: '30', juzTo: '30', s: '78' }));
    const opens = screen.getAllByRole('link', { name: 'افتح الشجرة' }).map(link => link.getAttribute('href')!);
    expect(opens.length).toBeGreaterThan(2);
    expect(opens.every(href => href.includes('s=78'))).toBe(true);
    cleanup();
    render(await open(Object.fromEntries(new URL(opens[1], 'http://localhost').searchParams)));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(opens[0]);
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(opens[2]);
    expect(steps.textContent).toContain(`${num(2)} / `);
  });

  it('keeps the search in the open-tree links of a search result', async () => {
    render(await open({ juzFrom: '25', juzTo: '30', s: '43', q: 'فذرهم يخوضوا ويلعبوا' }));
    const href = screen.getByRole('link', { name: 'افتح الشجرة' }).getAttribute('href')!;
    expect(new URL(href, 'http://localhost').searchParams.get('q')).toBe('فذرهم يخوضوا ويلعبوا');
  });

  it('steps through a search result in its order, keeping the search', async () => {
    const query = 'قال';
    render(await open({ q: query }));
    const opens = screen.getAllByRole('link', { name: 'افتح الشجرة' }).map(link => link.getAttribute('href')!);
    expect(opens.length).toBeGreaterThan(2);
    cleanup();
    render(await open(Object.fromEntries(new URL(opens[1], 'http://localhost').searchParams)));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(opens[0]);
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(opens[2]);
    expect(new URL(opens[2], 'http://localhost').searchParams.get('q')).toBe(query);
  });

  it('gives a tree outside the list no steps', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = screen.getAllByRole('link', { name: 'عرض هذا الجزء من الشجرة وحده' })[0].getAttribute('href')!;
    cleanup();
    render(await open(Object.fromEntries(new URL(href, 'http://localhost').searchParams)));
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'التنقل بين الأشجار' })).toBeNull();
  });

  it('keeps the list filter off subtree links of an open tree', async () => {
    render(await open({ o: 'لا اثم عليه', s: '2', q: 'لا' }));
    const links = screen.getAllByRole('link', { name: 'عرض هذا الجزء من الشجرة وحده' });
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      const params = new URL(link.getAttribute('href')!, 'http://localhost').searchParams;
      expect(params.has('s') || params.has('q')).toBe(false);
    });
  });
});
