import { num } from '../quran/arabicNumber';
import { runOn, type Branch, type BranchAyah } from '../quran/branches';
import { type BranchQuestion } from './branchQuestions';
import { bare } from '../quran/quranText/ayahWords';

const AYAH_MARK = /^(۝|﴿([٠-٩]+)﴾)$/;

export type Rebuilt = { key: string; words: string[] };
export type IntegrityError = { question: string; key: string; problem: string; rebuilt: string; expected: string };

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

export function rebuildTreeAnswers(question: Pick<BranchQuestion, 'tree' | 'prefixes' | 'branches'>): Rebuilt[] {
  const openings = new Map(rebuildTreeAyat({ tree: { ...question.tree, children: [], ayat: question.branches.flatMap(branch => branch.ayat.map(ayah => ayah.key)) }, prefixes: question.prefixes }).map(entry => [entry.key, entry.words]));
  return question.branches.flatMap(branch => branch.ayat.map(ayah => ({ key: ayah.key, words: [...(openings.get(ayah.key) ?? []), ...ayah.words] })));
}

export function checkRebuilt(question: string, rebuilt: readonly Rebuilt[], ayat: readonly BranchAyah[]): IntegrityError[] {
  const order = new Map(ayat.map((ayah, index) => [ayah.key, index]));
  const basmala = ayat.find(ayah => ayah.key === '1:1');
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
      expected.push(word, ...runOn(ayat[at - 1].key, ayat[at], basmala).words);
    }
    const [got, want] = [words.join(' ').split(' '), expected.join(' ').split(' ')];
    const same = got.length === want.length && got.every((word, i) => word === want[i] || word.normalize('NFC') === bare(want[i]).normalize('NFC'));
    return same ? [] : fail('text differs', expected);
  });
}
