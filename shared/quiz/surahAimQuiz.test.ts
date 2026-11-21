import { describe, expect, it } from 'vitest';
import { aimChoice, askable, surahAimQuiz } from './surahAimQuiz';
import { seededRandom } from './feedQuiz';
import { ORDER_AIMS } from '../quran/surahOrder';
import { juzOf } from '../quran/juz';

const ALL = { range: null, filters: {} };

describe('«ما مقصود هذه السورة؟»', () => {
  it('offers the asked surah\'s own saying and two of other surahs, each quoted from al-Biqa\'i with its page', () => {
    for (const question of surahAimQuiz.questions(ALL, 'medium', seededRandom(5))) {
      const offered = question.choices.map(choice => Number(choice.value));
      expect(new Set(offered).size).toBe(3);
      expect(offered).toContain(Number(question.correctAnswer));
      for (const choice of question.choices) {
        expect(ORDER_AIMS[Number(choice.value)].text).toContain(choice.labelArabic);
        expect(askable(Number(choice.value))).toBe(true);
      }
      expect(question.sources).toHaveLength(3);
      expect(question.sources.every(source => source.book.startsWith('البقاعي') && source.url?.startsWith('https://shamela.ws/'))).toBe(true);
    }
  });

  it('never asks nor offers a saying that names the surah or one near it (owner, 2026-11-21)', () => {
    // «واسمها الكوثر», «مدلول اسمها النصر», «على آخر يس» each point at the answer.
    for (const surah of [108, 110, 37, 4]) expect(askable(surah)).toBe(false);
    // A far surah's name used as a word names no surah: al-Fatiha's «مراقبة العباد لربهم» and al-An'am's saying stay.
    expect(askable(1)).toBe(true);
    expect(askable(6)).toBe(true);
  });

  it('drops al-Biqa\'i\'s «مقصودها» from the choices, the same opening in all three', () => {
    expect(aimChoice(1)).toBe('مراقبة العباد لربهم');
    expect(aimChoice(2).startsWith('إقامة الدليل')).toBe(true);
  });

  it('asks only the surahs of the chosen part of the Quran', () => {
    const juz30 = { range: { from: 30, to: 30 } };
    const asked = surahAimQuiz.questions({ ...juz30, filters: {} }, 'medium', seededRandom(2)).map(question => Number(question.correctAnswer));
    expect(asked.length).toBeGreaterThan(0);
    for (const surah of asked) expect(juzOf(`${surah}:1`)).toBe(30);
  });
});
