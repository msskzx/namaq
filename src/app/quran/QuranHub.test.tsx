// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranHub from './QuranHub';

const lang = vi.hoisted(() => ({ language: 'ar' as 'ar' | 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => lang }));

afterEach(() => {
  cleanup();
  lang.language = 'ar';
});

const routes = [
  '/quran/read', '/quran/compare', '/quran/words', '/quran/branches',
  '/quran/iltifat', '/quran/qiraat', '/quran/order', '/quran/openings',
  '/quran/oaths', '/quran/tajwid/tuhfat-al-atfal', '/quran/prophets/musa',
];

describe('QuranHub', () => {
  it.each(['ar', 'en'] as const)('preserves every Quran destination in %s', language => {
    lang.language = language;
    render(<QuranHub />);
    const links = screen.getAllByRole('link');
    expect(links.map(link => link.getAttribute('href'))).toEqual(routes);
    expect(links.every(link => link.textContent && !link.textContent.includes('/quran/'))).toBe(true);
  });

  it('identifies the Arabic reading and prophet destinations', () => {
    render(<QuranHub />);
    expect(screen.getByRole('heading', { level: 1, name: 'القرآن' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'قراءة القرآن' }).closest('a')?.getAttribute('href')).toBe('/quran/read');
    expect(screen.getByRole('heading', { name: 'قصص الأنبياء في القرآن' }).closest('a')?.getAttribute('href')).toBe('/quran/prophets/musa');
  });

  it('writes the titles and descriptions in English', () => {
    lang.language = 'en';
    render(<QuranHub />);
    expect(screen.getByRole('heading', { level: 1, name: 'Quran' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Words of the Quran' })).toBeTruthy();
    expect(screen.getByText('How often each word occurs, and opposite words side by side')).toBeTruthy();
  });
});
