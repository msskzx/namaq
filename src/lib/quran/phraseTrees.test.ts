import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ayahEnds, readerAyat, withRoots, type Branch, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';
import { buildPhraseGroups, phrasePieces, phrasePresentation, type PhraseGroup } from './phraseTrees';
import treeData from '@/app/quran/branches/trees.json';

const ayah = (key: string, text: string, roots?: (string | null)[], lemmas?: (string | null)[]): BranchAyah => {
  const words = text.split(' ');
  return { key, page: 1, words, roots: roots ?? words.map(normalizeWord), lemmas: lemmas ?? words.map(normalizeWord) };
};
const members = (group: PhraseGroup) => [...new Set(group.occurrences.map(occurrence => occurrence.key))].sort();
const treeKeys = (tree: Branch): string[] => [...tree.ayat, ...tree.children.flatMap(treeKeys)];
const normalized = (text: string) => normalizeWord(text).replace(/[ؤئء]/g, 'ا');
const find = (groups: PhraseGroup[], text: string) => groups.find(group => normalized(group.text) === normalized(text));

describe('buildPhraseGroups', () => {
  it('returns no phrase groups for an empty corpus', () => {
    expect(buildPhraseGroups([])).toEqual([]);
  });

  it('includes two consecutive rooted words with an occurrence inside an ayah', () => {
    const groups = buildPhraseGroups([
      ayah('56:1', 'إِذَا وَقَعَتِ ٱلْوَاقِعَةُ', [null, 'wqE', 'wqE']),
      ayah('69:15', 'فَيَوْمَئِذٍ وَقَعَتِ ٱلْوَاقِعَةُ', ['ywm', 'wqE', 'wqE']),
    ]);
    expect(members(find(groups, 'وقعت الواقعة')!)).toEqual(['56:1', '69:15']);
  });

  it('includes a two-word phrase when both corresponding words are rootless', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل عن الذين', ['qwl', null, null]),
      ayah('1:2', 'عن الذين جاءوا', [null, null, 'jyA']),
    ]);
    expect(members(find(groups, 'عن الذين')!)).toEqual(['1:1', '1:2']);
  });

  it('includes three consecutive words when the phrase contains a rootless word', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'جاهدوا في سبيل الله', ['jhd', null, 'sbl', 'Alh']),
      ayah('1:2', 'في سبيل الله أنفقوا', [null, 'sbl', 'Alh', 'nfq']),
    ]);
    expect(members(find(groups, 'في سبيل الله')!)).toEqual(['1:1', '1:2']);
  });

  it('includes a phrase when all occurrences begin their ayat', () => {
    expect(members(find(buildPhraseGroups([
      ayah('1:1', 'قال رب اغفر'),
      ayah('1:2', 'قال رب ارحم'),
    ]), 'قال رب')!)).toEqual(['1:1', '1:2']);
  });

  it('ignores a morphology-marked conjunction only at the start of an occurrence', () => {
    const first = { ...ayah('2:3', 'وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا', ['qwm', 'Slw', null], ['qwm', 'Slw', 'mA']), conjs: ['و', null, 'و'] };
    const second = { ...ayah('8:3', 'يُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا', ['qwm', 'Slw', null], ['qwm', 'Slw', 'mA']), conjs: [null, null, 'و'] };
    const built = buildPhraseGroups([first, second]);
    expect(built.map(group => group.text)).toEqual(['يُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا']);
    const group = find(built, 'يُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا');
    expect(members(group!)).toEqual(['2:3', '8:3']);
    expect(phrasePresentation(group!, [first, second]).prefixes.map(prefix => prefix.word).sort()).toEqual(['', 'و']);
  });

  it('requires two distinct ayat rather than two occurrences in one ayah', () => {
    expect(buildPhraseGroups([ayah('1:1', 'قال رب اغفر قال رب اغفر')])).toEqual([]);
  });

  it('retains separate offsets when one ayah contains the shared phrase twice', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل قال رب اغفر قال رب ارحم'),
      ayah('1:2', 'قال رب أعني'),
    ]);
    expect(find(groups, 'قال رب')?.occurrences.filter(occurrence => occurrence.key === '1:1').map(({ start, end }) => [start, end])).toEqual([[1, 3], [4, 6]]);
  });

  it('drops a shorter phrase when a longer run covers exactly the same ayat', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل قال رب اغفر لي'),
      ayah('1:2', 'قال رب اغفر لنا'),
    ]);
    expect(find(groups, 'قال رب')).toBeUndefined();
    expect(members(find(groups, 'قال رب اغفر')!)).toEqual(['1:1', '1:2']);
  });

  it('retains a shorter phrase when extending it would lose one of its ayat', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل قال رب اغفر لي'),
      ayah('1:2', 'قال رب اغفر لنا'),
      ayah('1:3', 'قال رب ارحمنا'),
    ]);
    expect(members(find(groups, 'قال رب')!)).toEqual(['1:1', '1:2', '1:3']);
    expect(members(find(groups, 'قال رب اغفر')!)).toEqual(['1:1', '1:2']);
  });

  it('does not match different written forms merely because their roots agree', () => {
    expect(buildPhraseGroups([
      ayah('1:1', 'قل مات الرجل', ['qwl', 'mwt', 'rjl']),
      ayah('1:2', 'ميت الرجل', ['mwt', 'rjl']),
    ])).toEqual([]);
  });

  it('does not match identical letters whose roots disagree', () => {
    expect(buildPhraseGroups([
      ayah('1:1', 'قل قال رب', ['qwl', 'first', 'rbb']),
      ayah('1:2', 'قال رب', ['second', 'rbb']),
    ])).toEqual([]);
  });

  it('matches different marks when letters roots and lemmas agree', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل عَلِمَ رَبُّ', ['qwl', 'Elm', 'rbb'], ['qwl', 'Elm', 'rbb']),
      ayah('1:2', 'عُلِمَ رَبِّ', ['Elm', 'rbb'], ['Elm', 'rbb']),
    ]);
    expect(groups.some(group => members(group).length === 2)).toBe(true);
  });

  it('keeps different spellings apart when their lemmas also disagree', () => {
    expect(buildPhraseGroups([
      ayah('1:1', 'قل عَلِمَ رَبُّ', ['qwl', 'Elm', 'rbb'], ['qwl', 'first', 'rbb']),
      ayah('1:2', 'عُلِمَ رَبِّ', ['Elm', 'rbb'], ['second', 'rbb']),
    ])).toEqual([]);
  });

  it('matches identical spellings with matching roots even when lemmas differ', () => {
    const groups = buildPhraseGroups([
      ayah('1:1', 'قل قال رب', ['qwl', 'qwl', 'rbb'], ['qwl', 'first', 'rbb']),
      ayah('1:2', 'قال رب', ['qwl', 'rbb'], ['second', 'rbb']),
    ]);
    expect(members(find(groups, 'قال رب')!)).toEqual(['1:1', '1:2']);
  });

  it('does not form a trunk from the same words in a different order', () => {
    expect(buildPhraseGroups([
      ayah('1:1', 'قل قال رب اغفر'),
      ayah('1:2', 'اغفر رب قال'),
    ])).toEqual([]);
  });

  it('merges hamza seats in the five real resurrection passages', () => {
    const wanted = ['23:82', '37:16', '37:53', '50:3', '56:47'];
    const pages = Array.from({ length: 604 }, (_, index) => JSON.parse(readFileSync(join(process.cwd(), 'src/app/quran/read/data', `${index + 1}.json`), 'utf8')));
    const morphology = readFileSync(join(process.cwd(), 'data/quran/quranic-corpus-morphology-0.4.txt'), 'utf8');
    const ayat = withRoots(readerAyat(pages).filter(entry => wanted.includes(entry.key)), morphology);
    expect(ayat).toHaveLength(5);
    const group = find(buildPhraseGroups(ayat), 'أءذا متنا وكنا ترابا');
    expect(members(group!)).toEqual([...wanted].sort());
    for (const occurrence of group!.occurrences) {
      const entry = ayat.find(candidate => candidate.key === occurrence.key)!;
      expect(normalized(entry.words.slice(occurrence.start, occurrence.end).join(' '))).toBe(normalized('أءذا متنا وكنا ترابا'));
    }
  });

  it('puts all six يقيمون الصلاة occurrences in one generated tree', () => {
    const group = (treeData.trees as PhraseGroup[]).find(tree => tree.id === 'يقيمون الصلوه')!;
    expect(members(group)).toEqual(['27:3', '2:3', '31:4', '5:55', '8:3', '9:71']);
    expect(group.occurrences.map(occurrence => occurrence.start)).toEqual([3, 7, 1, 10, 1, 1]);
  });

  it('keeps 43:83 ending at 43:84 in the unified artifact', () => {
    const data = treeData as { ayat: BranchAyah[]; trees: PhraseGroup[] };
    const group = data.trees.find(tree => tree.id === 'ذرهم يخوضوا ويلعبوا حتي يلقوا يومهم الذي يوعدون')!;
    expect(ayahEnds(phrasePresentation(group, data.ayat).tree)['43:83']).toBe('43:84');
    const members = [...new Set(group.occurrences.map(occurrence => occurrence.key))].map(key => data.ayat.find(ayah => ayah.key === key)!);
    expect(ayahEnds(phrasePresentation(group, members, true, false).tree)['43:83']).toBe('43:84');
  });
});

