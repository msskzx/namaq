// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NavBar, { NAV_SECTIONS, NavActions, NavSlotContext, NavSlotElement, activeSection } from './NavBar';

const { state } = vi.hoisted(() => ({ state: { path: '/', language: 'en' as 'ar' | 'en', toggleLanguage: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: state.language, languageLoaded: true, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }) }));
afterEach(() => { cleanup(); state.path = '/'; state.language = 'en'; vi.restoreAllMocks(); vi.clearAllMocks(); });

const destinations = ['/quran/branches', '/quran/read', '/quizzes'];

describe('launch navigation', () => {
  it.each(['ar', 'en'] as const)('links home and to the launch sections on desktop in %s', language => {
    state.language = language;
    render(<NavBar />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', ...destinations]);
    expect(within(nav).getAllByRole('link').slice(1).map(link => link.textContent)).toEqual(NAV_SECTIONS.map(section => section.label[language]));
    expect(screen.queryByRole('button', { name: language === 'ar' ? 'فتح القائمة' : 'Open menu' })).toBeNull();
  });

  it('marks the quizzes section on solo and party routes', () => {
    state.path = '/quizzes/party';
    render(<NavBar />);
    const marked = screen.getAllByRole('link').filter(link => link.getAttribute('aria-current') === 'page');
    expect(marked.map(link => link.getAttribute('href'))).toEqual(['/quizzes']);
    expect(activeSection('/quizzes?topic=BRANCHES')).toBe('/quizzes');
    expect(activeSection('/quizzes/party/123456')).toBe('/quizzes');
    expect(activeSection('/quran/read/3')).toBe('/quran/read');
    expect(activeSection('/quran/branches?o=test')).toBe('/quran/branches');
    expect(activeSection('/quran/compare')).toBeUndefined();
    expect(activeSection('/graphs')).toBeUndefined();
    expect(activeSection('/experiments')).toBeUndefined();
  });

  it('closes the party room menu with Escape and returns focus to its control', () => {
    state.path = '/quizzes/party/123456';
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

  it('slides the bar away on scroll down and back on scroll up', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 0; });
    render(<NavBar />);
    const bar = screen.getByRole('navigation');
    const scroll = (y: number) => act(() => { window.scrollY = y; window.dispatchEvent(new Event('scroll')); });
    scroll(300);
    expect(bar.className).toMatch(/scrolledAway/);
    scroll(250);
    expect(bar.className).not.toMatch(/scrolledAway/);
    scroll(400);
    scroll(20);
    expect(bar.className).not.toMatch(/scrolledAway/);
  });

  it('renders page actions into the top bar slot', () => {
    function Chrome() {
      const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
      return <NavSlotContext.Provider value={setSlot}><NavSlotElement.Provider value={slot}><NavBar /><NavActions><input aria-label="page search" /></NavActions></NavSlotElement.Provider></NavSlotContext.Provider>;
    }
    render(<Chrome />);
    expect(within(screen.getByRole('navigation')).getByRole('textbox', { name: 'page search' })).toBeTruthy();
  });
});
