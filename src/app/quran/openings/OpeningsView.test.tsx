// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { buildOpenings, SPANS } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const items = buildOpenings(data);
const region = (n: number) => within(screen.getByRole('region', { name: new RegExp(String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])) }));

describe('OpeningsView', () => {
  it('shows every ayah from the first to the end of each span, with no basmala', () => {
    render(<OpeningsView items={items} />);
    expect(items.map(i => i.lines.length)).toEqual([SPANS[81].to, SPANS[82].to, SPANS[84].to]);
    for (const i of items) expect(i.lines[0].text.split(' ')[0]).toBe(items[0].lines[0].text.split(' ')[0]);
  });

  it('marks the answer ayah in 81 and 82 and none in 84', () => {
    render(<OpeningsView items={items} />);
    expect(region(81).getAllByText('الجواب')).toHaveLength(1);
    expect(region(82).getAllByText('الجواب، قراءتنا')).toHaveLength(1);
    expect(region(84).queryByText('الجواب')).toBeNull();
    expect(region(84).queryByText('الجواب، قراءتنا')).toBeNull();
    expect(items[0].lines.find(l => l.answer)!.ayah).toBe(14);
    expect(items[1].lines.find(l => l.answer)!.ayah).toBe(5);
  });

  it('colors the shared words, including the answer clause of 81 and 82', () => {
    render(<OpeningsView items={items} />);
    const marks = (n: number) => region(n).queryAllByText((_, el) => el?.tagName === 'MARK');
    expect(marks(81)).toHaveLength(1 + 3);
    expect(marks(82)).toHaveLength(2 + 3);
    expect(marks(84)).toHaveLength(2);
  });

  it('lists the shared words and the views on the answer in 84', () => {
    render(<OpeningsView items={items} />);
    expect(within(screen.getByRole('list', { name: 'اللفظ المشترك' })).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'الجواب في الانشقاق' })).toBeTruthy();
    expect(screen.getByText(/المبرد/).textContent).toContain('تقديم وتأخير');
    expect(screen.getByText(/الكسائي/).textContent).toContain('النحاس');
    expect(screen.getByRole('list', { name: 'مصدر الخلاف' }).querySelector('a')!.getAttribute('href')).toMatch(/^https:\/\//);
  });
});
