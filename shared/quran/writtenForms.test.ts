import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import { branchInventory } from './branchInventory';
import type { Branch, BranchAyah, Variant } from './branches';
import { createPhrasePresenter } from './phraseTrees';
import { writtenForms } from './writtenForms';

const node = { forms: { '2:161': ['عَلَيْهِمْ', 'لَعْنَةُ', '﴿١٦١﴾'], '3:87': ['عَلَيْهِمْ', 'لَعْنَةَ', '﴿٨٧﴾'], '9:9': ['عَلَيْهِمْ', 'لَعْنَةُ', '﴿٩﴾'] } };

describe('writtenForms', () => {
  it('gives a word its ayat agree on once', () => {
    expect(writtenForms(node, 0, 'عَلَيْهِمْ')).toEqual([{ word: 'عَلَيْهِمْ', keys: ['2:161', '3:87', '9:9'] }]);
    expect(writtenForms({}, 0, 'قَالَ')).toEqual([{ word: 'قَالَ', keys: [] }]);
  });

  it('gives each way the ayat write a differing word, with its ayat, most ayat first', () => {
    expect(writtenForms(node, 1, 'لَعْنَة')).toEqual([{ word: 'لَعْنَةُ', keys: ['2:161', '9:9'] }, { word: 'لَعْنَةَ', keys: ['3:87'] }]);
  });

  it('never gives the blended word when the ayat differ', () => {
    expect(writtenForms(node, 1, 'لَعْنَة').map(form => form.word)).not.toContain('لَعْنَة');
  });

  it('reads as the lit ayah alone: its own form and its own ayah number', () => {
    const lit = new Set(['3:87']);
    expect(writtenForms(node, 1, 'لَعْنَة', lit)).toEqual([{ word: 'لَعْنَةَ', keys: ['3:87'] }]);
    expect(writtenForms(node, 2, '۝', lit)).toEqual([{ word: '﴿٨٧﴾', keys: ['3:87'] }]);
  });

  it('keeps one bare end mark while ayat with different numbers share it', () => {
    expect(writtenForms(node, 2, '۝')).toEqual([{ word: '۝', keys: ['2:161', '3:87', '9:9'] }]);
    expect(writtenForms(node, 2, '۝', new Set(['2:161', '3:87']))).toEqual([{ word: '۝', keys: ['2:161', '3:87'] }]);
  });

  it('ignores lit ayat the node does not hold', () => {
    expect(writtenForms(node, 1, 'لَعْنَة', new Set(['7:1']))).toHaveLength(2);
  });
});

describe('every word a tree draws', () => {
  const ayat = corpus.ayat as BranchAyah[];
  const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
  const present = createPhrasePresenter(ayat);
  const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');

  it('is written that way in an ayah of its node, on every tree of the default list', () => {
    const wrong: string[] = [];
    const check = (id: string, words: string[], forms: Record<string, string[]> | undefined) => words.forEach((shared, index) => {
      for (const { word, keys } of writtenForms({ forms }, index, shared)) {
        if (forms && !isEnd(word) && !keys.every(key => forms[key][index] === word)) wrong.push(`${id}: ${word}`);
      }
    });
    const walk = (id: string, branch: Branch) => { check(id, branch.words, branch.forms); branch.children.forEach(child => walk(id, child)); };
    const pieces = branchInventory({}, null);
    expect(pieces.length).toBeGreaterThan(900);
    for (const piece of pieces) {
      const { tree, prefixes } = present(piece.phrase);
      walk(piece.id, tree);
      prefixes.forEach((prefix: Variant) => check(piece.id, prefix.words ?? [], prefix.forms));
    }
    expect(wrong).toEqual([]);
  }, 120000);

  it('comes from the ayah itself when the node has one way to write it', () => {
    const piece = branchInventory({}, null).find(candidate => candidate.id === 'cmp:0drvgjs1g0a1fs')!;
    const { tree, offsets } = present(piece.phrase);
    expect(tree.forms!['2:161'][1]).toBe(byKey.get('2:161')!.words[offsets['2:161'] + 1]);
    expect(writtenForms(tree, 1, tree.words[1]).map(form => form.word)).toEqual(['لَعْنَةُ', 'لَعْنَةَ']);
  });
});
