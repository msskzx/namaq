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
  test('quotes his own opening words exactly as stored, never an ayah he quotes nor a bracket left open', () => {
    let opened = 0;
    for (const [, , , , text] of mufradat.entries) {
      const opening = raghibOpening(text);
      if (!opening) continue;
      opened++;
      expect(text.trim().startsWith(opening.text)).toBe(true);
      expect(opening.text).not.toMatch(/(قوله|قال)( الله)? تعالى|\[[^\]]*\/\s*[٠-٩]+\]/);
      for (const [left, right] of [['«', '»'], ['(', ')'], ['[', ']'], ['﴿', '﴾']]) expect(opening.text.split(left).length).toBe(opening.text.split(right).length);
    }
    expect(opened).toBeGreaterThan(0);
  });

  test('gives none for an article that opens on an ayah', () => {
    const ab = mufradat.entries.find(entry => entry[0] === 'أب')!;
    expect(ab[4].trim()).toMatch(/^قوله تعالى/);
    expect(raghibOpening(ab[4])).toBeNull();
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

  test('every entry explaining the word is a branch, in his own words; none for a phrase it is in', () => {
    const branches = meaningBranches(gharib, entries);
    expect(branches.map(branch => branch.at)).toEqual(entries.filter(entry => !entry.phrase).map(entry => entry.at));
    expect(entries.some(entry => !gharib.meanings[entry.at])).toBe(true);
    for (const branch of branches) expect(`${gharib.meanings[branch.at] ?? ''} ${branch.text}`).toContain(branch.meaning);
  });

  test('two entries giving the same meaning stay two branches', () => {
    const [first] = meaningBranches(gharib, entries);
    const twin = { ...entries.find(entry => entry.at === first.at)!, at: -1, key: '1:1' };
    const meanings = { ...gharib.meanings, [-1]: gharib.meanings[first.at] };
    expect(meaningBranches({ ...gharib, meanings }, [entries.find(entry => entry.at === first.at)!, twin])).toHaveLength(2);
  });
});
