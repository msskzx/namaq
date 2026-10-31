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
    render(await open({ juzFrom: '25', juzTo: '30', s: '43', m: 'list' }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'فذرهم يخوضوا ويلعبوا' } });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('يَوْمَهُمُ ٱلَّذِى');
  });

  it('keeps zoom links to an absorbed phrase after an ayah ending', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = branchesHref('ان الله غفور رحيم', undefined, { occurrences: ['2:173:21', '2:182:12'] });
    expect(screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' }).some(link => link.getAttribute('href') === href)).toBe(true);
  });
  it('shows the فذرهم passages together once in the reported range and surah', async () => {
    render(await open({ juzFrom: '25', juzTo: '30', s: '43', q: 'فذرهم يخوضوا ويلعبوا', m: 'list' }));
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
    visit(await open({ m: 'list' }));
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

  it('opens the first tree of the list by default, keeping the filters', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    await expect(open({})).rejects.toThrow(`REDIRECT ${branchesHref(data.trees[0].id)}`);
    await expect(open({ juzFrom: '30', juzTo: '30', m: 'cards' })).rejects.toThrow(`REDIRECT ${branchesHref(trees[0].id, { from: 30, to: 30 }, { mode: 'cards' })}`);
  });

  it('does not render an opening-or-inside filter', async () => {
    render(await open({ m: 'list' }));
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
  });

  it('disables the previous step on the first tree', async () => {
    render(await open({ o: data.trees[0].id }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(data.trees[1].id));
  });

  it('browses the trees a surah filter leaves from the first tree on the page, keeping the filter', async () => {
    render(await open({ juzFrom: '30', juzTo: '30', s: '78', m: 'list' }));
    const mode = screen.getByRole('group', { name: 'طريقة العرض' });
    expect(within(mode).getByRole('link', { name: 'قائمة' }).getAttribute('aria-current')).toBe('page');
    const first = within(mode).getByRole('link', { name: 'شجرة' }).getAttribute('href')!;
    expect(new URL(first, 'http://localhost').searchParams.get('s')).toBe('78');
    cleanup();
    render(await open(Object.fromEntries(new URL(first, 'http://localhost').searchParams)));
    let steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(screen.getByRole('group', { name: 'طريقة العرض' })).getByRole('link', { name: 'شجرة' }).getAttribute('aria-current')).toBe('page');
    const second = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
    expect(new URL(second, 'http://localhost').searchParams.get('s')).toBe('78');
    cleanup();
    render(await open(Object.fromEntries(new URL(second, 'http://localhost').searchParams)));
    steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(first);
  });

  it('returns from browsing to the list page holding the current tree', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    render(await open({ o: trees[11].id, juzFrom: '30', juzTo: '30' }));
    const list = within(screen.getByRole('group', { name: 'طريقة العرض' })).getByRole('link', { name: 'قائمة' }).getAttribute('href');
    expect(list).toBe(branchesHref('', { from: 30, to: 30 }, { page: 2, mode: 'list' }));
  });

  it('browses a search result in its order, keeping the search', async () => {
    const query = 'قال';
    render(await open({ q: query, m: 'list' }));
    const first = within(screen.getByRole('group', { name: 'طريقة العرض' })).getByRole('link', { name: 'شجرة' }).getAttribute('href')!;
    expect(new URL(first, 'http://localhost').searchParams.get('q')).toBe(query);
    cleanup();
    render(await open(Object.fromEntries(new URL(first, 'http://localhost').searchParams)));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    const second = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
    expect(new URL(second, 'http://localhost').searchParams.get('q')).toBe(query);
  });

  it('gives a tree outside the list no steps', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' })[0].getAttribute('href')!;
    cleanup();
    render(await open(Object.fromEntries(new URL(href, 'http://localhost').searchParams)));
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'التنقل بين الأشجار' })).toBeNull();
  });

  it('keeps the list filter off subtree links of an open tree', async () => {
    render(await open({ o: 'لا اثم عليه', s: '2', q: 'لا' }));
    const links = screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' });
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      const params = new URL(link.getAttribute('href')!, 'http://localhost').searchParams;
      expect(params.has('s') || params.has('q')).toBe(false);
    });
  });

  it('shows the controls above the trees as named icons, with the title for screen readers only', async () => {
    render(await open({ juzFrom: '30', juzTo: '30', p: '2', m: 'list' }));
    expect(screen.getByRole('heading', { level: 1, name: 'متشابهات القرآن' }).className).toContain('sr-only');
    const named = [
      ...within(screen.getByRole('group', { name: 'طريقة العرض' })).getAllByRole('link'),
      screen.getByRole('link', { name: 'كل الأجزاء' }),
      screen.getByRole('link', { name: 'السابق' }),
      screen.getByRole('link', { name: 'التالي' }),
    ];
    named.forEach(control => {
      expect(control.textContent).toBe('');
      expect(control.getAttribute('title')).toBe(control.getAttribute('aria-label'));
    });
  });

  it('shows the tree as ayah cards in cards view, crossing to the previous tree on its last card', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: 'cards' }));
    expect(screen.getByRole('region', { name: 'آيات الشجرة في سياقها' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeNull();
    const mode = screen.getByRole('group', { name: 'طريقة العرض' });
    expect(within(mode).getByRole('link', { name: 'بطاقات الآيات' }).getAttribute('aria-current')).toBe('page');
    expect(within(mode).getByRole('link', { name: 'شجرة' }).getAttribute('href')).toBe(branchesHref(trees[1].id, juz));
    expect(within(mode).getByRole('link', { name: 'قائمة' }).getAttribute('href')).toBe(branchesHref('', juz, { mode: 'list' }));
  });

  it('keeps the colour legend in the side pane in cards view only, under an unheaded pane', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: 'cards' }));
    const pane = screen.getByRole('complementary', { name: 'السور' });
    expect(within(pane).getByText('نفس الكلمة')).toBeTruthy();
    expect(within(pane).getByText('نفس الجذر')).toBeTruthy();
    expect(within(pane).queryByRole('heading', { name: 'السور' })).toBeNull();
    cleanup();
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    expect(within(screen.getByRole('complementary', { name: 'السور' })).queryByText('نفس الكلمة')).toBeNull();
  });

  it('sends surah picks inside a tree to the list of that surah', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const pane = screen.getByRole('complementary', { name: 'السور' });
    const all = within(pane).getByRole('link', { name: /كل الأشجار/ }).getAttribute('href')!;
    expect(new URL(all, 'http://localhost').searchParams.get('m')).toBe('list');
  });

  it('names the juz range once and keeps the pane explanation inside the rules button', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const form = screen.getByRole('form', { name: 'نطاق الأجزاء' });
    expect(form.textContent!.match(/الجزء/g)).toHaveLength(1);
    expect(screen.getByRole('spinbutton', { name: 'إلى الجزء' })).toBeTruthy();
    const rules = screen.getByText('قواعد المطابقة').closest('details')!;
    expect(rules.textContent).toContain('سور آيات هذه الشجرة بعدد آياتها فيها');
    expect(within(screen.getByRole('complementary', { name: 'السور' })).getAllByText(/سور آيات هذه الشجرة/)).toHaveLength(1);
  });
});

