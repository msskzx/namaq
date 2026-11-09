import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import { toggleBookmark } from '@shared/bookmarks';
import { homeQuranSections } from '@/lib/homeQuranSections';
import Homepage from './Homepage';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
vi.mock('@/components/common/NavBar', () => ({ NavActions: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/app/quran/branches/OpeningSearch', () => ({ default: () => <input aria-label="Phrase search" /> }));
vi.mock('@/app/quran/branches/Filters', () => ({ FilterButton: () => <button>Filter</button> }));

const surahs = [
  { number: 2, name: 'البقرة', nameEn: undefined, count: 0 },
  { number: 3, name: 'آل عمران', nameEn: undefined, count: 0 },
  { number: 62, name: 'الجمعة', nameEn: undefined, count: 0 },
];
const data = {
  surahs,
  sections: homeQuranSections(surahs),
  bookmarkAyat: { family: ['2:129', '2:151', '3:164', '62:2'] },
};
const bookmark = { id: 'family', text: 'الكتاب والحكمة', href: '/quran/branches?o=family', savedAt: 1 };

afterEach(() => { cleanup(); localStorage.clear(); state.language = 'ar'; });

describe('release homepage', () => {
  it.each(['ar', 'en'])('places saved material between the Quran widget and quizzes in %s', language => {
    state.language = language;
    render(<Homepage data={data} />);
    const ar = language === 'ar';
    const quran = screen.getByRole('region', { name: ar ? 'القرآن الكريم' : 'Quran' });
    const saved = screen.getByRole('region', { name: ar ? 'المحفوظات' : 'Saved' });
    const quizzes = screen.getByRole('region', { name: ar ? 'اختبارات القرآن' : 'Quran quizzes' });
    expect(quran.compareDocumentPosition(saved) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(saved.compareDocumentPosition(quizzes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(quizzes).getByRole('link', { name: ar ? 'بمفردك' : 'Solo' }).getAttribute('href')).toBe('/quizzes');
    expect(within(quizzes).getByRole('link', { name: ar ? 'مع غيرك' : 'Party' }).getAttribute('href')).toBe('/quizzes/party');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(ar ? 'نمق' : 'Namaq');
    expect(screen.getByRole('heading', { level: 1 }).querySelector('svg')).toBeNull();
  });

  it('shows grouped references and saved text as one link without card icons or action labels', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('link', { name: /الكتاب والحكمة/ });
    expect(card.getAttribute('href')).toBe(bookmark.href);
    expect(card.textContent).toContain('البقرة ١٢٩، ١٥١');
    expect(card.textContent).toContain('آل عمران ١٦٤');
    expect(card.textContent).toContain('الجمعة ٢');
    expect(card.querySelector('svg')).toBeNull();
    expect(card.textContent).not.toMatch(/عائلة|فتح للمقارنة|فتح للاستكشاف/);
  });

  it('reacts to saves and removals made through the existing bookmark API', () => {
    render(<Homepage data={data} />);
    expect(screen.queryByRole('link', { name: /الكتاب والحكمة/ })).toBeNull();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.getByRole('link', { name: /الكتاب والحكمة/ })).toBeTruthy();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.queryByRole('link', { name: /الكتاب والحكمة/ })).toBeNull();
    expect(screen.getByText(/احفظ شجرة أو عائلة أو بطاقة مقارنة أو آية بزر/)).toBeTruthy();
  });

  it('keeps old bookmarks readable and navigable when their inventory entry is unknown', () => {
    localStorage.setItem('bookmarks', JSON.stringify([{ ...bookmark, id: 'old-tree', text: 'عبارة محفوظة' }]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('link', { name: 'عبارة محفوظة' });
    expect(card.getAttribute('href')).toBe(bookmark.href);
  });
});
