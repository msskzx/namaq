import { describe, expect, it } from 'vitest';
import { surahOrderQuiz } from './surahOrderQuiz';
import { seededRandom } from './feedQuiz';
import { PICKS } from './choiceKinds';
import { questionPoints } from './score';
import { inJuzRange } from '../quran/juz';

const ALL = { range: null, filters: {} };
const surahs = (question: { choices: { value: string }[] }) => question.choices.map(choice => Number(choice.value));

describe('«رتّب السور»', () => {
  it('asks four different surahs, never already in order, and the answer is the mushaf\'s order', () => {
    for (const question of surahOrderQuiz.questions({ range: null, filters: { apart: '1' } }, 'medium', seededRandom(3))) {
      const shown = surahs(question);
      const sorted = [...shown].sort((a, b) => a - b);
      expect(new Set(shown).size).toBe(4);
      expect(shown).not.toEqual(sorted);
      expect(question.order).toEqual(sorted.map(String));
      expect(question.correctAnswer).toBe(sorted.join(PICKS));
    }
  });

  it('asks surahs that follow each other by default, and surahs from anywhere in the range when asked apart (owner, 2026-11-20)', () => {
    const neighbours = surahOrderQuiz.questions(ALL, 'medium', seededRandom(4));
    for (const question of neighbours) {
      const order = question.order!.map(Number);
      expect(order.every((n, i) => i === 0 || n === order[i - 1] + 1)).toBe(true);
    }
    const apart = surahOrderQuiz.questions({ range: null, filters: { apart: '1' } }, 'medium', seededRandom(4));
    expect(apart.some(question => question.order!.map(Number).some((n, i, all) => i > 0 && n !== all[i - 1] + 1))).toBe(true);
  });

  it('asks only the surahs of the chosen part of the Quran', () => {
    const juz30 = { range: { from: 30, to: 30 } };
    for (const filters of [{}, { apart: '1' }]) for (const question of surahOrderQuiz.questions({ ...juz30, filters }, 'medium', seededRandom(2)))
      for (const n of surahs(question)) expect(inJuzRange(`${n}:1`, juz30.range) || inJuzRange(`${n}:2`, juz30.range)).toBe(true);
  });

  it('fills a part of fewer than four surahs with the surahs just outside it, and asks nothing of one surah', () => {
    // Juz 1 holds al-Fatiha and al-Baqarah: the two after them fill the question.
    const juz1 = surahOrderQuiz.questions({ range: { from: 1, to: 1 }, filters: {} }, 'medium', seededRandom(1));
    expect(juz1.length).toBeGreaterThan(0);
    for (const question of juz1) expect(question.order).toEqual(['1', '2', '3', '4']);
    expect(surahOrderQuiz.questions({ range: null, filters: { surahs: '2' } }, 'medium', seededRandom(1))).toEqual([]);
  });

  it('gives each surah put in its right place its share (owner: partial answers accepted)', () => {
    const question = { order: ['82', '85', '86', '88'] };
    expect(questionPoints(question, ['82', '85', '86', '88'].join(PICKS))).toEqual({ earned: 4, total: 4 });
    expect(questionPoints(question, ['82', '86', '85', '88'].join(PICKS))).toEqual({ earned: 2, total: 4 });
    expect(questionPoints(question, undefined)).toEqual({ earned: 0, total: 4 });
  });
});
