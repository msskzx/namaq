// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NavBar, { NAV_SECTIONS, activeSection } from './NavBar';
import { getAllNavLinks } from '@/lib/siteLinks';

const { state } = vi.hoisted(() => ({ state: { path: '/', toggleLanguage: () => {} } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', languageLoaded: true, toggleLanguage: state.toggleLanguage }),
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }) }));

afterEach(() => { cleanup(); state.path = '/'; });

// jsdom has no PointerEvent, so pointerType would be lost on the events below.
class TestPointerEvent extends MouseEvent {
  pointerType: string;
  constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerType = init.pointerType ?? ''; }
}
if (!('PointerEvent' in window)) Object.assign(window, { PointerEvent: TestPointerEvent });

describe('NavBar shelves', () => {
  it('shows the theme button directly in the navbar without a settings menu', () => {
    render(<NavBar />);
    expect(within(screen.getByRole('navigation')).getByRole('button', { name: 'Switch to dark mode' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Settings' })).toBeNull();
  });
  it('opens the Quran shelf from its toggle, listing every Quran page with what it is for', () => {
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Quran pages' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const shelf = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    const hrefs = within(shelf).getAllByRole('link').map(a => a.getAttribute('href'));
    for (const { href } of getAllNavLinks('en').filter(l => l.href.startsWith('/quran/'))) expect(hrefs).toContain(href);
    expect(within(shelf).getByRole('link', { name: /Prophets’ stories/ }).textContent).toContain('The prophets’ stories in the Quran on a timeline');
    expect(within(shelf).getAllByRole('heading').map(h => h.textContent)).toEqual(['Read', 'Words', 'Themes', 'Tajwid']);
    expect(NAV_SECTIONS[0].groups[1].items[0].href).toBe('/quran/branches');
  });

  it('closes the shelf with Escape and when focus leaves the chapter', () => {
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Hadith pages' });
    fireEvent.click(toggle);
    const shelfLink = within(document.getElementById(toggle.getAttribute('aria-controls')!)!).getAllByRole('link')[0];
    shelfLink.focus();
    fireEvent.keyDown(shelfLink, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
    fireEvent.click(toggle);
    fireEvent.blur(toggle, { relatedTarget: document.body });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('orders the chapters from the texts to review, with Quizzes as a plain link', () => {
    render(<NavBar />);
    expect(NAV_SECTIONS.map(s => s.label.en)).toEqual(['Quran', 'Hadith', 'Biographies', 'Sources', 'Quizzes']);
    expect(screen.getByRole('link', { name: 'Quizzes' }).getAttribute('href')).toBe('/quizzes');
    expect(screen.queryByRole('button', { name: 'Quizzes pages' })).toBeNull();
  });

  it('marks the current page in its shelf and ends each shelf with a link to the section', () => {
    state.path = '/quran/oaths';
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Quran pages' });
    fireEvent.click(toggle);
    const shelf = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(within(shelf).getByRole('link', { name: /Oaths/ }).getAttribute('aria-current')).toBe('page');
    expect(within(shelf).getByRole('link', { name: 'All Quran pages' }).getAttribute('href')).toBe('/quran');
  });

  it('marks the section the current page belongs to', () => {
    state.path = '/quran/compare';
    render(<NavBar />);
    expect(screen.getAllByRole('link', { name: 'Quran' })[0].getAttribute('aria-current')).toBe('page');
    expect(activeSection('/people/prophet-muhammad')).toBe('/biographies');
    expect(activeSection('/nasab')).toBe('/biographies');
    expect(activeSection('/graphs')).toBe('/biographies');
    expect(activeSection('/attributions')).toBe('/sources');
    expect(activeSection('/')).toBeUndefined();
  });

  it('lets a tap on the toggle open and close the shelf, and closes it when the mouse leaves', () => {
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Hadith pages' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    fireEvent.pointerLeave(toggle.parentElement!, { pointerType: 'mouse' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('hides a shelf after a pick until the pointer leaves', () => {
    render(<NavBar />);
    const toggle = screen.getByRole('button', { name: 'Quran pages' });
    const chapter = toggle.parentElement!;
    fireEvent.click(within(document.getElementById(toggle.getAttribute('aria-controls')!)!).getAllByRole('link')[0]);
    expect(chapter.hasAttribute('data-dismissed')).toBe(true);
    fireEvent.pointerLeave(chapter, { pointerType: 'mouse' });
    expect(chapter.hasAttribute('data-dismissed')).toBe(false);
  });

  it('switches language in one tap', () => {
    const toggleLanguage = vi.fn();
    state.toggleLanguage = toggleLanguage;
    render(<NavBar />);
    fireEvent.click(screen.getByRole('button', { name: 'التبديل إلى العربية' }));
    expect(toggleLanguage).toHaveBeenCalledOnce();
  });
});

describe('NavBar phone menu', () => {
  it('groups the pages into the same sections and opens the current one', () => {
    state.path = '/hadith/muslim-jibril';
    render(<NavBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const sections = Array.from(document.querySelectorAll('details'));
    expect(sections.map(d => d.querySelector('summary')!.textContent)).toEqual(NAV_SECTIONS.filter(s => s.groups.length).map(s => s.label.en));
    expect(sections.filter(d => d.open).map(d => d.querySelector('summary')!.textContent)).toEqual(['Hadith']);
  });

  it('reaches every page in the shared list', () => {
    for (const { href } of getAllNavLinks('ar')) expect(activeSection(href), href).toBeDefined();
  });
});
