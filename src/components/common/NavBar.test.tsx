// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NavBar from './NavBar';
import { getAllNavLinks } from '@/lib/siteLinks';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', languageLoaded: true }),
}));
vi.mock('../language/LanguageSwitcher', () => ({ default: () => null }));
vi.mock('../theme/ThemeSwitcher', () => ({ default: () => null }));

afterEach(cleanup);

describe('NavBar Quran links', () => {
  it('shows a top-level Quran link whose submenu lists every page', () => {
    render(<NavBar />);
    const top = screen.getAllByText('Quran').find(el => el.getAttribute('href') === '/quran')!;
    fireEvent.mouseEnter(top.parentElement!);

    const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
    expect(hrefs.filter(h => h === '/quran').length).toBe(2);
    expect(hrefs).toContain('/quran/compare');
    expect(hrefs).toContain('/quran/shifts');
    expect(hrefs).toContain('/quran/iltifat');
    expect(hrefs).toContain('/quran/qiraat');
    expect(hrefs).toContain('/quran/themes');
  });

  it('keeps every page in the shared list for the mobile menu and graph menu', () => {
    const hrefs = getAllNavLinks('ar').map(l => l.href);
    expect(hrefs).toEqual(expect.arrayContaining(['/quran', '/quran/compare', '/quran/shifts', '/quran/iltifat', '/quran/qiraat', '/quran/themes']));
  });
});
