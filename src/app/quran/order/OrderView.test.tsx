// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
  it('shows one chip per surah and one step per neighbouring pair', () => {
    renderView();
    expect(strip().getAllByRole('listitem')).toHaveLength(37);
    expect(document.querySelectorAll('details')).toHaveLength(36);
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

  it('hides the names on request and reveals one name on a tap', () => {
    renderView();
    expect(strip().getByText(/النبإ/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'اخفِ الأسماء' }));
    expect(strip().queryByText(/النبإ/)).toBeNull();
    fireEvent.click(strip().getByRole('button', { name: /٧٨/ }));
    expect(strip().getByText(/النبإ/)).toBeTruthy();
    expect(strip().queryByText(/النازعات/)).toBeNull();
  });
});
