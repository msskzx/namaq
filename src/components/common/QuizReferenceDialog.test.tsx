// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuizReferenceDialog from './QuizReferenceDialog';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const reference = {
  excerptArabic: 'نص الشاهد',
  sourceTitle: 'سير أعلام النبلاء',
  pageReference: '5',
  readerUrl: '/people/zaynab-bint-jahsh?book=account-1&page=3&passage=5-p3',
};

describe('QuizReferenceDialog', () => {
  it('renders nothing without a reference', () => {
    const { container } = render(<QuizReferenceDialog reference={null} onClose={() => {}} />);
    expect(container.innerHTML).toBe('');
    cleanup();
  });

  it('shows the cited excerpt with its source and page', () => {
    render(<QuizReferenceDialog reference={reference} onClose={() => {}} />);
    expect(screen.getByText('نص الشاهد')).toBeTruthy();
    expect(screen.getByText(/سير أعلام النبلاء/)).toBeTruthy();
    expect(screen.getByRole('dialog')).toBeTruthy();
    cleanup();
  });

  it('opens the exact reader passage in a new tab', () => {
    render(<QuizReferenceDialog reference={reference} onClose={() => {}} />);
    const visit = screen.getByText('فتح المرجع في القارئ').closest('a');
    expect(visit?.getAttribute('href')).toBe(reference.readerUrl);
    expect(visit?.getAttribute('target')).toBe('_blank');
    cleanup();
  });

  it('closes by its button and by a tap on the backdrop', () => {
    const onClose = vi.fn();
    render(<QuizReferenceDialog reference={reference} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'إغلاق المرجع' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(2);
    cleanup();
  });
});
