// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import SectionHub from './SectionHub';
import { NAV_SECTIONS } from './NavBar';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

describe('SectionHub', () => {
  it('lists every page on the Biographies shelf', () => {
    render(<SectionHub href="/biographies" />);
    const shelf = NAV_SECTIONS.find(section => section.href === '/biographies')!;
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href')))
      .toEqual(shelf.groups.flatMap(group => group.items.map(item => item.href)));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('التراجم');
  });
});
