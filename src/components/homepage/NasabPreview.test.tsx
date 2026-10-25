import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NasabPreview, { nasabCrop } from './NasabPreview';
import { layoutNasab } from '@/lib/relationship/nasabLayout';
import { nasabPlotHeight, nasabRowTop } from '../nasab/NasabPlot';

const people = [
  { slug: 'adnan', name: 'عدنان', fathers: [] },
  { slug: 'shared', name: 'جد', fathers: ['adnan'] },
  { slug: 'a', name: 'علي', fathers: ['shared'], isCompanion: true, sex: 'MALE' },
  { slug: 'b', name: 'عمر', fathers: ['shared'], isCompanion: true, sex: 'MALE' },
];
vi.mock('swr', () => ({ default: () => ({ data: { people, subjects: ['a', 'b'] } }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('complete lineage example', () => {
  it('retains ancestors above the first shared ancestor and every selected person', () => {
    render(<NasabPreview />);
    const plot = screen.getByRole('img', { name: 'شجرة النسب' });
    expect([...plot.querySelectorAll('text')].map(node => node.textContent)).toEqual(expect.arrayContaining(['عدنان', 'جد', 'علي ﵁', 'عمر ﵁']));
    expect(plot.textContent).not.toContain('الجد المشترك');
    expect(plot.textContent).not.toContain('الأب غير مسجل');
  });

  it('fades the ancestors above the one every line shares', () => {
    const { container } = render(<NasabPreview />);
    expect(container.querySelector<HTMLElement>('[style*="--fade"]')!.style.getPropertyValue('--fade')).toBe(`${nasabCrop(layoutNasab(people, ['a', 'b']))!.fade * 100}%`);
  });
});

describe('lineage crop', () => {
  const chain = (top: string, length: number) => Array.from({ length }, (_, i) => ({ slug: `${top}${i}`, name: `${top}${i}`, fathers: i === 0 ? [] : [`${top}${i - 1}`] }));
  const deep = [...chain('p', 6), { slug: 'x', name: 'x', fathers: ['p5'] }, { slug: 'y', name: 'y', fathers: ['p5'] }];

  it('keeps the shared ancestor and two rows above it, cropping the rest', () => {
    const layout = layoutNasab(deep, ['x', 'y']);
    const crop = nasabCrop(layout)!;
    const height = nasabPlotHeight(layout);
    expect(crop.keep * height).toBeCloseTo(height - nasabRowTop(3));
    expect(crop.fade * crop.keep * height).toBeCloseTo(nasabRowTop(5) - nasabRowTop(3));
  });

  it('keeps the whole tree when the shared ancestor is near the top', () => {
    expect(nasabCrop(layoutNasab(people, ['a', 'b']))!.keep).toBe(1);
  });

  it('does not crop one line or lines that never meet', () => {
    expect(nasabCrop(layoutNasab(deep, ['x']))).toBeNull();
    expect(nasabCrop(layoutNasab([...chain('p', 3), ...chain('q', 3)], ['p2', 'q2']))).toBeNull();
  });
});
