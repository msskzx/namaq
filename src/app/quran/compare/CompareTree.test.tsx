import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { CardSide } from '@shared/quran/compareCards';
import CompareTree from './CompareTree';
import BranchTree from '../branches/BranchTree';
import { compareTree } from '@shared/quran/braid';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe('CompareTree', () => {
  it('colours a word the other side writes differently amber on a node of one side (البقرة ٥١ and ٩٢)', () => {
    const sides: [CardSide, CardSide] = [
      { surah: 2, ayah: 51, ayat: [{ number: 51, words: ['وَإِذْ', 'وَٰعَدْنَا', 'مُوسَىٰٓ', 'أَرْبَعِينَ'], marks: { 2: { kind: 'exact', link: 'm' } } }] },
      { surah: 2, ayah: 92, ayat: [{ number: 92, words: ['وَلَقَدْ', 'جَآءَكُم', 'مُّوسَىٰ', 'بِٱلْبَيِّنَـٰتِ'], marks: { 2: { kind: 'exact', link: 'm' } } }] },
    ];
    const { container } = render(<CompareTree sides={sides} names={{ 2: 'البقرة' }} titles={['البقرة ٥١', 'البقرة ٩٢']} ar />);
    const kinds = [...container.querySelectorAll('mark[data-match]')].filter(mark => /مُ?ّ?وسَىٰ/.test(mark.textContent ?? '')).map(mark => mark.getAttribute('data-match'));
    expect(kinds).toEqual(['written', 'written']);
    // Each side's box names its ayah, over a rule, as every box of the branches tree does.
    expect([...container.querySelectorAll('[data-ref]')].map(ref => ref.textContent)).toEqual(['البقرة ٥١', 'البقرة ٩٢']);
  });

  it('hangs each side\'s ayah before above its first box and its ayah after under the box its last word is in', () => {
    // The two sides part and meet again on «ليلة»: each side's last word is in the box after the rejoin.
    const sides: [CardSide, CardSide] = [
      { surah: 2, ayah: 51, ayat: [{ number: 51, words: ['وَإِذْ', 'وَٰعَدْنَا', 'أَرْبَعِينَ', 'لَيْلَةً'] }] },
      { surah: 7, ayah: 142, ayat: [{ number: 142, words: ['وَوَٰعَدْنَا', 'مُوسَىٰ', 'ثَلَـٰثِينَ', 'لَيْلَةً'] }, { number: 143, words: ['أَرْبَعِينَ', 'لَيْلَةً'] }] },
    ];
    const { tree } = compareTree(sides);
    const near = (key: string) => ({ key, page: 1, words: [`آية-${key}`] });
    const data = { before: { '2:51': near('2:50'), '7:142': near('7:141') }, after: { '2:51': near('2:52'), '7:143': near('7:144') } };
    const { container } = render(<BranchTree tree={tree} names={{ 2: 'البقرة', 7: 'الأعراف' }} direction="down" showSpellings={false} surround={{ on: true, data }} />);
    for (const key of ['2:50', '7:141', '2:52', '7:144']) expect(container.textContent).toContain(`آية-${key}`);
  });
});
