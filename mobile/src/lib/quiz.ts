import corpus from '@shared/quran/quranText/corpus';
import type { BranchAyah } from '@shared/quran/branches';
import { branchQuestionPool, branchQuiz, type AskedBranchQuestion } from '@shared/quiz/branchQuestions';
import { branchesCorrect, emptyBranchAnswers, isAsked, questionPoints } from '@shared/quiz/score';
import { DEFAULT_LEAVES, QUIZ_LEAVES, quizLength } from '@shared/quiz/settings';
import { QUIZ_CATEGORIES } from '@shared/quiz/scopeParams';
import { DEFAULT_DIFFICULTY, parseDifficulty, type Difficulty } from '@shared/quiz/difficulty';
import type { Random } from '@shared/quiz/random';
import type { Hints } from '@shared/quiz/hints';
import { readBookmarks, type Bookmark } from '@shared/bookmarks';
import type { GroupFilters } from '@shared/quran/mutashabih/browse';
import type { JuzRange } from '@shared/quran/juz';
import { quizTrees, parseTreeScope } from '@shared/quiz/treeScope';
import { isCompareBookmark } from '@shared/compareBookmarks';
import { mixQuestions, questionAyat, type ChoiceQuestion, type ChoiceScope } from '@shared/quiz/choiceKinds';
import { kunyaNotFirst } from '@shared/quiz/tarajim';
import { emptyCompareAnswers, type CompareAsk } from '@shared/quiz/compareAnswers';
import { CHOICE_KINDS } from '@shared/quiz/kinds';
import { CHOICE_TOPICS, WRITTEN_TOPICS, type QuizTopic } from '@shared/quiz/settings';
import { quizQuery, type PartyQuestion, type PartySettings } from '@shared/party/rules';
import { parseJuzRange } from '@shared/quran/juz';
import { shuffle } from '@shared/quiz/random';
import { orders, recited, ticks } from '@shared/quiz/choiceKinds';
import { writeAsk } from '@shared/quiz/writeAsk';
import { surahName } from '@shared/quran/surahNames';

export type QuizList = { filters: GroupFilters; range: JuzRange | null; saved: boolean };
export const SOLO_KINDS: QuizTopic[] = ['BRANCHES', ...CHOICE_TOPICS];
export type SoloSettings = { kinds: QuizTopic[]; list: QuizList; difficulty: Difficulty; leaves: number; length: number; apart?: boolean };
export const DEFAULT_LIST: QuizList = { filters: { categories: QUIZ_CATEGORIES }, range: null, saved: false };
export const DEFAULT_SOLO: SoloSettings = { kinds: ['BRANCHES'], list: DEFAULT_LIST, difficulty: DEFAULT_DIFFICULTY, leaves: DEFAULT_LEAVES, length: 5 };

const juz = (value: unknown, fallback: number) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 30 ? value as number : fallback;

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

export function cleanSolo(settings: Partial<SoloSettings> & { juzFrom?: number; juzTo?: number } | undefined): SoloSettings {
  const kinds = Array.isArray(settings?.kinds) ? SOLO_KINDS.filter(kind => settings!.kinds!.includes(kind)) : [];
  return {
    kinds: kinds.length ? kinds : DEFAULT_SOLO.kinds,
    list: cleanList(settings),
    difficulty: parseDifficulty(settings?.difficulty),
    leaves: (QUIZ_LEAVES as readonly number[]).includes(settings?.leaves as number) ? settings!.leaves! : DEFAULT_SOLO.leaves,
    length: quizLength(settings?.length, DEFAULT_SOLO.length),
    ...(settings?.apart === true && { apart: true }),
  };
}

type Pool = ReturnType<typeof branchQuestionPool>;
const pools = new Map<string, Pool>();

const treesFor = (list: QuizList, bookmarks: Bookmark[]) =>
  quizTrees(list.range, { filters: list.filters, saved: list.saved ? bookmarks.filter(item => !isCompareBookmark(item)).map(item => item.id) : undefined });

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

