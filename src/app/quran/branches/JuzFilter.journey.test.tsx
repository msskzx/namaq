// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import JuzFilter from './JuzFilter';

const navigation = vi.hoisted(() => ({ search: '', replace: vi.fn(), params: new Map<string, URLSearchParams>() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/quran/branches',
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => {
    if (!navigation.params.has(navigation.search)) navigation.params.set(navigation.search, new URLSearchParams(navigation.search));
    return navigation.params.get(navigation.search);
  },
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(() => { cleanup(); vi.useRealTimers(); navigation.replace.mockClear(); navigation.search = ''; });

it('keeps edited range values pending until Apply is clicked', async () => {
  vi.useFakeTimers();
  render(<JuzFilter range={null} view={{ mode: 'cards' }} />);
  fireEvent.change(screen.getByLabelText('من الجزء'), { target: { value: '25' } });
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(navigation.replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(navigation.replace).toHaveBeenCalledExactlyOnceWith('/quran/branches?juzFrom=25&juzTo=30&m=cards', { scroll: false });
});

it('restores applied values when navigation changes the route and blocks invalid drafts', () => {
  const { rerender } = render(<JuzFilter range={{ from: 25, to: 30 }} view={{}} />);
  fireEvent.change(screen.getByLabelText('من الجزء'), { target: { value: '29' } });
  fireEvent.change(screen.getByLabelText('إلى الجزء'), { target: { value: '26' } });
  expect(screen.getByRole('button', { name: 'تطبيق' }).hasAttribute('disabled')).toBe(true);
  navigation.search = '?juzFrom=27&juzTo=30';
  rerender(<JuzFilter range={{ from: 27, to: 30 }} view={{}} />);
  expect((screen.getByLabelText('من الجزء') as HTMLInputElement).value).toBe('٢٧');
  expect((screen.getByLabelText('إلى الجزء') as HTMLInputElement).value).toBe('٣٠');
  expect(navigation.replace).not.toHaveBeenCalled();
});
