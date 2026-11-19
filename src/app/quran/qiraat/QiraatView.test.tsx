// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { pageAyat } from '@shared/quran/branches';
import type { MushafPage } from '@shared/quran/readerPage';
import { qiraatAyat } from '@shared/quran/qiraatData';
import page1 from '@shared/data/quran/mushaf/1.json';
import page2 from '@shared/data/quran/mushaf/2.json';
import page3 from '@shared/data/quran/mushaf/3.json';
import QiraatView from './QiraatView';

const texts = Object.fromEntries(pageAyat([page1, page2, page3] as MushafPage[]).map(ayah => [ayah.key, ayah.words]));

afterEach(cleanup);

describe('QiraatView: the website\'s «القراءات»', () => {
  it('lists every place under its surah, the differing words banded in the page words', () => {
    const { container } = render(<QiraatView texts={texts} />);
    expect(container.querySelectorAll('article')).toHaveLength(qiraatAyat().length);
    const place = container.querySelector('#a2-9')!;
    expect(place.textContent).toContain(texts['2:9'][1]);
    expect([...place.querySelectorAll('mark')].map(m => m.textContent)).toEqual([texts['2:9'][5]]);
    expect(place.textContent).toContain('يُخَٰدِعُونَ');
  });

  it("narrows to a reader, shades his reading, and offers his two riwayat", () => {
    const { container } = render(<QiraatView texts={texts} />);
    fireEvent.click(screen.getByRole('tab', { name: 'حمزة' }));
    expect(container.querySelector('#a2-9')).toBeNull();
    const place = container.querySelector('#a2-36')!;
    expect(place.querySelector('[data-marked]')?.textContent).toContain('فَأَزَالَهُمَا');
    expect(within(screen.getByRole('tablist', { name: 'الرواة' })).getAllByRole('tab').map(t => t.textContent)).toEqual(['حمزة', 'خلف عن حمزة', 'خلاد']);
  });

  it('finds a word without its vowels', () => {
    const { container } = render(<QiraatView texts={texts} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'يخادعون' } });
    expect([...container.querySelectorAll('article')].map(a => a.id)).toContain('a2-9');
    expect(container.querySelectorAll('article').length).toBeLessThan(qiraatAyat().length);
  });
});
