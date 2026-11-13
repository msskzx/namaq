// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranIltifatPage from './page';

vi.mock('@/components/common/SettingsHelp', () => ({ SettingsHelp: () => null }));
afterEach(cleanup);

describe('QuranIltifatPage', () => {
  it('shows the title and the seven cards, with no explanation on the page', () => {
    render(<QuranIltifatPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'الالتفات' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(document.body.textContent).not.toContain('انتقال الكلام');
  });
});
