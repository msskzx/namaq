import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NavigationLoaderProvider, useNavigatingRouter } from './NavigationLoader';

const nav = vi.hoisted(() => ({ pathname: '/quran/branches', search: '', push: vi.fn(), replace: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.search),
  useRouter: () => nav,
}));
vi.mock('../language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, '', '/quran/branches');
  nav.pathname = '/quran/branches';
  nav.search = '';
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

function Search() {
  const router = useNavigatingRouter();
  return <button onClick={() => router.push('/quran/branches?q=x', { scroll: false })}>search</button>;
}

const view = () => (
  <NavigationLoaderProvider>
    <a href="/quran/compare" onClick={event => event.preventDefault() /* as next/link does */}>compare</a>
    <a href="/quran/branches#top" onClick={event => event.preventDefault()}>here</a>
    <Search />
  </NavigationLoaderProvider>
);

it('shows the loader while a link opens a new page, and hides it once the URL changes', () => {
  const { rerender } = render(view());
  fireEvent.click(screen.getByText('compare'));
  expect(screen.queryByRole('status')).toBeNull();
  act(() => vi.advanceTimersByTime(200));
  expect(screen.getByRole('status').textContent).toBe('Loading');
  nav.pathname = '/quran/compare';
  rerender(view());
  expect(screen.queryByRole('status')).toBeNull();
});

it('shows the loader for a router push and passes the call through', () => {
  render(view());
  fireEvent.click(screen.getByText('search'));
  expect(nav.push).toHaveBeenCalledWith('/quran/branches?q=x', { scroll: false });
  act(() => vi.advanceTimersByTime(200));
  expect(screen.getByRole('status')).not.toBeNull();
});

it('ignores a link to the page already open', () => {
  render(view());
  fireEvent.click(screen.getByText('here'));
  act(() => vi.advanceTimersByTime(200));
  expect(screen.queryByRole('status')).toBeNull();
});

it('gives up after a navigation that never lands', () => {
  render(view());
  fireEvent.click(screen.getByText('compare'));
  act(() => vi.advanceTimersByTime(9000));
  expect(screen.queryByRole('status')).toBeNull();
});
