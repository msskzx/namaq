import { describe, expect, it } from 'vitest';
import { ayatLabel, shownAyat, type Branch, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';
import { createPhrasePresenter, type PhraseGroup } from './phraseTrees';
import treeData from '../data/quran/trees.json';

const all = treeData.ayat as BranchAyah[];
const byKey = new Map(all.map(ayah => [ayah.key, ayah]));
const order = new Map(all.map((ayah, i) => [ayah.key, i]));
const basmala = byKey.get('1:1')!.words;
const surahOf = (key: string) => Number(key.split(':')[0]);
const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');
const plain = (words: string[]) => words.filter(word => !isEnd(word)).map(word => normalizeWord(word).replace(/[ؤئء]/g, 'ا').replace(/^[وف](?=..)/, ''));

/** The words read from one ayah to another, with a new surah's basmala before its first ayah, as the trees run on. */
function reading(first: string, last: string) {
  const from = order.get(first)!;
  const to = order.get(last)!;
  return all.slice(from, to + 1).flatMap(ayah => {
    const opens = ayah.key.endsWith(':1') && surahOf(ayah.key) !== 1 && surahOf(ayah.key) !== 9;
    return [...(opens ? basmala : []), ...ayah.words];
  });
}

const holds = (text: string[], part: string[]) => part.length === 0 || text.some((_, i) => part.every((word, j) => text[i + j] === word));

describe('tree labels', () => {
  it('names the ayah a branch is and the ayah a grown leaf reads into', () => {
    const leaf: Branch = { words: ['بسم', 'الله', 'الرحمن', 'الرحيم', 'ص', 'والقرآن'], ayat: ['37:182'], children: [], through: { '37:182': '38:1' } };
    const path = ['والحمد', 'لله', 'رب', 'العالمين', '۝'];
    expect(shownAyat(leaf, path)).toEqual({ '37:182': ['37:182', '38:1'] });
    expect(shownAyat({ words: ['الرحمن', 'الرحيم'], ayat: ['1:2'], children: [] }, ['الحمد', 'لله', 'رب', 'العالمين', '﴿٢﴾'])).toEqual({ '1:2': ['1:2', '1:3'] });
    expect(shownAyat({ words: ['رب', 'العالمين'], ayat: ['1:2'], children: [] }, ['الحمد', 'لله'])).toEqual({ '1:2': ['1:2'] });
    expect(ayatLabel(['1:2'], { 1: 'الفاتحة' })).toBe('الفاتحة ٢');
    expect(ayatLabel(['37:182', '38:1'], { 37: 'الصافات', 38: 'ص' })).toBe('الصافات ١٨٢ ثم ص ١');
    expect(ayatLabel(['2:4', '2:5'], { 2: 'البقرة' })).toBe('البقرة ٤–٥');
  });

  it('names, on every node of every tree, the ayat that hold the words the node shows', () => {
    const present = createPhrasePresenter(all);
    const wrong: string[] = [];
    let grown = 0;
    const visit = (id: string, node: Branch, path: string[]) => {
      const labels = shownAyat(node, path);
      for (const key of node.ayat) {
        const ayat = labels[key];
        if (ayat[0] !== key) wrong.push(`${id} ${key} labelled from ${ayat[0]}`);
        if (ayat.length > 1 && surahOf(ayat[1]) !== surahOf(key)) grown++;
        const own = node.forms?.[key]?.slice(path.length) ?? node.words;
        const last = ayat[ayat.length - 1];
        // All the node's words lie between the two ayat named, and the words after its last ayah end lie in the last one.
        const tail = own.slice(own.findLastIndex(isEnd) + 1);
        if (!holds(plain(reading(key, last)), plain(own)) || !holds(plain(reading(last, last)), plain(tail))) wrong.push(`${id} ${key} → ${ayat.join(' ')}: ${node.words.join(' ')}`);
      }
      node.children.forEach(child => visit(id, child, [...path, ...node.words]));
    };
    for (const group of treeData.trees as PhraseGroup[]) visit(group.id, present(group).tree, []);
    expect(wrong).toEqual([]);
    expect(grown).toBeGreaterThan(10);
  }, 180_000);
});
