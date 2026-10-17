// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranHub from './QuranHub';
import { getAllNavLinks } from '@/lib/siteLinks';

const lang = vi.hoisted(() => ({ language: 'ar' as 'ar' | 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => lang }));

afterEach(() => {
  cleanup();
  lang.language = 'ar';
});

const quranPages = (language: 'ar' | 'en') => getAllNavLinks(language).filter(l => l.href.startsWith('/quran/'));

describe('QuranHub', () => {
  it('links a card to every Quran page in the menu, under the menu label', () => {
    render(<QuranHub />);
    const cards = screen.getAllByRole('link');
    expect(cards.map(c => c.getAttribute('href'))).toEqual(quranPages('ar').map(l => l.href));
    for (const { href, label } of quranPages('ar')) {
      expect(screen.getByRole('heading', { name: label }).closest('a')?.getAttribute('href')).toBe(href);
    }
  });

  it('writes the titles and descriptions in English', () => {
    lang.language = 'en';
    render(<QuranHub />);
    expect(screen.getByRole('heading', { level: 1, name: 'Quran' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Words of the Quran' })).toBeTruthy();
    expect(screen.getByText('How often each word occurs, and opposite words side by side')).toBeTruthy();
  });
});
