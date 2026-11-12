vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// The site's top bar is not rendered here; its page-actions slot shows in place.
vi.mock('@/components/common/NavBar', () => ({
  useDesktopRail: () => null,
  NavActions: ({ children }: { children: React.ReactNode }) => <div data-testid="nav-actions">{children}</div>,
  NavButtons: ({ children, bottom }: { children: React.ReactNode; bottom?: boolean }) => <div data-testid={bottom ? 'nav-bottom' : 'nav-buttons'}>{children}</div>,
}));
// @vitest-environment jsdom
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import BranchTree from './BranchTree';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { branchesHref, type BranchAyah } from '@shared/quran/branches';
import * as quranText from '@/lib/quran/quranText';
import { ayahContexts, sharedByAll } from '@shared/quran/ayahContext';
import { buildPhraseGroups, type TreeGroup } from '@shared/quran/phraseTrees';
import { subtreeIndex } from '@shared/quran/subtrees';
import { comparisonId } from '@shared/quran/mutashabih/identity';
import { resolveTree } from '@/lib/quran/branchTreeLinks';
import { inJuzRange } from '@shared/quran/juz';
import data from '@shared/data/quran/trees.json';
import { groups as groupData } from '@shared/quran/mutashabih/data';
import { browseGroups } from '@shared/quran/mutashabih/browse';
import { branchInventory } from '@shared/quran/branchInventory';
import { NextRequest } from 'next/server';
import { GET as phrasesRoute } from '@/app/api/quran/branch-phrases/route';
import { ALL_KINDS } from '@shared/quran/branchSearch';
import { mushafText } from '@shared/quran/mushafText';

