import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import { braid, compareTree } from './braid';
import { keys, type Branch } from './branches';
import type { CardSide } from './compareCards';

const words = (key: string) => corpus.ayat.find(ayah => ayah.key === key)!.words;
const text = (list: string[], [start, end]: [number, number]) => list.slice(start, end).join(' ').normalize('NFC');

describe('braid', () => {
  it('parts and rejoins 2:35 and 7:19 where Adam is told to dwell and eat', () => {
    const a = words('2:35');
    const b = words('7:19');
    const strands = braid(a, b);
    expect(strands.map(strand => strand.kind)).toEqual(['split', 'shared', 'split', 'shared']);
    expect(strands[0].a).toEqual([0, 2]);
    expect(strands[0].b).toEqual([0, 1]);
    expect(text(a, strands[1].a)).toBe(text(b, strands[1].b));
    expect(strands[1].a[1] - strands[1].a[0]).toBe(4);
    expect(strands[2].a[1] - strands[2].a[0]).toBe(3);
    expect(strands[2].b[1] - strands[2].b[0]).toBe(2);
    expect(strands[3].a[1]).toBe(a.length);
    expect(strands[3].b[1]).toBe(b.length);
  });

  it('covers both lists in order with no gap', () => {
    for (const [p, q] of [['2:35', '7:19'], ['42:14', '45:17'], ['2:48', '2:123'], ['26:8', '26:67'], ['1:1', '2:255']]) {
      const a = words(p);
      const b = words(q);
      const strands = braid(a, b);
      let at = [0, 0];
      for (const strand of strands) {
        expect(strand.a[0]).toBe(at[0]);
        expect(strand.b[0]).toBe(at[1]);
        if (strand.kind === 'shared') expect(strand.a[1] - strand.a[0]).toBe(strand.b[1] - strand.b[0]);
        at = [strand.a[1], strand.b[1]];
      }
      expect(at).toEqual([a.length, b.length]);
      expect(strands.every((strand, i) => i === 0 || strand.kind !== strands[i - 1].kind)).toBe(true);
    }
  });

  it('is one shared strand for identical ayat and one split when nothing long is shared', () => {
    expect(braid(words('26:8'), words('26:67')).map(strand => strand.kind)).toEqual(['shared']);
    expect(braid(['قال', 'موسى'], ['قال', 'فرعون']).map(strand => strand.kind)).toEqual(['split']);
  });
});

describe('compareTree', () => {
  it('makes a compare tree that parts and rejoins, each box naming the sides through it', () => {
    const side = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return { surah, ayah, ayat: [{ number: ayah, words: words(key) }] }; };
    const { tree, sides } = compareTree([side('2:35'), side('7:19')]);
    // It opens apart: a root with no words, a child for each side, then the shared «اسكن انت وزوجك الجنة».
    expect(tree.words).toEqual([]);
    expect(tree.children.map(keys)).toEqual([['2:35'], ['7:19']]);
    expect(keys(tree)).toEqual(['2:35', '7:19']);
    expect(tree.children.map(child => sides.get(child))).toEqual([0, 1]);
    const middle = tree.rejoin!;
    expect(middle.words).toHaveLength(4);
    expect(middle.tones).toHaveLength(4);
    expect(middle.children.map(child => sides.get(child))).toEqual([0, 1]);
    expect(middle.rejoin!.rejoin).toBeUndefined();
  });

  it('gives each node the end signs, the ayat it names and its words\' likeness, as a branches node', () => {
    const sides: [CardSide, CardSide] = [
      { surah: 2, ayah: 51, ayat: [{ number: 51, words: ['وَإِذْ', 'وَٰعَدْنَا', 'مُوسَىٰٓ', 'أَرْبَعِينَ', 'لَيْلَةً'], marks: { 1: { kind: 'root' }, 2: { kind: 'exact', link: 'm' } } }] },
      { surah: 7, ayah: 142, ayat: [{ number: 142, words: ['وَوَٰعَدْنَا', 'مُوسَىٰ', 'ثَلَـٰثِينَ', 'لَيْلَةً'], marks: { 1: { kind: 'exact', link: 'm' } } }, { number: 143, words: ['أَرْبَعِينَ', 'لَيْلَةً'] }] },
    ];
    const { tree } = compareTree(sides, new Set(['m']));
    const [first, second] = tree.children;
    // A box of one side names the ayat it holds; the sides' names are no longer kept for the first boxes alone.
    expect(first.holds).toEqual([['2:51']]);
    expect(second.holds).toEqual([['7:142']]);
    // An ayah's end sign follows its last word, a word the other side writes differently is written, a root match is root.
    expect(second.words).toContain('﴿١٤٢﴾');
    expect(first.tones![first.words.indexOf('مُوسَىٰٓ')]).toBe('written');
    expect(first.tones![first.words.indexOf('وَٰعَدْنَا')]).toBe('root');
    // The box each side's last word is in hangs the ayah after it, found after the side's last ayah.
    const last = (node: Branch): Branch => node.rejoin ? last(node.rejoin) : node;
    const end = last(tree);
    // «أربعين ليلة» closes both: it names the ayat ending there, and hangs both sides' ayah after, found after 7:143.
    expect(end.holds).toEqual([['2:51'], ['7:143']]);
    expect(end.ayat).toEqual(['2:51', '7:142']);
    expect(end.through).toEqual({ '2:51': '2:51', '7:142': '7:143' });
  });

  it('marks two ayat with different numbers ending together with one empty sign, and both in the box\'s names', () => {
    const sides: [CardSide, CardSide] = [
      { surah: 2, ayah: 15, ayat: [{ number: 15, words: ['فِى', 'طُغْيَـٰنِهِمْ', 'يَعْمَهُونَ'] }] },
      { surah: 7, ayah: 186, ayat: [{ number: 186, words: ['فِى', 'طُغْيَـٰنِهِمْ', 'يَعْمَهُونَ'] }] },
    ];
    const { tree } = compareTree(sides);
    expect(tree.words.at(-1)).toBe('۝');
    expect(tree.holds).toEqual([['2:15'], ['7:186']]);
    expect(tree.ayat).toEqual(['2:15', '7:186']);
  });
});
