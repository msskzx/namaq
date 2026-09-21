// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AyatGroup } from './AyahCard';
import type { Ayah } from '@/types/quran';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

function ayah(overrides: Partial<Ayah> = {}): Ayah {
  return {
    id: `ayah-${overrides.number ?? 1}`,
    number: 1,
    text: 'آية',
    surahId: 'surah-1',
    surah: { id: 'surah-1', name: 'سورة', nameTransliterated: 'Surah', number: 1 },
    ...overrides,
  } as unknown as Ayah;
}

afterEach(cleanup);

describe('AyatGroup', () => {
  it('renders nothing when there are no verses', () => {
    const { container } = render(<AyatGroup ayat={[]} />);
    expect(container.firstChild).toBeNull();
  });

  // Uses the app's own Pagination component (src/components/common/Pagination.tsx),
  // same as ClaimEvidence, SourceAccountReader, and UtteranceGroup.
  it('pages forward and back through the verses', () => {
    const many = Array.from({ length: 12 }, (_, index) => ayah({ number: index, text: `آية رقم ${index}` }));

    render(<AyatGroup ayat={many} pageSize={5} />);

    expect(screen.getByText('آية رقم 0')).toBeTruthy();
    expect(screen.queryByText('آية رقم 5')).toBeNull();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('آية رقم 5')).toBeTruthy();
    expect(screen.queryByText('آية رقم 0')).toBeNull();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByText('آية رقم 0')).toBeTruthy();
  });

  it('offers no pagination when everything fits on one page', () => {
    render(<AyatGroup ayat={[ayah()]} />);

    expect(screen.queryByText('Next')).toBeNull();
  });
});
