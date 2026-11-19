// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 4): a tree box that ends an ayah closes with that
// ayah's number sign, as the mushaf writes it (owner, 2026-11-14). Both tree drawers take the sign from `closingSign`, and
// every tree the app and the website can build is walked through it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import data from './quranText/corpus';
import { num } from './arabicNumber';
import { closingSign, END, endedIn, isEndSign, type Branch, type BranchAyah } from './branches';
import type { TreeGroup } from './phraseTrees';
import { branchQuestions } from '../quiz/branchQuestions';

const ROOT = join(__dirname, '../..');
const DRAWERS = ['src/app/quran/branches/BranchTree.tsx', 'mobile/src/components/BranchTree.tsx', 'src/app/quran/branches/Surroundings.tsx'];

/** Every box of a tree with the words before it. */
function boxes(node: Branch, path: string[] = []): { node: Branch; path: string[] }[] {
  return [{ node, path }, ...node.children.flatMap(child => boxes(child, [...path, ...node.words]))];
}

describe('a tree box that ends an ayah shows its sign', () => {
  const trees = branchQuestions(data.ayat as BranchAyah[], null, data.trees as TreeGroup[]).map(question => question.tree);

  // Worked out from the corpus, not from the drawers' helpers: of the box's ayah and the two after it, the box ends the one
  // whose closing words its own words match furthest back (so «وما أدراك ما ليلة القدر» ends al-Qadr 2, not 1).
  const words = new Map((data.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.words]));
  const next = (key: string) => { const [s, a] = key.split(':').map(Number); return words.has(`${s}:${a + 1}`) ? `${s}:${a + 1}` : words.has(`${s + 1}:1`) ? `${s + 1}:1` : undefined; };
  const matched = (ayah: string[], box: string[]) => { let n = 0; while (n < ayah.length && n < box.length && ayah[ayah.length - 1 - n] === box[box.length - 1 - n]) n++; return n; };
  /** The ayat the box may end: those matched furthest back (two alike ayat, as al-Shu'ara 108 and 110, both count). */
  const endsIn = (key: string, box: string[]) => {
    const tried: [string, number][] = [];
    for (let at: string | undefined = key, n = 0; at && n < 4; at = next(at), n++) tried.push([at, matched(words.get(at)!, box)]);
    const most = Math.max(...tried.map(([, run]) => run));
    return most > 0 ? tried.filter(([, run]) => run === most).map(([at]) => Number(at.split(':')[1])) : undefined;
  };

  it('every box of every tree ends with the sign of the ayat that end in it, and no other box has one', () => {
    expect(trees.length).toBeGreaterThan(0);
    const wrong = trees.flatMap(tree => boxes(tree)).flatMap(({ node, path }) => {
      const sign = closingSign(node.words, endedIn(node, path));
      const word = node.words[node.words.length - 1] ?? '';
      if (node.ayat.length === 0 || isEndSign(word)) return sign.length ? [`${node.ayat.join(',')}: a sign on a box that ends no ayah`] : [];
      // Words after the box's last sign are the ayah it ends in; a box whose words end no ayah of the three is left alone.
      const box = [...path, ...node.words];
      const ended = node.ayat.map(key => endsIn(key, box.slice(box.findLastIndex(isEndSign) + 1)));
      if (ended.some(numbers => !numbers)) return [];
      // One ayah number (or one of two alike ayat) gives its sign; ayat of different numbers give the bare sign.
      const allowed = ended.length === 1 ? ended[0]!.map(n => `﴿${num(n)}﴾`) : new Set(ended.map(numbers => numbers![0])).size === 1 ? [`﴿${num(ended[0]![0])}﴾`] : [END];
      return allowed.includes(sign.join(' ')) ? [] : [`${node.ayat.join(',')} «${node.words.join(' ')}»: ${sign.join(' ')} for ${allowed.join(' or ')}`];
    });
    expect(wrong).toEqual([]);
  });

  it('a dashed neighbour box closes with its own ayah\'s sign', () => {
    expect(closingSign(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ'], ['2:2'])).toEqual([`﴿${num(2)}﴾`]);
    expect(closingSign(['ذَٰلِكَ', `﴿${num(2)}﴾`], ['2:2'])).toEqual([]);
    expect(closingSign(['قَالَ'], ['7:12', '38:76'])).toEqual([END]);
    expect(closingSign(['قَالَ'], [])).toEqual([]);
  });

  it('both drawers take the sign from closingSign', () => {
    for (const path of DRAWERS) {
      const source = readFileSync(join(ROOT, path), 'utf8');
      expect(source, path).toMatch(/\bclosingSign\(/);
      expect(source, path).not.toMatch(/\bendSign\(/);
    }
  });
});
