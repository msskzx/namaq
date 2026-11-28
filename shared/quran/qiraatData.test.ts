import { describe, expect, it } from 'vitest';
import data from '../data/quran/qiraat.json';
import corrections from '../../scripts/quran/qiraatCorrections.json';
import { qiraatOf } from './qiraatData';
import { madinaSpelling } from '../../scripts/quran/madinaSpelling';
import { sameForm } from '../../scripts/quran/qiraatFarsh';
import { trimShared } from '../../scripts/quran/qiraatTrim';

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
      expect(readings.filter(r => r.rawis.includes(9)).map(r => r.text)).toEqual([`${prefix}جَبۡرَئِلَ`]);
    });
  }

  it('2:165 keeps Khalaf an Hamza with the open hamza in وأن', () => {
    expect(word('2:165', 27).readings.map(r => r.rawis)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20],
      [15, 16, 17, 18],
    ]);
  });

  it('2:173 assigns the raised ta of اضطر to all readers except Abu Jafar', () => {
    expect(word('2:173', 13).readings.map(r => r.rawis)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20], [15, 16],
    ]);
  });

  it('2:177 anchors the differing case on البر after the rub marker and ليس', () => {
    expect(word('2:177', 2)).toEqual({ at: [2, 2], readings: [
      { text: 'ٱلۡبِرَّ', rawis: [10, 11, 12] },
      { text: 'ٱلۡبِرُّ', rawis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 19, 20] },
    ] });
  });
});

describe('al-Nashr audit of al-Imran to al-Nas', () => {
  const rawis = (key: string, at: number) => word(key, at).readings.map(r => r.rawis);

  it('keeps every corrected word in the data and names every riwaya in it', () => {
    for (const { ayah, replacement } of corrections) {
      if (!replacement) continue;
      const texts = replacement.readings.map(r => r.text);
      const cut = trimShared(texts);
      const trimmed = 'problem' in cut ? { start: 0, end: replacement.at[1] - replacement.at[0] + 1, texts } : cut;
      const at = [replacement.at[0] + trimmed.start, replacement.at[0] + trimmed.end - 1];
      const stored = word(ayah, at[0]);
      expect(stored.at).toEqual(at);
      expect(stored.readings.map(r => r.rawis)).toEqual(replacement.readings.map(r => r.rawis));
      const seated = (text: string) => text.replace(/[ئؤ]/g, 'ء');
      const words = (text: string) => text.trim().split(/\s+/).length;
      stored.readings.forEach((r, i) => {
        expect(words(r.text)).toBe(words(trimmed.texts[i]));
        expect(sameForm(seated(r.text), seated(madinaSpelling(trimmed.texts[i])))).toBe(true);
      });
      expect([...new Set(replacement.readings.flatMap(r => r.rawis))].sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    }
  });

  it('puts Yaqub with the address form at 3:13 and with nun at 55:31', () => {
    expect(rawis('3:13', 14)[1]).toEqual([1, 2, 15, 16, 17, 18]);
    expect(rawis('55:31', 0)[1]).toEqual([11, 12, 13, 14, 19, 20]);
  });

  it('files a word under its own ayah, not the next one', () => {
    for (const [moved, own, at] of [['4:164', '4:163', 25], ['33:69', '33:68', 7], ['38:16', '38:15', 9], ['54:4', '54:3', 5]] as const) {
      expect(qiraatOf(moved).find(w => w.at[0] === 0)).toBeUndefined();
      expect(word(own, at).at).toEqual([at, at]);
    }
    expect(word('90:6', 3).readings[1]).toEqual({ text: 'لُبَّدًا', rawis: [15, 16] });
    expect(word('90:7', 0).readings[0].text).toBe('أَيَحۡسَبُ');
    expect(word('94:5', 2).readings[1].rawis).toEqual([15, 16]);
  });

  it('adds the words the dump lacked', () => {
    expect(word('5:2', 28).readings[1]).toEqual({ text: 'شَنۡـَٔانُ', rawis: [7, 8, 9, 15, 16] });
    expect(word('15:41', 3).readings[1]).toEqual({ text: 'عَلِيٌّ', rawis: [17, 18] });
    expect(rawis('112:4', 3)).toEqual([[10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16], [11, 12, 17, 18, 19, 20]]);
    expect(rawis('2:67', 12)[2]).toEqual([11, 12, 19, 20]);
  });

  it('keeps neighbouring words out of a reading', () => {
    for (const [key, at] of [['20:13', 0], ['23:52', 0], ['25:69', 0], ['42:35', 0], ['70:4', 0], ['84:12', 0]] as const) {
      for (const r of word(key, at).readings) expect(r.text.split(' ')).toHaveLength(1);
    }
    expect(word('23:14', 9).readings[1].text).toBe('عَظۡمًا');
    expect(word('5:107', 11).readings[0].rawis).toEqual([10]);
  });
});
