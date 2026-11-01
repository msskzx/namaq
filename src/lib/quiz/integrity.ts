// Every quiz question must give back the exact Quran text: what is shown plus what is asked,
// put together in order, has to equal the stored mushaf words, with nothing missing or changed.
import { num } from '@/lib/quran/arabicNumber';
import { type Branch, type BranchAyah } from '@/lib/quran/branches';
import { type BranchQuestion } from './branchQuestions';

/** Marks the end of an ayah when a branch runs on into the next one: ﴿٤٣﴾, or ۝ in a merged display. */
const AYAH_MARK = /^(۝|﴿([٠-٩]+)﴾)$/;

/** One ayah as a question carries it, from its first word to where its branch ends, ayah marks kept. */
export type Rebuilt = { key: string; words: string[] };
export type IntegrityError = { question: string; key: string; problem: string; rebuilt: string; expected: string };

/** Each ayah of a tree: its given opening, then each node from the root down to its leaf, in that ayah's own spelling. */
export function rebuildTreeAyat(question: Pick<BranchQuestion, 'tree' | 'prefixes'>): Rebuilt[] {
  const rebuilt: Rebuilt[] = [];
  const walk = (node: Branch, path: Branch[]) => {
    const nodes = [...path, node];
    for (const key of node.ayat) {
      const prefix = question.prefixes.find(variant => variant.keys.includes(key));
      const opening = prefix ? (prefix.forms?.[key] ?? [prefix.word]) : [];
      rebuilt.push({ key, words: [...opening, ...nodes.flatMap(each => each.forms?.[key] ?? each.words)] });
    }
    node.children.forEach(child => walk(child, nodes));
  };
  walk(question.tree, []);
  return rebuilt;
}

/** Each typed answer of a tree question, after the shown opening and trunk, must be the rest of its ayah. */
export function rebuildTreeAnswers(question: Pick<BranchQuestion, 'tree' | 'prefixes' | 'branches'>): Rebuilt[] {
  const openings = new Map(rebuildTreeAyat({ tree: { ...question.tree, children: [], ayat: question.branches.flatMap(branch => branch.ayat.map(ayah => ayah.key)) }, prefixes: question.prefixes }).map(entry => [entry.key, entry.words]));
  return question.branches.flatMap(branch => branch.ayat.map(ayah => ({ key: ayah.key, words: [...(openings.get(ayah.key) ?? []), ...ayah.words] })));
}

/**
 * Compares rebuilt ayat with the mushaf. The text must equal the ayah exactly; each ayah mark must sit
 * where an ayah ends and carry that ayah's number, and the text then runs on to the end of the next ayah.
 */
export function checkRebuilt(question: string, rebuilt: readonly Rebuilt[], ayat: readonly BranchAyah[]): IntegrityError[] {
  const order = new Map(ayat.map((ayah, index) => [ayah.key, index]));
  return rebuilt.flatMap(({ key, words }) => {
    const fail = (problem: string, expected: string[] = []) => [{ question, key, problem, rebuilt: words.join(' '), expected: expected.join(' ') }];
    if (words.some(word => !word.trim())) return fail('empty word');
    let at = order.get(key);
    if (at === undefined) return fail('unknown ayah');
    const expected = [...ayat[at].words];
    for (const word of words.slice(0, -1)) {
      const mark = word.match(AYAH_MARK);
      if (!mark) continue;
      if (mark[2] && mark[2] !== num(Number(ayat[at].key.split(':')[1]))) return fail('wrong ayah number', expected);
      if (++at >= ayat.length) return fail('runs past the last ayah', expected);
      expected.push(word, ...ayat[at].words);
    }
    return words.join(' ') === expected.join(' ') ? [] : fail('text differs', expected);
  });
}
