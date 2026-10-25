// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NotFound from './not-found';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

afterEach(cleanup);

describe('NotFound', () => {
  it('shows the not-found message and a link home', () => {
    render(<NotFound />);
    expect(screen.getByText("The page you're looking for doesn't exist or was moved.")).not.toBeNull();
    const link = screen.getByRole('link', { name: /go home/i });
    expect(link.getAttribute('href')).toBe('/');
  });

  it('heads the page with its title and draws 404 as nodes with an open zero', () => {
    const { container } = render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('circle')).toHaveLength(17);
    expect(svg.querySelectorAll('g[stroke-dasharray] line')).toHaveLength(2);
    expect(svg.querySelectorAll('g:not([stroke-dasharray]) > line')).toHaveLength(14);
  });
});
