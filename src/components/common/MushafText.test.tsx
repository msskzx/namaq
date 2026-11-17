import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import MushafText from './MushafText';
import PageSpread from '@/components/quran/PageSpread';
import { vi } from 'vitest';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

it('shows the page\'s words as they are, waqf signs included, with one medallion per ayah number', () => {
  const { container } = render(<MushafText>{'وَلَا تَجۡعَلُواْ ٱللَّهَ عُرۡضَةٗ لِّأَيۡمَٰنِكُمۡ فِرۡعَوۡنَۚ ﴿٢٢٤﴾'}</MushafText>);
  expect(container.textContent).toBe('وَلَا تَجۡعَلُواْ ٱللَّهَ عُرۡضَةٗ لِّأَيۡمَٰنِكُمۡ فِرۡعَوۡنَۚ ٢٢٤');
});

it('keeps context highlighting on a page word', () => {
  const { container } = render(<PageSpread pages={[{ title: 'البقرة', rows: [[{ number: 224, words: ['تَجۡعَلُواْ'], marks: { 0: { kind: 'exact', title: 'shared' } } }]] }]} />);
  expect(container.querySelector('mark')?.textContent).toBe('تَجۡعَلُواْ');
  expect(container.querySelector('mark')?.title).toBe('shared');
});