describe('phrasePresentation', () => {
  it('does not treat another matching member as the following ayah', () => {
    const ayat = [ayah('1:1', 'قال رب قول'), ayah('2:1', 'قال رب قول')];
    const group: PhraseGroup = { id: 'قال رب', text: 'قال رب', occurrences: [
      { key: '1:1', start: 0, end: 2 },
      { key: '2:1', start: 0, end: 2 },
    ] };
    const tree = phrasePresentation(group, ayat, true, false).tree;
    expect(ayahEnds(tree)).toEqual({ '1:1': '1:1', '2:1': '2:1' });
  });

  it('preserves seated hamza in identical prefixes and singleton or identical continuation nodes', () => {
    const ayat = [
      ayah('1:1', 'سُئِلَ قال رب يُؤْمِنُونَ'),
      ayah('1:2', 'سُئِلَ قال رب يُؤْمِنُونَ'),
      ayah('1:3', 'قال رب يَئِسَ'),
    ];
    const group: PhraseGroup = { id: 'قال رب', text: 'قال رب', occurrences: [
      { key: '1:1', start: 1, end: 3 },
      { key: '1:2', start: 1, end: 3 },
      { key: '1:3', start: 0, end: 2 },
    ] };
    const presentation = phrasePresentation(group, ayat, false);
    expect(presentation.prefixes.find(prefix => prefix.keys.length === 2)?.word).toBe('سُئِلَ');
    expect(presentation.tree.children.map(node => node.words.join(' '))).toEqual(['يُؤْمِنُونَ', 'يَئِسَ']);
    expect(presentation.tree.children.every(node => node.forms === undefined)).toBe(true);
  });

  it('preserves whole prefixes, empty prefixes, and original trunk offsets', () => {
    const ayat = [ayah('1:1', 'قالوا قال رب اغفر'), ayah('1:2', 'وكانوا يقولون قال رب ارحم'), ayah('1:3', 'قال رب أعني')];
    const group = find(buildPhraseGroups(ayat), 'قال رب')!;
    const presentation = phrasePresentation(group, ayat);
    expect(presentation.offsets).toMatchObject({ '1:1': 1, '1:2': 2, '1:3': 0 });
    expect(presentation.prefixes.map(prefix => prefix.word).sort()).toEqual(['', 'قالوا', 'وكانوا يقولون'].sort());
    expect([...new Set(treeKeys(presentation.tree))].sort()).toEqual(['1:1', '1:2', '1:3']);
    expect(normalized(presentation.tree.words.join(' '))).toBe('قال رب');
  });

  it('continues a shorter ayah into its following ayah when another branch extends past it', () => {
    const short = { ...ayah('1:1', 'قل قال رب'), next: ['اغفر', 'لي'], nextRoots: ['غفر', null], nextLemmas: ['اغفر', 'لي'] };
    const ayat = [short, ayah('2:1', 'قال رب اغفر لنا')];
    const group = find(buildPhraseGroups(ayat), 'قال رب')!;
    const presentation = phrasePresentation(group, ayat);
    expect(JSON.stringify(presentation.tree)).toContain('﴿١﴾');
    expect(JSON.stringify(presentation.tree)).toContain('لي');
    expect([...new Set(treeKeys(presentation.tree))].sort()).toEqual(['1:1', '2:1']);
  });

  it('continues identical ayah endings and merges their different end numbers before they branch', () => {
    const ayat = [
      { ...ayah('1:2', 'الحمد لله رب العالمين'), next: ['الرحمن', 'الرحيم'] },
      { ...ayah('37:182', 'والحمد لله رب العالمين'), next: ['ص', 'والقرآن'] },
    ];
    const group: PhraseGroup = { id: 'رب العالمين', text: 'رب العالمين', occurrences: [
      { key: '1:2', start: 2, end: 4 },
      { key: '37:182', start: 2, end: 4 },
    ] };
    const tree = phrasePresentation(group, ayat, true).tree;
    expect(tree.words.join(' ')).toBe('رب العالمين ۝');
    expect(tree.children.map(child => child.words.join(' '))).toEqual(['الرحمن الرحيم', 'ص والقرآن']);
  });

  it('groups equivalent prefixes and retains their original spellings for context hints', () => {
    const ayat = [
      ayah('1:1', 'قَالُوا قال رب اغفر', ['qwl', 'qwl', 'rbb', 'gfr'], ['qAl', 'qAl', 'rbb', 'gfr']),
      ayah('1:2', 'قَالُوٓا قال رب ارحم', ['qwl', 'qwl', 'rbb', 'rHm'], ['qAl', 'qAl', 'rbb', 'rHm']),
      ayah('1:3', 'قال رب أعني', ['qwl', 'rbb', 'Ewn'], ['qAl', 'rbb', 'Ewn']),
    ];
    const presentation = phrasePresentation(find(buildPhraseGroups(ayat), 'قال رب')!, ayat);
    const prefix = presentation.prefixes.find(entry => entry.keys.length === 2);
    expect(prefix?.keys.sort()).toEqual(['1:1', '1:2']);
    expect(prefix?.forms).toEqual({ '1:1': ['قَالُوا'], '1:2': ['قَالُوٓا'] });
    expect(presentation.prefixes.filter(entry => entry.word !== '')).toHaveLength(1);
  });

  it('keeps prefixes with different roots separate even when their spelling matches', () => {
    const ayat = [
      ayah('1:1', 'قالوا قال رب اغفر', ['first', 'qwl', 'rbb', 'gfr']),
      ayah('1:2', 'قالوا قال رب ارحم', ['second', 'qwl', 'rbb', 'rHm']),
    ];
    const presentation = phrasePresentation(find(buildPhraseGroups(ayat), 'قال رب')!, ayat);
    expect(presentation.prefixes).toHaveLength(2);
    expect(presentation.prefixes.map(entry => entry.keys)).toEqual([['1:1'], ['1:2']]);
  });
});

