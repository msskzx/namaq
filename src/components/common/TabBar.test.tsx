// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import TabBar from './TabBar';

const { state } = vi.hoisted(() => ({ state: { path: '/', language: 'en' as 'ar' | 'en', toggleLanguage: vi.fn(), setTheme: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: state.language, languageLoaded: true, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'system', setTheme: state.setTheme }) }));
afterEach(() => { cleanup(); state.path = '/'; state.language = 'en'; vi.clearAllMocks(); });

describe('TabBar', () => {
  it.each(['ar', 'en'] as const)('shows icon-only section tabs with names for screen readers in %s', language => {
    state.language = language;
    state.path = '/quizzes/party';
    render(<TabBar />);
    const tabs = within(screen.getByRole('navigation')).getAllByRole('link');
    expect(tabs.map(tab => tab.getAttribute('href'))).toEqual(['/quran/branches', '/quran/read', '/quizzes']);
    expect(tabs.every(tab => tab.textContent === '' && tab.getAttribute('aria-label') && tab.querySelector('svg'))).toBe(true);
    expect(tabs.filter(tab => tab.getAttribute('aria-current')).map(tab => tab.getAttribute('href'))).toEqual(['/quizzes']);
  });

  it('opens settings with language, theme, about and privacy, and closes with Escape', () => {
    render(<TabBar />);
    const toggle = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(toggle);
    const sheet = screen.getByRole('dialog', { name: 'Settings' });
    fireEvent.click(within(sheet).getByRole('button', { name: 'العربية' }));
    expect(state.toggleLanguage).toHaveBeenCalledOnce();
    fireEvent.click(within(sheet).getByRole('button', { name: 'English' }));
    expect(state.toggleLanguage).toHaveBeenCalledOnce();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Dark' }));
    expect(state.setTheme).toHaveBeenCalledWith('dark');
    expect(within(sheet).getByRole('button', { name: 'Device' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(sheet).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/about', '/privacy']);
    const items = within(sheet).getAllByRole('button').concat(within(sheet).getAllByRole('link'));
    items.at(-1)!.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });
});
