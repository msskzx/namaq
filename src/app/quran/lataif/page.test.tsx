// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranLataifPage from './page';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('QuranLataifPage', () => {
  it('shows the title and the seven cards, each followed by its reference', async () => {
    render(await QuranLataifPage());
    expect(screen.getByRole('heading', { level: 1, name: 'لطائف' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(document.body.textContent).not.toContain('انتقال الكلام');
  });
});
