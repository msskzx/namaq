import { describe, expect, it } from 'vitest';
import gharib from '../data/quran/gharib';
import mufradat from '../data/quran/mufradat';
import corpus from './quranText/corpus';
import words from '../data/quran/words.json';
import gharibWordsJson from '../data/quran/gharibWords.json';
import { mushafPlacesOf, type WordsData } from './words';
import { gharibAt, gharibCredit, gharibOfPlaces, mufradatOfPlaces, gharibOfWord, gharibPage, mufradatCredit, mufradatOf, mufradatPage, wordsOf, type GharibEntry, type GharibWordsData } from './gharib';

const marks = gharibWordsJson as unknown as GharibWordsData;

const ayahWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));

describe("Ibn Qutaybah's gharib", () => {
  it("finds his two entries on al-Naba' 14, the one on «ثَجَّاجٗا» quoting it", () => {
    const entries = gharibAt(gharib, '78:14');
    expect(entries.map(entry => entry.text.split('\n')[0])).toEqual(['١٤- ﴿وَأَنْزَلْنَا مِنَ الْمُعْصِرَاتِ﴾ يعني: السحابَ.', '﴿مَاءً ثَجَّاجًا﴾ أي سَيَّالا.']);
    expect(gharibOfWord(entries, 4).map(entry => entry.text)).toEqual(['﴿مَاءً ثَجَّاجًا﴾ أي سَيَّالا.']);
    expect(gharibCredit(entries[1])).toBe('غريب القرآن لابن قتيبة، ص ٥٠٨');
    expect(gharibPage(entries[1])).toMatch(/^https:\/\/shamela\.ws\/book\/3259\/\d+$/);
  });

  it('places every quote inside its ayah', () => {
    for (const [surah, , , , places] of gharib.entries) for (const [ayah, from, to] of places) {
      const length = ayahWords.get(`${surah}:${ayah}`)?.length ?? 0;
      expect(length).toBeGreaterThan(0);
      if (from >= 0) expect(from <= to && to < length).toBe(true);
    }
  });

  it('joins the places an entry quotes in one ayah into runs', () => {
    const entry: GharibEntry = [2, 1, 1, 'text', [[5, 4, 4], [5, 0, 1], [5, 2, 2], [6, 0, 0]]];
    expect(wordsOf(entry, 5)).toEqual([[0, 2], [4, 4]]);
  });

  it('asks only his short meanings, each question with three others and their text', () => {
    expect(gharib.questions.length).toBeGreaterThan(2000);
    for (const question of gharib.questions) {
      expect(new Set(question).size).toBe(4);
      for (const at of question) expect(gharib.meanings[at]).toBeTruthy();
      expect(gharib.entries[question[0]][4][0][1]).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("al-Raghib's al-Mufradat", () => {
  it('links «ثَجَّاجٗا» to his article ثج, whole', () => {
    const article = mufradatOf(mufradat, '78:14', 4)!;
    expect(article[0].replace(/[\u064B-\u0652]/g, '')).toBe('ثج');
    expect(article[4]).toMatch(/^يقال: ثَجَّ الماء/);
    expect(mufradatCredit(article)).toBe('المفردات للراغب، ص ١٧٢');
    expect(mufradatPage(article)).toMatch(/^https:\/\/shamela\.ws\/book\/23636\/\d+$/);
  });

  it("numbers each ayah's links by its mushaf words", () => {
    for (const [key, links] of Object.entries(mufradat.words)) {
      expect(links).toHaveLength(ayahWords.get(key)!.length);
      for (const at of links) expect(at === -1 || (at >= 0 && at < mufradat.entries.length)).toBe(true);
    }
  });

  it('links the right word in an ayah the page spaces otherwise («بَعۡدَ مَا» in 2:181)', () => {
    const heading = (word: number) => mufradatOf(mufradat, '2:181', word)?.[0].replace(/[\u064B-\u0652]/g, '');
    expect(heading(4)).toBe('سمع');
    expect(heading(12)).toBe('سمع');
    expect(heading(13)).toBe('علم');
  });

  it('has nothing for a word with no root («مِنَ»)', () => {
    expect(mufradatOf(mufradat, '78:14', 1)).toBeNull();
  });
});

describe("a word's meanings on the words page", () => {
  const corpus = words as unknown as WordsData;
  const placesOfWord = (name: string) => mushafPlacesOf(corpus, corpus.lemmas.findIndex(([lemma]) => lemma === name));

  it('gathers his entries on «طُور» wherever it occurs, «وَالطُّورِ» with its waw too, in mushaf order', () => {
    const found = gharibOfPlaces(gharib, marks, placesOfWord('طُور'));
    expect(found.map(entry => entry.key)).toEqual(['2:63', '20:80', '52:1']);
    expect(found.every(entry => entry.text.includes('الطُّور'))).toBe(true);
  });

  it('puts an entry quoting a phrase on the page of the word he explains, and one explaining the phrase whole «في عبارة»', () => {
    const nakhl = gharibOfPlaces(gharib, marks, placesOfWord('نَخۡل'));
    expect(nakhl.some(entry => entry.text.includes('أي طوالا'))).toBe(false);
    expect(nakhl.filter(entry => !entry.phrase)).toEqual([]);
    expect(nakhl.some(entry => entry.phrase && entry.text.includes('أصولُ نخل'))).toBe(true);
    expect(gharibOfPlaces(gharib, marks, placesOfWord('أَعۡجَاز')).some(entry => entry.phrase && entry.text.includes('أصولُ نخل'))).toBe(true);
    expect(gharibOfPlaces(gharib, marks, placesOfWord('بَاسِقَٰت')).map(entry => [entry.text, entry.phrase])).toEqual([[expect.stringContaining('أي طوالا'), undefined]]);
  });

  it("lists a word's own meanings before the phrases it is in, a phrase across two ayat too", () => {
    const found = gharibOfPlaces(gharib, marks, placesOfWord('أَجۡر'));
    const first = found.findIndex(entry => entry.phrase);
    expect(first).toBeGreaterThan(0);
    expect(found.slice(first).every(entry => entry.phrase)).toBe(true);
    const inherit = gharibOfPlaces(gharib, marks, placesOfWord('وَرِثَ')).find(entry => entry.text.includes('يعني الولد'));
    expect(inherit?.phrase).toBe(true);
  });

  it('keeps an entry whose quoted words are all this word, whatever its marks say', () => {
    expect(gharibOfPlaces(gharib, marks, placesOfWord('نَفۡس')).some(entry => entry.text.includes('إخواننا وإخوانكم'))).toBe(true);
  });

  it('marks only words an entry quotes, and only entries quoting more than one word', () => {
    expect(marks.source).toEqual(gharib.source);
    for (const at of marks.phrases) expect(marks.words[at]).toBeUndefined();
    for (const [at, explained] of Object.entries(marks.words)) {
      const places = gharib.entries[Number(at)][4];
      expect(places.reduce((count, [, from, to]) => count + to - from + 1, 0)).toBeGreaterThan(1);
      for (const [ayah, word] of explained) expect(places.some(([at, from, to]) => at === ayah && word >= from && word <= to)).toBe(true);
    }
  });

  it('shows an entry found in two of its ayat once', () => {
    const entry = gharib.entries.findIndex(([, , , , places]) => new Set(places.map(([ayah]) => ayah)).size > 1 && places.every(([, from]) => from >= 0));
    const [surah, , , , places] = gharib.entries[entry];
    const twice = [...new Set(places.map(([ayah]) => ayah))].map(ayah => ({ key: `${surah}:${ayah}`, words: places.filter(place => place[0] === ayah).flatMap(([, from, to]) => Array.from({ length: to - from + 1 }, (_, i) => from + i)) }));
    expect(gharibOfPlaces(gharib, marks, twice).filter(found => found.at === entry)).toHaveLength(1);
  });

  it("gives al-Raghib's one article on the root of «نَخۡل» and of «نَّخِيل», a stray link outvoted", () => {
    expect(mufradatOfPlaces(mufradat, placesOfWord('سَمِيع')).map(article => article[0].replace(/[\u064B-\u0652]/g, ''))).toEqual(['سمع']);
    expect(mufradatOfPlaces(mufradat, placesOfWord('نَخۡل')).map(article => article[0].replace(/[\u064B-\u0652]/g, ''))).toEqual(['نخل']);
    expect(mufradatOfPlaces(mufradat, placesOfWord('نَّخِيل')).map(article => article[0].replace(/[\u064B-\u0652]/g, ''))).toEqual(['نخل']);
  });
});
