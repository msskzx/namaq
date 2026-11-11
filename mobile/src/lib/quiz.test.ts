import { describe, expect, it } from 'vitest';
import { keys } from '@shared/quran/branches';
import { inJuzRange } from '@shared/quran/juz';
import { branchNodes, spelled } from '@shared/quiz/branchAnswers';
import { branchQuestions, quizTrees } from '@shared/quiz/branchQuestions';
import type { BranchAyah } from '@shared/quran/branches';
import corpus from '@shared/data/quran/trees.json';
import { isAsked } from '@shared/quiz/score';
import { availability, check, cleanSolo, goTo, hasTyped, questionState, showAnswer, soloScore, startSolo, submit, typeAnswer, type SoloRun } from './quiz';

const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** Types the right words (in ordinary spelling) into every asked node of the current question. */
function typeRight(run: SoloRun) {
  const question = run.questions[run.current];
  return branchNodes(question.tree).reduce((next, node, index) =>
    isAsked(question, index) ? typeAnswer(next, index, node.words.map(spelled).join(' ')) : next, run);
}

describe('solo quiz on the phone', () => {
  it('keeps settings in range and the juz range in order', () => {
    expect(cleanSolo({ juzFrom: 30, juzTo: 28, leaves: 6, length: 10 })).toEqual({ juzFrom: 28, juzTo: 30, leaves: 6, length: 10 });
    expect(cleanSolo({ juzFrom: 0, juzTo: 31, leaves: 11, length: 7 })).toEqual({ juzFrom: 1, juzTo: 30, leaves: 3, length: 5 });
  });

  it('knows how many questions a juz range holds, as the website counts them', () => {
    // When this fails, the trees changed: run `npm run quiz:app-counts`.
    for (const [from, to] of [[30, 30], [1, 1], [27, 30]]) {
      expect(availability({ juzFrom: from, juzTo: to }).available).toBe(branchQuestions(corpus.ayat as BranchAyah[], { from, to }, quizTrees({ from, to })).length);
    }
    expect(availability({ juzFrom: 1, juzTo: 30 }).lengths).toEqual([5, 10, 15]);
  });

  it('offers only the lengths a juz range fills', () => {
    expect(availability({ juzFrom: 0, juzTo: 0 })).toEqual({ available: 0, lengths: [] });
  });

  it('asks only ayat of the chosen juz', () => {
    const run = startSolo(cleanSolo({ juzFrom: 30, juzTo: 30, length: 10 }), seeded(3));
    expect(run.questions).toHaveLength(10);
    expect(run.questions.flatMap(question => keys(question.tree)).every(key => inJuzRange(key, { from: 30, to: 30 }))).toBe(true);
  });

  it('scores full marks for every leaf typed right, in ordinary spelling', () => {
    let run = startSolo(cleanSolo({ juzFrom: 30, juzTo: 30, length: 5 }), seeded(11));
    for (let i = 0; i < run.questions.length; i++) run = check(typeRight(goTo(run, i)));
    expect(run.questions.map((_, i) => questionState(run, i))).toEqual(run.questions.map(() => 'correct'));
    const { score, total, passed } = soloScore(submit(run));
    expect(score).toBe(total);
    expect(passed).toBe(true);
  });

  it('gives a point for each right leaf, so one right and one wrong is partly solved', () => {
    let run = startSolo(cleanSolo({ juzFrom: 30, juzTo: 30, leaves: 2, length: 15 }), seeded(5));
    const index = run.questions.findIndex(question => question.asked.length === 2);
    run = typeRight(goTo(run, index));
    run = check(typeAnswer(run, run.questions[index].asked[1], 'كلمة خطأ'));
    expect(questionState(run, index)).toBe('partial');
    expect(soloScore(run).points[index]).toEqual({ earned: 1, total: 2 });
  });

  it('drops what was typed when the answer is shown, and locks a checked question', () => {
    let run = typeRight(startSolo(cleanSolo({ juzFrom: 30, juzTo: 30 }), seeded(9)));
    run = showAnswer(run);
    expect(questionState(run, 0)).toBe('incorrect');
    expect(soloScore(run).points[0].earned).toBe(0);
    expect(typeRight(run)).toBe(run);
  });

  it('grades on submit what was typed but never checked, and leaves untouched questions unanswered', () => {
    let run = typeRight(startSolo(cleanSolo({ juzFrom: 30, juzTo: 30 }), seeded(13)));
    expect(hasTyped(run)).toBe(true);
    run = submit(run);
    expect(questionState(run, 0)).toBe('correct');
    expect(questionState(run, 1)).toBe('unanswered');
    expect(soloScore(run).score).toBe(run.questions[0].asked.length);
  });
});
