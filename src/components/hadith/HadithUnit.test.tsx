// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import HadithUnit from './HadithUnit';
import { hadithView } from '@/lib/model/hadithView';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="icon" />,
}));

vi.mock('./IsnadSvg', () => ({
  default: ({ profiles }: { profiles: string[] }) => (
    <div data-testid="isnad-svg">
      <div data-testid="svg-profiles">{profiles.join(',')}</div>
      SVG Diagram
    </div>
  ),
}));

vi.mock('./PageReader', () => ({
  default: () => <div>Page Reader</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('HadithUnit component', () => {
  it('renders in bubbles mode by default', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.length).toBeGreaterThan(0);
  });

  it('switches to Full text mode and shows the full text', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const fullTextButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(fullTextButton);
    expect(screen.getByText(/حَدَّثَنَا مُسَدَّدٌ/)).toBeTruthy();
  });

  it('switches back from Full text to bubbles mode', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const fullTextButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(fullTextButton);
    expect(screen.getByText(/حَدَّثَنَا مُسَدَّدٌ/)).toBeTruthy();
    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    fireEvent.click(bubblesButton);
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.length).toBeGreaterThan(0);
  });

  it('does not show extracted-text view or bubbles checkbox', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes).toHaveLength(0);
  });

  it('shows compiler\'s remark exactly once, not in either mode', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const remarkHeadings = h2s.filter((h) => h.textContent?.includes('تعليق المصنف'));
    expect(remarkHeadings).toHaveLength(1);
    const fullTextButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(fullTextButton);

    const h2sAfter = screen.getAllByRole('heading', { level: 2 });
    const remarkHeadingsAfter = h2sAfter.filter((h) => h.textContent?.includes('تعليق المصنف'));
    expect(remarkHeadingsAfter).toHaveLength(1);
  });

  it('renders a profile link when agent is in profiles prop', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} profiles={['ismail-ibn-ibrahim-ibn-ulayyah']} />);
    const svgProfilesDiv = screen.getByTestId('svg-profiles');
    expect(svgProfilesDiv.textContent).toContain('ismail-ibn-ibrahim-ibn-ulayyah');
  });

  it('does not create profile links when profiles prop is empty', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} profiles={[]} />);
    const svgProfilesDiv = screen.getByTestId('svg-profiles');
    expect(svgProfilesDiv.textContent).toBe('');
  });

  it('Muslim hadith also starts in bubbles mode with toggle', () => {
    const view = hadithView('muslim-jibril')!;
    render(<HadithUnit view={view} />);
    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    const fullTextButton = screen.getByRole('button', { name: /النص كاملاً/ });

    expect(bubblesButton).toBeTruthy();
    expect(fullTextButton).toBeTruthy();
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.length).toBeGreaterThan(0);
  });

  it('shows isnad diagram in bubbles mode', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    expect(screen.getByTestId('isnad-svg')).toBeTruthy();
  });

  it('hides isnad diagram in full text mode', () => {
    const view = hadithView('bukhari-jibril')!;
    render(<HadithUnit view={view} />);
    const fullTextButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(fullTextButton);
    expect(screen.queryByTestId('isnad-svg')).toBeNull();
  });

  it('a hadith with no scenes still shows the diagram and its matn in bubbles mode', () => {
    const view = hadithView('bukhari-jibril')!;
    const bare = { ...view, reports: [{ ...view.reports[0], scenes: [] }] };
    render(<HadithUnit view={bare} />);
    expect(screen.getByTestId('isnad-svg')).toBeTruthy();
    expect(screen.queryByText(/المشهد/)).toBeNull();
    expect(document.body.textContent).toContain(view.reports[0].statements[0]);
  });
});
