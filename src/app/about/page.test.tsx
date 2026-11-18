// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AboutPage from './page';

const language = vi.hoisted(() => ({ current: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(cleanup);

it.each([
  ['ar', 'عن نمَق', 'العزو', 'اسم نمق', 'نَمَّقَ (فعل)', 'نَمَق (اسم)', 'نستمد الشخصيات والأحداث', 'لم يُراجع', 'تُطابَق مع نص الكتاب'],
  ['en', 'About Namaq', 'Attributions', 'The name Namaq', 'Namaq (Verb)', 'Namaq (Noun)', 'People and events are drawn', 'Not reviewed', 'checked against the book'],
])('keeps the purpose and sources visible, with no review labels, in %s while name detail can be disclosed', (lang, title, link, disclosure, verb, noun, source, review, checked) => {
  language.current = lang;
  const { container } = render(<AboutPage />);
  expect(screen.getByRole('heading', { name: title, level: 1 })).toBeTruthy();
  const purpose = screen.getByText(lang === 'ar' ? /نَمَق تطبيق تعليمي/ : /Namaq is an Arabic-first learning/);
  for (const subject of lang === 'ar' ? ['القرآن', 'الحديث', 'تاريخ صدر الإسلام'] : ['Quran', 'Hadith', 'early Islamic history']) expect(purpose.textContent).toContain(subject);
  expect(screen.getByText(new RegExp(source))).toBeTruthy();
  // No review labels anywhere (owner, 2026-11-17): the page says how values are checked instead.
  expect(screen.queryByText(new RegExp(review))).toBeNull();
  expect(screen.getByText(new RegExp(checked))).toBeTruthy();
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
