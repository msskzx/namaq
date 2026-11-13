// The solo quiz on the phone: tree questions built on the device from the bundled متشابهات,
// graded with the website's rules (shared/quiz), and kept so a quiz survives leaving the app.
import corpus from '@shared/data/quran/trees.json';
import type { BranchAyah } from '@shared/quran/branches';
import { branchQuestionPool, branchQuiz, type AskedBranchQuestion } from '@shared/quiz/branchQuestions';
import { branchesCorrect, emptyBranchAnswers, isAsked, questionPoints } from '@shared/quiz/score';
import { DEFAULT_LEAVES, QUIZ_LEAVES, QUIZ_LENGTHS } from '@shared/quiz/settings';
import { DEFAULT_DIFFICULTY, parseDifficulty, type Difficulty } from '@shared/quiz/difficulty';
import type { Random } from '@shared/quiz/random';
import { readBookmarks, type Bookmark } from '@shared/bookmarks';
import type { GroupFilters } from '@shared/quran/mutashabih/browse';
import type { JuzRange } from '@shared/quran/juz';
import { quizTrees } from '@shared/quiz/treeScope';
import { isCompareBookmark } from '@shared/compareBookmarks';

/** Which trees the quiz asks, with the branches tab's filters: kinds, differences, part of the Quran, saved only. */
export type QuizList = { filters: GroupFilters; range: JuzRange | null; saved: boolean };
export type SoloSettings = { list: QuizList; difficulty: Difficulty; leaves: number; length: number };
export const DEFAULT_LIST: QuizList = { filters: { categories: 'mutashabeh' }, range: null, saved: false };
export const DEFAULT_SOLO: SoloSettings = { list: DEFAULT_LIST, difficulty: DEFAULT_DIFFICULTY, leaves: DEFAULT_LEAVES, length: 5 };

const juz = (value: unknown, fallback: number) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 30 ? value as number : fallback;

/** A stored list, or the juz range older settings kept. */
function cleanList(settings: Partial<SoloSettings> & { juzFrom?: number; juzTo?: number } | undefined): QuizList {
  const list = settings?.list;
  if (list && typeof list === 'object' && list.filters && typeof list.filters === 'object') {
    const range = list.range && juz(list.range.from, 0) && juz(list.range.to, 0) ? { from: Math.min(list.range.from, list.range.to), to: Math.max(list.range.from, list.range.to) } : null;
    return { filters: list.filters, range: range && (range.from !== 1 || range.to !== 30) ? range : null, saved: list.saved === true };
  }
  const from = juz(settings?.juzFrom, 1), to = juz(settings?.juzTo, 30);
  const range = { from: Math.min(from, to), to: Math.max(from, to) };
  return { ...DEFAULT_LIST, range: range.from === 1 && range.to === 30 ? null : range };
}

/** Settings read back from storage or typed in: anything out of range falls back. */
export function cleanSolo(settings: Partial<SoloSettings> & { juzFrom?: number; juzTo?: number } | undefined): SoloSettings {
  return {
    list: cleanList(settings),
    difficulty: parseDifficulty(settings?.difficulty),
    leaves: (QUIZ_LEAVES as readonly number[]).includes(settings?.leaves as number) ? settings!.leaves! : DEFAULT_SOLO.leaves,
    length: (QUIZ_LENGTHS as readonly number[]).includes(settings?.length as number) ? settings!.length! : DEFAULT_SOLO.length,
  };
}

type Pool = ReturnType<typeof branchQuestionPool>;
const pools = new Map<string, Pool>();

/** The trees the filters keep, as the branches tab lists them; saved only keeps just the saved ones. */
const treesFor = (list: QuizList, bookmarks: Bookmark[]) =>
  quizTrees(list.range, { filters: list.filters, saved: list.saved ? bookmarks.filter(item => !isCompareBookmark(item)).map(item => item.id) : undefined });

/** The questions the filters hold; kept for the last few filters, since working them out takes a moment on a phone. */
function poolFor(list: QuizList, bookmarks: Bookmark[] = readBookmarks()): Pool {
  const id = JSON.stringify([list, list.saved ? bookmarks.map(item => item.id) : []]);
  let pool = pools.get(id);
  if (!pool) {
    pool = branchQuestionPool(corpus.ayat as BranchAyah[], list.range, treesFor(list, bookmarks));
    if (pools.size > 4) pools.delete(pools.keys().next().value!);
    pools.set(id, pool);
  }
  return pool;
}

/** How many tree questions the filters hold, and the quiz lengths they fill. */
export function availability(list: QuizList, bookmarks?: Bookmark[]) {
  const available = poolFor(list, bookmarks).candidates.length;
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

export function startSolo(settings: SoloSettings, random: Random = Math.random, bookmarks?: Bookmark[]): SoloRun {
  const questions = branchQuiz(poolFor(settings.list, bookmarks), settings.length, settings.leaves, random, settings.difficulty);
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
