// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Footer from './Footer';

const { language } = vi.hoisted(() => ({ language: { current: 'en' as 'en' | 'ar', loaded: true } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current, languageLoaded: language.loaded }) }));
afterEach(() => { cleanup(); language.current = 'en'; language.loaded = true; });

describe('Footer', () => {
  it('matches the Arabic server output until the saved English preference is ready', () => {
    language.loaded = false;
    const view = render(<Footer />);
    expect(screen.getByRole('link', { name: 'نَمَق' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'أشجار العبارات' })).toBeTruthy();
    language.loaded = true;
    view.rerender(<Footer />);
    expect(screen.getByRole('link', { name: 'Namaq' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Phrase trees' })).toBeTruthy();
  });
  it.each(['en', 'ar'] as const)('links to launch features and privacy information without experiments or a persistent disclaimer in %s', current => {
    language.current = current;
    render(<Footer />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/quran/branches', '/quran/read', '/quizzes?topic=BRANCHES', '/quizzes/party']);
    expect(screen.queryByRole('note')).toBeNull();
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', '/quran/branches', '/quran/read', '/quizzes?topic=BRANCHES', '/quizzes/party', '/about', '/privacy']);
  });

  it('shows only the wordless icon in its home link', () => {
    render(<Footer />);
    const svgs = screen.getByRole('link', { name: 'Namaq' }).querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].getAttribute('viewBox')).toBe('12 24.7 76 76');
  });
});
