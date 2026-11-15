import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { CardSide } from '@shared/quran/compareCards';
import CompareTree from './CompareTree';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe('CompareTree', () => {
  it('colours a word the other side writes differently amber on a node of one side (البقرة ٥١ and ٩٢)', () => {
    const sides: [CardSide, CardSide] = [
      { surah: 2, ayah: 51, ayat: [{ number: 51, words: ['وَإِذْ', 'وَٰعَدْنَا', 'مُوسَىٰٓ', 'أَرْبَعِينَ'], marks: { 2: { kind: 'exact', link: 'm' } } }] },
      { surah: 2, ayah: 92, ayat: [{ number: 92, words: ['وَلَقَدْ', 'جَآءَكُم', 'مُّوسَىٰ', 'بِٱلْبَيِّنَـٰتِ'], marks: { 2: { kind: 'exact', link: 'm' } } }] },
    ];
    const { container } = render(<CompareTree sides={sides} titles={['البقرة ٥١', 'البقرة ٩٢']} ar />);
    const colours = [...container.querySelectorAll('span[style]')].filter(span => /مُ?ّ?وسَىٰ/.test(span.textContent ?? '')).map(span => (span as HTMLElement).style.color);
    expect(colours.length).toBeGreaterThan(0);
    expect(colours.every(colour => colour === 'var(--mark-written)')).toBe(true);
  });
});
