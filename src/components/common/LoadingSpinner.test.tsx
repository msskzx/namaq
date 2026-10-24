import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';
const state = vi.hoisted(() => ({ language: 'en' }));
vi.mock('../language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(cleanup);
it.each([['en', 'Loading'], ['ar', 'جارٍ التحميل']])('announces loading in %s', (language, label) => {
  state.language = language;
  render(<LoadingSpinner />);
  expect(screen.getByRole('status').textContent).toBe(label);
});
