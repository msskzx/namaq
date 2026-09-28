import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ replace: vi.fn() }),
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(() => () => undefined, () => '', () => '');
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

vi.mock('swr', () => ({
  default: () => ({
    data: {
      questions: [{
        key: 'one',
        fingerprint: 'fingerprint',
        family: 'KUNYA',
        topic: 'PEOPLE',
        generatedPromptArabic: 'ما الكنية؟',
        promptArabicOverride: null,
        choices: [
          { value: 'right', labelArabic: 'أبو محمد' },
          { value: 'one', labelArabic: 'أبو الأول' },
          { value: 'two', labelArabic: 'أبو الثاني' },
          { value: 'three', labelArabic: 'أبو الثالث' },
        ],
        correctAnswer: 'right',
        evidence: { claimKeys: ['person/kunya'], readerUrls: ['/people/person?book=account&page=1'] },
        status: 'APPROVED',
        rejectionReason: null,
      }],
      pagination: { page: 1, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    },
    error: null,
    isLoading: false,
  }),
}));

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

import QuestionBankReview from './QuestionBankReview';

afterEach(cleanup);

describe('QuestionBankReview', () => {
  it('shows all choices and explicitly marks the correct answer', () => {
    render(<QuestionBankReview />);
    expect(screen.getByText('ما الكنية؟')).toBeTruthy();
    expect(screen.getByText('أبو محمد')).toBeTruthy();
    expect(screen.getByText('أبو الثالث')).toBeTruthy();
    expect(screen.getByText('Correct answer')).toBeTruthy();
    expect(screen.getByText('person/kunya')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Source' }).getAttribute('href')).toBe('/people/person?book=account&page=1');
  });
});
