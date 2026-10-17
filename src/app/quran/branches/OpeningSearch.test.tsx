// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import OpeningSearch, { TOP } from './OpeningSearch';

afterEach(cleanup);

const openings = [
  { id: 'يايها الذين', text: 'يَـٰٓأَيُّهَا ٱلَّذِينَ', count: 85 },
  { id: 'ان الذين', text: 'إِنَّ ٱلَّذِينَ', count: 73 },
  ...Array.from({ length: TOP }, (_, i) => ({ id: `قال رب${i}`, text: `قال رب${i}`, count: 2 })),
  { id: 'ان المتقين', text: 'إِنَّ ٱلْمُتَّقِينَ', count: 6 },
];

describe('OpeningSearch', () => {
  it('offers the largest openings as buttons and marks the one shown', () => {
    render(<OpeningSearch openings={openings} current="ان الذين" />);
    const picks = within(screen.getByLabelText('أكثر الفواتح تكرارًا')).getAllByRole('link');
    expect(picks).toHaveLength(TOP);
    expect(picks[1].getAttribute('aria-current')).toBe('page');
    expect(picks[1].getAttribute('href')).toBe(`/quran/branches?o=${encodeURIComponent('ان الذين')}`);
  });

  it('finds an opening typed with or without diacritics', () => {
    render(<OpeningSearch openings={openings} current="ان الذين" />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'إِنَّ ٱلْمُتَّقِ' } });
    const found = within(screen.getByLabelText('فواتح مقترحة')).getAllByRole('link');
    expect(found).toHaveLength(1);
    expect(found[0].getAttribute('href')).toBe(`/quran/branches?o=${encodeURIComponent('ان المتقين')}`);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'كهيعص' } });
    expect(screen.getByText('لا فاتحة مشتركة تطابق البحث.')).toBeTruthy();
  });
});
