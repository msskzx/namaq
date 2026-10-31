vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { Children, isValidElement, type ReactNode } from 'react';
import CompareLayout from '../compare/CompareLayout';
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
    expect(screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' }).some(link => link.getAttribute('href') === href)).toBe(true);
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
});
