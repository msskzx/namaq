import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ayahPreview } from './ayahPreview';
import { qiraatOf } from '@shared/quran/qiraatData';
import { LanguageProvider } from '@/components/language/LanguageContext';
import AyahPreviewSheet from './AyahPreviewSheet';
import type { BalaghaAyah } from './balagha';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }), usePathname: () => '/quran/read', useSearchParams: () => new URLSearchParams() }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };
});
afterEach(cleanup);

describe('the readings sheet', () => {
  it("lists each differing word, Hafs's reading first, with who reads each and the source", () => {
    render(<AyahPreviewSheet preview={{ kind: 'readings', key: '2:85', qiraat: qiraatOf('2:85') }} onClose={vi.fn()} />);
    expect(screen.getByText('تَعۡمَلُونَ')).toBeTruthy();
    expect(screen.getByText('يعملون')).toBeTruthy();
    expect(screen.getAllByText('الباقون').length).toBeGreaterThan(0);
    expect(screen.getByText('المصدر: الموسوعة القرآنية').getAttribute('href')).toBe('https://quranpedia.net');
  });
});

describe('the trees sheet', () => {
  it("draws each tree as the branches page's card, with its own switch to the matrix", async () => {
    const data = ayahPreview('2:25');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
    render(<LanguageProvider><AyahPreviewSheet preview={{ kind: 'trees', key: '2:25', all: '/quran/branches?k=2:25' }} onClose={vi.fn()} /></LanguageProvider>);
    const switches = await screen.findAllByRole('button', { name: 'عرض المصفوفة' });
    expect(switches.length).toBe(data.trees.length);
    fireEvent.click(switches[0]);
    expect(screen.getAllByRole('button', { name: 'عرض الشجرة' }).length).toBe(1);
    vi.unstubAllGlobals();
  });
});

describe('the balagha sheet', () => {
  it("shows al-Zamakhshari's whole passage, his device words in front of the lit sentence, and folds the book open", async () => {
    const text = 'قرئ ﴿وَهَنَ﴾ بالحركات الثلاث. شبه الشيب بشواظ النار، ثم أخرجه مخرج الاستعارة في ﴿وَاشْتَعَلَ﴾. آخر.';
    const [start, end] = [text.indexOf('شبه'), text.indexOf('آخر') - 1];
    const data: BalaghaAyah = {
      words: ['قَالَ', 'رَبِّ', 'إِنِّي', 'وَهَنَ', 'ٱلۡعَظۡمُ', 'مِنِّي', 'وَٱشۡتَعَلَ', 'ٱلرَّأۡسُ', 'شَيۡبࣰا'], version: '2026-08-10',
      passage: { surah: 19, from: 4, to: 4, part: 3, pages: [5, 6], text, lit: [[start, end, 0, 4, 6, 6], [start, end, 1, 4, 6, 6]] },
    };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
    render(<LanguageProvider><AyahPreviewSheet preview={{ kind: 'balagha', key: '19:4' }} onClose={vi.fn()} /></LanguageProvider>);
    const lit = await screen.findByRole('button', { name: /«الاستعارة» «التشبيه»/ });
    expect(lit.textContent).toContain('ثم أخرجه مخرج الاستعارة');
    const credit = screen.getByRole('button', { name: /الكشاف للزمخشري/ });
    expect(credit.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(credit);
    expect(screen.getByText('اقرأ الصفحة').getAttribute('href')).toMatch(/^https:\/\/quranpedia\.net\/book\/346\//);
    vi.unstubAllGlobals();
  });
});
