// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Footer from './Footer';

const { language } = vi.hoisted(() => ({ language: { current: 'en' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(() => { cleanup(); language.current = 'en'; });

describe('Footer', () => {
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
