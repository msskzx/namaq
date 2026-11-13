import { describe, expect, it } from 'vitest';
import example from '@shared/data/quiz/example.json';
import type { Branch } from '@shared/quran/branches';
import { branchNodes } from './branchAnswers';
import { addHint, hintLetters, hintsOf, hintText } from './hints';

const tree = example.tree as Branch;
const leaves = branchNodes(tree).flatMap((node, index) => node.children.length ? [] : [index]);
const question = { tree, asked: leaves.slice(0, 2) };

describe('tree quiz hints', () => {
  it('reads the mushaf letters without tashkeel', () => {
    expect(hintLetters('ٱلۡكِتَٰبَ').join('')).toBe('الكتب');
    expect(hintText(['وَعُيُونٍ'], 1)).toBe('و…');
    expect(hintText(['وَعُيُونٍ'], 2)).toBe('وع…');
    expect(hintText(['وَعُيُونٍ'], 9)).toBe('وعيون');
    expect(hintText(['وَعُيُونٍ'], 0)).toBe('');
  });

  it('adds a letter only to the asked leaves still empty, and stops at the whole word', () => {
    const typed = branchNodes(tree).map(() => '');
    typed[leaves[1]] = 'شيء';
    let hints = addHint(question, typed, {});
    expect(Object.keys(hints).map(Number)).toEqual([leaves[0]]);
    for (let i = 0; i < 30; i++) hints = addHint(question, typed, hints);
    const word = branchNodes(tree)[leaves[0]].words[0];
    expect(hints[leaves[0]]).toBe(hintLetters(word).length);
    expect(hintsOf(question, hints)[leaves[0]]).toBe(hintLetters(word).join(''));
    expect(hintsOf(question, hints)[leaves[1]]).toBe('');
  });
});
