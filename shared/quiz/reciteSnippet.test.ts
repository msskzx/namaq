import { describe, expect, it } from 'vitest';
import { normalizeWord } from '../quran/normalize';
import corpus from '../data/quran/trees.json';
import { reciteSnippet } from './reciteSnippet';
import { FORGOT, RECITED } from './choiceKinds';

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const text = (words: string[]) => words.map(normalizeWord).join(' ');

describe('recite a snippet', () => {
  it('shows an opening no other ayah starts with, and the rest after it', () => {
    const questions = reciteSnippet.questions({ range: null, filters: { surahs: '2' } }, 'hard', seeded(1));
    expect(questions.length).toBeGreaterThan(200);
    for (const question of questions.slice(0, 40)) {
      const ayah = corpus.ayat.find(item => item.key === question.ayahKey)!;
      expect([...question.quran!, ...question.reveal!]).toEqual(ayah.words);
      expect(question.quran!.length).toBeGreaterThanOrEqual(3);
      expect(question.reveal!.length).toBeGreaterThanOrEqual(3);
      const opening = text(question.quran!);
      expect(corpus.ayat.filter(item => text(item.words.slice(0, question.quran!.length)) === opening)).toHaveLength(1);
    }
  });

  it('skips an opening shared with another ayah until it parts from it', () => {
    const [adam] = reciteSnippet.questions({ range: null, filters: { surahs: '2', pageFrom: '6', pageTo: '6' } }, 'hard', seeded(2)).filter(question => question.ayahKey === '2:34');
    expect(adam.quran).toHaveLength(10);
  });

  it('shows more of the opening when easier, and grades the reader\'s own word', () => {
    const scope = { range: null, filters: { surahs: '36' } };
    const hard = reciteSnippet.questions(scope, 'hard', seeded(3), 1)[0];
    const easy = reciteSnippet.questions(scope, 'easy', seeded(3), 1)[0];
    expect(easy.ayahKey).toBe(hard.ayahKey);
    expect(easy.quran!.length).toBeGreaterThan(hard.quran!.length);
    expect(hard.correctAnswer).toBe(RECITED);
    expect(hard.choices.map(choice => choice.value)).toEqual([RECITED, FORGOT]);
  });
});
