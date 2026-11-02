vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// The site's top bar is not rendered here; its page-actions slot shows in place.
vi.mock('@/components/common/NavBar', () => ({
  NavActions: ({ children }: { children: React.ReactNode }) => <div data-testid="nav-actions">{children}</div>,
  NavButtons: ({ children, bottom }: { children: React.ReactNode; bottom?: boolean }) => <div data-testid={bottom ? 'nav-bottom' : 'nav-buttons'}>{children}</div>,
}));
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import QuranBranchesPage from './page';
import { branchesHref, type BranchAyah } from '@/lib/quran/branches';
import { buildTreeGroups } from '@/lib/quran/phraseTrees';
import { inJuzRange } from '@/lib/quran/juz';
import data from './trees.json';
import { NextRequest } from 'next/server';
import { GET as phrasesRoute } from '@/app/api/quran/branch-phrases/route';

const params = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/quran/branches',
  useSearchParams: () => params,
  redirect: (url: string) => { throw new Error(`REDIRECT ${url}`); },
}));
vi.mock('@/lib/quran/surahList', () => ({ surahList: vi.fn(async () => [{ number: 2, name: 'البقرة' }, { number: 43, name: 'الزخرف' }, { number: 78, name: 'النبأ' }]) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));

afterEach(cleanup);
const open = (values: Record<string, string>) => QuranBranchesPage({ searchParams: Promise.resolve(values) });
const target = (values: Record<string, string>) => open(values).then(() => '', (error: Error) => error.message.replace('REDIRECT ', ''));
const paramsOf = (href: string) => Object.fromEntries(new URL(href, 'http://localhost').searchParams);
/** Opens the page the way a browser lands on it: following the redirect to the first tree. */
const follow = async (values: Record<string, string>) => open(paramsOf(await target(values)));

describe('Quran branch trees', () => {
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
    expect(fetch.mock.calls.map(([url]) => url).filter(url => url.includes('branch-phrases'))).toEqual(['/api/quran/branch-phrases?all=1&juzFrom=25&juzTo=30']);
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('يَوْمَهُمُ ٱلَّذِى');
  });

  it('keeps zoom links to the subtree after an ayah ending', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const href = branchesHref('لا اثم عليه ان الله غفور رحيم ۝');
    expect(screen.getAllByRole('link', { name: 'عرض هذا الجزء وحده' }).some(link => link.getAttribute('href') === href)).toBe(true);
  });
  it('shows the فذرهم passages together once in the reported range and surah', async () => {
    render(await follow({ juzFrom: '25', juzTo: '30', s: '43', q: 'فذرهم يخوضوا ويلعبوا' }));
    const tree = screen.getByRole('region', { name: 'شجرة العبارات المشتركة' });
    expect(within(tree).getAllByText(/^فَذَرْهُمْ/)).toHaveLength(2);
    expect(within(tree).queryByText('ف')).toBeNull();
    expect(tree.textContent).toContain('٥٢:٤٥');
    expect(tree.textContent).toContain('٧٠:٤٢');
    expect(tree.textContent).toContain('الزخرف ٨٣');
  });

  it('has no list view any more: old list and page links open the first tree', async () => {
    expect(await target({ m: 'list', q: 'قال', p: '2' })).toBe(branchesHref('', undefined, { query: 'قال' }));
    expect(new URL(await target({ q: 'قال' }), 'http://localhost').searchParams.get('o')).toBeTruthy();
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

  it('keeps the search when the juz range changes, opening the tree whose phrase is the search', async () => {
    await expect(open({ q: 'ان المتقين في', juzFrom: '26', juzTo: '30', m: 'cards' }))
      .rejects.toThrow(`REDIRECT ${branchesHref('ان المتقين في', { from: 26, to: 30 }, { query: 'ان المتقين في', mode: 'cards' })}`);
  });

  it('does not render an opening-or-inside filter or a side pane', async () => {
    render(await follow({}));
    expect(screen.getByRole('heading', { name: 'متشابهات القرآن' })).toBeTruthy();
    expect(screen.queryByText('أول الآية')).toBeNull();
    expect(screen.queryByText('داخل الآية')).toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('steps to the neighbouring trees in list order, keeping the juz range', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(branchesHref(trees[0].id, juz));
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(trees[2].id, juz));
  });

  it('draws the neighbouring trees beside this one, so a swipe brings in the finished card', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
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
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(data.trees[1].id));
  });

  it('browses the trees a surah filter leaves from its first tree, keeping the filter as a chip', async () => {
    const first = await target({ juzFrom: '30', juzTo: '30', s: '78' });
    expect(new URL(first, 'http://localhost').searchParams.get('s')).toBe('78');
    render(await open(paramsOf(first)));
    let steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('link', { name: 'اعرض بطاقات الآيات' })).toBeTruthy();
    expect(screen.getByText('سورة النبأ')).toBeTruthy();
    expect(new URL(screen.getByRole('link', { name: 'إزالة السورة' }).getAttribute('href')!, 'http://localhost').searchParams.has('s')).toBe(false);
    const second = within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')!;
    expect(new URL(second, 'http://localhost').searchParams.get('s')).toBe('78');
    cleanup();
    render(await open(paramsOf(second)));
    steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(first);
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
    const first = await target({ b: `${a}|${b}` });
    expect(paramsOf(first)).toEqual({ o: a, b: `${a}|${b}` });
    render(await open(paramsOf(first)));
    const steps = screen.getByRole('navigation', { name: 'التنقل بين الأشجار' });
    expect(within(steps).getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(branchesHref(b, undefined, { saved: [a, b] }));
    expect(within(steps).getByRole('button', { name: 'الشجرة السابقة' }).hasAttribute('disabled')).toBe(true);
    expect(within(screen.getByTestId('nav-actions')).getByRole('button', { name: 'تصفية' }).parentElement!.querySelector('.rounded-full')).toBeTruthy();
  });

  it('says so when no tree matches the search', async () => {
    render(await open({ q: 'كلمات لا توجد أبدا' }));
    expect(screen.getByText('لا شجرة تطابق «كلمات لا توجد أبدا».')).toBeTruthy();
  });

  it('opens the subtree a search names, lighting the ayah that holds the words before it', async () => {
    const href = await open({ q: 'قل أطيعوا الله وأطيعوا الرسول' }).then(() => '', (error: Error) => error.message.replace('REDIRECT ', ''));
    expect(new URL(href, 'http://localhost').searchParams.get('o')).toBe('اطيعوا الله واطيعوا الرسول');
    render(await open(Object.fromEntries(new URL(href, 'http://localhost').searchParams)));
    const lit = [...document.querySelectorAll('[data-lit]')].map(box => box.getAttribute('data-keys'));
    expect(lit.length).toBeGreaterThan(0);
    expect(lit.every(keys => keys!.split(' ').includes('24:54'))).toBe(true);
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

  it('puts search and filter in the top bar, page buttons in the side rail, help in the bottom bar and share and save under the tree', async () => {
    render(await follow({ juzFrom: '30', juzTo: '30' }));
    expect(screen.getByRole('heading', { level: 1, name: 'متشابهات القرآن' }).className).toContain('sr-only');
    const bar = screen.getByTestId('nav-actions');
    expect(within(bar).getByRole('combobox')).toBeTruthy();
    expect(within(bar).getByRole('button', { name: 'البحث' })).toBeTruthy();
    const filter = within(bar).getByRole('button', { name: 'تصفية' });
    expect(filter.parentElement!.querySelector('.rounded-full')).toBeTruthy();
    const rail = screen.getByTestId('nav-buttons');
    const named = [
      within(rail).getByRole('link', { name: 'اعرض بطاقات الآيات' }),
      within(rail).getByRole('button', { name: 'الآيات المحيطة' }),
      filter,
    ];
    named.forEach(control => {
      expect(control.textContent).toBe('');
      expect(control.getAttribute('title')).toBe(control.getAttribute('aria-label'));
    });
    expect(within(screen.getByTestId('nav-bottom')).getByTitle('قواعد المطابقة')).toBeTruthy();
    const actions = screen.getByRole('button', { name: 'حفظ' }).parentElement!;
    expect(within(actions).getByRole('button', { name: 'مشاركة' })).toBeTruthy();
    expect(within(rail).queryByRole('button', { name: 'مشاركة' })).toBeNull();
  });

  it('shows the tree as ayah cards in cards view, crossing to the previous tree on its last card', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    const juz = { from: 30, to: 30 };
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: 'cards' }));
    expect(screen.getByRole('region', { name: 'آيات الشجرة في سياقها' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeNull();
    expect(screen.getByRole('link', { name: 'اعرض الشجرة' }).getAttribute('href')).toBe(branchesHref(trees[1].id, juz));
    expect(screen.queryByRole('link', { name: 'اعرض بطاقات الآيات' })).toBeNull();
  });

  it('keeps the colour legend in the help in cards view only', async () => {
    const trees = buildTreeGroups((data.ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, { from: 30, to: 30 })));
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30', m: 'cards' }));
    const help = within(screen.getByTestId('nav-bottom')).getByTitle('قواعد المطابقة').closest('details')!;
    expect(within(help).getByText('نفس الكلمة')).toBeTruthy();
    expect(within(help).getByText('نفس الجذر')).toBeTruthy();
    cleanup();
    render(await open({ o: trees[1].id, juzFrom: '30', juzTo: '30' }));
    expect(within(screen.getByTestId('nav-bottom')).queryByText('نفس الكلمة')).toBeNull();
  });

  it('keeps the juz range in the filter sheet, named once', async () => {
    render(await open({ o: 'لا اثم عليه' }));
    const form = screen.getByRole('form', { name: 'نطاق الأجزاء', hidden: true });
    expect(form.closest('dialog')).toBeTruthy();
    expect(form.textContent!.match(/الجزء/g)).toHaveLength(1);
    expect(within(screen.getByTestId('nav-actions')).getByRole('button', { name: 'تصفية' }).parentElement!.querySelector('.rounded-full')).toBeNull();
  });
});

