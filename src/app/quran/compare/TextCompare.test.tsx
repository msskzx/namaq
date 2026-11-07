// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TextCompare from './TextCompare';
import quran from '../branches/trees.json';
import spread from '@/components/quran/PageSpread.module.css';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: () => {} }) }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ayah: { findMany: async ({ where }: { where: { surah: { number: number } } }) => quran.ayat.filter(ayah => Number(ayah.key.split(':')[0]) === where.surah.number).map(ayah => ({ text: ayah.words.join(' ') })) },
    surah: { findMany: async () => Array.from({ length: 114 }, (_, i) => ({ number: i + 1, name: `سورة ${i + 1}` })) },
  },
}));
vi.mock('./SimilarAyat', () => ({ default: ({ controls }: { controls: React.ReactNode }) => <>{controls}</> }));

const locale = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => locale }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: string }) => children }));

afterEach(() => { cleanup(); locale.language = 'ar'; });

const value = (label: string) => label.startsWith('السورة')
  ? (screen.getByRole('combobox', { name: label }).parentElement!.querySelector('input[type=hidden]') as HTMLInputElement).value
  : (screen.getByRole('spinbutton', { name: label }) as HTMLInputElement).value;

describe('TextCompare', () => {
  it('keeps equal-length explicit custom ranges paired ayah by ayah', async () => {
    const { container } = render(await TextCompare({ query: { view: 'ayat', a: '112', af: '1', at: '2', b: '114', bf: '1', bt: '2' }, range: { unit: 'juz', range: null } }));
    const articles = Array.from(container.querySelectorAll('article'));
    expect(articles).toHaveLength(2);
    for (const article of articles) {
      expect(Array.from(article.querySelectorAll(`.${spread.verseSeal}`)).map(seal => seal.textContent)).toEqual(['١', '٢']);
    }
    expect(screen.getByRole('combobox', { name: 'السورة الأولى' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'السورة الثانية' })).toBeTruthy();
  });

  it('shows the newly chosen surahs and ranges in its fields when the page moves to another comparison', async () => {
    const { rerender } = render(await TextCompare({ query: { a: '56', b: '69' }, range: { unit: 'juz', range: null } }));
    rerender(await TextCompare({ query: { a: '2', af: '3', at: '5', b: '3', bf: '4', bt: '6' }, range: { unit: 'juz', range: null } }));
    expect(['السورة الأولى', 'من آية (الأولى)', 'إلى آية (الأولى)', 'السورة الثانية', 'من آية (الثانية)', 'إلى آية (الثانية)'].map(value)).toEqual(['2', '3', '5', '3', '4', '6']);
  });
});
