// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ShiftsView from './ShiftsView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const surah = { number: 9, name: 'سورة', plain: 'سورة' };
const ayat = ['أ ب ج د ه', 'و ز ح ط ي', 'أ ب ج د ك', 'ل م ن س ع', 'ل م ن'];
const arcs = [{ a: { ayah: 1, word: 0 }, b: { ayah: 3, word: 0 }, len: 4 }];
const refrains = [{ text: 'ل م ن', len: 3, at: [{ ayah: 4, word: 0 }, { ayah: 5, word: 0 }] }];
const openers = [{ ayah: 2, word: 0, form: 'male' as const }];

const renderView = () => render(<ShiftsView surah={surah} ayat={ayat} arcs={arcs} refrains={refrains} openers={openers} />);
const marked = () => [...document.querySelectorAll('mark')].map(m => m.textContent);

describe('ShiftsView', () => {
  it('shows the first arc at once, with the shared words colored in both ayat', () => {
    renderView();
    expect(marked()).toEqual(['أ', 'ب', 'ج', 'د', 'أ', 'ب', 'ج', 'د']);
  });

  it('shows one ayah, with the refrain colored, when a tick is pressed', () => {
    renderView();
    fireEvent.click(screen.getAllByRole('button', { name: 'الآية ٤' })[0]);
    expect(marked()).toEqual(['ل', 'م', 'ن']);
  });

  it('colors the opener word when a block is pressed', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: /قال: مفرد مذكر/ }));
    expect(marked()).toEqual(['و']);
  });

});
