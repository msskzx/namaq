import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuizzesPage from './page';

const nav = vi.hoisted(() => ({ search: '', push: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/quizzes',
  useRouter: () => ({ push: nav.push }),
  useSearchParams: () => {
    const search = nav.search;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  },
}));
vi.mock('swr', () => ({ default: () => ({ data: undefined, isLoading: false }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(cleanup);

it.each([
  'topic=PEOPLE%2CBATTLES%2CTITLES%2CBATTLES%2CPEOPLE',
  'topic=PEOPLE&topic=BATTLES&topic=TITLES&topic=BATTLES&topic=PEOPLE',
])('highlights and toggles unique selections from %s', (search) => {
  nav.search = search;
  nav.push.mockImplementation((url: string) => { nav.search = url.split('?')[1] ?? ''; });
  const view = render(<QuizzesPage />);
  for (const name of ['People', 'Battles', 'Titles']) {
    expect(screen.getByRole('button', { name }).className).toContain('bg-amber-400');
    expect(screen.getByRole('button', { name }).getAttribute('aria-pressed')).toBe('true');
  }
  fireEvent.click(screen.getByRole('button', { name: 'Battles' }));
  view.rerender(<QuizzesPage />);
  expect(new URLSearchParams(nav.search).get('topic')).toBe('PEOPLE,TITLES');
  expect(screen.getByRole('button', { name: 'Battles' }).className).not.toContain('bg-amber-400');
  expect(screen.getByRole('button', { name: 'Battles' }).getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(screen.getByRole('button', { name: 'Battles' }));
  view.rerender(<QuizzesPage />);
  expect(new URLSearchParams(nav.search).get('topic')).toBe('PEOPLE,TITLES,BATTLES');
  expect(screen.getByRole('button', { name: 'Battles' }).className).toContain('bg-amber-400');
});
