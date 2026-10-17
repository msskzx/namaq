// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranIltifatPage from './page';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

describe('QuranIltifatPage', () => {
  it('links the repeated phrases to /quran/compare, where they now live', () => {
    render(<QuranIltifatPage />);
    expect(screen.getByRole('link', { name: /تكرار العبارات/ }).getAttribute('href')).toBe('/quran/compare');
  });
});
