// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NavSearch from './NavSearch';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(cleanup);

describe('NavSearch', () => {
  it('opens the box from the icon, focuses it, and closes back to the icon', () => {
    render(<NavSearch><input aria-label="phrase" /></NavSearch>);
    const icon = screen.getByRole('button', { name: 'Search' });
    expect(icon.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(icon);
    expect(icon.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'phrase' }));
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'phrase' }), { key: 'Escape' });
    expect(icon.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(icon);
    fireEvent.click(icon);
    fireEvent.click(screen.getByRole('button', { name: 'Close search' }));
    expect(icon.getAttribute('aria-expanded')).toBe('false');
  });
});
