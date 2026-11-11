import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import { sharedOpenings, withRoots, type BranchAyah } from '@shared/quran/branches';

const all = data.ayat as BranchAyah[];
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

  it.each([
    ['52:27', '70:3'],
    ['19:18', '19:20'],
  ])('does not keep the false shared opening for %s and %s', (first, second) => {
    const groups = sharedOpenings(all);

    expect([...groups.values()].some(group => group.some(ayah => ayah.key === first) && group.some(ayah => ayah.key === second))).toBe(false);
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

});
