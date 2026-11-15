import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import { branchInventory } from './branchInventory';
import { keys, type Branch, type BranchAyah, type Variant } from './branches';
import { foldForms } from './foldForms';
import { buildPhraseGroups, createPhrasePresenter, phrasePresentation, phraseSubtreeTargets } from './phraseTrees';
import { groupPresentation } from './mutashabih/presentation';
import { writtenForms, writtenPieces, writtenStrands } from './writtenForms';

const leaf = (words: string[], ayat: string[], forms?: Record<string, string[]>): Branch => ({ words, ayat, children: [], ...(forms ? { forms } : {}) });
const prefix = (word: string, keys: string[]): Variant => ({ word, words: word ? word.split(' ') : [], conj: '', keys, id: 't' });

describe('foldForms', () => {
  it('moves a differing first word of the trunk into the words before it, and starts the trunk one word later', () => {
    const tree: Branch = { words: ['مِلَّةَ', 'إِبْرَٰهِيمَ'], ayat: ['3:95', '6:161'], children: [], forms: { '3:95': ['مِلَّةَ', 'إِبْرَٰهِيمَ'], '6:161': ['مِّلَّةَ', 'إِبْرَٰهِيمَ'] } };
    const folded = foldForms({ tree, prefixes: [prefix('فَٱتَّبِعُوا۟', ['3:95']), prefix('قِيَمًۭا', ['6:161'])], offsets: { '3:95': 4, '6:161': 9 } });
    expect(folded.prefixes.map(p => [p.word, p.differs])).toEqual([['فَٱتَّبِعُوا۟ مِلَّةَ', [1]], ['قِيَمًۭا مِّلَّةَ', [1]]]);
    expect(folded.tree.words).toEqual(['إِبْرَٰهِيمَ']);
    // The trunk keeps its old spelling for its tree id and links.
    expect(folded.tree.spelled).toEqual(['مِلَّةَ', 'إِبْرَٰهِيمَ']);
    expect(folded.tree.forms).toBeUndefined();
    expect(folded.offsets).toEqual({ '3:95': 5, '6:161': 10 });
  });

  it('moves a differing last word into the children when each child writes it one way', () => {
    const tree: Branch = { words: ['يَقُولُونَ', 'رَبَّنَا'], ayat: [], forms: { '25:65': ['يَقُولُونَ', 'رَبَّنَا'], '3:16': ['يَقُولُونَ', 'رَبَّنَآ'] }, children: [leaf(['ٱصْرِفْ'], ['25:65']), leaf(['إِنَّنَآ'], ['3:16'])] };
    const folded = foldForms({ tree, prefixes: [], offsets: {} });
    expect(folded.tree.words).toEqual(['يَقُولُونَ']);
    expect(folded.tree.children.map(child => [child.words.join(' '), child.differs])).toEqual([['رَبَّنَا ٱصْرِفْ', [0]], ['رَبَّنَآ إِنَّنَآ', [0]]]);
    expect([folded.tree.spelled, ...folded.tree.children.map(child => child.spelled)]).toEqual([['يَقُولُونَ', 'رَبَّنَا'], ['ٱصْرِفْ'], ['إِنَّنَآ']]);
  });

  it('moves a differing word before the ayah sign into the children with the sign (owner, 2026-11-15)', () => {
    const tree: Branch = { words: ['عَذَابٌ', 'أَلِيمٌ', '۝'], ayat: [], forms: { '2:174': ['عَذَابٌ', 'أَلِيمٌ', '۝'], '3:77': ['عَذَابٌ', 'أَلِيمٌۭ', '۝'] }, children: [leaf(['أُو۟لَـٰٓئِكَ'], ['2:174']), leaf(['وَإِنَّ'], ['3:77'])] };
    const folded = foldForms({ tree, prefixes: [], offsets: {} });
    expect(folded.tree.words).toEqual(['عَذَابٌ']);
    expect(folded.tree.children.map(child => child.words)).toEqual([['أَلِيمٌ', '۝', 'أُو۟لَـٰٓئِكَ'], ['أَلِيمٌۭ', '۝', 'وَإِنَّ']]);
  });

  it('dissolves a one-word node into its children, but never the trunk', () => {
    const forms = { '1:1': ['قَالُوا۟'], '1:2': ['قَالُوٓا۟'] };
    const node: Branch = { words: ['قَالُوا۟'], ayat: [], forms, children: [leaf(['أَ'], ['1:1']), leaf(['إِنَّ'], ['1:2'])] };
    const tree: Branch = { words: ['ثُمَّ'], ayat: [], children: [node, leaf(['لَا'], ['1:3'])] };
    const folded = foldForms({ tree, prefixes: [], offsets: {} }).tree;
    expect(folded.children.map(child => child.words.join(' '))).toEqual(['قَالُوا۟ أَ', 'قَالُوٓا۟ إِنَّ', 'لَا']);
    expect(folded.children.map(child => child.spelled)).toEqual([['قَالُوا۟', 'أَ'], ['قَالُوا۟', 'إِنَّ'], undefined]);
    expect(foldForms({ tree: node, prefixes: [], offsets: {} }).tree.words).toEqual(['قَالُوا۟']);
  });

  it('gives a word to ayat that start with the trunk as a box of its own before it', () => {
    const tree: Branch = { words: ['ٱللَّهُ', 'يَبْسُطُ'], ayat: ['13:26', '30:37'], children: [], forms: { '13:26': ['ٱللَّهُ', 'يَبْسُطُ'], '30:37': ['ٱللَّهَ', 'يَبْسُطُ'] } };
    const folded = foldForms({ tree, prefixes: [prefix('', ['13:26']), prefix('أَنَّ', ['30:37'])], offsets: { '13:26': 0, '30:37': 3 } });
    expect(folded.prefixes.map(p => [p.word, p.differs])).toEqual([['ٱللَّهُ', [0]], ['أَنَّ ٱللَّهَ', [1]]]);
    expect(folded.offsets).toEqual({ '13:26': 1, '30:37': 4 });
  });

  it('keeps a word when the neighbours part the ayat another way, or an ayah ends at the node', () => {
    const forms = { a: ['x', 'yَ'], b: ['x', 'yُ'], c: ['x', 'yُ'] };
    const mixed: Branch = { words: ['x', 'y'], ayat: [], forms, children: [leaf(['p'], ['a', 'b']), leaf(['q'], ['c'])] };
    expect(foldForms({ tree: mixed, prefixes: [], offsets: {} }).tree.words).toEqual(['x', 'y']);
    const ending: Branch = { words: ['x', 'y'], ayat: ['a'], forms, children: [leaf(['q'], ['b', 'c'])] };
    expect(foldForms({ tree: ending, prefixes: [], offsets: {} }).tree.words).toEqual(['x', 'y']);
  });
});

