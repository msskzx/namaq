// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import TabBar from './TabBar';

const { state } = vi.hoisted(() => ({ state: { path: '/', language: 'en' as 'ar' | 'en', loaded: true, toggleLanguage: vi.fn(), setTheme: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path, useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: state.language, languageLoaded: state.loaded, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'system', setTheme: state.setTheme }) }));
afterEach(() => { cleanup(); state.path = '/'; state.language = 'en'; state.loaded = true; vi.clearAllMocks(); });

describe('TabBar', () => {
  it.each(['ar', 'en'] as const)('lights the Quran tab on the Quran hub and each of its tools in %s', language => {
    state.language = language;
    for (const path of ['/quran', '/quran/branches', '/quran/compare', '/quran/prophets', '/quran/tajwid/tuhfat-al-atfal']) {
      state.path = path;
      render(<TabBar />);
      const link = screen.getByRole('link', { name: language === 'ar' ? 'القرآن' : 'Quran' });
      expect(link.getAttribute('href')).toBe('/quran');
      expect(link.getAttribute('aria-current')).toBe('page');
      cleanup();
    }
  });

  it.each(['ar', 'en'] as const)('shows icon-only section tabs with names for screen readers in %s', language => {
    state.language = language;
    state.path = '/quizzes/party';
    render(<TabBar />);
    const [logo, ...tabs] = within(screen.getByRole('navigation')).getAllByRole('link');
    expect(logo.getAttribute('href')).toBe('/');
    // The app's five buttons, first on the right.
    expect(tabs.map(tab => tab.getAttribute('href'))).toEqual(['/quran', '/quran/read', '/', '/quizzes', '/utilities']);
    expect(tabs.every(tab => tab.textContent === '' && tab.getAttribute('aria-label') && tab.querySelector('svg'))).toBe(true);
    expect(tabs.filter(tab => tab.getAttribute('aria-current')).map(tab => tab.getAttribute('href'))).toEqual(['/quizzes']);
    expect(tabs[0].querySelector('svg')?.getAttribute('class')).toContain('-rotate-90');
  });

  it('opens settings with language, theme, about and privacy, and closes with Escape', () => {
    render(<TabBar />);
    const toggle = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(toggle);
    const sheet = screen.getByRole('dialog', { name: 'Settings' });
    expect(within(sheet).getByRole('group', { name: 'Default similar-ayat view' })).toBeTruthy();
    fireEvent.click(within(sheet).getByRole('button', { name: 'العربية' }));
    expect(state.toggleLanguage).toHaveBeenCalledOnce();
    fireEvent.click(within(sheet).getByRole('button', { name: 'English' }));
    expect(state.toggleLanguage).toHaveBeenCalledOnce();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Dark' }));
    expect(state.setTheme).toHaveBeenCalledWith('dark');
    expect(within(sheet).getByRole('button', { name: 'Device' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(within(sheet).getByRole('button', { name: 'Black' }));
    expect(state.setTheme).toHaveBeenLastCalledWith('dark');
    expect(localStorage.getItem('card-dark')).toBe('black');
    expect(document.documentElement.getAttribute('data-card-dark')).toBe('black');
    fireEvent.click(within(sheet).getByRole('button', { name: 'Lighter' }));
    expect(state.setTheme).toHaveBeenLastCalledWith('light');
    expect(document.documentElement.getAttribute('data-card-light')).toBe('cream');
    expect(within(sheet).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/?tour=1', '/about', '/privacy']);
    expect(within(sheet).getAllByRole('link').map(link => link.textContent)).toEqual(['Tour', 'About Namaq', 'Privacy policy']);
    const items = within(sheet).getAllByRole('button').concat(within(sheet).getAllByRole('link'));
    items.at(-1)!.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(items[0]);
    const pageShortcut = vi.fn();
    window.addEventListener('keydown', pageShortcut);
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(pageShortcut).not.toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    window.removeEventListener('keydown', pageShortcut);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it('renders the Arabic tabs before the language loads, as the server does', () => {
    state.loaded = false;
    render(<TabBar />);
    expect(screen.getByRole('navigation', { name: 'شريط التبويب' })).toBeTruthy();
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', '/quran', '/quran/read', '/', '/quizzes', '/utilities']);
  });

  it('closes the desktop settings panel on a press outside it, but not inside', () => {
    window.matchMedia = vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })) as unknown as typeof window.matchMedia;
    render(<><TabBar /><p>page</p></>);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.pointerDown(within(screen.getByRole('dialog')).getByRole('button', { name: 'Dark' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.pointerDown(screen.getByText('page'));
    expect(screen.queryByRole('dialog')).toBeNull();
    // @ts-expect-error jsdom has no matchMedia
    delete window.matchMedia;
  });
});
