// see docs/quiz-ayah-branches.md
import { keys, ownAyat, type Branch, type BranchAyah, type Variant } from '../quran/branches';
import { inJuzRange, type JuzRange } from '../quran/juz';
import { ownAyatOnly } from '../quran/branchVerdicts';
import { buildTreeGroups, createTreePresenter, type TreeGroup } from '../quran/phraseTrees';
import { askedNodes } from './branchAnswers';
import { byDifficulty, DEFAULT_DIFFICULTY, levelOf, treeScore, type Difficulty } from './difficulty';
import { shuffle, type Random } from './random';
import { ayahPlace, MUSHAF_BOOK, type QuizSource } from './sources';

export const BRANCH_FAMILY = 'AYAH_BRANCH';
const MAX_BRANCHES = 10;

export type BranchAnswer = { words: string[]; ayat: { key: string; page: number; words: string[] }[] };

export interface BranchQuestion {
  key: string;
  family: typeof BRANCH_FAMILY;
  promptArabic: string;
  phrase: string;
  choices: [];
  correctAnswer: string;
  branches: BranchAnswer[];
  tree: Branch;
  level: Difficulty;
  variants: Variant[];
  prefixes: Variant[];
  sources: QuizSource[];
  evidence: { claimKeys: string[] };
}

const nextClass = (ayah: BranchAyah, at: number) => at >= ayah.words.length ? '۝' : `${ayah.roots?.[at] ?? ''}:${ayah.words[at].replace(/[\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, '')}`;

export function branchQuestionPool(all: BranchAyah[], range: JuzRange | null = null, supplied?: (TreeGroup & { sources?: QuizSource[]; cited?: boolean })[]) {
  const ayat = range ? all.filter(entry => inJuzRange(entry.key, range)) : all;
  const byKey = new Map(ayat.map(entry => [entry.key, entry]));
  const trees = supplied ? supplied.map(group => ({ ...group, occurrences: group.occurrences.filter(occurrence => byKey.has(occurrence.key)) })) : buildTreeGroups(ayat);
  const present = createTreePresenter(ayat, true, !range);
  const presentBook = createTreePresenter(ayat, true, false);
  const candidates = trees.filter(group => !group.family && new Set(group.occurrences.map(occurrence => occurrence.key)).size >= 2 && new Set(group.occurrences.map(occurrence => occurrence.key)).size <= MAX_BRANCHES && new Set(group.occurrences.map(occurrence => nextClass(byKey.get(occurrence.key)!, occurrence.end))).size >= 2);
  const levels = new Map<TreeGroup, Difficulty>();
  const level = (group: TreeGroup) => {
    let found = levels.get(group);
    if (!found) levels.set(group, (found = levelOf(treeScore([...new Set(group.occurrences.map(occurrence => occurrence.key))].map(key => byKey.get(key)!.words)))));
    return found;
  };
  const build = (group: TreeGroup & { sources?: QuizSource[]; cited?: boolean }): BranchQuestion | null => {
    const presentation = (group.cited ? presentBook : present)(group);
    const tree = ownAyatOnly(group) ? ownAyat(presentation.tree) : presentation.tree;
    const memberKeys = [...new Set(group.occurrences.map(occurrence => occurrence.key))];
    if (!tree.words.length || tree.children.length < 2 || tree.children.length > MAX_BRANCHES || tree.ayat.length > 0 || memberKeys.length > MAX_BRANCHES) return null;
    return {
      key: `${BRANCH_FAMILY}:${group.id}`,
      family: BRANCH_FAMILY,
      promptArabic: 'أكمل الأطراف الفارغة، وتكفي من كل طرف كلمتاه الأوليان.',
      phrase: group.id,
      choices: [],
      correctAnswer: tree.words.join(' '),
      tree,
      level: level(group),
      variants: [],
      prefixes: presentation.prefixes.filter(prefix => prefix.word),
      branches: tree.children.map(child => ({
        words: child.words,
        ayat: keys(child).map(key => {
          const entry = byKey.get(key)!;
          return { key, page: entry.page, words: entry.words.slice((presentation.offsets[key] ?? 0) + tree.words.length) };
        }),
      })),
      sources: [{ book: MUSHAF_BOOK, at: memberKeys.map(ayahPlace).join('، ') }, ...(group.sources ?? [])],
      evidence: { claimKeys: [] },
    };
  };
  return { candidates, build, level };
}

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null, supplied?: (TreeGroup & { sources?: QuizSource[] })[]): BranchQuestion[] {
  const { candidates, build } = branchQuestionPool(all, range, supplied);
  return candidates.flatMap(group => build(group) ?? []);
}

export function biggerFirst<T>(items: T[], leaves: number, size: (item: T) => number): T[] {
  return [...items.filter(item => size(item) >= leaves), ...items.filter(item => size(item) < leaves).sort((a, b) => size(b) - size(a))];
}

export type AskedBranchQuestion = BranchQuestion & { asked: number[] };

export function branchQuiz(pool: ReturnType<typeof branchQuestionPool>, length: number, leaves: number, random: Random, difficulty: Difficulty = DEFAULT_DIFFICULTY): AskedBranchQuestion[] {
  const picked: AskedBranchQuestion[] = [];
  const ayat = (group: TreeGroup) => new Set(group.occurrences.map(occurrence => occurrence.key)).size;
  for (const group of byDifficulty(biggerFirst(shuffle(pool.candidates, random), leaves, ayat), difficulty, pool.level)) {
    if (picked.length >= length) break;
    const question = pool.build(group);
    if (question) picked.push({ ...question, asked: askedNodes(question.tree, leaves, random) });
  }
  return picked;
}
