import { describe, expect, it } from 'vitest';
import data from '../data/quran/qiraat.json';
import { qiraatOf } from './qiraatData';

const word = (key: string, at: number) => qiraatOf(key).find(w => w.at[0] === at)!;

describe('al-Nashr source corrections', () => {
  it('no word starts on a rub marker', () => {
    for (const list of Object.values(data.ayat)) {
      for (const w of list) expect(w.readings[0].text).not.toMatch(/^۞/);
    }
    expect(word('9:57', 6).at).toEqual([6, 6]);
  });

  it("2:37 prints Ibn Kathir's raised كلمات as a word", () => {
    expect(word('2:37', 4).readings[1]).toEqual({ text: 'كَلِمَاتٌ', rawis: [3, 4] });
  });

  it('2:85 assigns both Abu Jafar riwayat to تعملون', () => {
    expect(word('2:85', 48).readings.map(r => r.rawis)).toEqual([
      [5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16],
      [1, 2, 3, 4, 9, 17, 18, 19, 20],
    ]);
  });

  for (const [key, at, prefix] of [['2:97', 4, 'لِ'], ['2:98', 6, 'وَ']] as const) {
    it(`${key} gives Shuba only the Shatibiyya جبرئل and keeps Ibn Kathir separate`, () => {
      const readings = word(key, at).readings;
      expect(readings[1].rawis).toEqual([3, 4]);
      expect(readings.filter(r => r.rawis.includes(9)).map(r => r.text)).toEqual([`${prefix}جَبْرَئِلَ`]);
    });
  }

  it('2:165 keeps Khalaf an Hamza with the open hamza in وأن', () => {
    expect(word('2:165', 26).readings.map(r => r.rawis)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20],
      [15, 16, 17, 18],
    ]);
  });

  it('2:173 assigns the raised ta of اضطر to all readers except Abu Jafar', () => {
    expect(word('2:173', 12).readings.map(r => r.rawis)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20], [15, 16],
    ]);
  });

  it('2:177 anchors the differing case on البر after the rub marker and ليس', () => {
    expect(word('2:177', 2)).toEqual({ at: [2, 2], readings: [
      { text: 'ٱلۡبِرَّ', rawis: [10, 11, 12] },
      { text: 'ٱلْبِرُّ', rawis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 19, 20] },
    ] });
  });
});
