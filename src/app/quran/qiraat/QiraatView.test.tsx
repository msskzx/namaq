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
const entries = variants.map(variant => ({ variant, text: texts[`${variant.surah}:${variant.ayah}`], surahName: 'سورة' }));

afterEach(cleanup);

describe('QiraatView', () => {
  it('offers twelve variants and starts on 1:4', () => {
    const { container } = render(<QiraatView entries={entries} />);
    expect(screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button')).toHaveLength(12);
    expect(container.querySelectorAll('li[data-state]')).toHaveLength(20);
    expect(container.textContent).toContain('تجريبي');
    expect(container.textContent).toContain('فرق على مستوى الكلمة، وليس نص مصحف تلك الرواية');
  });

  it('shows the Hafs/Shu\'ba split on 5:6 and withholds the meaning', () => {
    const { container } = render(<QiraatView entries={entries} />);
    fireEvent.click(screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button')[5]);
    const chip = (name: string) => screen.getByText(name).closest('li')!.getAttribute('data-state');
    expect(chip('حفص')).toBe('0');
    expect(chip('شعبة')).toBe('1');
    expect(container.textContent).toContain('لا يُعرض شرح هنا لأنه موضع خلاف فقهي');
  });

  it('labels an unsourced meaning and greys every chip on 18:86', () => {
    const { container } = render(<QiraatView entries={entries} />);
    const buttons = screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button');
    fireEvent.click(buttons[1]);
    expect(container.textContent).toContain('غير موثق (اقتراح للتجربة)');
    fireEvent.click(buttons[8]);
    expect(container.querySelectorAll('li[data-state="unknown"]')).toHaveLength(20);
  });
});
