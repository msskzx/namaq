import { describe, expect, test } from 'vitest';
import gharib from '../data/quran/gharib';
import gharibWords from '../data/quran/gharibWords.json';
import mufradat from '../data/quran/mufradat';
import words from '../data/quran/words.json';
import { gharibOfPlaces, type GharibWordsData } from './gharib';
import { countsBySurah, mushafPlacesOf, placesOf, type WordsData } from './words';
import { meaningBranches, mostIn, raghibOpening } from './wordFace';

const data = words as unknown as WordsData;

describe('mostIn', () => {
  test('names only the surahs holding the word most, more than once, two at most', () => {
    let named = 0;
    for (let id = 0; id < data.lemmas.length; id += 7) {
      const counts = countsBySurah(placesOf(data, id));
      const most = mostIn(counts);
      const top = Math.max(...counts);
      const tied = counts.filter(each => each === top).length;
      if (top < 2 || tied > 2) expect(most).toBeNull();
      else {
        named++;
        expect(most!.count).toBe(top);
        expect(most!.surahs.map(surah => counts[surah - 1])).toEqual(most!.surahs.map(() => top));
        expect(most!.surahs).toHaveLength(tied);
      }
    }
    expect(named).toBeGreaterThan(0);
  });
});

describe('raghibOpening', () => {
  test('quotes his opening words as written, stopping before any quotation', () => {
    for (const [, , , , text] of mufradat.entries) {
      const opening = raghibOpening(text);
      if (!opening) { expect(text.trim()).toMatch(/^(قال|وقال|يقال|ويقال|نحو|كقوله|وقوله|ومنه)[^،.]{0,20}:/); continue; }
      expect(opening.text.length).toBeGreaterThan(0);
      expect(text.replace(/\s+/g, ' ').trim().startsWith(opening.text)).toBe(true);
      expect(opening.text).not.toMatch(/(^|\s)(قال|يقال|وقوله|كقوله)[^،.]{0,20}:/);
    }
  });

  test('says when his article goes on after it', () => {
    const fitna = mufradat.entries.find(entry => entry[0] === 'فتن')!;
    const opening = raghibOpening(fitna[4])!;
    expect(opening.text).toMatch(/^أصل الفَتْنِ: إدخال الذّهب النار/);
    expect(opening.cut).toBe(true);
  });
});

describe('meaningBranches', () => {
  const marks = gharibWords as unknown as GharibWordsData;
  const fitna = data.lemmas.findIndex(([name]) => name === 'فِتۡنَة');
  const entries = gharibOfPlaces(gharib, marks, mushafPlacesOf(data, fitna));

  test('each branch is one entry explaining the word, with his meaning in his words', () => {
    const branches = meaningBranches(gharib, entries);
    expect(branches.length).toBeGreaterThan(1);
    for (const branch of branches) {
      expect(branch.phrase).toBeFalsy();
      expect(gharib.meanings[branch.at]).toContain(branch.meaning);
    }
    expect(new Set(branches.map(branch => branch.at)).size).toBe(branches.length);
  });

  test('two entries giving the same meaning stay two branches', () => {
    const [first] = meaningBranches(gharib, entries);
    const twin = { ...entries.find(entry => entry.at === first.at)!, at: -1, key: '1:1' };
    const meanings = { ...gharib.meanings, [-1]: gharib.meanings[first.at] };
    expect(meaningBranches({ ...gharib, meanings }, [entries.find(entry => entry.at === first.at)!, twin])).toHaveLength(2);
  });
});
