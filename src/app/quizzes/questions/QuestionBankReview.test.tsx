import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

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
        choiceDetails: {},
        evidence: {
          claimKeys: ['person/kunya'],
          reference: {
            excerptArabic: 'نص الشاهد',
            sourceTitle: 'سير أعلام النبلاء',
            pageReference: '5',
            readerUrl: '/people/person?book=account&page=1&passage=5-p3',
          },
        },
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
    const badge = screen.getByText('Correct answer');
    expect(badge.className).toContain('shrink-0');
    expect(badge.closest('li')?.className).toContain('gap-3');
    expect(screen.queryByText('person/kunya')).toBeNull();
    expect(screen.queryByText('fingerprint')).toBeNull();
  });

  it('opens the single quiz reference in an overlay instead of navigating away', () => {
    render(<QuestionBankReview />);
    fireEvent.click(screen.getByRole('button', { name: 'Source' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('نص الشاهد')).toBeTruthy();
    expect(screen.getByText('Visit reference').closest('a')?.getAttribute('href'))
      .toBe('/people/person?book=account&page=1&passage=5-p3');
  });
});
