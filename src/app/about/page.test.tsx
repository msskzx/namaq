// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AboutPage from './page';
import { ABOUT_INTRO, ABOUT_REFERENCES } from '@shared/infoPages';

const language = vi.hoisted(() => ({ current: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(cleanup);

it.each([
  ['ar', 'عن نمَق', 'العزو', 'اسم نمق', 'نَمَّقَ (فعل)', 'نَمَق (اسم)', 'لم يُراجع'],
  ['en', 'About Namaq', 'Attributions', 'The name Namaq', 'Namaq (Verb)', 'Namaq (Noun)', 'Not reviewed'],
])('keeps the purpose and sources visible, with no review labels, in %s while name detail can be disclosed', (lang, title, link, disclosure, verb, noun, review) => {
  language.current = lang;
  const { container } = render(<AboutPage />);
  expect(screen.getByRole('heading', { name: title, level: 1 })).toBeTruthy();
  // The purpose is the shared about text (shared/infoPages.ts), the same words the app's about page shows.
  const at = lang as 'ar' | 'en';
  expect(screen.getByText(ABOUT_INTRO[at])).toBeTruthy();
  // No review labels anywhere (owner, 2026-11-17): the page says how content is chosen and cited instead.
  expect(screen.queryByText(new RegExp(review))).toBeNull();
  for (const text of ABOUT_REFERENCES) expect(screen.getByText(text[at])).toBeTruthy();
  expect(screen.getByRole('link', { name: link }).getAttribute('href')).toBe('/attributions');
  const details = container.querySelector('details')!;
  expect(details.open).toBe(false);
  fireEvent.click(screen.getByText(disclosure));
  expect(details.open).toBe(true);
  expect(screen.getByRole('heading', { name: verb })).toBeTruthy();
  expect(screen.getByRole('heading', { name: noun })).toBeTruthy();
  expect(screen.getByText('نَمَق · يَنمُق · نَمْقًا · نامِق · مَنْموق · نَمَّقَ · ينمِّق · تنميقًا · مُنمِّق · نَمْق · نَمَق')).toBeTruthy();
  fireEvent.click(screen.getByText(disclosure));
  expect(details.open).toBe(false);
});
