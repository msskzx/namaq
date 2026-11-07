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
    { surah: 52, from: 40, to: 40, ayat: [{ number: 40, words: ['أم', 'تسألهم', 'أجرا'], marks: { 0: { kind: 'exact', link: '0' }, 1: { kind: 'exact', link: '1' } } }] },
    { surah: 68, from: 46, to: 46, ayat: [{ number: 46, words: ['أم', 'تسألهم', 'أجرا'], marks: { 0: { kind: 'exact', link: '0' }, 1: { kind: 'exact', link: '1' } } }] },
  ],
}];

afterEach(() => { cleanup(); localStorage.clear(); });

const pane = () => screen.getByRole('complementary', { name: 'اختر سورتين' });
const listed = () => within(within(pane()).getByRole('heading', { name: 'كل السور المتشابهة' }).nextElementSibling as HTMLElement).getAllByRole('link').map(link => link.getAttribute('href'));

describe('PairCompare', () => {
  it('lists pairs in mushaf order, sorts by similarity on request and remembers it', () => {
    render(<PairCompare a={52} b={68} cards={cards} pairs={pairs} names={names} />);
    expect(listed()).toEqual(['/quran/compare?a=2&b=7', '/quran/compare?a=7&b=11', '/quran/compare?a=7&b=26', '/quran/compare?a=52&b=68']);
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

  it('offers the next pair in mushaf order', () => {
    render(<PairCompare a={7} b={11} cards={cards} pairs={pairs} names={names} />);
    expect(screen.getByRole('link', { name: /التالي/ }).getAttribute('href')).toBe('/quran/compare?a=7&b=26');
  });
});
