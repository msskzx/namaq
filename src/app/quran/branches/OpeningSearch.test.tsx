// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branchesHref, TOP } from '@/lib/quran/branches';
import OpeningSearch from './OpeningSearch';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

afterEach(() => {
  cleanup();
  router.push.mockClear();
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
const suggested = () => within(screen.getByLabelText('عبارات مقترحة')).getAllByRole('link').map(a => a.getAttribute('href'));

describe('OpeningSearch', () => {
  it('offers the largest openings as buttons and marks the one a deeper phrase sits under', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="الم تر كيف" />);
    const picks = within(screen.getByLabelText('أكثر الفواتح تكرارًا')).getAllByRole('link');
    expect(picks).toHaveLength(TOP);
    expect(picks[2].getAttribute('href')).toBe(branchesHref('الم تر'));
    expect(picks[2].className).toContain('bg-amber-400');
    expect(picks[2].getAttribute('aria-current')).toBeNull();
    expect(picks[1].className).not.toContain('bg-amber-400');
  });

  it('finds a phrase longer than two words, typed with or without diacritics', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'أَلَمْ تَرَ كيف' } });
    expect(suggested()).toEqual([branchesHref('الم تر كيف'), branchesHref('الم تر كيف فعل ربك')]);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'كهيعص' } });
    expect(screen.getByText('لا عبارة مشتركة تطابق البحث.')).toBeTruthy();
  });

  it('lists phrases that start with the search before those that only contain it', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'تر' } });
    expect(suggested()[0]).toBe(branchesHref('الم تر'));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'الذين' } });
    expect(suggested()).toEqual([branchesHref('يايها الذين'), branchesHref('ان الذين')]);
  });

  it('opens the first suggestion on Enter', () => {
    render(<OpeningSearch top={top} phrases={phrases} current="ان الذين" />);
    const box = screen.getByRole('searchbox');
    fireEvent.change(box, { target: { value: 'الم تر كيف' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(router.push).toHaveBeenCalledWith(branchesHref('الم تر كيف'));
  });
});
