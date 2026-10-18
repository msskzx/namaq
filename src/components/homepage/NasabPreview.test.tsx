import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NasabPreview from './NasabPreview';

vi.mock('swr', () => ({ default: () => ({ data: {
  people: [
    { slug: 'adnan', name: 'عدنان', fathers: [] },
    { slug: 'shared', name: 'جد', fathers: ['adnan'] },
    { slug: 'a', name: 'علي', fathers: ['shared'] },
    { slug: 'b', name: 'عمر', fathers: ['shared'] },
  ], subjects: ['a', 'b'],
} }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('complete lineage example', () => {
  it('retains ancestors above the first shared ancestor and every selected person', () => {
    render(<NasabPreview />);
    const plot = screen.getByRole('img', { name: 'شجرة النسب' });
    expect([...plot.querySelectorAll('text')].map(node => node.textContent)).toEqual(expect.arrayContaining(['عدنان', 'جد', 'علي', 'عمر']));
    expect(plot.textContent).not.toContain('الجد المشترك');
    expect(plot.textContent).not.toContain('الأب غير مسجل');
  });
});
