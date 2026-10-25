import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { branch, grown, keys, listPhrases, sharedOpenings, startingWith, searchPhrases, type Branch, type BranchAyah } from './branches';
import { chapterFamilies } from './chapterFamilies';
import { inJuzRange } from './juz';
import { normalizeWord } from './normalize';

const all = ayat as BranchAyah[];
const families = chapterFamilies(all);
const expected = {
  hawamim: ['40:1', '41:1', '42:1', '43:1', '44:1', '45:1', '46:1'],
  tawasin: ['26:1', '27:1', '28:1'],
  mimat: ['2:1', '3:1', '29:1', '30:1', '31:1', '32:1'],
  raat: ['10:1', '11:1', '12:1', '13:1', '14:1', '15:1'],
  hamidat: ['1:2', '6:1', '18:1', '34:1', '35:1'],
  musabbihat: ['17:1', '57:1', '59:1', '61:1', '62:1', '64:1', '87:1'],
  'alif-lam-mim': ['2:1', '3:1', '7:1', '13:1', '29:1', '30:1', '31:1', '32:1'],
};

describe('chapter opening families', () => {
  it('selects the fixed chapter openings, including the named families and the broader الم prefix', () => {
    expect(Object.fromEntries(families.map(family => [family.id.replace('family:', ''), family.keys]))).toEqual(expected);
    expect(new Set(all.map(ayah => ayah.key)).size).toBe(all.length);
    expect(families.every(family => family.count === family.keys.length)).toBe(true);
  });

  it('finds every family by its Arabic and English name', () => {
    for (const family of families) {
      expect(searchPhrases(families, family.text)).toContain(family);
      expect(searchPhrases(families, family.textEn)).toContain(family);
    }
  });

  it('keeps original words on every tree path without inserting family names', () => {
    for (const family of families) {
      const group = family.keys.map(key => all.find(ayah => ayah.key === key)!);
      const tree = branch(group, true);
      const paths = new Map<string, string[]>();
      const walk = (node: Branch, path: string[]) => {
        const words = [...path, ...node.words];
        expect(node.words).not.toContain(family.text);
        node.ayat.forEach(key => paths.set(key, words));
        node.children.forEach(child => walk(child, words));
      };
      walk(tree, []);
      expect(keys(tree).sort()).toEqual([...family.keys].sort());
      for (const ayah of grown(group)) {
        expect(paths.get(ayah.key)?.map(normalizeWord)).toEqual(ayah.words.map(normalizeWord));
      }
    }
  });

  it('keeps links from family branches resolvable as shared Quran wording', () => {
    const phrases = listPhrases(sharedOpenings(all));
    for (const family of families) {
      const group = family.keys.map(key => all.find(ayah => ayah.key === key)!);
      const walk = (node: Branch, path: string[]) => {
        const words = [...path, ...node.words];
        if (path.length > 0 && node.children.length > 0) {
          const id = words.map(normalizeWord).join(' ');
          const selected = startingWith(all, id, node.partition);
          expect(phrases.some(phrase => phrase.id === id && (!phrase.partition || phrase.partition === node.partition)), id).toBe(true);
          expect(selected.map(ayah => ayah.key)).toEqual(expect.arrayContaining(keys(node)));
        }
        node.children.forEach(child => walk(child, words));
      };
      walk(branch(group, true), []);
    }
  });

  it('branches المسبحات by the actual four opening forms', () => {
    const family = families.find(family => family.id === 'family:musabbihat')!;
    const tree = branch(family.keys.map(key => all.find(ayah => ayah.key === key)!), true);
    expect(tree.words).toEqual([]);
    expect(tree.children.map(child => normalizeWord(child.words[0]))).toEqual(['سبحن', 'سبح', 'يسبح', 'سبح']);
    expect(tree.children.map(child => keys(child).length)).toEqual([1, 3, 2, 1]);
  });

  it('limits families to the selected juz and omits groups with fewer than two members', () => {
    const range = { from: 28, to: 28 };
    const selected = all.filter(ayah => inJuzRange(ayah.key, range));
    const restricted = chapterFamilies(selected);
    expect(restricted.find(family => family.id === 'family:musabbihat')?.keys).toEqual(['59:1', '61:1', '62:1', '64:1']);
    expect(restricted.every(family => family.keys.every(key => inJuzRange(key, range)))).toBe(true);
    expect(chapterFamilies(all.filter(ayah => ayah.key === '42:1'))).toEqual([]);
  });
});
