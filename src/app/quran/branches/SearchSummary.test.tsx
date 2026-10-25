// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import SearchSummary from './SearchSummary';

const language = vi.hoisted(() => ({ value: 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));

afterEach(cleanup);

describe('SearchSummary', () => {
  it.each([[1, 'en', '1 entry matches «قال»'], [3, 'en', '3 entries match «قال»'], [0, 'en', 'No entry matches «قال».'], [2, 'ar', 'مجموعتان تطابق «قال»']])('counts %i result(s) in %s', (count, lang, text) => {
    language.value = lang;
    render(<SearchSummary query="قال" count={count} complete={[]} />);
    expect(screen.getByText(text)).toBeTruthy();
  });
});
