import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Homepage from './Homepage';
import { getHomePreviews } from '@/lib/homePreviewData';

const { state } = vi.hoisted(() => ({ state: { language: 'ar', languageLoaded: true } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(() => { cleanup(); sessionStorage.clear(); });
describe('Quran learning homepage', () => {
  it.each(['ar', 'en'])('offers exploration, reading and solo/party quizzes in %s', async language => {
    state.language = language;
    render(<Homepage data={await getHomePreviews()} />);
    expect(document.querySelector('[dir]')?.getAttribute('dir')).toBe(language === 'ar' ? 'rtl' : 'ltr');
    const hrefs = screen.getAllByRole('link').map(link => link.getAttribute('href')!);
    expect(hrefs).toContain('/quran/branches');
    expect(hrefs).toContain('/quran/read');
    expect(hrefs).toContain('/quizzes?topic=BRANCHES');
    expect(hrefs).toContain('/quizzes/party');
    expect(hrefs.every(href => href.startsWith('/quran/branches') || href === '/quran/read' || href.startsWith('/quizzes'))).toBe(true);
    expect(screen.getByRole('region', { name: language === 'ar' ? 'مثال تفاعلي لشجرة عبارات قرآنية' : 'Interactive Quran phrase tree example' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: language === 'ar' ? /إظهار المسار/ : /Show path/ }).length).toBeGreaterThan(0);
  });
  it('allows pinning and unpinning a real example path', async () => {
    state.language = 'en';
    render(<Homepage data={await getHomePreviews()} />);
    const path = screen.getAllByRole('button', { name: /Show path/ })[0];
    fireEvent.click(path);
    expect(path.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(path);
    expect(path.getAttribute('aria-pressed')).toBe('false');
  });
});
