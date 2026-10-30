// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NavBar, { NAV_SECTIONS, activeSection } from './NavBar';

const { state } = vi.hoisted(() => ({ state: { path: '/', language: 'en' as 'ar' | 'en', toggleLanguage: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: state.language, languageLoaded: true, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }) }));
afterEach(() => { cleanup(); state.path = '/'; state.language = 'en'; vi.clearAllMocks(); });

const destinations = ['/quran/branches', '/quran/read', '/quizzes?topic=BRANCHES', '/quizzes/party'];

describe('launch navigation', () => {
  it.each(['ar', 'en'] as const)('exposes only launch destinations on desktop and phone in %s', language => {
    state.language = language;
    render(<NavBar />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', ...destinations]);
    fireEvent.click(screen.getByRole('button', { name: language === 'ar' ? 'فتح القائمة' : 'Open menu' }));
    const button = screen.getByRole('button', { name: language === 'ar' ? 'إغلاق القائمة' : 'Close menu' });
    const menu = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(within(menu).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(destinations);
    expect(within(menu).getAllByRole('link').map(link => link.textContent)).toEqual(NAV_SECTIONS.map(section => section.label[language]));
    const destination = within(menu).getAllByRole('link')[0];
    destination.addEventListener('click', event => event.preventDefault());
    fireEvent.click(destination);
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBeNull();
  });

  it('marks only party as active on party routes and solo on ordinary quizzes', () => {
    state.path = '/quizzes/party';
    render(<NavBar />);
    const marked = screen.getAllByRole('link').filter(link => link.getAttribute('aria-current') === 'page');
    expect(marked.map(link => link.getAttribute('href'))).toEqual(['/quizzes/party']);
    expect(activeSection('/quizzes?topic=BRANCHES')).toBe('/quizzes?topic=BRANCHES');
    expect(activeSection('/quizzes/party/123456')).toBe('/quizzes/party');
    expect(activeSection('/quran/read/3')).toBe('/quran/read');
    expect(activeSection('/quran/branches?o=test')).toBe('/quran/branches');
    expect(activeSection('/quran/compare')).toBeUndefined();
    expect(activeSection('/graphs')).toBeUndefined();
    expect(activeSection('/experiments')).toBeUndefined();
  });

  it('closes the phone menu with Escape and returns focus to its control', () => {
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggle);
    const menu = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    const link = within(menu).getAllByRole('link')[0];
    link.focus();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('keeps the existing compact party room menu with launch links', () => {
    state.path = '/quizzes/party/123456';
    render(<NavBar />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(destinations);
  });

  it('keeps theme and one-tap language controls', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'التبديل إلى العربية' }));
    expect(state.toggleLanguage).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Namaq' }).querySelectorAll('svg')).toHaveLength(2);
  });
});
