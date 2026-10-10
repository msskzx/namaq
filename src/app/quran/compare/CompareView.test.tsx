// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import CompareView from './CompareView';
import fixture from '@/lib/quran/compare.fixture.json';
import { alignSurahs } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const fx = fixture as Record<string, string[]>;
const words = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0));
const side = (number: number, plain: string) => ({ number, name: plain, plain, words: words(number).map(w => w.display.join(' ')) });

afterEach(cleanup);

describe('CompareView on Al-Hadid and At-Taghabun', () => {
  const rows = alignSurahs(words(57).map(w => w.norm), words(64).map(w => w.norm));

  it('shows 64:1 on one card with both 57:1 and 57:2 beside it', () => {
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={rows} />);
    const text = container.textContent ?? '';
    const cards = Array.from(container.querySelectorAll('.font-arabic')).map(c => c.textContent);
    const first = side(64, '').words[0];
    expect(cards.filter(c => c === first)).toHaveLength(1);
    expect(cards.filter(c => c === side(57, '').words[0])).toHaveLength(1);
    expect(cards.filter(c => c === side(57, '').words[1])).toHaveLength(1);
    expect(text).toContain('التغابن');
  });

  it('colors the shared words of the two links in different colors', () => {
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={rows} />);
    const shared = container.querySelectorAll('mark');
    expect(new Set(Array.from(shared).map(m => m.className)).size).toBeGreaterThan(1);
  });
});
