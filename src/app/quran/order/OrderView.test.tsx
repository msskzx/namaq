// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { buildOrder } from '@/lib/quran/surahOrder';
import data from './ayat.json';
import OrderView from './OrderView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const { chips, hops } = buildOrder(data);
const renderView = () => render(<OrderView chips={chips} hops={hops} />);
const strip = () => within(screen.getByRole('list', { name: 'ترتيب السور' }));

describe('OrderView', () => {
  it('names each surah once and has one link per neighbouring pair', () => {
    renderView();
    expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(37);
    expect(document.querySelectorAll('details')).toHaveLength(36);
    expect(screen.getAllByText(/^٧٩ /)).toHaveLength(1);
    expect(screen.getAllByRole('heading', { name: /النازعات/ })).toHaveLength(1);
  });

  it('links the surahs that open alike to the openings page', () => {
    renderView();
    const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
    expect(hrefs.filter(h => h === '/quran/openings')).toHaveLength(4);
  });

  it('labels a step without a source and links the ones with one', () => {
    renderView();
    expect(screen.getAllByText('بلا مصدر')).toHaveLength(36 - 4);
    expect(within(document.getElementById('hop-105')!).getByRole('link').getAttribute('href')).toMatch(/^https:\/\//);
  });

  it('colors a shared word the same on both sides', () => {
    renderView();
    const marks = [...document.getElementById('hop-109')!.querySelectorAll('mark')];
    expect(marks).toHaveLength(2);
    expect(marks[0].className).toBe(marks[1].className);
  });
});
