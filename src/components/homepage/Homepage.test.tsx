import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { toggleBookmark } from '@shared/bookmarks';
import Homepage from './Homepage';
import { Stories } from './HomeFeed';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
vi.mock('@/components/common/NavBar', () => ({ NavActions: ({ children }: { children: React.ReactNode }) => children }));
const { quranContexts } = vi.hoisted(() => ({ quranContexts: vi.fn() }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));

const surahs = [
  { number: 2, name: 'البقرة', nameEn: undefined, count: 0 },
  { number: 3, name: 'آل عمران', nameEn: undefined, count: 0 },
  { number: 62, name: 'الجمعة', nameEn: undefined, count: 0 },
];
const data = {
  surahs,
  bookmarkAyat: { family: ['2:129', '2:151', '3:164', '62:2'] },
  tour: null,
};
const bookmark = { id: 'family', text: 'الكتاب والحكمة', href: '/quran/branches?o=family', savedAt: 1 };

const side = (surah: number, number: number, words: string[]) => ({ surah, ayah: number, ayat: [{ number, words, marks: { 0: { kind: 'exact' as const } } }] });
const pairs = [{ id: '2:35|7:19', sides: [side(2, 35, ['وقلنا', 'يا']), side(7, 19, ['ويا', 'آدم'])] }, { id: '2:48|2:123', sides: [side(2, 48, ['واتقوا', 'يوما']), side(3, 9, ['ربنا', 'إنك'])] }];
const fetched: string[] = [];
// The feed's API (src/app/api/home/feed/route.ts): two pairs and no trees, and page slices.
const fetchMock = vi.fn(async (url: string) => {
  fetched.push(url);
  const query = new URL(url, 'http://localhost').searchParams;
  const body = query.has('page') ? { surah: 18, words: ['ٱلۡحَمۡدُ', 'لِلَّهِ', 1] }
    : query.has('p') ? { pairs: query.get('p')!.split(',').filter(Boolean).map(Number).map(at => pairs[at]).filter(Boolean), trees: [] }
    : { pairs: pairs.map(pair => pair.id), trees: [null, null], pairKeys: pairs.map(pair => pair.sides.map(side => `${side.surah}:${side.ayah}`)), treeKeys: [[], []] };
  return { ok: true, json: async () => body } as Response;
});
vi.stubGlobal('fetch', fetchMock);

afterEach(() => { cleanup(); localStorage.clear(); state.language = 'ar'; fetched.length = 0; });

