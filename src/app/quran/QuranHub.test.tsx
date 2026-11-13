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

describe('QuranHub', () => {
  it.each(['ar', 'en'] as const)('shows the app\'s Quran tools as icon tiles in %s', language => {
    lang.language = language;
    render(<QuranHub />);
    expect(screen.getByRole('heading', { level: 1, name: language === 'ar' ? 'القرآن' : 'Quran' })).toBeTruthy();
    const links = screen.getAllByRole('link');
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/quran/branches', '/quran/compare', '/quran/prophets', '/quran/tajwid/tuhfat-al-atfal', '/quran/oaths', '/quran/iltifat', '/quran/openings']);
    expect(links.every(link => link.querySelector('svg') && link.textContent)).toBe(true);
  });

  it('names the tools as the app does', () => {
    render(<QuranHub />);
    expect(screen.getAllByRole('link').map(link => link.textContent)).toEqual(['متشابهات القرآن', 'مقارنة السور', 'قصص الأنبياء', 'تحفة الأطفال', 'الأقسام', 'الالتفات', 'افتتاح السور']);
  });
});
