import { describe, expect, it } from 'vitest';
import gharib from '../data/quran/gharib';
import mufradat from '../data/quran/mufradat';
import corpus from './quranText/corpus';
import { gharibAt, gharibCredit, gharibOfWord, gharibPage, mufradatCredit, mufradatOf, mufradatPage, wordsOf, type GharibEntry } from './gharib';

const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));

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
      const length = words.get(`${surah}:${ayah}`)?.length ?? 0;
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
      expect(links).toHaveLength(words.get(key)!.length);
      for (const at of links) expect(at === -1 || (at >= 0 && at < mufradat.entries.length)).toBe(true);
    }
  });

  it('has nothing for a word with no root («مِنَ»)', () => {
    expect(mufradatOf(mufradat, '78:14', 1)).toBeNull();
  });
});
