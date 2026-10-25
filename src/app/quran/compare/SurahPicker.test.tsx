// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SurahPicker from './SurahPicker';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const surahs = [{ number: 1, name: 'الفاتحة' }, { number: 2, name: 'البقرة' }, { number: 20, name: 'طه' }, { number: 56, name: 'الواقعة' }];
const show = () => render(<form><SurahPicker name="a" label="السورة الأولى" value={56} surahs={surahs} /></form>);
const box = () => screen.getByRole('combobox', { name: 'السورة الأولى' }) as HTMLInputElement;
const submitted = () => (document.querySelector('input[name=a]') as HTMLInputElement).value;
const options = () => screen.queryAllByRole('option').map(o => o.textContent);

describe('SurahPicker', () => {
  it('shows the chosen surah and submits its number', () => {
    show();
    expect(box().value).toBe('٥٦. الواقعة');
    expect(submitted()).toBe('56');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('lists every surah on focus and narrows the list as the reader types a name or number', () => {
    show();
    fireEvent.focus(box());
    expect(options()).toEqual(['١. الفاتحة', '٢. البقرة', '٢٠. طه', '٥٦. الواقعة']);
    fireEvent.change(box(), { target: { value: 'بقره' } });
    expect(options()).toEqual(['٢. البقرة']);
    fireEvent.change(box(), { target: { value: '٢' } });
    expect(options()).toEqual(['٢. البقرة', '٢٠. طه']);
    fireEvent.change(box(), { target: { value: 'يوسف' } });
    expect(screen.getByText('لا سورة بهذا الاسم.')).toBeTruthy();
  });

  it('picks with a click, or with the arrow keys and Enter without submitting the form', () => {
    show();
    fireEvent.focus(box());
    fireEvent.change(box(), { target: { value: 'ال' } });
    fireEvent.click(screen.getByRole('option', { name: '٢. البقرة' }));
    expect(submitted()).toBe('2');
    expect(box().value).toBe('٢. البقرة');
    fireEvent.change(box(), { target: { value: '٢. البقرةال' } });
    fireEvent.keyDown(box(), { key: 'ArrowDown' });
    fireEvent.keyDown(box(), { key: 'ArrowDown' });
    expect(fireEvent.keyDown(box(), { key: 'Enter' })).toBe(false);
    expect(submitted()).toBe('56');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('keeps the chosen surah when the reader leaves or presses Escape', () => {
    show();
    fireEvent.focus(box());
    fireEvent.change(box(), { target: { value: 'طه' } });
    fireEvent.keyDown(box(), { key: 'Escape' });
    expect(box().value).toBe('٥٦. الواقعة');
    fireEvent.change(box(), { target: { value: 'طه' } });
    fireEvent.blur(box());
    expect(box().value).toBe('٥٦. الواقعة');
    expect(submitted()).toBe('56');
  });

  it('starts a new search when the reader types after picking', () => {
    show();
    fireEvent.focus(box());
    fireEvent.click(screen.getByRole('option', { name: '٢. البقرة' }));
    fireEvent.change(box(), { target: { value: '٢. البقرةطه' } });
    expect(options()).toEqual(['٢٠. طه']);
    fireEvent.click(screen.getByRole('option', { name: '٢٠. طه' }));
    fireEvent.change(box(), { target: { value: 'بقر' } });
    expect(options()).toEqual(['٢. البقرة']);
    fireEvent.click(screen.getByRole('option', { name: '٢. البقرة' }));
    fireEvent.change(box(), { target: { value: '٢. البقر' } });
    expect(options()).toHaveLength(4);
  });

  it('lets Enter submit the form while the list is closed', () => {
    show();
    expect(fireEvent.keyDown(box(), { key: 'Enter' })).toBe(true);
  });
});
