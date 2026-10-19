import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { layoutNasab } from '@/lib/relationship/nasabLayout';
import NasabPlot from './NasabPlot';

afterEach(cleanup);

describe('lineage honorifics', () => {
  it.each([true, false])('marks only Companions with known sex, in Arabic and English (%s)', isArabic => {
    const layout = layoutNasab([
      { slug: 'ancestor', name: 'جد', fathers: [] },
      { slug: 'ali', name: 'علي بن أبي طالب', fathers: ['ancestor'], isCompanion: true, sex: 'MALE' },
      { slug: 'zaynab', name: 'زينب بنت علي', fathers: ['ali'], isCompanion: true, sex: 'FEMALE' },
      { slug: 'unknown', name: 'مجهول', fathers: [], isCompanion: true },
      { slug: 'prophet-muhammad', name: 'محمد', fathers: [], sex: 'MALE' },
    ], ['ali']);
    render(<NasabPlot layout={layout} isArabic={isArabic} />);
    expect(screen.getByText('علي ﵁')).toBeTruthy();
    expect(screen.getByText('زينب ﵂')).toBeTruthy();
    expect(screen.getByText('علي بن أبي طالب رضي الله عنه')).toBeTruthy();
    expect(screen.getByText('زينب بنت علي رضي الله عنها')).toBeTruthy();
    const labels = [...screen.getByRole('img').querySelectorAll('text')].map(node => node.textContent);
    expect(labels).toEqual(expect.arrayContaining(['جد', 'مجهول', 'محمد']));
  });
});
