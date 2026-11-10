// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FilterButton } from './Filters';

const { router, language } = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() }, language: { value: 'ar' } }));
const params = new URLSearchParams();
vi.mock('next/navigation', () => ({ useRouter: () => router, useSearchParams: () => params, usePathname: () => '/quran/branches' }));
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => router }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));

beforeEach(() => {
  language.value = 'ar';
  window.history.replaceState(null, '', '/quran/branches?o=old&m=cards&q=قال');
  for (const [method, newState] of [['showPopover', 'open'], ['hidePopover', 'closed']]) {
    Object.defineProperty(HTMLElement.prototype, method, { configurable: true, value() {
      this.dataset.open = String(newState === 'open');
      this.dispatchEvent(Object.assign(new Event('toggle'), { newState }));
    } });
  }
});
afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers(); vi.clearAllMocks(); });

it('keeps all edits pending and applies range, categories, differences and sorting in one navigation', async () => {
  vi.useFakeTimers();
  render(<FilterButton range={null} view={{ mode: 'cards', query: 'قال' }} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.change(screen.getByLabelText('من الجزء'), { target: { value: '25' } });
  fireEvent.change(screen.getByLabelText('إلى الجزء'), { target: { value: '30' } });
  fireEvent.click(screen.getByRole('button', { name: 'متشابهات' }));
  fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
  fireEvent.click(screen.getByRole('button', { name: 'الأكثر مواضع' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(router.replace).not.toHaveBeenCalled();
  expect(router.push).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(router.replace).toHaveBeenCalledTimes(1);
  const url = new URL(router.replace.mock.calls[0][0], 'http://localhost');
  expect(url.pathname).toBe('/quran/branches');
  expect(Object.fromEntries(url.searchParams)).toEqual({ juzFrom: '25', juzTo: '30', m: 'cards', q: 'قال', categories: 'pondering', differences: 'order', sort: 'places' });
  expect(document.querySelector('[popover]')?.getAttribute('data-open')).toBe('false');
  expect(screen.getByRole('button', { name: 'تصفية' }).getAttribute('aria-expanded')).toBe('false');
});

it.each([
  ['surah', 'من السورة', 'إلى السورة', 'surahFrom', 'surahTo', '50', '60'],
  ['page', 'من الصفحة', 'إلى الصفحة', 'pageFrom', 'pageTo', '500', '550'],
])('applies a %s range and replaces the previous juz selection', (unit, from, to, fromKey, toKey, a, b) => {
  render(<FilterButton range={{ from: 25, to: 30 }} view={{ mode: 'cards' }} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'التصفية حسب' }), { target: { value: unit } });
  fireEvent.change(screen.getByLabelText(from), { target: { value: a } });
  fireEvent.change(screen.getByLabelText(to), { target: { value: b } });
  expect(router.replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(Object.fromEntries(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams)).toEqual({ m: 'cards', [fromKey]: a, [toKey]: b });
});

it('selects chapters 50 and 60 individually through one picker', () => {
  render(<FilterButton range={null} view={{}} allSurahs={[{ number: 50, name: 'ق' }, { number: 60, name: 'الممتحنة' }]} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'التصفية حسب' }), { target: { value: 'surahs' } });
  const picker = screen.getByRole('textbox', { name: 'ابحث عن سورة' });
  fireEvent.change(picker, { target: { value: '50' } });
  fireEvent.click(screen.getByRole('button', { name: 'ق' }));
  fireEvent.change(picker, { target: { value: '60' } });
  fireEvent.keyDown(picker, { key: 'Enter' });
  expect(screen.getByRole('button', { name: 'الممتحنة' })).toBeTruthy();
  expect(router.replace).not.toHaveBeenCalled();
  expect(screen.queryByText('النطاق')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams.get('surahs')).toBe('50,60');
});

it('selects separate juz values without treating them as a range', () => {
  render(<FilterButton range={null} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'التصفية حسب' }), { target: { value: 'juzs' } });
  const picker = screen.getByRole('textbox', { name: 'ابحث عن جزء' });
  for (const number of ['٢٥', '٣٠']) {
    fireEvent.change(picker, { target: { value: number } });
    fireEvent.click(screen.getByRole('button', { name: `الجزء ${number}` }));
  }
  expect(router.replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(Object.fromEntries(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams)).toEqual({ juz: '25,30' });
});

