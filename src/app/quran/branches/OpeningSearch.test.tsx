// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branchesHref, TOP } from '@/lib/quran/branches';
import OpeningSearch from './OpeningSearch';

const language = vi.hoisted(() => ({ value: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

afterEach(() => {
  cleanup();
  router.push.mockClear();
  language.value = 'ar';
});

const top = [
  { id: 'يايها الذين', text: 'يَـٰٓأَيُّهَا ٱلَّذِينَ', count: 90 },
  { id: 'ان الذين', text: 'إِنَّ ٱلَّذِينَ', count: 73 },
  { id: 'الم تر', text: 'أَلَمْ تَرَ', count: 31 },
  ...Array.from({ length: TOP - 3 }, (_, i) => ({ id: `قال رب${i}`, text: `قال رب${i}`, count: 2 })),
];
const phrases = [
  ...top,
  { id: 'الم تر الي', text: 'أَلَمْ تَرَ إِلَى', count: 15 },
  { id: 'ان المتقين', text: 'إِنَّ ٱلْمُتَّقِينَ', count: 6 },
  { id: 'الم تر كيف', text: 'أَلَمْ تَرَ كَيْفَ', count: 3 },
  { id: 'الم تر كيف فعل ربك', text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ', count: 2 },
];
const suggested = () => within(screen.getByLabelText('عبارات مقترحة')).getAllByRole('option').map(a => a.textContent);

describe('OpeningSearch', () => {
  it.each(['ar', 'en'])('explains an unavailable requested opening in %s', lang => {
    language.value = lang;
    render(<OpeningSearch top={top} phrases={phrases} current="unknown" unavailable />);
    expect(screen.getByRole('status').textContent).toContain(lang === 'ar' ? 'لا تطابق العبارة المطلوبة' : 'No two ayat share the requested phrase');
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('finds a phrase longer than two words, typed with or without diacritics', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'أَلَمْ تَرَ كيف' } });
    expect(suggested()).toEqual(['أَلَمْ تَرَ كَيْفَ٣', 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ٢']);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'كهيعص' } });
    expect(screen.getByText('لا عبارة مشتركة تطابق البحث.')).toBeTruthy();
  });

  it('lists phrases that start with the search before those that only contain it', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'تر' } });
    expect(suggested()[0]).toBe('أَلَمْ تَرَ٣١');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'الذين' } });
    expect(suggested()).toEqual(['يَـٰٓأَيُّهَا ٱلَّذِينَ٩٠', 'إِنَّ ٱلَّذِينَ٧٣']);
  });

  it('shows every result on Enter when no suggestion is highlighted', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" view={{ grouped: true, page: 3 }} />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: ' الم تر ' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('', undefined, { grouped: true, query: 'الم تر' }));
    expect(screen.queryByLabelText('عبارات مقترحة')).toBeNull();
  });

  it('keeps the picked surah when searching', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="" view={{ surah: 14 }} />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'الم تر' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('', undefined, { surah: 14, query: 'الم تر' }));
  });

  it('leaves a suggestion under the mouse out of Enter', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'الم تر' } });
    fireEvent.mouseEnter(screen.getAllByRole('option')[1]);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('', undefined, { query: 'الم تر' }));
  });

  it('opens the highlighted suggestion on Enter', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'الم تر كيف' } });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('الم تر كيف'));
  });

  it('keeps the search in the box on the results, and clearing the box returns to the whole list', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="" query="الم تر" view={{ page: 2, query: 'الم تر', surah: 14 }} />);
    const box = screen.getByRole('combobox') as HTMLInputElement;
    expect(box.value).toBe('الم تر');
    expect(screen.queryByLabelText('عبارات مقترحة')).toBeNull();
    fireEvent.change(box, { target: { value: '' } });
    expect(router.push).toHaveBeenCalledWith(branchesHref('', undefined, { surah: 14 }));
  });

  it('does not navigate when a box that held no search is emptied', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'ا' } });
    fireEvent.change(box, { target: { value: '' } });
    expect(router.push).not.toHaveBeenCalled();
  });
});
