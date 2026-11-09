// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { NavSlotElement } from '@/components/common/NavBar';
import PairCompare from './PairCompare';
import type { PairCard } from './pairCards';

const router = vi.hoisted(() => ({ push: vi.fn(), prefetch: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

const names = { 2: { ar: 'الْبَقَرَةِ', en: 'Al-Baqarah' }, 7: { ar: 'الْاَعْرَافِ', en: "Al-A'raf" }, 11: { ar: 'هُوْدٍ', en: 'Hud' }, 26: { ar: 'الشُّعَرَاءِ', en: "Ash-Shu'ara" }, 52: { ar: 'الطُّوْرِ', en: 'At-Tur' }, 68: { ar: 'الْقَلَمِ', en: 'Al-Qalam' } };
const pairs = [{ a: 2, b: 7, count: 24 }, { a: 7, b: 11, count: 22 }, { a: 7, b: 26, count: 8 }, { a: 52, b: 68, count: 30 }];
const cards: PairCard[] = [{
  id: 'x', group: 'cmp:1',
  sides: [
    { surah: 52, ayah: 40, ayat: [{ number: 40, words: ['أم', 'تسألهم', 'أجرا'], marks: { 0: { kind: 'exact', link: '0' }, 1: { kind: 'exact', link: '1' } } }] },
    { surah: 68, ayah: 46, ayat: [{ number: 46, words: ['أم', 'تسألهم', 'أجرا'], marks: { 0: { kind: 'exact', link: '0' }, 1: { kind: 'exact', link: '1' } } }] },
  ],
}];

afterEach(() => { cleanup(); localStorage.clear(); });

const pane = () => screen.getByRole('complementary', { name: 'اختر سورتين' });
const listed = () => within(within(pane()).getByRole('heading', { name: 'كل السور المتشابهة' }).nextElementSibling as HTMLElement).getAllByRole('link').map(link => link.getAttribute('href'));

describe('PairCompare', () => {
  it('lists pairs in mushaf order, sorts by similarity on request and remembers it', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    const groups = () => [...pane().querySelectorAll('details')].map(group => ({
      surah: group.querySelector('summary span')!.textContent,
      open: (group as HTMLDetailsElement).open,
      links: [...group.querySelectorAll('ul a')].map(link => link.getAttribute('href')),
    }));
    expect(groups().map(group => group.surah)).toEqual(['البقرة', 'الاعراف', 'هود', 'الشعراء', 'الطور', 'القلم']);
    expect(groups().filter(group => group.open).map(group => group.surah)).toEqual(['الطور']);
    expect(groups()[1].links).toEqual(['/quran/compare?a=7&b=2', '/quran/compare?a=7&b=11', '/quran/compare?a=7&b=26']);
    expect(groups()[5].links).toEqual(['/quran/compare?a=68&b=52']);
    fireEvent.click(within(pane()).getByRole('button', { name: /الأكثر تشابهًا/ }));
    expect(listed()).toEqual(['/quran/compare?a=52&b=68', '/quran/compare?a=2&b=7', '/quran/compare?a=7&b=11', '/quran/compare?a=7&b=26']);
    cleanup();
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    expect(listed()[0]).toBe('/quran/compare?a=52&b=68');
  });

  it('finds pairs by surah name, number or story', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    const search = within(pane()).getByRole('searchbox');
    fireEvent.change(search, { target: { value: 'الشعراء' } });
    expect(listed()).toEqual(['/quran/compare?a=7&b=26']);
    fireEvent.change(search, { target: { value: '٥٢' } });
    expect(listed()).toEqual(['/quran/compare?a=52&b=68']);
    fireEvent.change(search, { target: { value: 'فرعون' } });
    expect(within(pane()).getByRole('heading', { name: 'مختارة' })).toBeTruthy();
    expect(listed()).toEqual(['/quran/compare?a=7&b=26']);
    fireEvent.change(search, { target: { value: 'zzz' } });
    expect(within(pane()).queryByRole('heading', { name: 'مختارة' })).toBeNull();
    expect(within(pane()).getByRole('status').textContent).toContain('لا سورة');
  });

  it('lights the matching word on the other side when a word is tapped', () => {
    const { container } = render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    const [first] = container.querySelectorAll('mark[data-link="1"]');
    fireEvent.click(first);
    expect([...container.querySelectorAll('mark[data-link="1"]')].map(mark => mark.hasAttribute('data-lit'))).toEqual([true, true]);
    expect(container.querySelector('mark[data-link="0"]')!.hasAttribute('data-lit')).toBe(false);
    fireEvent.click(first);
    expect(container.querySelector('mark[data-lit]')).toBeNull();
    expect(screen.getByRole('link', { name: 'افتح في متشابهات القرآن' }).getAttribute('href')).toBe('/quran/branches?o=cmp%3A1');
  });

  it('reads one side word by word in the studio, lighting each word with its partner', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
      fireEvent.click(screen.getByRole('button', { name: 'استوديو القراءة' }));
      expect(screen.queryByRole('button', { name: 'حفظ' })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'اقرأ مع التظليل' }));
      const reading = () => container.querySelector('[data-reading]');
      expect(reading()!.textContent).toBe('أم');
      expect([...container.querySelectorAll('mark[data-link="0"]')].map(mark => mark.hasAttribute('data-lit'))).toEqual([true, true]);
      act(() => { vi.advanceTimersByTime(1400); });
      expect(reading()!.textContent).toBe('تسألهم');
      expect(container.querySelectorAll('mark[data-lit][data-link="1"]')).toHaveLength(2);
      act(() => { vi.advanceTimersByTime(1400); });
      expect(reading()!.textContent).toBe('أجرا');
      expect(container.querySelector('mark[data-lit]')).toBeNull();
      act(() => { vi.advanceTimersByTime(4000); });
      expect(reading()).toBeNull();
      expect(screen.getByRole('button', { name: 'إعادة' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'إغلاق الاستوديو' }));
      expect(screen.getByRole('button', { name: 'حفظ' })).toBeTruthy();
    } finally { vi.useRealTimers(); }
  });

  it('says «سورة» once per surah when the names already start with it', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={{ ...names, 52: { ar: 'سُورَةُ الطُّورِ' } }} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('سُورَةُ الطُّورِ وَسُورَةُ الْقَلَمِ');
  });

  it('opens each ayah of a card in the reader', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    const read = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/quran/read/'));
    expect(read.map(link => link.getAttribute('href'))).toEqual(['/quran/read/ayah/52/40', '/quran/read/ayah/68/46']);
    expect(read[0].getAttribute('aria-label')).toMatch(/^اقرأ .+ ٤٠ في المصحف$/);
  });

  it('in review, flags the cards that need the owner, says who checked each verdict and keeps review on in links', () => {
    const reviewed: PairCard[] = [
      { ...cards[0], id: 'y', verdict: { keep: true, why: 'same phrase', ask: 'Is this one parallel?' } },
      { ...cards[0], id: 'z', verdict: { keep: false, why: 'formula only', checked: true } },
    ];
    const { container } = render(<PairCompare a={52} b={68} cards={reviewed} pairs={pairs} names={names} review />);
    expect([...container.querySelectorAll('[data-ask]')].map(node => node.textContent)).toEqual(['? Needs your feedback: Is this one parallel?']);
    expect(container.textContent).toContain('drafted by Claude');
    expect(container.textContent).toContain('checked by you');
    expect(within(pane()).getAllByRole('link').every(link => link.getAttribute('href')!.endsWith('&review=1'))).toBe(true);
  });

  it('filters the pages by scope and keeps it in its links', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} scope={{ unit: 'juz', from: 27, to: 29 }} spans={{ page: {}, juz: { 2: [1, 3], 7: [8, 9], 11: [11, 12], 26: [19, 19], 52: [27, 27], 68: [29, 29] } }} />);
    const rows = [...pane().querySelectorAll('ul a')].map(link => link.getAttribute('href'));
    expect(rows.length).toBeGreaterThan(0);
    // Under each surah's heading, the row opens the page with that surah first.
    expect(rows).toEqual(['/quran/compare?a=52&b=68&juz=27-29', '/quran/compare?a=68&b=52&juz=27-29']);
    const filter = within(pane()).getByRole('form', { name: 'تصفية' });
    expect((within(filter).getByRole('combobox', { name: 'التصفية حسب' }) as HTMLSelectElement).value).toBe('juz');
    fireEvent.click(within(filter).getByRole('button', { name: /إعادة ضبط/ }));
    expect(router.push).toHaveBeenCalledWith('/quran/compare?a=52&b=68');
  });

  it('in review, the unreviewed-only switch hides finished pages and keeps those with a question', () => {
    const allRows = () => [...pane().querySelectorAll('ul a')].map(link => link.getAttribute('href'));
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} review todo states={{ '52:68': 'checked', '7:11': 'ask', '2:7': 'dropped' }} />);
    const rows = allRows();
    expect(rows.some(href => href?.includes('a=7&b=11'))).toBe(true);
    expect(rows.some(href => href?.includes('a=7&b=26'))).toBe(true);
    expect(rows.some(href => href?.includes('a=52&b=68'))).toBe(false);
    expect(rows.some(href => href?.includes('a=2&b=7'))).toBe(false);
    expect(rows.every(href => href?.includes('&todo=1'))).toBe(true);
    fireEvent.click(within(pane()).getByRole('switch', { name: 'غير المراجَعة فقط' }));
    expect(router.push).toHaveBeenCalledWith('/quran/compare?a=52&b=68&review=1');
  });

  it('in review, marks a page the owner dropped with a cross', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} review states={{ '7:26': 'dropped' }} />);
    const row = pane().querySelector('[href="/quran/compare?a=7&b=26&review=1"]') as HTMLElement;
    expect(within(row).getByRole('img', { name: 'حُذفت' })).toBeTruthy();
    expect(within(row).queryByRole('img', { name: 'راجعتها' })).toBeNull();
  });

  it('in review, marks the surah pairs the owner reviewed and those with a question', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} review states={{ '52:68': 'checked', '7:11': 'ask' }} />);
    expect(within(pane()).getAllByRole('img', { name: 'راجعتها' }).length).toBeGreaterThan(0);
    expect(within(pane()).getAllByRole('img', { name: 'فيها سؤال لك' }).length).toBeGreaterThan(0);
  });

  it('shows no review marks outside review', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} states={{ '52:68': 'checked' }} />);
    expect(within(pane()).queryByRole('img', { name: 'راجعتها' })).toBeNull();
  });

  it('offers the next and previous pairs in mushaf order beside the title', () => {
    function Chrome({ children }: { children: React.ReactNode }) {
      const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
      return <><header aria-label="top bar"><div ref={setSlot} /></header><NavSlotElement.Provider value={slot}>{children}</NavSlotElement.Provider></>;
    }
    render(<PairCompare a={7} b={11} cards={cards} pairs={pairs} names={names} />, { wrapper: Chrome });
    const bar = screen.getByRole('banner', { name: 'top bar' });
    expect(within(bar).getByRole('link', { name: /التالي/ }).getAttribute('href')).toBe('/quran/compare?a=7&b=26');
    // Opened under surah 7, the steps walk surah 7's pairs: 7·2, 7·11, 7·26.
    expect(within(bar).getByRole('link', { name: /السابق/ }).getAttribute('href')).toBe('/quran/compare?a=7&b=2');
  });

  it('loads a batch of neighbouring pairs so swiping does not wait', () => {
    router.prefetch.mockClear();
    render(<PairCompare a={2} b={7} cards={cards} pairs={pairs} names={names} />);
    const loaded = router.prefetch.mock.calls.map(call => call[0]);
    expect(loaded).toEqual(expect.arrayContaining(['/quran/compare?a=7&b=11', '/quran/compare?a=7&b=26', '/quran/compare?a=11&b=7']));
  });

  it('shows where the page sits in the list swiping walks', () => {
    render(<PairCompare a={7} b={11} cards={cards} pairs={pairs} names={names} />);
    const bar = screen.getByRole('progressbar', { name: 'التقدم بين الصفحات' }) as HTMLProgressElement;
    expect([bar.value, bar.max]).toEqual([3, 7]);
  });

  it('greys out the previous chevron on the first pair', () => {
    function Chrome({ children }: { children: React.ReactNode }) {
      const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
      return <><header aria-label="top bar"><div ref={setSlot} /></header><NavSlotElement.Provider value={slot}>{children}</NavSlotElement.Provider></>;
    }
    render(<PairCompare a={2} b={7} cards={cards} pairs={pairs} names={names} />, { wrapper: Chrome });
    const previous = screen.getByRole('link', { name: /السابق/ });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(previous.getAttribute('href')).toBeNull();
    expect(screen.getByRole('link', { name: /التالي/ }).getAttribute('href')).toBe('/quran/compare?a=7&b=11');
  });

  it('saves a card with its bookmark button and links back to it', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    fireEvent.click(screen.getByRole('button', { name: 'حفظ' }));
    expect(JSON.parse(localStorage.getItem('bookmarks')!)).toMatchObject([{ id: 'compare:x', text: 'أم تسألهم أجرا …', href: '/quran/compare?a=52&b=68#c-52-40-68-46' }]);
    expect(document.getElementById('c-52-40-68-46')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'إزالة من المحفوظة' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'إزالة من المحفوظة' }));
    expect(JSON.parse(localStorage.getItem('bookmarks')!)).toEqual([]);
  });

  it('shows only saved cards and the surah pairs that hold them when saved only is on', () => {
    const pair = (id: string): PairCard => ({ ...cards[0], id, group: undefined });
    render(<PairCompare a={52} b={68} cards={[pair('52:40|68:46'), pair('52:41|68:47')]} pairs={pairs} names={names} />);
    const savedOnly = () => within(pane()).getByRole('switch', { name: 'المحفوظة فقط' }) as HTMLInputElement;
    expect(savedOnly().disabled).toBe(true);
    fireEvent.click(screen.getAllByRole('button', { name: 'حفظ' })[1]);
    expect(savedOnly().disabled).toBe(false);
    fireEvent.click(savedOnly());
    expect(screen.getAllByRole('button', { name: 'إزالة من المحفوظة' })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'حفظ' })).toBeNull();
    expect([...pane().querySelectorAll('ul a')].map(link => link.getAttribute('href'))).toEqual(['/quran/compare?a=52&b=68', '/quran/compare?a=68&b=52']);
  });

  describe('range cards', () => {
    const ayat = (from: number, link: string) => [{ number: from, words: ['قال', 'موسى'], marks: { 0: { kind: 'exact' as const, link } } }, { number: from + 1, words: ['ثم', 'جاء'] }];
    const range: PairCard = {
      id: '7:106-107|26:31-32',
      pairs: [{ id: '7:106|26:31', verdict: { keep: true, why: 'first pair' } }, { id: '7:107|26:32', verdict: { keep: true, why: 'second pair', checked: true } }],
      sides: [{ surah: 7, ayah: 106, ayat: ayat(106, 'l') }, { surah: 26, ayah: 31, ayat: ayat(31, 'l') }],
    };

    it('titles the card with its ayah range and lists a verdict per pair', () => {
      render(<PairCompare a={7} b={26} cards={[range]} pairs={pairs} names={names} review />);
      expect(screen.getByRole('heading', { level: 3, name: 'الاعراف ١٠٦–١٠٧' })).toBeTruthy();
      expect(screen.getByText(/7:106 ~ 26:31/).textContent).toContain('first pair');
      expect(screen.getByText(/7:107 ~ 26:32/).textContent).toContain('checked by you');
    });

    it('counts a pair saved earlier as saving the range, and removes both together', () => {
      localStorage.setItem('bookmarks', JSON.stringify([{ id: 'compare:7:106|26:31', text: 'x', href: '/quran/compare?a=7&b=26#c-7-106-26-31', savedAt: 1 }]));
      render(<PairCompare a={7} b={26} cards={[range]} pairs={pairs} names={names} />);
      fireEvent.click(screen.getByRole('button', { name: 'إزالة من المحفوظة' }));
      expect(JSON.parse(localStorage.getItem('bookmarks')!)).toEqual([]);
    });

    it('scrolls a saved link to the card that now holds its ayah', () => {
      window.location.hash = '#c-7-107-26-32';
      const scroll = vi.fn();
      Element.prototype.scrollIntoView = scroll;
      render(<PairCompare a={7} b={26} cards={[range]} pairs={pairs} names={names} />);
      expect(scroll).toHaveBeenCalledTimes(1);
      expect((scroll.mock.contexts[0] as Element).id).toBe('c-7-106-26-31');
      window.location.hash = '';
    });
  });

  describe('one ayah against several', () => {
    const option = (n: number, link: string) => ({
      id: `10:72|26:${n}`,
      ayah: { number: n, words: ['إن', String(n)], marks: { 0: { kind: 'exact' as const, link } } },
      shared: { number: 72, words: ['إن', 'أجري'], marks: { [n === 109 ? 0 : 1]: { kind: 'exact' as const, link } } },
    });
    const options = [option(109, 'a'), option(127, 'b')];
    const many: PairCard = {
      id: '10:72|26:109,127',
      pairs: [{ id: '10:72|26:109', verdict: { keep: true, why: 'one' } }, { id: '10:72|26:127', verdict: { keep: true, why: 'two' } }],
      many: { side: 1, options },
      sides: [{ surah: 10, ayah: 72, ayat: [options[0].shared] }, { surah: 26, ayah: 109, ayat: [options[0].ayah] }],
    };
    const names2 = { ...names, 10: { ar: 'يُونُسَ', en: 'Yunus' } };

    it('opens on the first partner and moves the marks when another is picked', () => {
      const { container } = render(<PairCompare a={10} b={26} cards={[many]} pairs={pairs} names={names2} review />);
      const first = screen.getByRole('button', { name: /^الشعراء ١٠٩: / });
      const second = screen.getByRole('button', { name: /^الشعراء ١٢٧: / });
      expect(screen.getByRole('heading', { level: 3, name: 'الشعراء ١٠٩ · ١٢٧' })).toBeTruthy();
      expect(first.getAttribute('aria-pressed')).toBe('true');
      expect(second.getAttribute('aria-pressed')).toBe('false');
      expect(first.querySelector('mark')).toBeTruthy();
      expect(second.querySelector('mark')).toBeNull();
      expect(container.querySelector('mark[data-link="a"]')).toBeTruthy();
      fireEvent.click(second);
      expect(second.getAttribute('aria-pressed')).toBe('true');
      expect(first.querySelector('mark')).toBeNull();
      expect(second.querySelector('mark')).toBeTruthy();
      expect(container.querySelector('mark[data-link="a"]')).toBeNull();
      expect(container.querySelectorAll('mark[data-link="b"]')).toHaveLength(2);
      expect(screen.getByText(/10:72 ~ 26:127/).textContent).toContain('two');
    });

    it('reads the shared ayah once, then each partner in turn', () => {
      vi.useFakeTimers();
      try {
        const { container } = render(<PairCompare a={10} b={26} cards={[many]} pairs={pairs} names={names2} />);
        fireEvent.click(screen.getByRole('button', { name: 'استوديو القراءة' }));
        fireEvent.click(screen.getByRole('button', { name: 'اقرأ مع التظليل' }));
        const reading = () => container.querySelector('[data-reading]')!;
        expect(reading().closest('article')!.getAttribute('aria-label')).toContain('يونس');
        expect(reading().textContent).toBe('إن');
        act(() => { vi.advanceTimersByTime(1300); });
        expect(reading().textContent).toBe('أجري');
        act(() => { vi.advanceTimersByTime(2600); });
        expect(reading().closest('button')!.textContent).toContain('109');
        act(() => { vi.advanceTimersByTime(1300); });
        act(() => { vi.advanceTimersByTime(2600); });
        expect(screen.getByRole('button', { name: /^الشعراء ١٢٧: / }).getAttribute('aria-pressed')).toBe('true');
        expect(reading().textContent).toBe('إن');
        expect(screen.getAllByRole('button', { name: /^من الآية/ })).toHaveLength(3);
      } finally { vi.useRealTimers(); }
    });

    it('shows a refrain once and lists where it recurs', () => {
      const refrain = (n: number) => ({ id: `10:72|26:${n}`, ayah: { number: n, words: ['ويل', 'يومئذ'], marks: { 0: { kind: 'exact' as const, link: 'a' } } }, shared: options[0].shared });
      const same = [refrain(109), refrain(127)];
      render(<PairCompare a={10} b={26} cards={[{ ...many, many: { side: 1, options: same }, sides: [many.sides[0], { surah: 26, ayah: 109, ayat: [same[0].ayah] }] }]} pairs={pairs} names={names2} />);
      expect(screen.getByRole('heading', { level: 3, name: 'الشعراء' })).toBeTruthy();
      expect(screen.getByRole('link', { name: '١٢٧' }).getAttribute('href')).toBe('/quran/read/ayah/26/127');
      expect(screen.queryByRole('button', { name: /^الشعراء ١٢٧: / })).toBeNull();
      expect(screen.getAllByText('ويل')).toHaveLength(1);
    });

    it('gives each partner its ayah text as well as its reference', () => {
      render(<PairCompare a={10} b={26} cards={[many]} pairs={pairs} names={names2} />);
      expect(screen.getByRole('button', { name: /^الشعراء ١٢٧: / }).textContent).toContain('127');
    });

    it('still scrolls a saved link to the card when its first partner has been removed', () => {
      window.location.hash = '#c-10-72-26-100';
      const scroll = vi.fn();
      Element.prototype.scrollIntoView = scroll;
      render(<PairCompare a={10} b={26} cards={[many]} pairs={pairs} names={names2} />);
      expect((scroll.mock.contexts[0] as Element).id).toBe('c-10-72-26-109');
      window.location.hash = '';
    });
  });
});

