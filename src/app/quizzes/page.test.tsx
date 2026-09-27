import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const nav = vi.hoisted(() => {
  let url = '/quizzes';
  const listeners = new Set<() => void>();
  return {
    getUrl: () => url,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    push: (next: string) => {
      url = next;
      listeners.forEach((listener) => listener());
    },
    reset: (next: string) => {
      url = next;
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ push: nav.push }),
    usePathname: () => '/quizzes',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(
        nav.subscribe,
        () => nav.getUrl().split('?')[1] ?? '',
        () => nav.getUrl().split('?')[1] ?? '',
      );
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

const questions = Array.from({ length: 5 }, (_, index) => ({
  key: `question-${index + 1}`,
  family: 'KUNYA',
  promptArabic: `السؤال العربي ${index + 1}؟`,
  choices: [
    { value: 'right', labelArabic: 'الصحيح' },
    { value: 'one', labelArabic: 'الأول' },
    { value: 'two', labelArabic: 'الثاني' },
    { value: 'three', labelArabic: 'الثالث' },
  ],
  correctAnswer: 'right',
  evidence: { readerUrls: [] },
}));

vi.mock('swr', () => ({
  default: (key: string | null) => {
    if (key?.startsWith('/api/quiz/availability')) {
      const available = nav.getUrl().includes('topic=AYAT') ? 2 : 5;
      return { data: { available, lengths: available >= 5 ? [5] : [] }, error: null, isLoading: false };
    }
    if (key?.startsWith('/api/quiz?')) return { data: { questions }, error: null, isLoading: false };
    return { data: undefined, error: null, isLoading: false };
  },
}));

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

import QuizzesPage from './page';

beforeEach(() => {
  nav.reset('/quizzes');
});

afterEach(() => {
  cleanup();
});

describe('QuizzesPage', () => {
  it('renders reviewed Arabic content and only shows Submit on the final question', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    expect(screen.getByText('السؤال العربي 1؟')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Question 5' }));
    expect(screen.getByText('السؤال العربي 5؟')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Submit' })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });

  it('allows unanswered submission and reports it as incorrect', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Question 5' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('النتيجة: 0 من 5')).toBeTruthy();
    expect(screen.getAllByText('بدون إجابة')).toHaveLength(5);
  });

  it('shows the exact small supply and offers no impossible length', () => {
    nav.reset('/quizzes?topic=AYAT');
    render(<QuizzesPage />);

    expect(screen.getByText('2 questions available')).toBeTruthy();
    expect(screen.getByText('Fewer than five approved questions are available.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '5' })).toBeNull();
  });
});
