import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ayahPreview } from './ayahPreview';
import { qiraatOf } from '@shared/quran/qiraatData';
import { LanguageProvider } from '@/components/language/LanguageContext';
import AyahPreviewSheet from './AyahPreviewSheet';
import type { BalaghaAyah } from './balagha';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }), usePathname: () => '/quran/read', useSearchParams: () => new URLSearchParams() }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };
});
afterEach(cleanup);

describe('the readings sheet', () => {
  it("lists each differing word, Hafs's reading first, with who reads each and the source", () => {
    render(<AyahPreviewSheet preview={{ kind: 'readings', key: '2:85', qiraat: qiraatOf('2:85') }} onClose={vi.fn()} />);
    expect(screen.getByText('تَعۡمَلُونَ')).toBeTruthy();
    expect(screen.getByText('يَعۡمَلُونَ')).toBeTruthy();
    expect(screen.getAllByText('الباقون').length).toBeGreaterThan(0);
    expect(screen.getByText('المصدر: الموسوعة القرآنية').getAttribute('href')).toBe('https://quranpedia.net');
  });
});

describe('the trees sheet', () => {
  it("draws each tree as the branches page's card, opening as the matrix with its own switch to the tree", async () => {
    const data = ayahPreview('2:25');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
    render(<LanguageProvider><AyahPreviewSheet preview={{ kind: 'trees', key: '2:25', all: '/quran/branches?k=2:25' }} onClose={vi.fn()} /></LanguageProvider>);
    const switches = await screen.findAllByRole('button', { name: 'عرض الشجرة' });
    // A card kept as its matrix only (the owner's call, on branches or on its compare twin) has no switch to the tree.
    const drawable = data.trees.filter(tree => !tree.matrixOnly);
    expect(drawable.length).toBeGreaterThan(0);
    expect(switches.length).toBe(drawable.length);
    fireEvent.click(switches[0]);
    expect(screen.getAllByRole('button', { name: 'عرض المصفوفة' }).length).toBe(1);
    vi.unstubAllGlobals();
  });

  it('lists every ayah a quote fits when al-Suyuti names none, each opening in the mushaf', async () => {
    const data: BalaghaAyah = {
      itqan: [{ kind: 'النَّوْعُ السَّادِسُ وَالْخَمْسُونَ', heading: 'الصِّفَةُ', part: 3, pages: [233, 233], id: 900, text: 'وقرئ ﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾.', words: [[0, 3]], places: 2, matches: ['1:2', '6:45'] }],
      words: ['ٱلۡحَمۡدُ', 'لِلَّهِ', 'رَبِّ', 'ٱلۡعَٰلَمِينَ'], version: '2026-08-10', passage: null,
    };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
    render(<LanguageProvider><AyahPreviewSheet preview={{ kind: 'balagha', key: '1:2' }} onClose={vi.fn()} /></LanguageProvider>);
    const line = await screen.findByRole('button', { name: 'مواضع الشاهد في القرآن: ٢، ولم يعيّن السيوطي أحدها' });
    expect(line.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(line);
    fireEvent.click(screen.getByRole('button', { name: /^افتح الأَنْعَامْ ٤٥ في المصحف$/ }));
    expect(push).toHaveBeenCalledWith('/quran/read/ayah/6/45');
    vi.unstubAllGlobals();
  });
});

describe('the balagha sheet', () => {
  it("opens on al-Suyuti's paragraph under his heading, lights the words it quotes, then shows al-Zamakhshari's passage on the other pill", async () => {
    const text = 'قرئ ﴿وَهَنَ﴾ بالحركات الثلاث. شبه الشيب بشواظ النار، ثم أخرجه مخرج الاستعارة في ﴿وَاشْتَعَلَ﴾. آخر.';
    const [start, end] = [text.indexOf('شبه'), text.indexOf('آخر') - 1];
    const data: BalaghaAyah = {
      itqan: [{ kind: 'النَّوْعُ الثَّامِنُ وَالْخَمْسُونَ: فِي بَدَائِعِ الْقُرْآنِ', heading: 'الِاسْتِعَارَةُ', part: 3, pages: [150, 151], id: 1000, text: 'ومنه ﴿وَاشْتَعَلَ الرَّأْسُ شَيْبًا﴾ كله.', words: [[6, 8]], places: 1, matches: [] }],
      words: ['قَالَ', 'رَبِّ', 'إِنِّي', 'وَهَنَ', 'ٱلۡعَظۡمُ', 'مِنِّي', 'وَٱشۡتَعَلَ', 'ٱلرَّأۡسُ', 'شَيۡبࣰا'], version: '2026-08-10',
      passage: { surah: 19, from: 4, to: 4, part: 3, pages: [5, 6], text, lit: [[start, end, 0, 4, 6, 6], [start, end, 1, 4, 6, 6]] },
    };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => data })));
    render(<LanguageProvider><AyahPreviewSheet preview={{ kind: 'balagha', key: '19:4' }} onClose={vi.fn()} /></LanguageProvider>);
    const itqanTab = await screen.findByRole('tab', { name: 'الإتقان للسيوطي' });
    expect(itqanTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText(/«الِاسْتِعَارَةُ» · النَّوْعُ الثَّامِنُ/)).toBeTruthy();
    expect(screen.getByText('شَيۡبࣰا').className).toMatch(/20%/);
    expect(screen.getByText('قَالَ').className).not.toMatch(/20%/);
    fireEvent.click(screen.getByRole('button', { name: 'الإتقان للسيوطي ٣/١٥٠–١٥١' }));
    expect(screen.getByText('اقرأ الصفحة').getAttribute('href')).toBe('https://shamela.ws/book/11728/1000');
    fireEvent.click(screen.getByRole('tab', { name: 'الكشاف للزمخشري' }));
    const lit = await screen.findByRole('button', { name: /«الاستعارة» «التشبيه»/ });
    expect(lit.textContent).toContain('ثم أخرجه مخرج الاستعارة');
    const credit = screen.getByRole('button', { name: /الكشاف للزمخشري/ });
    expect(credit.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(credit);
    expect(screen.getByText('اقرأ الصفحة').getAttribute('href')).toMatch(/^https:\/\/quranpedia\.net\/book\/346\//);
    vi.unstubAllGlobals();
  });
});
