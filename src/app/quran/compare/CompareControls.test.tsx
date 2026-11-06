// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CompareControls, { rangeHref } from './CompareControls';

const params = new URLSearchParams();
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }), usePathname: () => '/quran/compare', useSearchParams: () => params }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(() => { cleanup(); replace.mockClear(); });

const href = (name: string) => screen.getByRole('link', { name }).getAttribute('href');

describe('rangeHref', () => {
  it('swaps the range and keeps everything else', () => {
    const query = { a: '56', b: '69', view: 'ayat', juzFrom: '25', juzTo: '30' };
    expect(rangeHref(query, { unit: 'surah', range: { from: 90, to: 114 } })).toBe('/quran/compare?a=56&b=69&view=ayat&by=surah&surahFrom=90&surahTo=114');
    expect(rangeHref(query, { unit: 'juz', range: null })).toBe('/quran/compare?a=56&b=69&view=ayat');
    expect(rangeHref({}, { unit: 'juz', range: null })).toBe('/quran/compare');
  });
});

describe('CompareControls', () => {
  it('marks the current tab and links the others with the pair and range', () => {
    render(<CompareControls tab="ayat" query={{ a: '56', b: '69', view: 'ayat', juzFrom: '25', juzTo: '30' }} range={{ unit: 'juz', range: { from: 25, to: 30 } }} summary="s" />);
    expect(screen.getByRole('link', { name: 'آية بآية' }).getAttribute('aria-current')).toBe('page');
    expect(href('آية بآية')).toBe('/quran/compare?a=56&b=69&view=ayat&juzFrom=25&juzTo=30');
    expect(href('المتشابه')).toBe('/quran/compare?a=56&b=69&juzFrom=25&juzTo=30');
    expect(href('المواضيع')).toBe('/quran/compare?mode=themes&a=56&b=69&juzFrom=25&juzTo=30');
  });

  it('keeps the range on the current unit and clears it when switching unit', () => {
    const query = { a: '56', b: '69', juzFrom: '25', juzTo: '30' };
    render(<CompareControls tab="similar" query={query} range={{ unit: 'juz', range: { from: 25, to: 30 } }} summary="s" />);
    expect((screen.getByRole('combobox', { name: 'النطاق بالأجزاء أو بالسور' }) as HTMLSelectElement).value).toBe('juz');
    fireEvent.click(screen.getByRole('button', { name: 'كل الأجزاء' }));
    expect(replace).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
    expect(replace).toHaveBeenCalledWith('/quran/compare?a=56&b=69', { scroll: false });
  });

  it('keeps range-unit changes pending until Apply', () => {
    render(<CompareControls tab="similar" query={{ a: '56', b: '69' }} range={{ unit: 'juz', range: null }} summary="s" />);
    fireEvent.change(screen.getByRole('combobox', { name: 'النطاق بالأجزاء أو بالسور' }), { target: { value: 'surah' } });
    fireEvent.change(screen.getByLabelText('من السورة'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('إلى السورة'), { target: { value: '60' } });
    expect(replace).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
    expect(replace).toHaveBeenCalledWith('/quran/compare?a=56&b=69&by=surah&surahFrom=50&surahTo=60', { scroll: false });
  });

  it('keeps the open surah when its current tab is pressed', () => {
    render(<CompareControls tab="similar" query={{ s: '43', within: '1' }} range={{ unit: 'juz', range: null }} summary="s" />);
    expect(screen.getByRole('link', { name: 'المتشابه' }).getAttribute('aria-current')).toBe('page');
    expect(href('المتشابه')).toBe('/quran/compare?s=43&within=1');
  });

  it('offers surah numbers up to 114 in the surah unit', () => {
    render(<CompareControls tab="similar" query={{ by: 'surah' }} range={{ unit: 'surah', range: null }} summary="المصحف كله" />);
    expect((screen.getByRole('spinbutton', { name: 'من السورة' }) as HTMLInputElement).value).toBe('1');
    expect((screen.getByRole('spinbutton', { name: 'إلى السورة' }) as HTMLInputElement).value).toBe('114');
    expect(screen.getByRole('status').textContent).toBe('المصحف كله');
  });
});
