// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ayahWordsOf } from '@shared/quran/quranText/ayahWords';
import type { MushafPage } from '@shared/quran/readerPage';
import { qiraatAyat } from '@shared/quran/qiraatData';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import QiraatView from './QiraatView';

// The first 17 pages, as the server reads them: up to 2:106, whose ayah opens with the hizb mark ۞.
const pages = Array.from({ length: 17 }, (_, i) => JSON.parse(readFileSync(join(__dirname, `../../../../shared/data/quran/mushaf/${i + 1}.json`), 'utf8')) as MushafPage);
const texts = ayahWordsOf(pages);

afterEach(cleanup);

describe('QiraatView: the website\'s «القراءات»', () => {
  it('lists every place under its surah, the differing words banded in the page words', () => {
    const { container } = render(<QiraatView texts={texts} />);
    expect(container.querySelectorAll('article')).toHaveLength(qiraatAyat().length);
    const place = container.querySelector('#a2-9')!;
    expect(place.textContent).toContain(texts['2:9'][1]);
    expect([...place.querySelectorAll('mark')].map(m => m.textContent)).toEqual([texts['2:9'][5]]);
    expect(place.textContent).toContain('يُخَٰدِعُونَ');
    // qiraat.json counts the ۞ as a word, so the band stays on نَنسَخۡ and نُنسِهَا, not the word after each.
    expect([...container.querySelectorAll('#a2-106 mark')].map(m => m.textContent)).toEqual([texts['2:106'][2], texts['2:106'][6]]);
    expect(texts['2:106'][0]).toBe('۞');
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