const scopeOf = (settings: Pick<SoloSettings, 'list' | 'apart'>): ChoiceScope => ({ range: settings.list.range, filters: { ...settings.list.filters, ...(settings.apart && { apart: '1' }) } });
const kindsOf = (settings: Pick<SoloSettings, 'kinds'>) => CHOICE_KINDS.filter(kind => settings.kinds.includes(kind.id));

export function availability(settings: Pick<SoloSettings, 'kinds' | 'list' | 'apart'>, bookmarks?: Bookmark[]) {
  const trees = settings.kinds.includes('BRANCHES') ? poolFor(settings.list, bookmarks).candidates.length : 0;
  const available = trees + kindsOf(settings).reduce((sum, kind) => sum + kind.count(scopeOf(settings)), 0);
  return { available };
}

const partyCounts = new Map<string, number>();
export function partyAvailable(settings: PartySettings) {
  const id = JSON.stringify({ topics: settings.topics, juzFrom: settings.juzFrom, juzTo: settings.juzTo, filters: settings.filters });
  const known = partyCounts.get(id);
  if (known !== undefined) return known;
  const params = new URLSearchParams(quizQuery(settings));
  const range = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const scope = parseTreeScope(params);
  const trees = settings.topics.includes('BRANCHES') ? branchQuestionPool(corpus.ayat as BranchAyah[], range, quizTrees(range, scope)).candidates.length : 0;
  const count = trees + CHOICE_KINDS.filter(kind => settings.topics.includes(kind.id)).reduce((sum, kind) => sum + kind.count({ range, filters: scope.filters ?? {} }), 0);
  if (partyCounts.size > 4) partyCounts.delete(partyCounts.keys().next().value!);
  partyCounts.set(id, count);
  return count;
}

export type SoloQuestion = AskedBranchQuestion | ChoiceQuestion;
export const isTree = (question: SoloQuestion): question is AskedBranchQuestion => 'tree' in question && !!question.tree;
export const isCompare = (question: SoloQuestion): question is ChoiceQuestion & { compare: CompareAsk } => 'compare' in question && !!question.compare;
const typedIn = (question: SoloQuestion) => isTree(question) || isCompare(question);
const emptyOf = (question: SoloQuestion) => isTree(question) ? emptyBranchAnswers(question) : emptyCompareAnswers(question);

export type SoloRun = {
  settings: SoloSettings;
  questions: SoloQuestion[];
  typed: string[][];
  shown?: boolean[];
  checked: boolean[];
  hints?: Hints[];
  current: number;
  submitted: boolean;
};

export function startSolo(settings: SoloSettings, random: Random = Math.random, bookmarks?: Bookmark[]): SoloRun {
  const trees = settings.kinds.includes('BRANCHES') ? branchQuiz(poolFor(settings.list, bookmarks), settings.length * 3, settings.leaves, random, settings.difficulty) : [];
  const kinds = kindsOf(settings).map(kind => kind.questions(scopeOf(settings), settings.difficulty, random, settings.length * 3));
  const questions = kunyaNotFirst(mixQuestions<SoloQuestion>([trees, ...kinds], settings.length, random, questionAyat));
  return { settings, questions, typed: questions.map(emptyOf), checked: questions.map(() => false), current: 0, submitted: false };
}

export const pick = (run: SoloRun, value: string): SoloRun =>
  run.checked[run.current] ? run : { ...run, typed: at(run.typed, run.current, [value]), checked: at(run.checked, run.current, true) };

export const reveal = (run: SoloRun): SoloRun => ({ ...run, shown: run.questions.map((_, i) => i === run.current || !!run.shown?.[i]) });

const answerOf = (question: SoloQuestion, typed: string[]) => typedIn(question) ? typed : typed[0];

const at = <T,>(list: T[], index: number, value: T) => list.map((item, i) => i === index ? value : item);

export const typeAnswer = (run: SoloRun, node: number, text: string): SoloRun =>
  run.checked[run.current] ? run : { ...run, typed: at(run.typed, run.current, at(run.typed[run.current], node, text)) };

export const setHints = (run: SoloRun, hints: Hints): SoloRun =>
  run.checked[run.current] ? run : { ...run, hints: run.questions.map((_, i) => i === run.current ? hints : run.hints?.[i] ?? {}) };

