import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import MushafText from './MushafText';
import BranchTree from '@/app/quran/branches/BranchTree';
import PageSpread from '@/components/quran/PageSpread';
import { vi } from 'vitest';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

it('keeps context highlighting on the word rendered in the mushaf encoding', () => {
  const { container } = render(<PageSpread pages={[{ title: 'البقرة', rows: [[{ number: 224, words: ['تَجْعَلُوا۟'], marks: { 0: { kind: 'exact', title: 'shared' } } }]] }]} />);
  expect(container.querySelector('mark')?.textContent).toBe('تَجۡعَلُواْ');
  expect(container.querySelector('mark')?.title).toBe('shared');
});

it('renders tree roots, leaves and preceding words in the reader encoding', () => {
  const { container } = render(<BranchTree names={{}} prefixes={[{ word: 'لِّأَيْمَـٰنِكُمْ', keys: ['2:224'], conj: '', id: 'test' }]} tree={{ words: ['تَجْعَلُوا۟'], ayat: [], children: [{ words: ['تَبَرُّوا۟'], ayat: ['2:224'], children: [] }] }} />);
  const nodes = container.querySelector('[data-tree-content]')!;
  expect(nodes.textContent).toContain('تَجۡعَلُواْ');
  expect(nodes.textContent).toContain('تَبَرُّواْ');
  expect(nodes.textContent).toContain('لِّأَيۡمَٰنِكُمۡ');
  expect(nodes.querySelector('[style*="amiri"]')).toBeNull();
});

it('renders the screenshot ayah in the reader font encoding, including sukun and tanwin', () => {
  const text = 'وَلَا تَجْعَلُوا۟ ٱللَّهَ عُرْضَةًۭ لِّأَيْمَـٰنِكُمْ أَن تَبَرُّوا۟ وَتَتَّقُوا۟ وَتُصْلِحُوا۟ بَيْنَ ٱلنَّاسِ وَٱللَّهُ سَمِيعٌ عَلِيمٌۭ';
  const { container } = render(<MushafText>{text}</MushafText>);
  expect(container.textContent).toBe('وَلَا تَجۡعَلُواْ ٱللَّهَ عُرۡضَةٗ لِّأَيۡمَٰنِكُمۡ أَن تَبَرُّواْ وَتَتَّقُواْ وَتُصۡلِحُواْ بَيۡنَ ٱلنَّاسِ وَٱللَّهُ سَمِيعٌ عَلِيمٞ');
});

it('encodes shared synthetic forms without switching fonts', () => {
  const { container } = render(<MushafText>رَبْ</MushafText>);
  expect(container.textContent).toBe('رَبۡ');
  expect(container.querySelector('[style]')).toBeNull();
});

it('handles source words containing internal spaces', () => {
  const { container } = render(<MushafText>دَآئِرَ ةٌۭ</MushafText>);
  expect(container.textContent).toBe('دَآئِرَةٞ');
});
