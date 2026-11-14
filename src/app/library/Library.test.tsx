import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { toggleBookmark } from '@shared/bookmarks';
import Library from './Library';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/NavBar', () => ({ NavActions: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
const { quranContexts } = vi.hoisted(() => ({ quranContexts: vi.fn() }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts }));

const data = { surahs: [{ number: 2, name: 'البقرة' }], bookmarkAyat: {} };
const saved = Array.from({ length: 7 }, (_, at) => ({ id: `ayah:2:${at + 1}`, text: `آية ${at + 1}`, href: `/quran/read/ayah/2/${at + 1}`, savedAt: at }));

afterEach(() => { cleanup(); localStorage.clear(); quranContexts.mockReset(); });

describe('the saved and forgotten page', () => {
  it('lists every saved card under the Saved switch, each opening the card menu', () => {
    localStorage.setItem('bookmarks', JSON.stringify(saved));
    render(<Library data={data} tab="saved" />);
    const switcher = screen.getByRole('navigation', { name: 'المحفوظات وما نسيته وتأملاتي' });
    expect(within(switcher).getByRole('link', { name: 'المحفوظات' }).getAttribute('aria-current')).toBe('page');
    expect(within(switcher).getByRole('link', { name: 'ما نسيته' }).getAttribute('href')).toBe('/library?tab=forgotten');
    expect(screen.getAllByRole('button', { name: /آية/ })).toHaveLength(7);
    fireEvent.click(screen.getByRole('button', { name: /آية 7/ }));
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe('/quran/read/ayah/2/7');
  });

  it('lists every forgotten ayah, the last forgotten first, with its words', async () => {
    quranContexts.mockImplementation(async (keys: string[]) => keys.map(key => ({ ayah: { key, words: [`نص ${key}`] } })));
    localStorage.setItem('ayah-forgot', JSON.stringify({ '2:1': { forgot: 1, at: 1 }, '2:2': { forgot: 1, at: 2 } }));
    render(<Library data={data} tab="forgotten" />);
    const cards = screen.getAllByRole('button', { name: /البقرة/ });
    expect(cards.map(card => card.textContent?.slice(0, 8))).toEqual(['البقرة ٢', 'البقرة ١']);
    await waitFor(() => expect(cards[0].textContent).toContain('نص 2:2'));
  });

  it('lists the notes, newest first, and edits one from its menu', async () => {
    quranContexts.mockResolvedValue([]);
    localStorage.setItem('ayah-notes', JSON.stringify({ '2:1': { text: 'أول', at: 1 }, '2:2': { text: 'ثان', at: 2 } }));
    render(<Library data={data} tab="notes" />);
    const cards = screen.getAllByRole('button', { name: /البقرة/ });
    expect(cards.map(card => card.textContent)).toEqual(['البقرة ٢ثان', 'البقرة ١أول']);
    fireEvent.click(cards[0]);
    fireEvent.click(within(screen.getByRole('dialog', { name: 'تأمل' })).getByRole('button', { name: 'عدّل التأمل' }));
    const box = await screen.findByRole('textbox', { name: 'تأملك في هذه الآية' });
    expect((box as HTMLTextAreaElement).value).toBe('ثان');
    fireEvent.change(box, { target: { value: 'ثالث' } });
    await waitFor(() => expect(JSON.parse(localStorage.getItem('ayah-notes')!)['2:2'].text).toBe('ثالث'));
    expect(document.activeElement).not.toBe(box);
  });

  it('says when a list is empty', () => {
    render(<Library data={data} tab="saved" />);
    expect(screen.getByText('لا شيء محفوظ بعد.')).toBeTruthy();
    cleanup();
    render(<Library data={data} tab="forgotten" />);
    expect(screen.getByText('لا آيات منسية.')).toBeTruthy();
  });
});

// Saved cards, moved here from home when its shelf went (owner, 2026-11-14): the library page shows the same cards.
const homeData = {
  surahs: [{ number: 2, name: 'البقرة' }, { number: 3, name: 'آل عمران' }, { number: 62, name: 'الجمعة' }],
  bookmarkAyat: { family: ['2:129', '2:151', '3:164', '62:2'] },
};
const bookmark = { id: 'family', text: 'الكتاب والحكمة', href: '/quran/branches?o=family', savedAt: 1 };

describe('saved cards', () => {
  it('shows the kind, grouped references and saved text as one card without action labels', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Library data={homeData} tab="saved" />);
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
    render(<Library data={homeData} tab="saved" />);
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
    render(<Library data={homeData} tab="saved" />);
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.getByRole('button', { name: /الكتاب والحكمة/ })).toBeTruthy();
    act(() => { toggleBookmark(bookmark); });
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
  });

  it('keeps old bookmarks readable and navigable when their inventory entry is unknown', () => {
    localStorage.setItem('bookmarks', JSON.stringify([{ ...bookmark, id: 'old-tree', text: 'عبارة محفوظة' }]));
    render(<Library data={homeData} tab="saved" />);
    fireEvent.click(screen.getByRole('button', { name: /عبارة محفوظة/ }));
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
  });

  it('opens a saved card’s icons on a click: open it, its first ayah in the mushaf, and remove it', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Library data={homeData} tab="saved" />);
    fireEvent.click(screen.getByRole('button', { name: /الكتاب والحكمة/ }));
    const menu = screen.getByRole('dialog', { name: 'شجرة' });
    expect(within(menu).getByRole('link', { name: 'افتحها' }).getAttribute('href')).toBe(bookmark.href);
    expect(within(menu).getByRole('link', { name: 'في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/2/129');
    fireEvent.click(within(menu).getByRole('button', { name: 'أزلها من المحفوظات' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('button', { name: /الكتاب والحكمة/ })).toBeNull();
  });

  it('closes the icons on Escape and gives the focus back to the card', () => {
    localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    render(<Library data={homeData} tab="saved" />);
    const card = screen.getByRole('button', { name: /الكتاب والحكمة/ });
    card.focus();
    fireEvent.click(card);
    expect(document.activeElement?.closest('[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(card);
  });

});