it('discards unsubmitted edits when the sheet is closed and reopened', () => {
  render(<FilterButton range={{ from: 25, to: 30 }} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.change(screen.getByLabelText('من الجزء'), { target: { value: '27' } });
  fireEvent.click(screen.getByRole('button', { name: 'متشابهات' }));
  fireEvent.click(screen.getByRole('button', { name: 'إغلاق' }));
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  expect((screen.getByLabelText('من الجزء') as HTMLInputElement).value).toBe('٢٥');
  expect(screen.getByRole('button', { name: 'متشابهات' }).getAttribute('aria-pressed')).toBe('true');
  expect(router.replace).not.toHaveBeenCalled();
});

it('blocks Apply for an invalid range until it is fixed', () => {
  language.value = 'en';
  render(<FilterButton range={null} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  fireEvent.change(screen.getByLabelText('From juz'), { target: { value: '' } });
  expect(screen.getByRole('button', { name: 'Apply' }).hasAttribute('disabled')).toBe(true);
  fireEvent.change(screen.getByLabelText('From juz'), { target: { value: '25' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(router.replace).toHaveBeenCalledTimes(1);
});

it('keeps saved-only pending until Apply', () => {
  localStorage.setItem('bookmarks', JSON.stringify([{ id: 'saved', text: 'محفوظ', href: '/quran/branches?o=saved', savedAt: 1 }]));
  render(<FilterButton range={null} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.click(screen.getByRole('switch', { name: 'المحفوظة فقط' }));
  expect(router.replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams.get('b')).toBe('saved');
});

it('leaves saved compare cards out of the saved-only trees', () => {
  const compare = { id: 'compare:2:154|16:21', text: 'ولا تقولوا', href: '/quran/compare?a=2&b=16#c-2-154-16-21', savedAt: 2 };
  localStorage.setItem('bookmarks', JSON.stringify([compare]));
  render(<FilterButton range={null} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  expect((screen.getByRole('switch', { name: 'المحفوظة فقط' }) as HTMLInputElement).disabled).toBe(true);
  cleanup();
  localStorage.setItem('bookmarks', JSON.stringify([compare, { id: 'saved', text: 'محفوظ', href: '/quran/branches?o=saved', savedAt: 1 }]));
  render(<FilterButton range={null} view={{}} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.click(screen.getByRole('switch', { name: 'المحفوظة فقط' }));
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams.get('b')).toBe('saved');
});

it('resets every pending filter before Apply', () => {
  render(<FilterButton range={{ from: 25, to: 30 }} view={{ mode: 'cards', query: 'قال', saved: ['saved'], filters: { differences: 'order', sort: 'places' } }} />);
  fireEvent.click(screen.getByRole('button', { name: 'تصفية' }));
  fireEvent.click(screen.getByRole('button', { name: 'إعادة ضبط' }));
  expect((screen.getByLabelText('من الجزء') as HTMLInputElement).value).toBe('١');
  expect((screen.getByLabelText('إلى الجزء') as HTMLInputElement).value).toBe('٣٠');
  expect((screen.getByRole('switch', { name: 'المحفوظة فقط' }) as HTMLInputElement).checked).toBe(false);
  expect(screen.getByRole('button', { name: 'تقديم وتأخير' }).getAttribute('aria-pressed')).toBe('false');
  expect(screen.getByRole('button', { name: 'ترتيب المصحف' }).getAttribute('aria-pressed')).toBe('true');
  expect(router.replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
  expect(Object.fromEntries(new URL(router.replace.mock.calls[0][0], 'http://localhost').searchParams)).toEqual({ m: 'cards', q: 'قال' });
});

it('closes on Escape, returns focus and does not forward tree keyboard shortcuts', () => {
  const shortcut = vi.fn();
  render(<FilterButton range={null} view={{}} />);
  const button = screen.getByRole('button', { name: 'تصفية' });
  fireEvent.click(button);
  const panel = screen.getByRole('dialog', { name: 'تصفية' });
  expect(panel.contains(document.activeElement)).toBe(true);
  window.addEventListener('keydown', shortcut);
  try {
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(shortcut).not.toHaveBeenCalled();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  } finally {
    window.removeEventListener('keydown', shortcut);
  }
});
