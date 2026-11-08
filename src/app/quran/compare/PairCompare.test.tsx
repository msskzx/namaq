// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import PairCompare from './PairCompare';
import type { PairCard } from './pairCards';

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
    expect(groups()[1].links).toEqual(['/quran/compare?a=2&b=7', '/quran/compare?a=7&b=11', '/quran/compare?a=7&b=26']);
    expect(groups()[5].links).toEqual(['/quran/compare?a=52&b=68']);
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

  it('in review, marks the surah pairs the owner reviewed and those with a question', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} review states={{ '52:68': 'checked', '7:11': 'ask' }} />);
    expect(within(pane()).getAllByRole('img', { name: 'راجعتها' }).length).toBeGreaterThan(0);
    expect(within(pane()).getAllByRole('img', { name: 'فيها سؤال لك' }).length).toBeGreaterThan(0);
  });

  it('shows no review marks outside review', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} states={{ '52:68': 'checked' }} />);
    expect(within(pane()).queryByRole('img', { name: 'راجعتها' })).toBeNull();
  });

  it('offers the next pair in mushaf order', () => {
    render(<PairCompare a={7} b={11} cards={cards} pairs={pairs} names={names} />);
    expect(screen.getByRole('link', { name: /التالي/ }).getAttribute('href')).toBe('/quran/compare?a=7&b=26');
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
    expect([...pane().querySelectorAll('ul a')].map(link => link.getAttribute('href'))).toEqual(['/quran/compare?a=52&b=68', '/quran/compare?a=52&b=68']);
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
});
