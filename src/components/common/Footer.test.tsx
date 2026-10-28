// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Footer from './Footer';
import { NAV_SECTIONS } from './NavBar';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

afterEach(cleanup);

describe('Footer', () => {
  it('links only the five navbar sections, each to its hub', () => {
    render(<Footer />);
    const sections = within(screen.getByRole('navigation', { name: 'Sections' })).getAllByRole('link');
    expect(sections.map(link => link.getAttribute('href'))).toEqual(NAV_SECTIONS.map(section => section.href));
    expect(sections).toHaveLength(5);
  });
  it('shows only the wordless icon in its home link', () => {
    render(<Footer />);
    const svgs = screen.getAllByRole('link', { name: 'Namaq' }).at(-1)!.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].getAttribute('viewBox')).toBe('12 24.7 76 76');
  });
});
