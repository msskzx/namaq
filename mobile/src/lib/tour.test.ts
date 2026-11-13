import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { mushafPages, type MushafPage } from '@shared/quran/readerPage';
import surahs from '@shared/data/quran/surahs.json';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { cardOf } from './branches';
import { RECITE_AYAH, RECITE_PAGE, TOUR_AYAH, tourPiece } from './tour';

const page = (n: number) => JSON.parse(readFileSync(`${__dirname}/../../../shared/data/quran/mushaf/${n}.json`, 'utf8')) as MushafPage;

describe('the first-launch tour', () => {
  it('finds its tree, and the tree holds the ayah the recitation starts from', () => {
    const piece = tourPiece();
    expect(piece).toBeDefined();
    expect(cardOf(piece!).presentation.ayat.map(ayah => ayah.key)).toContain(TOUR_AYAH);
  });

  it('recites from the page al-Ikhlas starts on, with an ayah left to reveal there', () => {
    expect(mushafPages(Array.from({ length: 604 }, (_, i) => page(i + 1))).get(RECITE_AYAH)).toBe(RECITE_PAGE);
    // The surah running at the top of the page, as surahBefore() in lib/mushaf.ts finds it.
    const top = surahs.findLast(row => row.page != null && row.page < RECITE_PAGE)?.number;
    const view = reciteView(pageModel(page(RECITE_PAGE), top), { start: RECITE_AYAH, shown: null, words: 0 });
    expect(view.upcoming).toBe(RECITE_AYAH);
    expect(view.nextAyah()?.shown).toBe(RECITE_AYAH);
  });
});
