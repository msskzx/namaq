// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { LemmaCount } from '@/lib/quran/lemmas';
import WordCounts, { CHART_TOP } from './WordCounts';

vi.mock('next/navigation', () => ({ useRouter: () => ({}), usePathname: () => '/quran', useSearchParams: () => new URLSearchParams() }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const lemmas: LemmaCount[] = [['ٱللَّه', 9, 'اله'], ['مِن', 4, ''], ['رَحْمَة', 3, 'رحم'], ...Array.from({ length: 20 }, (_, i): LemmaCount => [`م${i}`, 1, ''])];
const show = () => render(<WordCounts lemmas={lemmas} />);
const section = () => screen.getByRole('heading', { name: 'عدد مرات ورود كل كلمة' }).closest('section') as HTMLElement;
const chart = () => within(section()).queryByRole('list', { name: 'عدد مرات ورود الكلمات المختارة' });
const bars = () => (chart() ? within(chart()!).getAllByRole('listitem').map(li => li.getAttribute('title')) : []);
const adder = () => within(section()).getByPlaceholderText('أضف كلمة إلى الرسم');
const suggestions = () => within(section()).queryByRole('list', { name: 'كلمات مقترحة' });

describe('WordCounts', () => {
  it('shows only the chart, with a link to how the corpus counts', () => {
    show();
    expect(within(section()).queryByRole('list', { name: 'جدول الكلمات' })).toBeNull();
    expect(within(section()).getByRole('link', { name: 'طريقة العدّ ومصدره في صفحة العزو' }).getAttribute('href')).toBe('/attributions#quranic-arabic-corpus');
  });
});

describe('WordCounts chart', () => {
  it('starts with the top lemmas, longest bar first', () => {
    show();
    expect(bars()).toHaveLength(CHART_TOP);
    expect(bars().slice(0, 3)).toEqual(['ٱللَّه: ٩', 'مِن: ٤', 'رَحْمَة: ٣']);
  });

  it('empties the plot, then restores the top lemmas', () => {
    show();
    fireEvent.click(within(section()).getByRole('button', { name: /إفراغ الرسم/ }));
    expect(chart()).toBeNull();
    expect(within(section()).getByText('الرسم فارغ. ابحث عن كلمة لإضافتها.')).toBeTruthy();
    expect((within(section()).getByRole('button', { name: /إفراغ الرسم/ }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(within(section()).getByRole('button', { name: /أكثر ١٠ كلمات/ }));
    expect(bars()).toHaveLength(CHART_TOP);
  });

  it('adds a searched lemma from the suggestions or with Enter, keeping bars in count order', () => {
    show();
    fireEvent.click(within(section()).getByRole('button', { name: /إفراغ الرسم/ }));
    fireEvent.change(adder(), { target: { value: 'رحمه' } });
    fireEvent.click(within(suggestions()!).getByRole('button', { name: /رَحْمَة/ }));
    expect(bars()).toEqual(['رَحْمَة: ٣']);
    expect(suggestions()).toBeNull();
    fireEvent.change(adder(), { target: { value: 'اللَّه' } });
    fireEvent.keyDown(adder(), { key: 'Enter' });
    expect(bars()).toEqual(['ٱللَّه: ٩', 'رَحْمَة: ٣']);
  });

  it('leaves chosen lemmas out of the suggestions and says when nothing matches', () => {
    show();
    fireEvent.change(adder(), { target: { value: 'الله' } });
    expect(within(suggestions()!).getByText('لا كلمة تطابق البحث.')).toBeTruthy();
  });

  it('removes one lemma from the plot', () => {
    show();
    fireEvent.click(within(section()).getByRole('button', { name: 'أزل «مِن» من الرسم' }));
    expect(bars()).toHaveLength(CHART_TOP - 1);
    expect(bars()).not.toContain('مِن: ٤');
  });
});
