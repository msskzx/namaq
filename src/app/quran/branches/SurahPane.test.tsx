// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import SurahPane from './SurahPane';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const names = Object.fromEntries(Array.from({ length: 114 }, (_, i) => [i + 1, `سورة ${i + 1}`]));
const view = { grouped: false, page: 1, context: false };

describe('SurahPane', () => {
  it('lists only the surahs inside the juz\' filter, like /quran/compare', () => {
    render(<SurahPane counts={{ 41: 2, 42: 3 }} total={5} names={names} juz={{ from: 25, to: 25 }} view={view} />);
    expect(screen.getByText('سورة 41')).toBeTruthy();
    expect(screen.getByText('سورة 45')).toBeTruthy();
    expect(screen.queryByText('سورة 40')).toBeNull();
    expect(screen.queryByText('سورة 46')).toBeNull();
    expect(screen.queryByText('سورة 1')).toBeNull();
  });

  it('lists every surah without a filter', () => {
    render(<SurahPane counts={{ 2: 1 }} total={1} names={names} juz={null} view={view} />);
    expect(screen.getByText('سورة 1')).toBeTruthy();
    expect(screen.getByText('سورة 114')).toBeTruthy();
  });
});
