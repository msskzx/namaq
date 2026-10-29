import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import data from '@/app/quran/branches/trees.json';
import { branchesHref, listOpenings, listPhrases, phraseTree, sharedOpenings, startingWith, withRoots, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';

const all = data.ayat as BranchAyah[];
const phraseId = (words: string[]) => words.map(normalizeWord).join(' ');
const ayah = (key: string, words: string[], roots: (string | null)[]): BranchAyah => ({ key, page: 1, words, roots });

describe('branch root partitions', () => {
  it('requires a corpus STEM mapping for every reader word and retains multiple roots on one word', () => {
    const morphology = readFileSync(join(__dirname, '../../../data/quran/quranic-corpus-morphology-0.4.txt'), 'utf8');
    const raw: BranchAyah = {
      key: '20:94',
      page: 1,
      words: ['قَالَ', 'يَـٰبْنَ أُمِّ', 'لَا', 'تَأْخُذْ', 'بِلِحْيَتِى', 'وَلَا', 'بِرَأْسِى', 'إِنِّى', 'خَشِيتُ', 'أَن', 'تَقُولَ', 'فَرَّقْتَ', 'بَيْنَ', 'بَنِىٓ', 'إِسْرَٰٓءِيلَ', 'وَلَمْ', 'تَرْقُبْ', 'قَوْلِى'],
    };
    const rooted = withRoots([raw], morphology)[0];

    expect(rooted.roots?.[1]).toBe('bny+Amm');
    expect(() => withRoots([{ ...raw, words: [...raw.words, 'كلمة غير موجودة'] }], morphology)).toThrow(/20:94/);
  });

  it('keeps generated root annotations aligned with every word and continuation', () => {
    expect(all.every(ayah => ayah.roots?.length === ayah.words.length)).toBe(true);
    expect(all.filter(ayah => ayah.next).every(ayah => ayah.nextRoots?.length === ayah.next?.length)).toBe(true);
  });

  it('keeps the real shared phrase in 41:52 and 46:10', () => {
    const id = phraseId(['قُلْ', 'أَرَءَيْتُمْ', 'إِن', 'كَانَ', 'مِن', 'عِندِ', 'ٱللَّهِ']);
    const matches = startingWith(all, id);

    expect(matches.filter(ayah => ['41:52', '46:10'].includes(ayah.key)).map(ayah => ayah.key)).toEqual(['41:52', '46:10']);
    expect(matches.find(ayah => ayah.key === '41:52')?.roots?.slice(0, 7)).toEqual(['qwl', 'rAy', null, 'kwn', null, 'End', 'Alh']);
    expect(matches.find(ayah => ayah.key === '46:10')?.roots?.slice(0, 7)).toEqual(['qwl', 'rAy', null, 'kwn', null, 'End', 'Alh']);
  });

  it.each([
    ['52:27', '70:3'],
    ['19:18', '19:20'],
  ])('does not keep the false shared opening for %s and %s', (first, second) => {
    const groups = sharedOpenings(all);

    expect([...groups.values()].some(group => group.some(ayah => ayah.key === first) && group.some(ayah => ayah.key === second))).toBe(false);
    expect(listOpenings(groups).some(opening => opening.id === (first === '52:27' ? 'من الله' : 'قالت اني'))).toBe(false);
  });

  it('keeps the two قال رب اني root partitions separately searchable', () => {
    const id = phraseId(['قَالَ', 'رَبِّ', 'إِنِّي']);
    const phrases = listPhrases(sharedOpenings(all)).filter(phrase => phrase.id === id);
    const two = phrases.find(phrase => phrase.count === 2);
    const seven = phrases.find(phrase => phrase.count === 7);

    expect(phrases).toHaveLength(2);
    expect(two?.partition).toBeTruthy();
    expect(seven?.partition).toBeTruthy();
    expect(two?.partition).not.toBe(seven?.partition);
    expect(startingWith(all, id, two?.partition).map(ayah => ayah.key)).toEqual(['3:40', '19:8']);
    expect(startingWith(all, id, seven?.partition).map(ayah => ayah.key)).toHaveLength(7);
  });

  it('requires matching roots after matching the written opening', () => {
    const shared = sharedOpenings([
      ayah('1:1', ['من', 'الله', 'نور'], [null, 'Alh', null]),
      ayah('1:2', ['من', 'الله', 'رحمة'], [null, 'Alh', null]),
      ayah('1:3', ['قال', 'رب', 'أني'], ['qwl', 'rbb', 'nwy']),
      ayah('1:4', ['قال', 'رب', 'أنت'], ['qwl', 'rbb', 'Ant']),
      ayah('1:5', ['قال', 'رب', 'أني'], ['qwl', null, 'nwy']),
      ayah('1:6', ['قال', 'رب', 'أنت'], ['qwl', null, 'Ant']),
      ayah('1:7', ['إن', 'الله', 'آية'], [null, null, null]),
      ayah('1:8', ['إن', 'الله', 'رحمة'], [null, null, null]),
      ayah('1:9', ['ما', 'الله', 'نور'], [null, 'Alh', null]),
      ayah('1:10', ['ما', 'الله', 'رحمة'], [null, null, null]),
      ayah('1:11', ['قال', 'زيد'], ['qwl', 'zyd']),
      ayah('1:12', ['قال', 'زيدا'], ['qwl', 'zyd']),
    ]);

    expect([...shared.values()].map(group => group.map(ayah => ayah.key))).toEqual([['1:1', '1:2'], ['1:3', '1:4'], ['1:5', '1:6'], ['1:7', '1:8']]);
  });

  it('splits a longer shared phrase when corresponding later words have different roots', () => {
    const ayat = [
      ayah('1:1', ['قال', 'رب', 'إني', 'نور'], ['qwl', 'rbb', 'root-a', 'nwr']),
      ayah('1:2', ['قال', 'رب', 'إني', 'رحمة'], ['qwl', 'rbb', 'root-a', 'rHm']),
      ayah('1:3', ['قال', 'رب', 'إني', 'ليل'], ['qwl', 'rbb', 'root-b', 'lyl']),
      ayah('1:4', ['قال', 'رب', 'إني', 'بحر'], ['qwl', 'rbb', 'root-b', 'bHr']),
    ];
    const groups = sharedOpenings(ayat);
    const group = [...groups.values()][0];
    const id = phraseId(['قال', 'رب', 'إني']);
    const phrases = listPhrases(groups).filter(phrase => phrase.id === id);
    const tree = phraseTree(group);

    expect(phrases.map(phrase => phrase.count).sort()).toEqual([2, 2]);
    expect(phrases[0].partition).not.toBe(phrases[1].partition);
    expect(startingWith(ayat, id, phrases[0].partition)).toHaveLength(2);
    expect(startingWith(ayat, id, phrases[1].partition)).toHaveLength(2);
    expect(tree.children.map(child => child.words[0])).toEqual(['إني', 'إني']);
  });

  it('keeps the tree identity in the URL', () => {
    const url = new URL(branchesHref('قال رب اني', undefined, { page: 3 }), 'https://namaq.test');

    expect(url.pathname).toBe('/quran/branches');
    expect(url.searchParams.get('o')).toBe('قال رب اني');
    expect(url.searchParams.has('r')).toBe(false);
    expect(url.searchParams.has('g')).toBe(false);
    expect(url.searchParams.get('p')).toBe('3');
    expect(url.searchParams.has('v')).toBe(false);
  });
});
