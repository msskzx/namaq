// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CompareControls from './CompareControls';

const language = vi.hoisted(() => ({ language: 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => language }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
afterEach(() => { cleanup(); language.language = 'en'; });
const props = {
  surahs: [{ number: 55, name: 'الرحمن' }, { number: 56, name: 'الواقعة' }],
  a: { number: 55, range: { from: 46, to: 61 }, count: 78 },
  b: { number: 55, range: { from: 62, to: 77 }, count: 78 },
  query: { a: '55', af: '46', at: '61', b: '55', bf: '62', bt: '77', view: 'ayat' },
};

it('submits the chosen surahs and ranges in the current comparison view', () => {
  const { container } = render(<CompareControls {...props} />);
  const from = screen.getByRole('spinbutton', { name: 'First surah: from ayah' });
  fireEvent.change(from, { target: { value: '47' } });
  const values = Object.fromEntries(new FormData(container.querySelector('form')!));
  expect(values).toEqual({ a: '55', af: '47', at: '61', b: '55', bf: '62', bt: '77', view: 'ayat' });
  expect(screen.getByRole('button', { name: 'Compare' })).toBeTruthy();
});

it('keeps ayah alignment and the other range when resetting one side to the whole surah', () => {
  render(<CompareControls {...props} />);
  const url = new URL(screen.getByRole('link', { name: 'All ayat: First surah' }).getAttribute('href')!, 'http://localhost');
  expect(Object.fromEntries(url.searchParams)).toEqual({ a: '55', af: '1', at: '78', b: '55', bf: '62', bt: '77', view: 'ayat' });
});

it('submits only surahs and topic mode for a topic comparison', () => {
  const { container } = render(<CompareControls {...props} themes />);
  expect(screen.queryByRole('spinbutton')).toBeNull();
  expect(Object.fromEntries(new FormData(container.querySelector('form')!))).toEqual({ mode: 'themes', a: '55', b: '55' });
});
