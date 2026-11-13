import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { toggleBookmark } from '@shared/bookmarks';
import { homeQuranSections } from '@/lib/homeQuranSections';
import Homepage from './Homepage';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
vi.mock('@/components/common/NavBar', () => ({ NavActions: ({ children }: { children: React.ReactNode }) => children }));
const { quranContexts } = vi.hoisted(() => ({ quranContexts: vi.fn() }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));

const surahs = [
  { number: 2, name: 'البقرة', nameEn: undefined, count: 0 },
  { number: 3, name: 'آل عمران', nameEn: undefined, count: 0 },
  { number: 62, name: 'الجمعة', nameEn: undefined, count: 0 },
];
const data = {
  surahs,
  sections: homeQuranSections(surahs),
  bookmarkAyat: { family: ['2:129', '2:151', '3:164', '62:2'] },
  tour: null,
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

  it('shows the kind, grouped references and saved text as one card without action labels', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('button', { name: /الكتاب والحكمة/ });
    expect(card.textContent).toContain('البقرة ١٢٩، ١٥١');
    expect(card.textContent).toContain('آل عمران ١٦٤');
    expect(card.textContent).toContain('الجمعة ٢');
    expect(card.getAttribute('data-kind')).toBe('tree');
    expect(card.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('شجرة');
    expect(card.textContent).toMatch(/^البقرة/);
    expect(card.textContent).not.toMatch(/عائلة|فتح للمقارنة|فتح للاستكشاف/);
  });

  it('labels compare cards and mushaf ayat with their own kind', () => {
    localStorage.setItem('bookmarks', JSON.stringify([
      { id: 'compare:2:154|16:21', text: 'ولا تقولوا', href: '/quran/compare?a=2&b=16', savedAt: 2 },
      { id: 'ayah:2:255', text: 'الله لا إله إلا هو', href: '/quran/read/42', savedAt: 3 },
    ]));
    render(<Homepage data={data} />);
    const compare = screen.getByRole('button', { name: /ولا تقولوا/ });
    const ayah = screen.getByRole('button', { name: /الله لا إله إلا هو/ });
    expect(compare.getAttribute('data-kind')).toBe('compare');
    expect(compare.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('مقارنة');
    expect(compare.textContent).not.toContain('مقارنة');
    expect(ayah.getAttribute('data-kind')).toBe('ayah');
    expect(ayah.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('آية');
    expect(ayah.textContent).not.toContain('آية');
  });

  it('reacts to saves and removals made through the existing bookmark API', () => {
    render(<Homepage data={data} />);
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.getByRole('button', { name: /الكتاب والحكمة/ })).toBeTruthy();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
    expect(screen.getByText(/احفظ شجرة أو بطاقة مقارنة أو آية بزر/)).toBeTruthy();
  });

  it('keeps old bookmarks readable and navigable when their inventory entry is unknown', () => {
    localStorage.setItem('bookmarks', JSON.stringify([{ ...bookmark, id: 'old-tree', text: 'عبارة محفوظة' }]));
    render(<Homepage data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /عبارة محفوظة/ }));
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
  });

  it('opens a saved card’s icons on a click: open it, its first ayah in the mushaf, and remove it', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /الكتاب والحكمة/ }));
    const menu = screen.getByRole('dialog', { name: 'شجرة' });
    expect(within(menu).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
    expect(within(menu).getByRole('link', { name: 'في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/2/129');
    fireEvent.click(within(menu).getByRole('button', { name: 'أزلها من المحفوظات' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
  });

  it('shows the forgotten ayat, the last forgotten first, each with its words and its icons', async () => {
    quranContexts.mockResolvedValue([{ ayah: { key: '2:255', words: ['الله', 'لا', 'إله'] } }, { ayah: { key: '3:164', words: ['لقد', 'من'] } }]);
    localStorage.setItem('ayah-forgot', JSON.stringify({ '2:255': { forgot: 2, at: 5 }, '3:164': { forgot: 1, at: 9 } }));
    render(<Homepage data={data} />);
    const forgotten = screen.getByRole('region', { name: 'ما نسيته' });
    const cards = within(forgotten).getAllByRole('button');
    expect(cards[0].textContent).toMatch(/^آل عمران ١٦٤/);
    expect(cards[1].textContent).toMatch(/^البقرة ٢٥٥/);
    await waitFor(() => expect(cards[1].textContent).toContain('الله لا إله'));
    expect(within(forgotten).getByRole('link', { name: 'راجع ما نسيت (٢)' }).getAttribute('href')).toBe('/quran/read/ayah/2/255?recite=2:255&review=1');
    expect(within(screen.getByRole('region', { name: 'اختبارات القرآن' })).queryByRole('link', { name: /راجع ما نسيت/ })).toBeNull();
    fireEvent.click(cards[0]);
    const menu = screen.getByRole('dialog', { name: 'آية نسيتها' });
    expect(within(menu).getByRole('link', { name: 'سمّع من هذه الآية' }).getAttribute('href')).toBe('/quran/read/ayah/3/164?recite=3:164&review=1');
    expect(within(menu).getByRole('link', { name: 'في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/3/164');
    fireEvent.click(within(menu).getByRole('button', { name: 'تذكّرتها، أزلها من المراجعة' }));
    expect(within(forgotten).getAllByRole('button')).toHaveLength(1);
  });

  it('closes the icons on Escape and gives the focus back to the card', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Homepage data={data} />);
    const card = screen.getByRole('button', { name: /الكتاب والحكمة/ });
    card.focus();
    fireEvent.click(card);
    expect(document.activeElement?.closest('[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(card);
  });

  it('hides the forgotten shelf when nothing is forgotten', () => {
    render(<Homepage data={data} />);
    expect(screen.queryByRole('region', { name: 'ما نسيته' })).toBeNull();
  });
});
