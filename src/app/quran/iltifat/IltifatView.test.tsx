// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { buildCurated, CURATED, MODES, USED_MODES } from '@/lib/quran/curatedShifts';
import data from './ayat.json';
import IltifatView from './IltifatView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const renderView = () => render(<IltifatView curated={buildCurated(data)} modes={USED_MODES} />);

describe('IltifatView', () => {
  it('lists each mode once in the legend, with a sample in its color', () => {
    renderView();
    const items = screen.getByRole('list', { name: 'ألوان الضمائر' }).querySelectorAll('li');
    expect([...items].map(li => li.textContent)).toEqual(USED_MODES.map(m => `${MODES[m].sample}${MODES[m].label}`));
  });

  it('gives the same mode the same color in every shift', () => {
    renderView();
    const swatch = screen.getByText(MODES.first.sample).className.replace('font-arabic text-xl ', '');
    const we = [...document.querySelectorAll('mark')].filter(m => ['فَسُقۡنَـٰهُ', 'أَرۡسَلۡنَـٰكَ', 'نَعۡبُدُ'].includes(m.textContent!));
    expect(we.map(m => m.className.replace('bg-transparent ', ''))).toEqual([swatch, swatch, swatch]);
  });

  it('lists each curated shift under its surah range', () => {
    renderView();
    expect(screen.getByRole('heading', { name: /الفاتحة ٢–٧/ })).toBeTruthy();
  });
});
