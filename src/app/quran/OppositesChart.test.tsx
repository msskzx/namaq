// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import OppositesChart from './OppositesChart';

vi.mock('next/navigation', () => ({ useRouter: () => ({}), usePathname: () => '/quran', useSearchParams: () => new URLSearchParams() }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const side = (label: string, count: number, form = false): CountedSide => ({ label, lemma: label, form, count });
const opposites: [CountedSide, CountedSide][] = [
  [side('الليل', 84), side('النهار', 57)],
  [{ label: 'الدنيا', lemma: 'دُنْيَا', form: false, count: 115 }, { label: 'الآخرة', lemma: 'آخِر', form: true, count: 115 }],
];
const lemmas: LemmaCount[] = [['شَمْس', 33, 'شمس'], ['قَمَر', 27, 'قمر']];
const show = () => render(<OppositesChart opposites={opposites} lemmas={lemmas} />);
const section = () => screen.getByRole('heading', { name: 'كلمات متقابلة' }).closest('section') as HTMLElement;
const chart = () => within(section()).queryByRole('list', { name: 'أزواج الكلمات المتقابلة' });
const rows = () => (chart() ? within(chart()!).getAllByRole('listitem').map(li => li.getAttribute('title')) : []);
const adder = () => within(section()).getByRole('searchbox');

describe('OppositesChart', () => {
  it('shows our pairs with both counts, says the pairs are ours, and names what each side counts', () => {
    show();
    expect(rows()).toEqual(['الليل: ٨٤ · النهار: ٥٧', 'الدنيا: ١١٥ · الآخرة: ١١٥']);
    expect(within(section()).getByText(/الأزواج من اختيارنا/)).toBeTruthy();
    expect(within(section()).getByText('صيغة «الآخرة» وحدها من «آخِر»')).toBeTruthy();
    expect(within(section()).getByText('مدخل «دُنْيَا»')).toBeTruthy();
  });

  it('scales each pair to its larger side', () => {
    show();
    const [night, day] = within(within(chart()!).getAllByRole('listitem')[0]).getAllByText('', { selector: 'span.h-5' });
    expect(night.style.width).toBe('100%');
    expect(day.style.width).toBe(`${(57 / 84) * 100}%`);
  });

  it('empties the chart and restores our pairs', () => {
    show();
    fireEvent.click(within(section()).getByRole('button', { name: /إفراغ الرسم/ }));
    expect(chart()).toBeNull();
    expect(within(section()).getByText('الرسم فارغ. ابحث عن كلمتين لإضافة زوج.')).toBeTruthy();
    fireEvent.click(within(section()).getByRole('button', { name: /أزواجنا/ }));
    expect(rows()).toHaveLength(2);
  });

  it('builds a pair from two searched words, and cancels a half-built one', () => {
    show();
    expect(within(section()).getByRole('status').textContent).toBe('');
    fireEvent.change(adder(), { target: { value: 'شمس' } });
    fireEvent.click(within(section()).getByRole('button', { name: /شَمْس/ }));
    expect(within(section()).getByRole('status').textContent).toMatch('الطرف الأول: شَمْس. اختر مقابله.');
    fireEvent.click(within(section()).getByRole('button', { name: /إلغاء/ }));
    expect(within(section()).queryByText(/الطرف الأول/)).toBeNull();
    fireEvent.change(adder(), { target: { value: 'شمس' } });
    fireEvent.keyDown(adder(), { key: 'Enter' });
    fireEvent.change(adder(), { target: { value: 'قمر' } });
    fireEvent.keyDown(adder(), { key: 'Enter' });
    expect(rows()[2]).toBe('شَمْس: ٣٣ · قَمَر: ٢٧');
  });

  it('removes one pair', () => {
    show();
    fireEvent.click(within(section()).getByRole('button', { name: 'أزل زوج «الليل» و«النهار»' }));
    expect(rows()).toEqual(['الدنيا: ١١٥ · الآخرة: ١١٥']);
  });
});