describe('home', () => {
  it('puts reading and the feed first, then the tools: prayer times, saved cards and quizzes', async () => {
    render(<Homepage data={data} />);
    const stories = screen.getByRole('navigation', { name: 'اختصارات' });
    const reading = screen.getByRole('region', { name: 'ابدأ القراءة' });
    const feed = screen.getByRole('region', { name: 'للتأمل اليوم' });
    const saved = screen.getByRole('region', { name: 'المحفوظات' });
    const quizzes = screen.getByRole('region', { name: 'اختبارات القرآن' });
    for (const [a, b] of [[stories, reading], [reading, feed], [feed, saved], [saved, quizzes]]) expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مواقيت الصلاة' }).getAttribute('href')).toBe('/utilities');
    expect(within(stories).getByRole('link', { name: 'الأنبياء' }).getAttribute('href')).toBe('/quran/prophets');
    expect(within(quizzes).getByRole('link', { name: 'بمفردك' }).getAttribute('href')).toBe('/quizzes');
    expect(within(quizzes).getByRole('link', { name: 'مع غيرك' }).getAttribute('href')).toBe('/quizzes/party');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('نمق');
    expect(screen.queryByRole('region', { name: 'ما نسيته' })).toBeNull();
    await waitFor(() => expect(screen.getAllByRole('article').length).toBeGreaterThan(0));
  });

  it('updates the daily juz after midnight while home stays open', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 13, 23, 59, 45));
    try {
      render(<Stories />);
      const before = screen.getByRole('link', { name: /^جزء اليوم:/ }).getAttribute('aria-label');
      act(() => { vi.advanceTimersByTime(30_000); });
      expect(screen.getByRole('link', { name: /^جزء اليوم:/ }).getAttribute('aria-label')).not.toBe(before);
    } finally {
      cleanup();
      vi.useRealTimers();
    }
  });

  it('continues reading on the page the mushaf was left on', async () => {
    localStorage.setItem('quran-reader-page', '294');
    render(<Homepage data={data} />);
    const reading = await screen.findByRole('region', { name: 'تابع القراءة' });
    expect(within(reading).getByRole('link', { name: 'اقرأ' }).getAttribute('href')).toBe('/quran/read/294');
    await waitFor(() => expect(reading.textContent).toContain('ٱلۡحَمۡدُ'));
    expect(fetched).toContain('/api/home/feed?page=294');
  });

  it('shows today\'s pair as a post with its compare link, saves it, and remembers it was seen', async () => {
    render(<Homepage data={data} />);
    await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('وقلنا يا'));
    const post = screen.getAllByRole('article')[0];
    expect(within(post).getByRole('link', { name: 'افتحها في المقارنة' }).getAttribute('href')).toBe('/quran/compare?a=2&b=7#c-2-35-7-19');
    fireEvent.click(within(post).getByRole('button', { name: 'احفظ' }));
    expect(within(post).getByRole('button', { name: 'أزلها من المحفوظات' })).toBeTruthy();
    await waitFor(() => expect(Object.keys(JSON.parse(localStorage.getItem('feed-seen') ?? '{}'))).toContain('2:35|7:19'));
  });

  it('skips a pair seen on an earlier visit and loads more on request', async () => {
    localStorage.setItem('feed-seen', JSON.stringify({ '2:35|7:19': 1 }));
    render(<Homepage data={data} />);
    await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('واتقوا يوما'));
    const feed = screen.getByRole('region', { name: 'للتأمل اليوم' });
    expect(feed.textContent).not.toContain('وقلنا يا');
    fireEvent.click(screen.getByRole('button', { name: 'المزيد للتأمل' }));
    // Everything was seen: the feed starts again from the seen pair.
    await waitFor(() => expect(feed.textContent).toContain('وقلنا يا'));
  });

  it('asks to recall a due forgotten ayah: first words, the rest hidden, and remembered takes it away', async () => {
    quranContexts.mockResolvedValue([{ ayah: { key: '2:255', words: ['الله', 'لا', 'إله', 'إلا', 'هو'] } }]);
    localStorage.setItem('ayah-forgot', JSON.stringify({ '2:255': { forgot: 1, at: 5 } }));
    render(<Homepage data={data} />);
    const post = (await screen.findByText('هل تذكرها؟')).closest('article')!;
    await waitFor(() => expect(post.textContent).toContain('الله لا إله'));
    expect(post.textContent).not.toContain('هو');
    fireEvent.click(within(post).getByRole('button', { name: /أظهرها/ }));
    expect(post.textContent).toContain('هو');
    expect(within(post).getByRole('link', { name: 'راجع ما نسيت' }).getAttribute('href')).toBe('/quran/read/ayah/2/255?recite=2:255&review=1');
    fireEvent.click(within(post).getByRole('button', { name: /تذكّرتها/ }));
    expect(screen.queryByText('هل تذكرها؟')).toBeNull();
  });

  it('asks once what is memorized: × closes it for good, «اختر» picks in the card', async () => {
    const { unmount } = render(<Homepage data={data} />);
    const card = screen.getByRole('region', { name: 'ما الذي تحفظه؟' });
    fireEvent.click(within(card).getByRole('button', { name: 'اختر ما تحفظه' }));
    const picking = screen.getByRole('region', { name: 'ما أحفظه' });
    fireEvent.click(within(picking).getByRole('checkbox', { name: 'الجزء ٣٠' }));
    expect(JSON.parse(localStorage.getItem('memorized')!)).toEqual({ unit: 'juz', picked: [30] });
    fireEvent.click(within(picking).getByRole('button', { name: 'تم' }));
    expect(screen.queryByRole('region', { name: 'ما أحفظه' })).toBeNull();
    unmount();
    localStorage.clear();
    render(<Homepage data={data} />);
    fireEvent.click(within(screen.getByRole('region', { name: 'ما الذي تحفظه؟' })).getByRole('button', { name: 'إغلاق' }));
    expect(screen.queryByRole('region', { name: 'ما الذي تحفظه؟' })).toBeNull();
    expect(localStorage.getItem('memorized-asked')).toBe('1');
  });

  it('asks about an ayah of the day from what is memorized when nothing forgotten is due, with «نسيتها»', async () => {
    quranContexts.mockImplementation(async (keys: string[]) => keys.map(key => ({ ayah: { key, words: ['أول', 'ثاني', 'ثالث', 'رابع'] } })));
    localStorage.setItem('memorized', JSON.stringify({ unit: 'surah', picked: [1] }));
    render(<Homepage data={data} />);
    expect(screen.queryByRole('region', { name: 'ما الذي تحفظه؟' })).toBeNull();
    const post = (await screen.findByText('هل تذكرها؟')).closest('article')!;
    expect(post.textContent).toContain('الفاتحة');
    expect(within(post).queryByRole('link', { name: 'راجع ما نسيت' })).toBeNull();
    fireEvent.click(within(post).getByRole('button', { name: /نسيتها/ }));
    expect(Object.keys(JSON.parse(localStorage.getItem('ayah-forgot')!))[0]).toMatch(/^1:/);
  });

  it('puts first a pair touching what is memorized, while that setting is on', async () => {
    localStorage.setItem('memorized', JSON.stringify({ unit: 'surah', picked: [3] }));
    render(<Homepage data={data} />);
    await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('واتقوا يوما'));
  });

  it('lights a story ring while it holds something new, until it is opened', async () => {
    localStorage.setItem('ayah-forgot', JSON.stringify({ '2:255': { forgot: 1, at: 5 } }));
    quranContexts.mockResolvedValue([]);
    render(<Homepage data={data} />);
    const story = screen.getByRole('link', { name: 'ما نسيته' });
    await waitFor(() => expect(story.querySelector('[data-lit]')).toBeTruthy());
    expect(screen.getByRole('link', { name: 'المحفوظات' }).querySelector('[data-lit]')).toBeNull();
    fireEvent.click(story);
    await waitFor(() => expect(story.querySelector('[data-lit]')).toBeNull());
  });

  it('shows the kind, grouped references and saved text as one card without action labels', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('button', { name: /الكتاب والحكمة/ });
    expect(card.textContent).toContain('البقرة ١٢٩، ١٥١');
    expect(card.textContent).toContain('آل عمران ١٦٤');
    expect(card.textContent).toContain('الجمعة ٢');
    expect(card.getAttribute('data-kind')).toBe('tree');
    expect(card.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('شجرة');
    expect(card.textContent).toMatch(/^البقرة/);
    expect(card.textContent).not.toMatch(/عائلة|فتح للمقارنة|فتح للاستكشاف/);
  });

  it('labels compare cards and mushaf ayat with their own kind', () => {
    localStorage.setItem('bookmarks', JSON.stringify([
      { id: 'compare:2:154|16:21', text: 'ولا تقولوا', href: '/quran/compare?a=2&b=16', savedAt: 2 },
      { id: 'ayah:2:255', text: 'الله لا إله إلا هو', href: '/quran/read/42', savedAt: 3 },
    ]));
    render(<Homepage data={data} />);
    const compare = screen.getByRole('button', { name: /ولا تقولوا/ });
    const ayah = screen.getByRole('button', { name: /الله لا إله إلا هو/ });
    expect(compare.getAttribute('data-kind')).toBe('compare');
    expect(compare.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('مقارنة');
    expect(compare.textContent).not.toContain('مقارنة');
    expect(ayah.getAttribute('data-kind')).toBe('ayah');
    expect(ayah.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('آية');
    expect(ayah.textContent).not.toContain('آية');
  });

  it('reacts to saves and removals made through the existing bookmark API', () => {
    render(<Homepage data={data} />);
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.getByRole('button', { name: /الكتاب والحكمة/ })).toBeTruthy();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
    expect(screen.getByText(/احفظ شجرة أو بطاقة مقارنة أو آية بزر/)).toBeTruthy();
  });

  it('keeps old bookmarks readable and navigable when their inventory entry is unknown', () => {
    localStorage.setItem('bookmarks', JSON.stringify([{ ...bookmark, id: 'old-tree', text: 'عبارة محفوظة' }]));
    render(<Homepage data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /عبارة محفوظة/ }));
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
  });

  it('opens a saved card’s icons on a click: open it, its first ayah in the mushaf, and remove it', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /الكتاب والحكمة/ }));
    const menu = screen.getByRole('dialog', { name: 'شجرة' });
    expect(within(menu).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
    expect(within(menu).getByRole('link', { name: 'في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/2/129');
    fireEvent.click(within(menu).getByRole('button', { name: 'أزلها من المحفوظات' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
  });

  it('closes the icons on Escape and gives the focus back to the card', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('button', { name: /الكتاب والحكمة/ });
    card.focus();
    fireEvent.click(card);
    expect(document.activeElement?.closest('[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(card);
  });

  it('keeps the latest five saved cards, with «عرض الكل» to the library page only when there are more', () => {
    const many = Array.from({ length: 6 }, (_, at) => ({ id: `ayah:2:${at + 1}`, text: `آية ${at + 1}`, href: `/quran/read/ayah/2/${at + 1}`, savedAt: at }));
    localStorage.setItem('bookmarks', JSON.stringify(many));
    render(<Homepage data={data} />);
    const saved = screen.getByRole('region', { name: 'المحفوظات' });
    expect(within(saved).getAllByRole('button')).toHaveLength(5);
    expect(within(saved).getByRole('link', { name: 'عرض الكل' }).getAttribute('href')).toBe('/library?tab=saved');
  });
});
