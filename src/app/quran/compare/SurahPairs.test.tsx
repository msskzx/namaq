// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { groupBySurah } from '@/lib/quran/surahPairs';
import { SurahPairs } from './SurahPairs';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  push.mockClear();
});

const names = { 2: 'البقرة', 3: 'آل عمران', 55: 'الرحمن', 62: 'الجمعة' };
const groups = groupBySurah([[2, 3], [2, 3], [2, 3], [3, 62], [62, 3], [55, 55], [55, 2]]);
const show = (props: Partial<React.ComponentProps<typeof SurahPairs>> = {}) =>
  render(<SurahPairs groups={groups} names={names} mode="text" surah={null} a={3} b={62} {...props} />);
const card = (name: string) => screen.getByText(name, { selector: 'summary span' }).closest('details')!;
const order = () => [...document.querySelectorAll('summary')].map(s => s.querySelector('span:nth-child(2)')!.textContent);

describe('SurahPairs', () => {
  it('opens the cards of the two compared surahs and marks the pair in each', () => {
    show();
    expect([...document.querySelectorAll('details')].filter(d => d.open).map(d => d.querySelector('summary span:nth-child(2)')!.textContent)).toEqual(['آل عمران', 'الجمعة']);
    expect(within(card('آل عمران')).getByRole('button', { name: /الجمعة/ }).getAttribute('aria-current')).toBe('true');
    expect(within(card('الجمعة')).getByRole('button', { name: /آل عمران/ }).getAttribute('aria-current')).toBe('true');
  });

  it('opens a pair from either surah, keeping the mode', () => {
    show({ mode: 'themes' });
    fireEvent.click(within(card('الجمعة')).getByRole('button', { name: /آل عمران/ }));
    expect(push).toHaveBeenCalledWith('/quran/compare?mode=themes&a=62&b=3', { scroll: false });
  });

  it('offers the pairs inside a surah, and the example, only when comparing text', () => {
    show({ surah: 55 });
    fireEvent.click(within(card('الرحمن')).getByRole('button', { name: /داخل السورة/ }));
    expect(push).toHaveBeenCalledWith('/quran/compare?s=55', { scroll: false });
    expect(screen.getByRole('link', { name: /مثال/ })).toBeTruthy();
    cleanup();
    show({ mode: 'themes' });
    expect(within(card('الرحمن')).queryByRole('button', { name: /داخل السورة/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /مثال/ })).toBeNull();
  });

  it('orders surahs by their count, or by number with the switch', () => {
    show();
    expect(order()).toEqual(['آل عمران', 'البقرة', 'الرحمن', 'الجمعة']);
    fireEvent.click(screen.getByRole('switch', { name: 'بترتيب المصحف' }));
    expect(order()).toEqual(['البقرة', 'آل عمران', 'الرحمن', 'الجمعة']);
    fireEvent.click(screen.getByText('الأكثر آيات متشابهة أولًا'));
    expect(order()).toEqual(['آل عمران', 'البقرة', 'الرحمن', 'الجمعة']);
  });

  it('reopens a compared surah that the reader closed when the comparison moves to another pair of it', () => {
    const { rerender } = show();
    card('آل عمران').open = false;
    rerender(<SurahPairs groups={groups} names={names} mode="text" surah={null} a={62} b={3} />);
    expect(card('آل عمران').open).toBe(true);
    card('آل عمران').open = false;
    rerender(<SurahPairs groups={groups} names={names} mode="themes" surah={null} a={62} b={3} />);
    expect(card('آل عمران').open).toBe(true);
  });

  it('says so under a surah with nothing to pair', () => {
    render(<SurahPairs groups={groupBySurah([], [106])} names={{ 106: 'قريش' }} mode="text" surah={null} a={106} b={108} />);
    expect(within(card('قريش')).getByText('لا آيات متشابهة.')).toBeTruthy();
  });

  it('narrows the list to the surahs whose name or number matches the search', () => {
    show();
    const search = screen.getByRole('searchbox', { name: 'ابحث عن سورة' });
    fireEvent.change(search, { target: { value: 'عمران' } });
    expect(order()).toEqual(['آل عمران']);
    fireEvent.change(search, { target: { value: '٥٥' } });
    expect(order()).toEqual(['الرحمن']);
    fireEvent.change(search, { target: { value: 'يوسف' } });
    expect(order()).toEqual([]);
    expect(screen.getByText('لا سورة بهذا الاسم.')).toBeTruthy();
    fireEvent.change(search, { target: { value: '' } });
    expect(order()).toEqual(['آل عمران', 'البقرة', 'الرحمن', 'الجمعة']);
  });
});