describe('writtenPieces and writtenStrands', () => {
  const node = { forms: { '2:173': ['عَلَيْكُمُ', 'ٱلْمَيْتَةَ', 'وَٱلدَّمَ', 'وَلَحْمَ', 'ٱلْخِنزِيرِ'], '16:115': ['عَلَيْكُمُ', 'ٱلْمَيْتَةَ', 'وَٱلدَّمَ', 'وَلَحْمَ', 'ٱلْخِنزِيرِ'], '5:3': ['عَلَيْكُمُ', 'ٱلْمَيْتَةُ', 'وَٱلدَّمُ', 'وَلَحْمُ', 'ٱلْخِنزِيرِ'] } };

  it('draws neighbouring differing words as one braid', () => {
    expect(writtenPieces(5, i => writtenForms(node, i, '').length > 1)).toEqual([{ kind: 'word', index: 0 }, { kind: 'braid', from: 1, to: 4 }, { kind: 'word', index: 4 }]);
  });

  it('gives one strand for each way the ayat write the run, most ayat first, or the lit ayah alone', () => {
    expect(writtenStrands(node, 1, 4)).toEqual([{ words: ['ٱلْمَيْتَةَ', 'وَٱلدَّمَ', 'وَلَحْمَ'], keys: ['2:173', '16:115'] }, { words: ['ٱلْمَيْتَةُ', 'وَٱلدَّمُ', 'وَلَحْمُ'], keys: ['5:3'] }]);
    expect(writtenStrands(node, 1, 4, new Set(['5:3']))).toEqual([{ words: ['ٱلْمَيْتَةُ', 'وَٱلدَّمُ', 'وَلَحْمُ'], keys: ['5:3'] }]);
  });
});

describe('every tree of the default list, folded', () => {
  const ayat = corpus.ayat as BranchAyah[];
  const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
  const pieces = branchInventory({}, null);
  const presentations = pieces.map(piece => [piece.id, piece.group ? groupPresentation(piece.group, byKey) : phrasePresentation(piece.phrase, ayat, true, true)] as const);

  it('writes each moved word as its ayat do, in its place in the ayah', () => {
    const wrong: string[] = [];
    let moved = 0;
    for (const [id, { tree, prefixes, offsets, ayat: compared }] of presentations) {
      const words = new Map(compared.map(ayah => [ayah.key, ayah.words]));
      prefixes.forEach(p => p.differs?.forEach(at => { moved++; for (const key of p.keys) if (words.get(key)?.[at] !== p.words![at]) wrong.push(`${id} ${key}`); }));
      const walk = (node: Branch, depth: number) => {
        node.differs?.forEach(at => { moved++; for (const key of keys(node)) if (words.get(key)?.[offsets[key] + depth + at] !== node.words[at]) wrong.push(`${id} ${key}`); });
        node.children.forEach(child => walk(child, depth + node.words.length));
      };
      walk(tree, 0);
    }
    expect(moved).toBeGreaterThan(300);
    expect(wrong).toEqual([]);
  }, 120000);

  it('finds the same trees of their own under its nodes as the unfolded tree', () => {
    const groups = buildPhraseGroups(ayat);
    const present = createPhrasePresenter(ayat);
    const differ: string[] = [];
    for (const piece of pieces.filter(piece => !piece.group).slice(0, 400)) {
      const before = phraseSubtreeTargets(present(piece.phrase).tree, groups, ayat);
      const after = phraseSubtreeTargets(phrasePresentation(piece.phrase, ayat).tree, groups, ayat);
      for (const [nodeKeys, target] of Object.entries(after)) if (before[nodeKeys]?.id !== target.id) differ.push(`${piece.id} ${nodeKeys}`);
    }
    expect(differ).toEqual([]);
  }, 120000);

  it('leaves a trunk on every tree and a braid only where the neighbours cannot take the word', () => {
    const braided = new Set<string>();
    for (const [id, { tree }] of presentations) {
      expect(tree.words.length).toBeGreaterThan(0);
      const walk = (node: Branch) => {
        if (writtenPieces(node.words.length, i => writtenForms(node, i, node.words[i]).length > 1).some(piece => piece.kind === 'braid')) braided.add(id);
        node.children.forEach(walk);
      };
      walk(tree);
    }
    expect(braided.has('cmp:0lazdrn02iyanb')).toBe(false);
    expect(braided.has('cmp:0u1tixf1q1mbt5')).toBe(true);
    expect(braided.size).toBeLessThan(80);
  }, 120000);
});
