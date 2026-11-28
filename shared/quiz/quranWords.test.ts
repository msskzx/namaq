// see docs/plans/guard-proposals.md
import { describe, expect, it } from 'vitest';
import data from '@shared/quran/quranText/corpus';
import { CHOICE_KINDS } from './kinds';
import { seededRandom } from './feedQuiz';
import type { ChoiceQuestion } from './choiceKinds';

const pageWords = new Set((data.ayat as { words: string[] }[]).flatMap(ayah => ayah.words));
const READINGS = new Set(['QIRAAT']);
const endMark = (word: string) => /^[٠-٩]+$/u.test(word);

const quranWords = (question: ChoiceQuestion) => [
  ...(question.quran ?? []),
  ...(question.reveal ?? []),
  ...(question.quranChoices && !READINGS.has(question.family) ? question.choices.flatMap(choice => choice.labelArabic.split(' ')) : []),
  ...(question.compare ? [...question.compare.shown.words, ...question.compare.asked.words] : []),
  ...Object.values(question.alike ?? {}).flatMap(alike => alike.words),
  ...Object.values(question.explains ?? {}).flatMap(explain => explain.quote.split(' ')),
].filter(word => !endMark(word));

describe('every Quran word a quiz shows is the page\'s own word', () => {
  for (const kind of CHOICE_KINDS) {
    it(kind.name, () => {
      const questions = kind.questions({ range: null, filters: {} }, 'medium', seededRandom(5));
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.flatMap(question => quranWords(question).filter(word => !pageWords.has(word)).map(word => `${question.key}: ${word}`))).toEqual([]);
    });
  }
});
