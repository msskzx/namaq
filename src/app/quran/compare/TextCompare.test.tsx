// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TextCompare from './TextCompare';
import quran from '../branches/trees.json';
import spread from '@/components/quran/PageSpread.module.css';
import { num } from '@/lib/quran/arabicNumber';

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

  it.each(['ar', 'en'])('renders the full Salih passages with lexical labels and no custom controls in %s', async language => {
    locale.language = language;
    const { container } = render(await TextCompare({ query: { view: 'ayat', a: '7', af: '73', at: '79', b: '26', bf: '141', bt: '159' }, range: { unit: 'juz', range: null }, curated: true }));
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.getAllByText(language === 'ar' ? 'مطابقات لفظية' : 'Lexical matches').length).toBeGreaterThan(0);
    const seals = Array.from(container.querySelectorAll(`.${spread.verseSeal}`)).map(seal => seal.textContent);
    expect(seals).toHaveLength(26);
    for (let verse = 73; verse <= 79; verse++) expect(seals.filter(seal => seal === num(verse))).toHaveLength(1);
    for (let verse = 141; verse <= 159; verse++) expect(seals.filter(seal => seal === num(verse))).toHaveLength(1);
  });

  it('shows the newly chosen surahs and ranges in its fields when the page moves to another comparison', async () => {
    const { rerender } = render(await TextCompare({ query: { a: '56', b: '69' }, range: { unit: 'juz', range: null } }));
    rerender(await TextCompare({ query: { a: '2', af: '3', at: '5', b: '3', bf: '4', bt: '6' }, range: { unit: 'juz', range: null } }));
    expect(['السورة الأولى', 'من آية (الأولى)', 'إلى آية (الأولى)', 'السورة الثانية', 'من آية (الثانية)', 'إلى آية (الثانية)'].map(value)).toEqual(['2', '3', '5', '3', '4', '6']);
  });
});
