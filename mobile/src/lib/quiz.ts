// The solo quiz on the phone: tree questions built on the device from the bundled متشابهات,
// graded with the website's rules (shared/quiz), and kept so a quiz survives leaving the app.
import corpus from '@shared/data/quran/trees.json';
import type { BranchAyah } from '@shared/quran/branches';
import { branchQuestionPool, branchQuiz, quizTrees, type AskedBranchQuestion } from '@shared/quiz/branchQuestions';
import { branchesCorrect, emptyBranchAnswers, isAsked, questionPoints } from '@shared/quiz/score';
import { DEFAULT_LEAVES, QUIZ_LEAVES, QUIZ_LENGTHS } from '@shared/quiz/settings';
import type { Random } from '@shared/quiz/random';
import counts from './quizCounts.json';

export type SoloSettings = { juzFrom: number; juzTo: number; leaves: number; length: number };
export const DEFAULT_SOLO: SoloSettings = { juzFrom: 1, juzTo: 30, leaves: DEFAULT_LEAVES, length: 5 };

const juz = (value: unknown, fallback: number) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 30 ? value as number : fallback;

/** Settings read back from storage or typed in: anything out of range falls back, and the juz range is put in order. */
export function cleanSolo(settings: Partial<SoloSettings> | undefined): SoloSettings {
  const from = juz(settings?.juzFrom, DEFAULT_SOLO.juzFrom);
  const to = juz(settings?.juzTo, DEFAULT_SOLO.juzTo);
  return {
    juzFrom: Math.min(from, to),
    juzTo: Math.max(from, to),
    leaves: (QUIZ_LEAVES as readonly number[]).includes(settings?.leaves as number) ? settings!.leaves! : DEFAULT_SOLO.leaves,
    length: (QUIZ_LENGTHS as readonly number[]).includes(settings?.length as number) ? settings!.length! : DEFAULT_SOLO.length,
  };
}

type Pool = ReturnType<typeof branchQuestionPool>;
const pools = new Map<string, Pool>();

/** The trees a juz range can ask: the متشابهات of the branches tab in that range, as on the website. */
function poolFor(settings: SoloSettings, ayat: BranchAyah[]): Pool {
  const whole = settings.juzFrom === 1 && settings.juzTo === 30;
  const id = `${settings.juzFrom}-${settings.juzTo}`;
  let pool = pools.get(id);
  if (!pool) {
    const range = whole ? null : { from: settings.juzFrom, to: settings.juzTo };
    pool = branchQuestionPool(ayat, range, quizTrees(range));
    if (pools.size > 4) pools.delete(pools.keys().next().value!);
    pools.set(id, pool);
  }
  return pool;
}

/** How many tree questions a juz range holds (counted ahead by `npm run quiz:app-counts`), and the quiz lengths it fills. */
export function availability({ juzFrom, juzTo }: Pick<SoloSettings, 'juzFrom' | 'juzTo'>) {
  const available = (counts as Record<string, number>)[`${juzFrom}-${juzTo}`] ?? 0;
  return { available, lengths: QUIZ_LENGTHS.filter(length => length <= available) };
}

export type SoloRun = {
  settings: SoloSettings;
  questions: AskedBranchQuestion[];
  /** What was typed in each node of each question; given nodes hold their words. */
  typed: string[][];
  /** A question is checked once its answer was graded, or its answer shown. */
  checked: boolean[];
  current: number;
  submitted: boolean;
};

export function startSolo(settings: SoloSettings, random: Random = Math.random): SoloRun {
  const questions = branchQuiz(poolFor(settings, corpus.ayat as BranchAyah[]), settings.length, settings.leaves, random);
  return { settings, questions, typed: questions.map(emptyBranchAnswers), checked: questions.map(() => false), current: 0, submitted: false };
}

const at = <T,>(list: T[], index: number, value: T) => list.map((item, i) => i === index ? value : item);

export const typeAnswer = (run: SoloRun, node: number, text: string): SoloRun =>
  run.checked[run.current] ? run : { ...run, typed: at(run.typed, run.current, at(run.typed[run.current], node, text)) };

export const clearAnswers = (run: SoloRun): SoloRun =>
  run.checked[run.current] ? run : { ...run, typed: at(run.typed, run.current, emptyBranchAnswers(run.questions[run.current])) };

/** Something was typed in at least one asked node, so checking means something. */
export const hasTyped = (run: SoloRun, index = run.current) =>
  run.typed[index].some((text, node) => isAsked(run.questions[index], node) && text.trim() !== '');

export const check = (run: SoloRun): SoloRun => ({ ...run, checked: at(run.checked, run.current, true) });

/** Showing the answer gives up the question: what was typed is dropped and it scores nothing. */
export const showAnswer = (run: SoloRun): SoloRun => ({
  ...run,
  typed: at(run.typed, run.current, emptyBranchAnswers(run.questions[run.current])),
  checked: at(run.checked, run.current, true),
});

export const goTo = (run: SoloRun, index: number): SoloRun => ({ ...run, current: Math.max(0, Math.min(run.questions.length - 1, index)) });

/** Submitting grades what was typed in every question, checked or not. */
export const submit = (run: SoloRun): SoloRun => ({ ...run, submitted: true, checked: run.checked.map((done, i) => done || hasTyped(run, i)) });

export type QuestionState = 'unanswered' | 'correct' | 'partial' | 'incorrect';

export function questionState(run: SoloRun, index: number): QuestionState {
  if (!run.checked[index]) return 'unanswered';
  const question = run.questions[index];
  if (branchesCorrect(question, run.typed[index])) return 'correct';
  return questionPoints(question, run.typed[index]).earned > 0 ? 'partial' : 'incorrect';
}

/** One point per asked leaf typed right; a question never checked scores nothing. */
export function soloScore(run: SoloRun) {
  const points = run.questions.map((question, i) => run.checked[i] ? questionPoints(question, run.typed[i]) : { earned: 0, total: questionPoints(question, []).total });
  const score = points.reduce((sum, point) => sum + point.earned, 0);
  const total = points.reduce((sum, point) => sum + point.total, 0);
  return { points, score, total, percent: total ? Math.round((score / total) * 100) : 0, passed: total > 0 && score / total >= 0.5 };
}
