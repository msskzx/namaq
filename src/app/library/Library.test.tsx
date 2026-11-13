import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
