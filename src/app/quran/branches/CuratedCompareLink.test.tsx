// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import CuratedCompareLink from './CuratedCompareLink';

const locale = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => locale }));
afterEach(() => { cleanup(); locale.language = 'ar'; });

describe('branches passage comparison link', () => {
  it.each(['ar', 'en'])('offers a named link to curated comparisons in %s', language => {
    locale.language = language;
    render(<CuratedCompareLink />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/quran/compare');
    expect(link.getAttribute('aria-label') || link.textContent).toMatch(language === 'ar' ? /مقار.*المقاطع/ : /[Pp]assage comparisons/);
    expect(link.querySelector('svg')).toBeTruthy();
  });
});
