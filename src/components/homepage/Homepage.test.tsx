import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { backToVisit, leftVisit, visitStart } from '@shared/feedSeen';
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

const side = (surah: number, number: number, words: string[]) => ({ surah, ayah: number, ayat: [{ number, words, marks: { 0: { kind: 'exact' as const } } }] });
const pairs = [{ id: '2:35|7:19', sides: [side(2, 35, ['وقلنا', 'يا']), side(7, 19, ['ويا', 'آدم'])] }, { id: '2:48|2:123', sides: [side(2, 48, ['واتقوا', 'يوما']), side(3, 9, ['ربنا', 'إنك'])] }];
const fetched: string[] = [];
// The recall card's page (?ayah=): one made-up line holding the ayah before and the ayah, or its surah's title then the ayah.
const ayahWordsOf: Record<string, string[]> = { '2:255': ['الله', 'لا', 'إله', 'إلا', 'هو'] };
const ayahPage = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  const words = ayahWordsOf[key] ?? ['أول', 'ثاني', 'ثالث', 'رابع'];
  const items = ayah === 1 ? [{ surah }, { line: [...words, 1] }] : [{ line: ['قبل', ayah - 1, ...words, ayah] }];
  return { page: 2, top: surah, data: { juz: 1, items }, previous: null };
};
vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
// The feed's API (src/app/api/home/feed/route.ts): two pairs and no trees, and page slices.
const fetchMock = vi.fn(async (url: string) => {
  fetched.push(url);
  const query = new URL(url, 'http://localhost').searchParams;
  const body = query.has('page') ? { surah: 18, words: ['ٱلۡحَمۡدُ', 'لِلَّهِ', 1] }
    : query.has('ayah') ? ayahPage(query.get('ayah')!)
    : query.has('p') || query.has('t') ? { pairs: (query.get('p') ?? '').split(',').filter(Boolean).map(Number).map(at => pairs[at]).filter(Boolean), trees: [] }
    : { pairs: pairs.map(pair => pair.id), trees: [null, null], pairKeys: pairs.map(pair => pair.sides.map(side => `${side.surah}:${side.ayah}`)), treeKeys: [[], []] };
  return { ok: true, json: async () => body } as Response;
});
vi.stubGlobal('fetch', fetchMock);
// The feed asks for more when its end mark comes near the screen; `observed` holds a call that says it came near.
const observed = new Set<() => void>();
vi.stubGlobal('IntersectionObserver', class {
  private seen?: () => void;
  constructor(private call: (entries: { isIntersecting: boolean }[]) => void) {}
  observe() { this.seen = () => this.call([{ isIntersecting: true }]); observed.add(this.seen); }
  disconnect() { if (this.seen) observed.delete(this.seen); }
});

afterEach(() => { cleanup(); localStorage.clear(); state.language = 'ar'; fetched.length = 0; });

describe('home', () => {
  it('puts reading and then the feed, with no tools below', async () => {
    render(<Homepage data={data} />);
    const stories = screen.getByRole('navigation', { name: 'اختصارات' });
    const reading = screen.getByRole('region', { name: 'ابدأ القراءة' });
    const feed = screen.getByRole('region', { name: 'للتأمل اليوم' });
    for (const [a, b] of [[stories, reading], [reading, feed]]) expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(stories).getByRole('link', { name: 'الأنبياء' }).getAttribute('href')).toBe('/quran/prophets');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('نمق');
    for (const name of ['المحفوظات', 'اختبارات القرآن', 'ما نسيته']) expect(screen.queryByRole('region', { name })).toBeNull();
    expect(screen.queryByRole('link', { name: 'مواقيت الصلاة' })).toBeNull();
    await waitFor(() => expect(screen.getAllByRole('article').length).toBeGreaterThan(0));
    expect(screen.queryByRole('button', { name: 'المزيد للتأمل' })).toBeNull();
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
    // The compare page's own card and buttons.
    expect(within(post).getByRole('button', { name: 'استوديو القراءة' })).toBeTruthy();
    fireEvent.click(within(post).getByRole('button', { name: 'حفظ' }));
    expect(within(post).getByRole('button', { name: 'إزالة من المحفوظة' })).toBeTruthy();
    await waitFor(() => expect(Object.keys(JSON.parse(localStorage.getItem('feed-seen') ?? '{}'))).toContain('2:35|7:19'));
  });

  it('skips a pair seen on an earlier visit and loads more as the page nears the end', async () => {
    localStorage.setItem('feed-seen', JSON.stringify({ '2:35|7:19': 1 }));
    render(<Homepage data={data} />);
    await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('واتقوا يوما'));
    const feed = screen.getByRole('region', { name: 'للتأمل اليوم' });
    expect(feed.textContent).not.toContain('وقلنا يا');
    act(() => observed.forEach(see => see()));
    // Everything was seen: the feed starts again from the seen pair.
    await waitFor(() => expect(feed.textContent).toContain('وقلنا يا'));
  });

  it('replaces seen posts after returning from a long time away', async () => {
    render(<Homepage data={data} />);
    await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('وقلنا يا'));
    const start = visitStart();
    const clock = vi.spyOn(Date, 'now');
    try {
      clock.mockReturnValue(start + 1000);
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      fireEvent(document, new Event('visibilitychange'));
      clock.mockReturnValue(start + 31 * 60_000);
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      fireEvent(document, new Event('visibilitychange'));
      await waitFor(() => expect(screen.getAllByRole('article')[0].textContent).toContain('واتقوا يوما'));
    } finally {
      cleanup();
      vi.restoreAllMocks();
      leftVisit(start - 31 * 60_000);
      backToVisit(start);
    }
  });

  it('asks to recall a due forgotten ayah in the reader\'s write boxes, grades what is typed, and remembered takes it away', async () => {
    localStorage.setItem('ayah-forgot', JSON.stringify({ '2:255': { forgot: 1, at: 5 } }));
    render(<Homepage data={data} />);
    const post = (await screen.findByText('هل تذكرها؟')).closest('article')!;
    await waitFor(() => expect(within(post).getAllByRole('button', { name: 'اكتب هذه الكلمة' })).toHaveLength(5));
    expect(within(post).getByRole('link', { name: 'راجع ما نسيت' }).getAttribute('href')).toBe('/quran/read/ayah/2/255?recite=2:255&review=1');
    const field = within(post).getByLabelText('اكتب الكلمة');
    for (const word of ['الله ', 'لا ', 'إله ', 'الا ', 'هي ']) fireEvent.change(field, { target: { value: word } });
    // The last word was wrong: amber, what was typed struck through above it, and the ayah forgotten again.
    expect(within(post).getByRole('note', { name: 'كتبت: هي' })).toBeTruthy();
    expect(within(post).queryAllByRole('button', { name: 'اكتب هذه الكلمة' })).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem('ayah-forgot')!)['2:255'].forgot).toBe(2);
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

});
