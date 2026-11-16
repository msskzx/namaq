// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranBalaghaPage from './page';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('QuranBalaghaPage', () => {
  it('shows the title and the seven cards, each followed by its reference', () => {
    render(<QuranBalaghaPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'البلاغة' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(document.body.textContent).not.toContain('انتقال الكلام');
  });
});
