vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Homepage from './Homepage';
import { getHomePreviews } from '@/lib/homePreviewData';

const { state } = vi.hoisted(() => ({ state: { language: 'ar', languageLoaded: true } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(() => { cleanup(); sessionStorage.clear(); vi.unstubAllGlobals(); });
describe('Quran learning homepage', () => {
  it.each(['ar', 'en'])('offers exploration, reading and quizzes in three cards in %s', async language => {
    state.language = language;
    render(<Homepage data={await getHomePreviews()} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(language === 'ar' ? 'متشابهات القرآن' : 'Quran phrase trees');
    expect(screen.getByRole('switch', { name: language === 'ar' ? 'الآيات المحيطة' : 'Surrounding ayat' })).toHaveProperty('checked', false);
    expect(screen.queryByRole('list', { name: /ما قبل العبارة|Before the phrase/ })).toBeNull();
    expect(screen.getByRole('button', { name: language === 'ar' ? 'تصغير' : 'Zoom out' })).toBeTruthy();
    expect(screen.getByRole('button', { name: language === 'ar' ? 'تكبير' : 'Zoom in' })).toBeTruthy();
    expect(document.querySelector('[dir]')?.getAttribute('dir')).toBe(language === 'ar' ? 'rtl' : 'ltr');
    const hrefs = screen.getAllByRole('link').map(link => link.getAttribute('href')!);
    expect(hrefs).toContain('/quran/branches');
    expect(hrefs).toContain('/quran/read');
    expect(hrefs).toContain('/quizzes');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
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
  it('shows surrounding ayat only when requested and hides them again', async () => {
    state.language = 'en';
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ before: { '15:45': { key: '15:44', words: ['السياق السابق للاختبار'] } }, after: {} }) })));
    render(<Homepage data={await getHomePreviews()} />);
    expect(screen.queryByText('السياق السابق للاختبار')).toBeNull();
    const toggle = screen.getByRole('switch', { name: 'Surrounding ayat' });
    fireEvent.click(toggle);
    expect(await screen.findByText('السياق السابق للاختبار')).toBeTruthy();
    fireEvent.click(toggle);
    expect(screen.queryByText('السياق السابق للاختبار')).toBeNull();
  });
  it('places navigation above the example and offers no random tree', async () => {
    state.language = 'en';
    render(<Homepage data={await getHomePreviews()} />);
    const all = screen.getByRole('link', { name: 'Browse all' });
    const example = screen.getByRole('region', { name: 'Interactive Quran phrase tree example' });
    expect(all.compareDocumentPosition(example) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Random' })).toBeNull();
  });
});