export const clearAnswers = (run: SoloRun): SoloRun =>
  run.checked[run.current] ? run : { ...run, typed: at(run.typed, run.current, emptyOf(run.questions[run.current])) };

export const hasTyped = (run: SoloRun, index = run.current) =>
  isTree(run.questions[index]) ? run.typed[index].some((text, node) => isAsked(run.questions[index] as AskedBranchQuestion, node) && text.trim() !== '')
    : isCompare(run.questions[index]) ? run.typed[index].some(text => text.trim() !== '') : run.typed[index].length > 0;

export const check = (run: SoloRun): SoloRun => ({ ...run, checked: at(run.checked, run.current, true) });

export const goTo = (run: SoloRun, index: number): SoloRun => ({ ...run, current: Math.max(0, Math.min(run.questions.length - 1, index)) });

export const submit = (run: SoloRun): SoloRun => ({ ...run, submitted: true, checked: run.checked.map((done, i) => done || hasTyped(run, i)) });

export type QuestionState = 'unanswered' | 'correct' | 'partial' | 'incorrect';

export function questionState(run: SoloRun, index: number): QuestionState {
  if (!run.checked[index]) return 'unanswered';
  const question = run.questions[index];
  if (isCompare(question)) {
    const { earned, total } = questionPoints(question, run.typed[index]);
    return earned === total ? 'correct' : earned > 0 ? 'partial' : 'incorrect';
  }
  if (!isTree(question) && (('correctAnswers' in question && question.correctAnswers) || ('order' in question && question.order))) {
    const { earned, total } = questionPoints(question, run.typed[index][0]);
    return earned === total ? 'correct' : earned > 0 ? 'partial' : 'incorrect';
  }
  if (!isTree(question)) return run.typed[index][0] === question.correctAnswer ? 'correct' : 'incorrect';
  if (branchesCorrect(question, run.typed[index])) return 'correct';
  return questionPoints(question, run.typed[index]).earned > 0 ? 'partial' : 'incorrect';
}

export function soloScore(run: SoloRun) {
  const points = run.questions.map((question, i) => run.checked[i] ? questionPoints(question, answerOf(question, run.typed[i])) : { earned: 0, total: questionPoints(question, typedIn(question) ? [] : undefined).total });
  const score = points.reduce((sum, point) => sum + point.earned, 0);
  const total = points.reduce((sum, point) => sum + point.total, 0);
  return { points, score, total, percent: total ? Math.round((score / total) * 100) : 0 };
}

export function partyQuiz(settings: PartySettings, random: Random = Math.random): { questions: PartyQuestion[]; surahNames: Record<number, string> } {
  const params = new URLSearchParams(quizQuery(settings));
  const range = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const scope = parseTreeScope(params);
  const choiceScope: ChoiceScope = { range, filters: scope.filters ?? {} };
  const trees = settings.topics.includes('BRANCHES')
    ? branchQuiz(branchQuestionPool(corpus.ayat as BranchAyah[], range, quizTrees(range, scope)), settings.length * 3, settings.leaves, random, settings.difficulty)
    : [];
  const kinds = CHOICE_KINDS.filter(kind => settings.topics.includes(kind.id)).map(kind => kind.questions(choiceScope, settings.difficulty, random, settings.length * 3));
  const written = settings.topics.some(topic => WRITTEN_TOPICS.includes(topic));
  const questions = kunyaNotFirst(mixQuestions<SoloQuestion>([trees, ...kinds], settings.length, random, questionAyat)).map(question => {
    const choice = question as ChoiceQuestion;
    const write = written && choice.ayahKey && choice.page?.recite ? writeAsk(choice.ayahKey, choice.page, settings.pen) : null;
    return {
      ...question,
      choices: recited(choice) || ticks(choice) || orders(choice) ? question.choices : shuffle(question.choices, random),
      ...(write && { write }),
    } as unknown as PartyQuestion;
  });
  const surahs = new Set(questions.flatMap(question => ((question.branches ?? []) as { ayat: { key: string }[] }[]).flatMap(branch => branch.ayat.map(ayah => Number(ayah.key.split(':')[0])))));
  return { questions, surahNames: Object.fromEntries([...surahs].map(number => [number, surahName(number)])) };
}
