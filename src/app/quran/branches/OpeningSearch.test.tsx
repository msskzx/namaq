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

  it('opens the first suggestion on Enter', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'الم تر كيف' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('الم تر كيف'));
  });
});
