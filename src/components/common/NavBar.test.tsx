// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NavBar, { NavActions, NavButtons, RailSlotElement, NavSlotContext, NavSlotElement, activeSection } from './NavBar';

const { state } = vi.hoisted(() => ({ state: { path: '/', language: 'en' as 'ar' | 'en', toggleLanguage: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: state.language, languageLoaded: true, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }) }));
afterEach(() => { cleanup(); state.path = '/'; state.language = 'en'; vi.restoreAllMocks(); vi.clearAllMocks(); });

const destinations = ['/quran', '/quran/read', '/', '/quizzes'];

describe('launch navigation', () => {
  it.each(['ar', 'en'] as const)('shows only the tree logo linking home, with no sections or settings, in %s', language => {
    state.language = language;
    state.path = '/quran/read';
    render(<NavBar />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/']);
    expect(within(nav).getByRole('link').querySelectorAll('svg')).toHaveLength(1);
    expect(within(nav).queryAllByRole('button')).toHaveLength(0);
  });

  it.each(['/quran/branches', '/quran/compare', '/quran/prophets', '/quran/tajwid/tuhfat-al-atfal'])('puts a back arrow to the Quran hub in the logo\'s place on %s, as in the app', path => {
    state.path = path;
    render(<NavBar />);
    const back = within(screen.getByRole('navigation')).getByRole('link', { name: 'Back' });
    expect(back.getAttribute('href')).toBe('/quran');
  });

  it('puts the settings gear in the homepage top bar only, as in the app', () => {
    render(<NavBar />);
    expect(within(screen.getByRole('navigation')).getByRole('button', { name: 'Settings' })).toBeTruthy();
    cleanup();
    state.path = '/quran/compare';
    render(<NavBar />);
    expect(within(screen.getByRole('navigation')).queryByRole('button', { name: 'Settings' })).toBeNull();
  });

  it('marks the quizzes section on solo and party routes', () => {
    expect(activeSection('/quizzes')).toBe('/quizzes');
    expect(activeSection('/quizzes?topic=BRANCHES')).toBe('/quizzes');
    expect(activeSection('/quizzes/party/123456')).toBe('/quizzes');
    expect(activeSection('/quran/read/3')).toBe('/quran/read');
    expect(activeSection('/quran/branches?o=test')).toBe('/quran');
    expect(activeSection('/quran/compare')).toBe('/quran');
    expect(activeSection('/quran/tajwid/tuhfat-al-atfal')).toBe('/quran');
    expect(activeSection('/quran')).toBe('/quran');
    expect(activeSection('/')).toBe('/');
    expect(activeSection('/quran/words')).toBeUndefined();
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
    expect(bar.className).toMatch(/scrolledAway/);
    act(() => { within(bar).getByRole('link').focus(); });
    expect(bar.className).not.toMatch(/scrolledAway/);
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

  it('provides the party room top bar slot and removes its actions when the question closes', () => {
    state.path = '/quizzes/party/123456';
    function Chrome({ shown }: { shown: boolean }) {
      const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
      return <NavSlotContext.Provider value={setSlot}><NavSlotElement.Provider value={slot}><NavBar />{shown && <NavButtons><button>Rotate tree</button><button>Surrounding ayat</button></NavButtons>}</NavSlotElement.Provider></NavSlotContext.Provider>;
    }
    const { rerender } = render(<Chrome shown />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByRole('button', { name: 'Rotate tree' })).toBeTruthy();
    expect(within(nav).getByRole('button', { name: 'Surrounding ayat' })).toBeTruthy();
    expect(within(nav).getByRole('button', { name: 'Open menu' })).toBeTruthy();
    rerender(<Chrome shown={false} />);
    expect(within(nav).queryByRole('button', { name: 'Rotate tree' })).toBeNull();
    expect(within(nav).getByRole('button', { name: 'Open menu' })).toBeTruthy();
  });

  it('puts page buttons in the rail on desktop and in the top bar on phones', () => {
    const rail = document.createElement('div');
    document.body.appendChild(rail);
    function Chrome() {
      const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
      return <NavSlotContext.Provider value={setSlot}><NavSlotElement.Provider value={slot}><RailSlotElement.Provider value={rail}><NavBar /><NavButtons><button>view</button></NavButtons></RailSlotElement.Provider></NavSlotElement.Provider></NavSlotContext.Provider>;
    }
    window.matchMedia = vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })) as unknown as typeof window.matchMedia;
    render(<Chrome />);
    expect(within(rail).getByRole('button', { name: 'view' })).toBeTruthy();
    cleanup();
    window.matchMedia = vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })) as unknown as typeof window.matchMedia;
    render(<Chrome />);
    expect(within(screen.getByRole('navigation')).getByRole('button', { name: 'view' })).toBeTruthy();
    // @ts-expect-error jsdom has no matchMedia
    delete window.matchMedia;
    rail.remove();
  });
});
