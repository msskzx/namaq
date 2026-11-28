import { describe, expect, it } from 'vitest';
import { keys } from '@shared/quran/branches';
import { inJuzRange } from '@shared/quran/juz';
import { branchNodes, spelled } from '@shared/quiz/branchAnswers';
import { branchQuestionPool, branchQuestions } from '@shared/quiz/branchQuestions';
import { quizTrees } from '@shared/quiz/treeScope';
import type { BranchAyah } from '@shared/quran/branches';
import corpus from '@shared/quran/quranText/corpus';
import { isAsked } from '@shared/quiz/score';
import { DEFAULT_SETTINGS } from '@shared/party/rules';
import { availability, DEFAULT_SOLO, partyQuiz, check, cleanSolo, DEFAULT_LIST, goTo, hasTyped, isTree, pick, questionState, reveal, setHints, soloScore, startSolo, submit, typeAnswer, type SoloRun } from './quiz';
import type { AskedBranchQuestion } from '@shared/quiz/branchQuestions';

const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function typeRight(run: SoloRun) {
  const question = run.questions[run.current] as AskedBranchQuestion;
  return branchNodes(question.tree).reduce((next, node, index) =>
    isAsked(question, index) ? typeAnswer(next, index, node.words.map(spelled).join(' ')) : next, run);
}

describe('solo quiz on the phone', () => {
  it('keeps settings in range, and turns an older juz range into the filters', () => {
    expect(cleanSolo({ juzFrom: 30, juzTo: 28, leaves: 6, length: 10 })).toEqual({ kinds: ['BRANCHES'], list: { filters: { categories: 'mutashabeh' }, range: { from: 28, to: 30 }, saved: false }, difficulty: 'medium', leaves: 6, length: 10 });
    expect(cleanSolo({ juzFrom: 0, juzTo: 31, leaves: 11, length: 0 })).toEqual({ kinds: ['BRANCHES'], list: { filters: { categories: 'mutashabeh' }, range: null, saved: false }, difficulty: 'medium', leaves: 3, length: 5 });
    expect(cleanSolo({ length: 37 }).length, 'no cap on how many questions (owner, 2026-11-28)').toBe(37);
    expect(cleanSolo({ kinds: ['RECITE', 'nope' as never, 'SURAH'] }).kinds).toEqual(['SURAH', 'RECITE']);
    expect(cleanSolo({ difficulty: 'hard' }).difficulty).toBe('hard');
    expect(cleanSolo({ difficulty: 'nope' as never }).difficulty).toBe('medium');
  });

  it('counts the questions the filters hold, as the website does', () => {
    for (const list of [{ ...DEFAULT_LIST, range: { from: 30, to: 30 } }, { ...DEFAULT_LIST, filters: { categories: 'mutashabeh', surahs: '2,36' } }]) {
      const trees = quizTrees(list.range, { filters: list.filters });
      const available = availability({ kinds: ['BRANCHES'], list }, []).available;
      expect(available).toBe(branchQuestionPool(corpus.ayat as BranchAyah[], list.range, trees).candidates.length);
      expect(branchQuestions(corpus.ayat as BranchAyah[], list.range, trees).length).toBeLessThanOrEqual(available);
    }
  });

  it('asks only saved trees when saved only is on', () => {
    expect(availability({ kinds: ['BRANCHES'], list: { ...DEFAULT_LIST, saved: true } }, []).available).toBe(0);
    const run = startSolo(cleanSolo({ list: { ...DEFAULT_LIST, range: { from: 30, to: 30 } }, length: 5 }), seeded(2));
    const saved = [{ id: (run.questions[0] as AskedBranchQuestion).phrase, text: '' }];
    expect(availability({ kinds: ['BRANCHES'], list: { ...DEFAULT_LIST, saved: true } }, saved).available).toBe(1);
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
    const { score, total } = soloScore(submit(run));
    expect(score).toBe(total);
  });

  it('gives a point for each right leaf, so one right and one wrong is partly solved', () => {
    let run = startSolo(cleanSolo({ juzFrom: 30, juzTo: 30, leaves: 2, length: 15 }), seeded(5));
    const index = run.questions.findIndex(question => question.asked.length === 2);
    run = typeRight(goTo(run, index));
    run = check(typeAnswer(run, run.questions[index].asked[1], 'كلمة خطأ'));
    expect(questionState(run, index)).toBe('partial');
    expect(soloScore(run).points[index]).toEqual({ earned: 1, total: 2 });
  });

  it('checks a question with nothing typed, showing its answer for nothing (owner, 2026-11-21: «تحقق» is the only way on), and locks it', () => {
    let run = check(startSolo(cleanSolo({ juzFrom: 30, juzTo: 30 }), seeded(9)));
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
    expect(soloScore(run).score).toBe((run.questions[0] as AskedBranchQuestion).asked.length);
  });

  it('keeps hints per question until it is checked, also for runs saved before hints', () => {
    const run = startSolo(cleanSolo({ list: { ...DEFAULT_LIST, range: { from: 30, to: 30 } }, length: 5 }), seeded(3));
    const old = { ...run, hints: undefined, current: 1 };
    const hinted = setHints(old, { 2: 1 });
    expect(hinted.hints).toEqual([{}, { 2: 1 }, {}, {}, {}]);
    expect(setHints(check(hinted), { 2: 2 }).hints).toEqual(hinted.hints);
  });

  it('mixes which-surah questions with the trees and scores a picked surah as one point', () => {
    const settings = cleanSolo({ kinds: ['BRANCHES', 'SURAH'], list: { ...DEFAULT_LIST, range: { from: 30, to: 30 } }, length: 10 });
    expect(availability(settings, []).available).toBeGreaterThan(availability({ ...settings, kinds: ['BRANCHES'] }, []).available + 400);
    let run = startSolo(settings, seeded(4));
    expect(run.questions.filter(question => !isTree(question))).toHaveLength(5);
    run = goTo(run, run.questions.findIndex(question => !isTree(question)));
    const question = run.questions[run.current];
    expect(hasTyped(run)).toBe(false);
    run = pick(run, question.correctAnswer);
    expect(pick(run, 'other')).toBe(run);
    expect(questionState(run, run.current)).toBe('correct');
    expect(soloScore(submit(run)).points[run.current]).toEqual({ earned: 1, total: 1 });
  });

  it('shows a recited snippet\'s rest before its choices, and counts «نسيتها» as not had', () => {
    let run = startSolo(cleanSolo({ kinds: ['RECITE'], list: { ...DEFAULT_LIST, range: { from: 30, to: 30 } } }), seeded(6));
    expect(run.questions.every(question => !isTree(question) && question.reveal?.length)).toBe(true);
    run = reveal(run);
    expect(run.shown).toEqual([true, false, false, false, false]);
    run = pick(run, '0');
    expect(questionState(run, 0)).toBe('incorrect');
    expect(questionState(submit(run), 1)).toBe('unanswered');
  });
});

