import { describe, expect, it } from 'vitest';
import bank from '../data/quran/ayahQuizzes.json';
import { balaghaQuiz, irabQuiz, qiraatQuiz, tafsirQuiz, type AyahQuizzes } from './ayahQuizzes';
import { hideQuotes, quotesOf, stem } from './ayahQuizText';
import { num } from '../quran/arabicNumber';

const data = bank as AyahQuizzes;
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const whole = { range: null, filters: {} };

describe('the four ayah quizzes', () => {
  it('ask every question of the built bank over the whole Quran', () => {
    expect(tafsirQuiz.count(whole)).toBe(data.tafsir.length);
    expect(balaghaQuiz.count(whole)).toBe(data.balagha.questions.length);
    expect(irabQuiz.count(whole)).toBe(data.irab.questions.length);
    expect(qiraatQuiz.count(whole)).toBe(data.qiraat.length);
    for (const kind of [tafsirQuiz, balaghaQuiz, irabQuiz, qiraatQuiz]) expect(kind.count(whole)).toBeGreaterThan(50);
  });

  it('every question has its right answer among distinct choices, and an ayah to open', () => {
    for (const kind of [tafsirQuiz, balaghaQuiz, irabQuiz, qiraatQuiz]) {
      for (const question of kind.questions(whole, 'medium', seeded(1), 80)) {
        const values = question.choices.map(choice => choice.value);
        expect(new Set(values).size).toBe(values.length);
        expect(new Set(question.choices.map(choice => choice.labelArabic)).size).toBe(values.length);
        expect(values).toContain(question.correctAnswer);
        expect(question.choices.every(choice => choice.labelArabic.trim())).toBe(true);
        expect(question.ayahKey).toMatch(/^\d+:\d+$/);
      }
    }
  });

  it('«لأي آية هذا التفسير؟» shows the passage with the ayah hidden and three whole ayat, each naming its place once answered', () => {
    for (const question of tafsirQuiz.questions(whole, 'medium', seeded(2), 40)) {
      expect(question.passage).toBeTruthy();
      expect(question.quran).toBeUndefined();
      expect(question.quranChoices).toBe(true);
      expect(question.choices).toHaveLength(3);
      expect(Object.keys(question.whereOf!).sort()).toEqual(question.choices.map(choice => choice.value).sort());
      // Each whole ayah ends with its number, the mushaf's end mark.
      for (const choice of question.choices) expect(choice.labelArabic).toMatch(new RegExp(` ${num(Number(choice.value.split(':')[1]))}$`));
    }
  });

  it('balagha, i\'rab and readings colour words of the ayah shown', () => {
    for (const kind of [balaghaQuiz, irabQuiz, qiraatQuiz]) {
      for (const question of kind.questions(whole, 'medium', seeded(3), 60)) {
        expect(question.marked!.length).toBeGreaterThan(0);
        expect(question.marked!.every(at => question.quran![at])).toBe(true);
      }
    }
  });

  it('«كيف يقرؤها؟» names every reader, never «الباقون»', () => {
    for (const question of qiraatQuiz.questions(whole, 'medium', seeded(4), 100)) {
      expect(question.quranChoices).toBe(true);
      expect(Object.values(question.whereOf!).join(' ')).not.toContain('الباقون');
    }
  });

  it('keeps to the scope', () => {
    for (const kind of [tafsirQuiz, balaghaQuiz, irabQuiz, qiraatQuiz]) {
      for (const question of kind.questions({ range: { from: 30, to: 30 }, filters: {} }, 'medium', seeded(5))) {
        expect(Number(question.ayahKey!.split(':')[0])).toBeGreaterThanOrEqual(78);
      }
    }
  });
});

describe('hiding the quotes', () => {
  it('writes the hidden quotes «…» and keeps the others', () => {
    const text = 'قال ﴿ٱلۡحَمۡدُ لِلَّهِ﴾ ثم ﴿رَبِّ ٱلۡعَٰلَمِينَ﴾.';
    expect(quotesOf(text)).toEqual(['ٱلۡحَمۡدُ لِلَّهِ', 'رَبِّ ٱلۡعَٰلَمِينَ']);
    expect(hideQuotes(text, [0])).toBe('قال «…» ثم ﴿رَبِّ ٱلۡعَٰلَمِينَ﴾.');
  });

  it('compares words without marks, «ال» or a joined و', () => {
    expect(stem('وَٱلۡكِتَٰبِ')).toBe('كتب');
    expect(stem('بِٱلۡحَقِّ')).toBe('');
    expect(stem('في')).toBe('');
  });
});
