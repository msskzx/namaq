// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import WorkInProgressBanner from './WorkInProgressBanner';

const { language } = vi.hoisted(() => ({ language: { current: 'ar' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

afterEach(() => {
  cleanup();
  language.current = 'ar';
});

describe('WorkInProgressBanner', () => {
  it('says in Arabic that the project is unreviewed', () => {
    language.current = 'ar';

    render(<WorkInProgressBanner />);

    const note = screen.getByRole('note');
    expect(note.textContent).toContain(
      'هذا المشروع قيد التطوير ولم يُراجَع بعد من قِبل أهل العلم. قد تحتوي المعلومات على أخطاء، فلا تعتمد عليها دون الرجوع إلى المصادر.',
    );
  });

  it('says the same thing in English', () => {
    language.current = 'en';

    render(<WorkInProgressBanner />);

    const note = screen.getByRole('note');
    expect(note.textContent).toContain(
      'This project is a work in progress and has not yet been reviewed by scholars. The information may contain mistakes, so do not rely on it without checking the sources.',
    );
  });

  it('shows one notice with no way to dismiss it', () => {
    render(<WorkInProgressBanner />);

    expect(screen.getAllByRole('note')).toHaveLength(1);
    expect(screen.queryByRole('button')).toBeNull();
  });
});