describe('phrasePieces', () => {
  it('cuts large groups into entries of at most six distinct ayat without losing members', () => {
    const ayat = Array.from({ length: 14 }, (_, index) => ayah(`1:${index + 1}`, `مقدمة${index} قال رب ${index % 2 ? 'اغفر' : 'ارحم'} لفظ${index}`));
    const inside = find(buildPhraseGroups(ayat), 'قال رب');
    expect(inside).toBeDefined();
    const pieces = phrasePieces(inside!, ayat);
    expect(pieces.length).toBeGreaterThan(1);
    expect(pieces.every(piece => members(piece).length <= 6)).toBe(true);
    expect([...new Set(pieces.flatMap(members))].sort()).toEqual(ayat.map(entry => entry.key).sort());
  });
});

it('preserves a common hamza seat when only vowel marks differ', () => {
  const ayat = [ayah('1:1', 'قبل قال رب وَيُؤَخِّرَكُمْ'), ayah('1:2', 'قال رب وَيُؤَخِّرْكُمْ')];
  const group: PhraseGroup = { id: 'قال رب', text: 'قال رب', occurrences: [{ key: '1:1', start: 1, end: 3 }, { key: '1:2', start: 0, end: 2 }] };
  const tree = phrasePresentation(group, ayat).tree;
  expect(tree.words.join(' ')).toContain('ؤ');
  expect(tree.words.join(' ')).not.toContain('ءَ');
});