const preference = vi.hoisted(() => ({ value: undefined as string | undefined, connectors: undefined as string | undefined }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => { const value = name === 'branches-connectors' ? preference.connectors : preference.value; return value ? { value } : undefined; } }) }));
const params = new URLSearchParams();
const navigation = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/quran/branches',
  useSearchParams: () => params,
  redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); },
}));
vi.mock('@/lib/quran/surahList', () => ({ surahList: vi.fn(async () => [{ number: 2, name: 'البقرة' }, { number: 43, name: 'الزخرف' }, { number: 78, name: 'النبأ' }]) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(() => { cleanup(); preference.value = undefined; preference.connectors = undefined; });
const open = (values: Record<string, string>) => QuranBranchesPage({ searchParams: Promise.resolve(values) });
const target = (values: Record<string, string>) => open(values).then(() => '', (error: Error) => error.message.replace('REDIRECT ', ''));
const paramsOf = (href: string) => Object.fromEntries(new URL(href, 'http://localhost').searchParams);
/** Opens the page the way a browser lands on it: following the redirect to the first tree. */
const follow = async (values: Record<string, string>) => open(paramsOf(await target(values)));

const shortTree = (id: string) => {
  const trees: TreeGroup[] = data.trees.map(tree => ({ ...tree, family: tree.family ? true : undefined }));
  const tree = resolveTree(id, [...trees, ...subtreeIndex(trees, data.subtrees).groups], () => buildPhraseGroups(data.ayat));
  if (!tree) throw new Error(`Missing tree ${id}`);
  return `tree:${comparisonId(tree.occurrences).slice(4)}`;
};
const defaultGroups = (range: { from: number; to: number } | null = null) => browseGroups(groupData, { categories: 'mutashabeh,pondering' }, new Map(data.ayat.map(ayah => [ayah.key, ayah])), range);

describe('Quran branch trees', () => {
  // Search outside the filters builds the every-kind tree list once and keeps it. That takes seconds on a slow CI runner and
  // blocks while it runs, so build it here instead of inside whichever test happens to search first.
  beforeAll(() => { branchInventory({ categories: ALL_KINDS }, null); }, 60000);
  it('keeps the tree continuation in the matrix for الم without enabling surrounding ayat', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    try {
      render(await open({ o: 'الم', m: 'cards', q: 'الم' }));
      const card = await screen.findByLabelText('البقرة ١–٢');
      expect(card.textContent).toContain((data.ayat as BranchAyah[]).find(ayah => ayah.key === '2:2')!.words.join(' '));
      expect(card.querySelectorAll('span[class*="verseSeal"]')).toHaveLength(2);
      expect(document.querySelectorAll('[data-col][data-current]')).toHaveLength(6);
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('keeps actual Quran references when a matrix passage continues into the next surah', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    try {
      render(await open({ o: 'باسم ربك', m: 'cards' }));
      const card = await screen.findByLabelText('سورة ٥٦ ٩٦–سورة ٥٧ ١');
      expect(card.textContent).toContain((data.ayat as BranchAyah[]).find(ayah => ayah.key === '57:1')!.words.join(' '));
      expect((await screen.findByLabelText('سورة ٦٩ ٥٢–سورة ٧٠ ١')).textContent).toContain((data.ayat as BranchAyah[]).find(ayah => ayah.key === '70:1')!.words.join(' '));
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('continues the identical الم group in matrix view just like the plain phrase URL', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    try {
      render(await open({ o: 'group:2:1,3:1,29:1,30:1,31:1,32:1', m: 'cards' }));
      const card = await screen.findByLabelText('البقرة ١–٢');
      expect(card.textContent).toContain((data.ayat as BranchAyah[]).find(ayah => ayah.key === '2:2')!.words.join(' '));
      expect(card.querySelectorAll('span[class*="verseSeal"]')).toHaveLength(2);
      expect(document.querySelectorAll('[data-col][data-current]')).toHaveLength(6);
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('shows only ayat inside juz 25–30 after entering the matrix through the range filter', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    try {
      render(await follow({ juzFrom: '25', juzTo: '30', m: 'cards' }));
      await screen.findByRole('region', { name: 'مصفوفة الآيات' });
      const shown = context.mock.calls.flatMap(([keys]) => keys);
      expect(shown.length).toBeGreaterThan(1);
      expect(shown.filter(key => !inJuzRange(key, { from: 25, to: 30 }))).toEqual([]);
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('limits the tree and its neighboring previews to the selected juz range', async () => {
    localStorage.setItem('branches-surround', '0');
    try {
      render(await follow({ juzFrom: '25', juzTo: '30', m: 'tree' }));
      const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
      const shown = [...new Set([...tree.querySelectorAll('[data-keys]')].flatMap(element => element.getAttribute('data-keys')!.split(' ')))];
      expect(shown.length).toBeGreaterThan(1);
      expect(shown.filter(key => !inJuzRange(key, { from: 25, to: 30 }))).toEqual([]);
    } finally {
      localStorage.removeItem('branches-surround');
    }
  });

  it('does not extend a plain phrase beyond the selected final juz', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    const values = { o: 'العزيز الحكيم', juzFrom: '25', juzTo: '25', m: 'cards' };
    try {
      const destination = await target(values);
      render(await open(destination ? paramsOf(destination) : values));
      await screen.findByRole('region', { name: 'مصفوفة الآيات' });
      const shown = context.mock.calls.flatMap(([keys]) => keys);
      expect(shown).toContain('45:37');
      expect(shown.filter(key => !inJuzRange(key, { from: 25, to: 25 }))).toEqual([]);
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it.each(['chapter', 'page'])('limits displayed cards and continuation to a %s range', async unit => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    const values: Record<string, string> = unit === 'chapter' ? { surahFrom: '50', surahTo: '60' } : { pageFrom: '500', pageTo: '550' };
    try {
      render(await follow({ ...values, m: 'cards' }));
      await screen.findByRole('region', { name: 'مصفوفة الآيات' });
      const shown = context.mock.calls.flatMap(([keys]) => keys);
      expect(shown.length).toBeGreaterThan(1);
      for (const key of shown) {
        const ayah = (data.ayat as BranchAyah[]).find(ayah => ayah.key === key)!;
        const position = unit === 'chapter' ? Number(key.split(':')[0]) : ayah.page;
        expect(position).toBeGreaterThanOrEqual(unit === 'chapter' ? 50 : 500);
        expect(position).toBeLessThanOrEqual(unit === 'chapter' ? 60 : 550);
      }
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('canonicalizes a selected family away from the old partial search and shows one family result', async () => {
    const destination = await target({ o: 'family:hamidat', m: 'cards', n: 'last', q: 'الح' });
    expect(paramsOf(destination)).toEqual({ o: 'family:hamidat', m: 'cards', q: 'الحامدات' });
    render(await open(paramsOf(destination)));
    expect(screen.getByRole('progressbar').getAttribute('max')).toBe('1');
  });

  it('keeps stored continuation text inside juz 1 for the plain لكم ما matrix', async () => {
    localStorage.setItem('branches-surround', '0');
    const context = vi.spyOn(quranText, 'quranContexts').mockImplementation(async keys => sharedByAll(ayahContexts(data.ayat as BranchAyah[], keys)));
    try {
      render(await open({ o: 'لكم ما', juzFrom: '1', juzTo: '1', m: 'cards' }));
      await screen.findByRole('region', { name: 'مصفوفة الآيات' });
      const shown = context.mock.calls.flatMap(([keys]) => keys);
      expect(shown).toContain('2:141');
      expect(shown).not.toContain('2:142');
      expect(shown.filter(key => !inJuzRange(key, { from: 1, to: 1 }))).toEqual([]);
    } finally {
      context.mockRestore();
      localStorage.removeItem('branches-surround');
    }
  });

  it('loads the connector default independently from an explicit matrix view', async () => {
    const group = groupData.find(group => group.citations.some(citation => citation.id === 'K02'))!;
    render(await open({ o: group.id, m: 'cards' }));
    expect(screen.getByRole('button', { name: 'تقديم وتأخير' }).getAttribute('aria-pressed')).toBe('false');
    cleanup();
    preference.connectors = 'on';
    render(await open({ o: group.id, m: 'cards' }));
    expect(screen.getByRole('button', { name: 'تقديم وتأخير' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('retains the occurrence scope when zooming into a generated group', async () => {
    const group = groupData.find(group => group.citations.some(citation => citation.id === 'Z03'))!;
    const wanted = group.tree.occurrences.slice(0, 2);
    render(await open({ o: group.id, at: wanted.map(place => `${place.key}:${place.start}`).join(',') }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    const drawn = new Set([...tree.querySelectorAll('[data-keys]')]
      .filter(element => !element.closest('[data-tree-neighbour]'))
      .flatMap(element => element.getAttribute('data-keys')!.split(' ')));
    expect([...drawn].sort()).toEqual(wanted.map(place => place.key).sort());
  });

  it("opens the reader's trees of one ayah: the first tree holding it, stepping only through those, with a chip that clears it", async () => {
    const key = branchInventory({}, null).flatMap(piece => piece.keys).find(item => item.startsWith('2:'))!;
    const holding = branchInventory({}, null).filter(piece => piece.keys.includes(key));
    const landed = paramsOf(await target({ k: key }));
    expect(landed.k).toBe(key);
    expect(landed.o).toBe(holding[0].id);
    render(await open(landed));
    expect(screen.getByLabelText('إزالة الآية').getAttribute('href')).not.toContain('k=');
  });

  it('opens the saved default view and preserves it through the initial redirect', async () => {
    preference.value = 'cards';
    expect(new URL(await target({}), 'http://localhost').searchParams.get('m')).toBe('cards');
    render(await open({ o: 'لا اثم عليه' }));
    expect(screen.getByRole('region', { name: 'آيات الشجرة في سياقها' })).toBeTruthy();
  });

  it.each([['cards', 'tree'], ['tree', 'cards']])('honors explicit %s links over the %s default', async (mode, saved) => {
    preference.value = saved;
    render(await open({ o: 'لا اثم عليه', m: mode }));
    expect(screen.getByRole('region', { name: mode === 'cards' ? 'آيات الشجرة في سياقها' : 'شجرة العبارات المشتركة' })).toBeTruthy();
  });

  it('keeps the explicit tree override when zooming into a subtree above a matrix default', async () => {
    preference.value = 'cards';
    render(await open({ o: 'لا اثم عليه', m: 'tree' }));
    const href = screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' })[0].getAttribute('href')!;
    expect(paramsOf(href).m).toBe('tree');
    cleanup();
    render(await open(paramsOf(href)));
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
  });

  it('ignores an invalid saved preference', async () => {
    preference.value = 'invalid';
    render(await open({ o: 'لا اثم عليه' }));
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
  });

  it('shows an ayah boundary between continuations without a separate phrase node', async () => {
    render(await open({ o: 'يومهم الذي', juzFrom: '25', juzTo: '30' }));
    expect(screen.getByText('۝').closest('[data-node]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'إظهار المسار: ۝' })).toBeNull();
    expect(screen.getByText(/^وَهُوَ ٱلَّذِى فِى ٱلسَّمَآءِ/)).toBeTruthy();
    expect(screen.getByText(/^يَوْمَ يَخْرُجُونَ مِنَ ٱلْأَجْدَاثِ/)).toBeTruthy();
    expect(screen.getByText('فِيهِ يُصْعَقُونَ')).toBeTruthy();
  });
  it('suggests the retained tree when typing absorbed wording, from phrases fetched once and not sent with the page', async () => {
    const fetch = vi.fn(async (url: string) => url.includes('branch-phrases') ? phrasesRoute(new NextRequest(`http://localhost${url}`)) : new Response(null, { status: 404 }));
    vi.stubGlobal('fetch', fetch);
    const page = await follow({ juzFrom: '25', juzTo: '30', s: '43' });
    render(page);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'فذرهم يخوضوا ويلعبوا' } });
    const options = await screen.findAllByRole('option');
    vi.unstubAllGlobals();
    expect(fetch.mock.calls.map(([url]) => url).filter(url => url.includes('branch-phrases') && !url.includes('outside=1'))).toEqual(['/api/quran/branch-phrases?all=1&juzFrom=25&juzTo=30&s=43']);
    expect(options.filter(option => !option.className.includes('home-muted'))).toHaveLength(1);
    expect(options[0].textContent).toContain(mushafText('يَوْمَهُمُ ٱلَّذِى'));
  });

  it('lists trees the filters hide under their own label; picking one clears the filters', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => url.includes('branch-phrases') ? phrasesRoute(new NextRequest(`http://localhost${url}`)) : new Response(null, { status: 404 })));
    render(await follow({ juzFrom: '1', juzTo: '1' }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'إن المجرمين في' } });
    expect(await screen.findByText('خارج التصفية الحالية، فتحها يمسح التصفية', {}, { timeout: 5000 })).toBeTruthy();
    vi.unstubAllGlobals();
    const hidden = screen.getAllByRole('option').find(option => option.textContent?.includes(mushafText('ٱلْمُجْرِمِينَ')))!;
    fireEvent.click(hidden);
    const pushed = new URL(navigation.push.mock.calls.at(-1)![0], 'http://localhost');
    expect(pushed.searchParams.get('juzFrom')).toBeNull();
    expect(pushed.searchParams.get('categories')).toBe('mutashabeh,pondering,words');
  });

  it('keeps zoom links to the subtree after an ayah ending', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = branchesHref(shortTree('لا اثم عليه ان الله غفور رحيم ۝'));
    expect(screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' }).some(link => link.getAttribute('href') === href)).toBe(true);
  });
  it('shows the فذرهم passages together once in the reported range and surah', async () => {
    render(await follow({ juzFrom: '25', juzTo: '30', s: '43', q: 'فذرهم يخوضوا ويلعبوا' }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(within(tree).getAllByText(/^فَذَرْهُمْ/).filter(element => element.closest('[data-node]') && !element.closest('li, [data-tree-neighbour]'))).toHaveLength(1);
    expect(within(tree).queryByText('ف')).toBeNull();
    expect(tree.textContent).toContain('الزخرف ٨٣');
    expect(tree.textContent).toContain('٧٠:٤٢');
    expect(tree.textContent).toContain('الزخرف ٨٣');
  });

  it('has no list view any more: old list and page links open the first tree', async () => {
    expect(await target({ m: 'list', q: 'قال', p: '2' })).toBe(branchesHref('', undefined, { query: 'قال' }));
    expect(new URL(await target({ q: 'قال' }), 'http://localhost').searchParams.get('o')).toBeTruthy();
  });

  it('canonicalizes a legacy opening URL to its unified tree', async () => {
    await expect(open({ o: 'فذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون', scope: 'opening' }))
      .rejects.toThrow(`REDIRECT ${branchesHref(shortTree('ذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون'))}`);
  });

  it('keeps whole first-word variants in a focused tree', async () => {
    render(await open({ o: 'يقيمون الصلوه', at: '2:3:3,8:3:1' }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(tree.textContent).toContain('وَيُقِيمُونَ');
    expect(within(tree).getAllByText(/يُقِيمُونَ$/)).toHaveLength(2);
    expect(within(tree).queryByText('و')).toBeNull();
  });

  it('opens the first group in mushaf order, preserving the range and view', async () => {
    const groups = defaultGroups();
    const firstInRange = defaultGroups({ from: 30, to: 30 })[0];
    await expect(open({})).rejects.toThrow(`REDIRECT ${branchesHref(groups[0].id)}`);
    await expect(open({ juzFrom: '30', juzTo: '30', m: 'cards' })).rejects.toThrow(`REDIRECT ${branchesHref(firstInRange.id, { from: 30, to: 30 }, { mode: 'cards' })}`);
  });

  it('keeps the search when the juz range changes, opening the tree whose phrase is the search', async () => {
    await expect(open({ q: 'ان المتقين في', juzFrom: '26', juzTo: '30', m: 'cards', categories: 'words' }))
      .rejects.toThrow(`REDIRECT ${branchesHref(shortTree('ان المتقين في'), { from: 26, to: 30 }, { query: 'ان المتقين في', mode: 'cards', filters: { categories: 'words' } })}`);
  });

  it('keys the server-supplied tree header and renders it without React console errors', async () => {
    const page = await open({ o: 'ان المتقين في' });
    const headers: ReactElement[] = [];
    const visit = (nodes: ReactNode) => Children.forEach(nodes, child => {
      if (!isValidElement<{ children?: ReactNode; header?: ReactElement }>(child)) return;
      if (child.type === BranchTree && child.props.header) headers.push(child.props.header);
      visit(child.props.children);
    });
    visit(page);
    expect(headers).toHaveLength(1);
    expect(headers[0].key).not.toBeNull();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(page);
      expect(screen.getByRole('navigation', { name: 'التنقل بين الأشجار' })).toBeTruthy();
      expect(error).not.toHaveBeenCalled();
    } finally { error.mockRestore(); }
  });

  it('steps to the neighbouring trees in list order, keeping the juz range', async () => {
    const trees = defaultGroups({ from: 30, to: 30 }).map(group => ({ ...group.tree, id: group.id }));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(branchesHref(trees[0].id, juz));
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(trees[2].id, juz));
  });

  it.each(['tree', 'cards'])('shows progress through only the filtered juz trees in %s view', async mode => {
    const trees = defaultGroups({ from: 30, to: 30 }).map(group => ({ ...group.tree, id: group.id }));
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: mode }));
    const progress = screen.getByRole('progressbar', { name: 'التقدم بين الأشجار' });
    expect(progress.getAttribute('value')).toBe('2');
    expect(progress.getAttribute('max')).toBe(String(trees.length));
    cleanup();
    render(await open({ o: trees[trees.length - 1].id, juzFrom: '30', juzTo: '30', m: mode }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe(String(trees.length));
  });

  it('draws the neighbouring trees beside this one, so a swipe brings in the finished card', async () => {
    const trees = defaultGroups({ from: 30, to: 30 }).map(group => ({ ...group.tree, id: group.id }));
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    const drawn = (side: string) => new Set([...document.querySelectorAll(`[data-tree-neighbour="${side}"] [data-keys]`)].flatMap(box => box.getAttribute('data-keys')!.split(' ')));
    const keysOf = (index: number) => [...new Set(trees[index].occurrences.map(occurrence => occurrence.key))].sort();
    expect([...drawn('next')].sort()).toEqual(keysOf(2));
    expect([...drawn('previous')].sort()).toEqual(keysOf(0));
  });

  it('disables the previous step on the first tree', async () => {
    render(await open({ o: data.trees[0].id }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(shortTree(data.trees[1].id)));
  });

  it('browses the trees a surah filter leaves from its first tree, keeping the filter as a chip', async () => {
    const first = await target({ s: '2' });
    expect(new URL(first, 'http://localhost').searchParams.get('s')).toBe('2');
    render(await open(paramsOf(first)));
    let steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('link', { name: 'اعرض بطاقات الآيات' })).toBeTruthy();
    expect(screen.getByText('سورة البقرة')).toBeTruthy();
    const total = branchInventory({}, null).filter(piece => piece.keys.some(key => key.startsWith('2:'))).length;
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('1');
    expect(screen.getByRole('progressbar').getAttribute('max')).toBe(String(total));
    expect(new URL(screen.getByRole('link', { name: 'إزالة السورة' }).getAttribute('href')!, 'http://localhost').searchParams.has('s')).toBe(false);
    const second = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
    expect(new URL(second, 'http://localhost').searchParams.get('s')).toBe('2');
    cleanup();
    render(await open(paramsOf(second)));
    steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(first);
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('2');
    expect(screen.getByRole('progressbar').getAttribute('max')).toBe(String(total));
  });

  it('opens the first search result and swipes through the rest in order, with no result count', async () => {
    const query = 'قال';
    const first = await target({ q: query });
    expect(new URL(first, 'http://localhost').searchParams.get('q')).toBe(query);
    render(await open(paramsOf(first)));
    expect(screen.queryByText(/^١ من /)).toBeNull();
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    const second = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
    expect(new URL(second, 'http://localhost').searchParams.get('q')).toBe(query);
  });

  it('gives a tree outside the list no steps', async () => {
    render(await open({ o: 'ان الله غفور رحيم', at: '2:173:21,2:182:12' }));
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'التنقل بين الأشجار' })).toBeNull();
  });

  it('opens a subtree by its id, stepping among the trees beside its parent', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const parentSteps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' }).textContent;
    const href = screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' })[0].getAttribute('href')!;
    cleanup();
    render(await open(Object.fromEntries(new URL(href, 'http://localhost').searchParams)));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(tree.textContent).toContain('البقرة ١٧٣');
    expect(tree.textContent).toContain('البقرة ١٨٢');
    expect(screen.getByRole('navigation', { name: 'التنقل بين الأشجار' }).textContent).toBe(parentSteps);
  });

  it('keeps every ayah of an old phrase link whose id is now a subtree id', async () => {
    render(await open({ o: 'امرت ان اكون', at: '6:14:14,10:72:11,10:104:21,27:91:12' }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(tree.textContent).toContain('٢٧:٩١');
  });

  it('steps through the saved trees only, newest first, while the saved-only switch is on', async () => {
    const [a, b] = [data.trees[5].id, data.trees[2].id];
    const first = await target({ b: `${a}|${b}`, categories: 'words' });
    expect(paramsOf(first)).toEqual({ o: shortTree(a), categories: 'words', b: `${a}|${b}` });
    render(await open(paramsOf(first)));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(shortTree(b), undefined, { saved: [a, b], filters: { categories: 'words' } }));
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(screen.getByTestId('nav-actions')).getByRole('button', { name: 'تصفية' }).parentElement!.querySelector('.rounded-full')).toBeTruthy();
  });

  it.each([['cited', '1'], ['categories', 'none']])('keeps saved-only results inside the applied eligibility filters', async (key, value) => {
    render(await open({ b: 'الم', [key]: value }));
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.queryByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeNull();
  });

  it('says so when no tree matches the search', async () => {
    render(await open({ q: 'كلمات لا توجد أبدا' }));
    expect(screen.getByText('لا شجرة تطابق «كلمات لا توجد أبدا».')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('does not qualify a shared subtree through a query present in only one member', async () => {
    render(await open({ q: 'قل أطيعوا الله وأطيعوا الرسول' }));
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(document.querySelector('[data-lit]')).toBeNull();
    expect(screen.getByText('لا شجرة تطابق «قل أطيعوا الله وأطيعوا الرسول».')).toBeTruthy();
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

  it('shows the tree as ayah cards in cards view, linking back to the same tree in tree view within the juz range', async () => {
    const trees = defaultGroups({ from: 30, to: 30 }).map(group => ({ ...group.tree, id: group.id }));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: 'cards' }));
    expect(screen.getByRole('region', { name: 'آيات الشجرة في سياقها' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeNull();
    expect(screen.getByRole('link', { name: 'اعرض الشجرة' }).getAttribute('href')).toBe(branchesHref(trees[1].id, juz, { mode: 'tree' }));
    expect(screen.queryByRole('link', { name: 'اعرض بطاقات الآيات' })).toBeNull();
  });
});


describe('branches review', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('shows keep / drop / discuss only in review on the owner\'s machine, and keeps review in the redirect', async () => {
    const landing = await target({ review: '1' });
    expect(paramsOf(landing).review).toBe('1');
    vi.stubEnv('NODE_ENV', 'development');
    render(await open(paramsOf(landing)));
    expect(screen.getByRole('button', { name: 'حذف البطاقة' })).toBeTruthy();
    expect(document.querySelector('[data-draft]')?.textContent).toContain('drafted by Claude');
    cleanup();
    render(await open({ ...paramsOf(landing), review: '' }));
    expect(screen.queryByRole('button', { name: 'حذف البطاقة' })).toBeNull();
    expect(document.querySelector('[data-draft]')).toBeNull();
  }, 30000);

  it('reviews every kind of tree up to 35 ayat and names the trees a tree sits inside', async () => {
    const pool = branchInventory({ categories: ALL_KINDS }, null, true);
    const big = pool.find(piece => piece.keys.length > 35)!;
    const landing = await target({ o: big.id, review: '1' });
    expect(landing).not.toBe('');
    expect(paramsOf(landing).o).not.toBe(big.id);
    render(await open({ o: 'cmp:0ilg4fd106qkbh', review: '1' }));
    const related = () => [...document.querySelectorAll('[data-related] li')].map(item => item.textContent!.replace(/ .* /, ' '));
    expect(related()).toEqual(['Inside (3)', 'Inside (31)']);
    expect(document.querySelector('[data-related] a')!.getAttribute('href')).toBe(branchesHref('cmp:039jbxl1kswrcn', undefined, { review: true }));
    cleanup();
    render(await open({ o: 'cmp:039jbxl1kswrcn', review: '1' }));
    expect(related()).toEqual(['Holds (2)', 'Inside (31)']);
  }, 30000);
});
