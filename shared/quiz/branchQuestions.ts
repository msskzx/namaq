// docs/quiz-ayah-branches.md
import { keys, type Branch, type BranchAyah, type Variant } from '../quran/branches';
import { inJuzRange, type JuzRange } from '../quran/juz';
import { buildTreeGroups, createPhrasePresenter, type TreeGroup } from '../quran/phraseTrees';
import { askedNodes } from './branchAnswers';
import { byDifficulty, DEFAULT_DIFFICULTY, levelOf, treeScore, type Difficulty } from './difficulty';
import { shuffle, type Random } from './random';

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
  /** How hard the tree is (difficulty.ts). */
  level: Difficulty;
  variants: Variant[];
  prefixes: Variant[];
  evidence: { claimKeys: string[] };
}

const nextClass = (ayah: BranchAyah, at: number) => at >= ayah.words.length ? '۝' : `${ayah.roots?.[at] ?? ''}:${ayah.words[at].replace(/[\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, '')}`;

/** The trees a quiz may ask, and how to turn one into a question; building a question costs time, so callers build only what they ask. */
export function branchQuestionPool(all: BranchAyah[], range: JuzRange | null = null, supplied?: TreeGroup[]) {
  const ayat = range ? all.filter(entry => inJuzRange(entry.key, range)) : all;
  const byKey = new Map(ayat.map(entry => [entry.key, entry]));
  // Supplied trees keep only their places inside the range.
  const trees = supplied ? supplied.map(group => ({ ...group, occurrences: group.occurrences.filter(occurrence => byKey.has(occurrence.key)) })) : buildTreeGroups(ayat);
  const present = createPhrasePresenter(ayat, true, !range);
  const candidates = trees.filter(group => !group.family && new Set(group.occurrences.map(occurrence => occurrence.key)).size >= 2 && new Set(group.occurrences.map(occurrence => occurrence.key)).size <= MAX_BRANCHES && new Set(group.occurrences.map(occurrence => nextClass(byKey.get(occurrence.key)!, occurrence.end))).size >= 2);
  const levels = new Map<TreeGroup, Difficulty>();
  /** A tree's difficulty, from its whole ayat. */
  const level = (group: TreeGroup) => {
    let found = levels.get(group);
    if (!found) levels.set(group, (found = levelOf(treeScore([...new Set(group.occurrences.map(occurrence => occurrence.key))].map(key => byKey.get(key)!.words)))));
    return found;
  };
  const build = (group: TreeGroup): BranchQuestion | null => {
    const presentation = present(group);
    const tree = presentation.tree;
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
      evidence: { claimKeys: [] },
    };
  };
  return { candidates, build, level };
}

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null, supplied?: TreeGroup[]): BranchQuestion[] {
  const { candidates, build } = branchQuestionPool(all, range, supplied);
  return candidates.flatMap(group => build(group) ?? []);
}

/**
 * A harder quiz (more answers per tree) picks bigger trees: trees with at least `leaves` leaves first, then the
 * biggest of the rest. Until each tree has its own difficulty, size stands in for it. Keeps the order otherwise.
 */
export function biggerFirst<T>(items: T[], leaves: number, size: (item: T) => number): T[] {
  return [...items.filter(item => size(item) >= leaves), ...items.filter(item => size(item) < leaves).sort((a, b) => size(b) - size(a))];
}

export type AskedBranchQuestion = BranchQuestion & { asked: number[] };

/**
 * A quiz of tree questions only, built on the device: random trees from the pool, of the chosen difficulty first, each with
 * `leaves` of its leaves to type. Only the trees it asks are built.
 */
export function branchQuiz(pool: ReturnType<typeof branchQuestionPool>, length: number, leaves: number, random: Random, difficulty: Difficulty = DEFAULT_DIFFICULTY): AskedBranchQuestion[] {
  const picked: AskedBranchQuestion[] = [];
  const ayat = (group: TreeGroup) => new Set(group.occurrences.map(occurrence => occurrence.key)).size;
  // The chosen level first; within each level, trees big enough for the leaves asked first.
  for (const group of byDifficulty(biggerFirst(shuffle(pool.candidates, random), leaves, ayat), difficulty, pool.level)) {
    if (picked.length >= length) break;
    const question = pool.build(group);
    if (question) picked.push({ ...question, asked: askedNodes(question.tree, leaves, random) });
  }
  return picked;
}