describe('kunya questions never come first (guard 9, owner 2026-11-18)', () => {
  it('starts the Tarajim questions of a mixed quiz with another kind than a kunya, whatever the seed', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const run = startSolo(cleanSolo({ kinds: ['TARAJIM_KUNYA', 'TARAJIM_LAQAB', 'TARAJIM_VIRTUE'], length: 6 }), seeded(seed));
      const first = run.questions.find(question => question.family.startsWith('TARAJIM_'));
      expect(first?.family).not.toBe('TARAJIM_KUNYA');
    }
  }, 30_000);
});

describe('party quiz built on the host’s phone', () => {
  it('asks the host’s number of trees, only from the juz the host chose, with the names of their surahs', () => {
    const { questions, surahNames } = partyQuiz({ ...DEFAULT_SETTINGS, juzFrom: 30, juzTo: 30 }, seeded(7));
    expect(questions).toHaveLength(DEFAULT_SETTINGS.length);
    const ayat = questions.flatMap(question => (question as unknown as AskedBranchQuestion).branches.flatMap(branch => branch.ayat.map(ayah => ayah.key)));
    expect(ayat.every(key => inJuzRange(key, { from: 30, to: 30 }))).toBe(true);
    expect(Object.keys(surahNames).map(Number).sort((a, b) => a - b)).toEqual([...new Set(ayat.map(key => Number(key.split(':')[0])))].sort((a, b) => a - b));
  });

  it('fills a long tree quiz, past the old cap of fifteen, solo or party, though trees sharing an ayah are skipped', () => {
    const longest = 4 * DEFAULT_SETTINGS.length;
    for (const seed of [1, 2, 3]) {
      expect(partyQuiz({ ...DEFAULT_SETTINGS, length: longest }, seeded(seed)).questions).toHaveLength(longest);
      expect(startSolo({ ...DEFAULT_SOLO, length: longest }, seeded(seed)).questions).toHaveLength(longest);
    }
  });

  it('gives a recited ayah the words the host’s pen asks, so the party can grade what each player writes', () => {
    const { questions } = partyQuiz({ ...DEFAULT_SETTINGS, topics: ['RECITE'], juzFrom: 30, juzTo: 30, pen: 'whole' }, seeded(3));
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every(question => Array.isArray((question as { write?: { words?: unknown } }).write?.words))).toBe(true);
  });
});
