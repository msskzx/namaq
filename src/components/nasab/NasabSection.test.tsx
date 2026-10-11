// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const swr = vi.hoisted(() => ({ data: undefined as unknown }));
vi.mock('swr', () => ({ default: () => ({ data: swr.data }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

import NasabSection from './NasabSection';

afterEach(cleanup);

describe('NasabSection', () => {
  it('draws the line and links to the page that compares people', () => {
    swr.data = {
      people: [
        { slug: 'ali', name: 'علي بن أبي طالب', fathers: ['abu-talib'] },
        { slug: 'abu-talib', name: 'أبو طالب', fathers: [] },
      ],
      subjects: ['ali'],
    };
    render(<NasabSection slug="ali" />);
    expect(screen.getByRole('link', { name: /compare with others/i }).getAttribute('href')).toBe('/nasab?subject=person:ali');
    expect(screen.getAllByText('علي').length).toBeGreaterThan(0);
    expect(screen.getByText('أبو طالب')).toBeTruthy();
  });

  it('renders nothing while loading, for an unknown person, and for a person with no recorded father', () => {
    for (const data of [undefined, { people: [], subjects: [] }, { people: [{ slug: 'x', name: 'x', fathers: [] }], subjects: ['x'] }]) {
      swr.data = data;
      const { container } = render(<NasabSection slug="x" />);
      expect(container.innerHTML).toBe('');
      cleanup();
    }
  });
});
