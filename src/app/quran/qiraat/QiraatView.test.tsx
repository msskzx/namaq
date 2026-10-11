// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QiraatView from './QiraatView';
import { variants } from './data/variants';
import hafs from './data/hafs.fixture.json';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const texts = hafs as Record<string, string>;
const pick = (label: string) => screen.getByRole('button', { name: new RegExp(`${label}$`) });
const entries = variants.map(variant => ({ variant, text: texts[`${variant.surah}:${variant.ayah}`], surahName: 'سُورَةُ ٱلْفَاتِحَةِ' }));

afterEach(cleanup);

describe('QiraatView', () => {
  it('offers thirteen variants and starts on 1:4', () => {
    const { container } = render(<QiraatView entries={entries} />);
    expect(screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button')).toHaveLength(13);
    expect(container.querySelectorAll('li[data-state]')).toHaveLength(20);
    expect(container.textContent).toContain('فرق على مستوى الكلمة، وليس نص مصحف تلك الرواية');
  });

  it('shows the Hafs/Shu\'ba split on 5:6 and withholds the meaning', () => {
    const { container } = render(<QiraatView entries={entries} />);
    fireEvent.click(pick('٥:٦'));
    const chip = (name: string) => screen.getByText(name).closest('li')!.getAttribute('data-state');
    expect(chip('حفص')).toBe('0');
    expect(chip('شعبة')).toBe('1');
    expect(container.textContent).toContain('لا يُعرض شرح هنا لأنه موضع خلاف فقهي');
  });

  it('shows no unreviewed label on an unsourced meaning and greys every chip on 18:86', () => {
    const { container } = render(<QiraatView entries={entries} />);
    fireEvent.click(pick('٢:٩'));
    expect(container.textContent).not.toContain('غير موثق');
    fireEvent.click(pick('١٨:٨٦'));
    expect(container.querySelectorAll('li[data-state="unknown"]')).toHaveLength(20);
  });

  it('nests each imam\'s two riwat under him', () => {
    render(<QiraatView entries={entries} />);
    const imams = screen.getByRole('list', { name: 'الأئمة ورواتهم' }).children;
    expect(imams).toHaveLength(10);
    for (const imam of imams) expect(imam.querySelectorAll('li[data-state]')).toHaveLength(2);
  });

  it('says so when no ayah is stored', () => {
    const { container } = render(<QiraatView entries={[]} />);
    expect(container.textContent).toContain('لا توجد آيات');
  });

  it('shows a notice instead of a word-level block when the word is not in the ayah', () => {
    const broken = [{ ...entries[0], text: 'كتاب' }];
    const { container } = render(<QiraatView entries={broken} />);
    expect(container.textContent).toContain('تعذر تحديد الكلمة');
  });
});
