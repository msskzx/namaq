// «في أي سورة؟» (owner, 2026-11-13): an ayah and four surahs to pick from. Easy offers surahs far from the right one,
// medium its neighbours, hard asks ayat with a close look-alike in another surah and always offers that surah.
import corpus from '../data/quran/trees.json';
import surahRows from '../data/quran/surahs.json';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { normalizeWord } from '../quran/normalize';
import { byDifficulty, HARD_FROM, wordShare, type Difficulty } from './difficulty';
import { shuffle, type Random } from './random';
import { quizTrees } from './treeScope';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';

export const WHICH_SURAH = 'SURAH';
const CHOICES = 4;
/** Fewer words than this cannot tell a surah (طه، الرحمن). */
const MIN_WORDS = 3;
/** Neighbours: this many surahs on each side; far: more than this many away. */
const NEAR = 4;
const FAR = 10;

const names = Object.fromEntries(surahRows.map(row => [row.number, row.name])) as Record<number, string>;
const surahOf = (key: string) => Number(key.split(':')[0]);

type Alike = { key: string; share: number };
type Index = { ayat: Map<string, BranchAyah>; answerable: (ayah: BranchAyah) => boolean; alike: Map<string, Alike[]> };
let built: Index | undefined;

/** Built once: which ayat can be asked, and each ayah's look-alikes in other surahs (from the متشابهات trees), closest first. */
function index(): Index {
  if (built) return built;
  const all = corpus.ayat as BranchAyah[];
  const ayat = new Map(all.map(ayah => [ayah.key, ayah]));
  const text = (ayah: BranchAyah) => ayah.words.map(normalizeWord).join(' ');
  // An ayah found word for word in more than one surah (الم، فبأي آلاء ربكما تكذبان is one surah's and stays) cannot be told.
  const surahsOf = new Map<string, Set<number>>();
  for (const ayah of all) {
    const words = text(ayah);
    if (!surahsOf.has(words)) surahsOf.set(words, new Set());
    surahsOf.get(words)!.add(surahOf(ayah.key));
  }
  const answerable = (ayah: BranchAyah) => ayah.words.length >= MIN_WORDS && surahsOf.get(text(ayah))!.size === 1;
  const alike = new Map<string, Alike[]>();
  const add = (a: string, b: string, share: number) => {
    const list = alike.get(a) ?? [];
    if (!list.some(item => item.key === b)) list.push({ key: b, share });
    alike.set(a, list);
  };
  for (const tree of quizTrees()) {
    const keys = [...new Set(tree.occurrences.map(occurrence => occurrence.key))].filter(key => ayat.has(key));
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
      if (surahOf(keys[i]) === surahOf(keys[j])) continue;
      const share = wordShare(ayat.get(keys[i])!.words, ayat.get(keys[j])!.words);
      add(keys[i], keys[j], share);
      add(keys[j], keys[i], share);
    }
  }
  alike.forEach(list => list.sort((a, b) => b.share - a.share));
  return (built = { ayat, answerable, alike });
}

/** Hard: a look-alike in another surah shares most of the ayah's words; medium: some look-alike; easy: none. */
const levelOf = (alike: Alike[] | undefined): Difficulty => !alike?.length ? 'easy' : alike[0].share >= HARD_FROM ? 'hard' : 'medium';

function wrongSurahs(surah: number, alike: Alike[], difficulty: Difficulty, random: Random): number[] {
  const picked: number[] = [];
  const take = (candidates: number[]) => { for (const n of candidates) if (picked.length < CHOICES - 1 && n !== surah && !picked.includes(n)) picked.push(n); };
  const lookAlike = [...new Set(alike.map(item => surahOf(item.key)))];
  const every = Array.from({ length: 114 }, (_, i) => i + 1);
  const near = shuffle(every.filter(n => Math.abs(n - surah) <= NEAR), random);
  const far = shuffle(every.filter(n => Math.abs(n - surah) > FAR), random);
  if (difficulty === 'hard') take(lookAlike);
  if (difficulty === 'medium') take(lookAlike.slice(0, 1));
  take(difficulty === 'easy' ? far : near);
  take(shuffle(every, random));
  return picked;
}

function question(ayah: BranchAyah, alike: Alike[], difficulty: Difficulty, random: Random): ChoiceQuestion {
  const surah = surahOf(ayah.key);
  const wrong = wrongSurahs(surah, alike, difficulty, random);
  const closest = Object.fromEntries(wrong.flatMap(n => {
    const found = alike.find(item => surahOf(item.key) === n);
    return found ? [[String(n), { key: found.key, words: index().ayat.get(found.key)!.words }]] : [];
  }));
  return {
    key: `${WHICH_SURAH}:${ayah.key}`,
    family: WHICH_SURAH,
    promptArabic: 'في أي سورة هذه الآية؟',
    quran: ayah.words,
    number: Number(ayah.key.split(':')[1]),
    choices: shuffle([surah, ...wrong], random).map(n => ({ value: String(n), labelArabic: names[n] })),
    correctAnswer: String(surah),
    ayahKey: ayah.key,
    ...(Object.keys(closest).length && { alike: closest }),
    evidence: { claimKeys: [] },
  };
}

/** The ayat in the scope that can be asked, in random order, the chosen difficulty's first. */
function candidates(scope: ChoiceScope, difficulty: Difficulty, random: Random) {
  const { ayat, answerable, alike } = index();
  const inScope = [...filteredAyat(ayat, scope.filters, scope.range).values()].filter(answerable);
  return byDifficulty(shuffle(inScope, random), difficulty, ayah => levelOf(alike.get(ayah.key)));
}

export const whichSurah: ChoiceKind = {
  id: WHICH_SURAH,
  name: 'في أي سورة؟',
  party: true,
  questions: (scope, difficulty, random, limit = Infinity) =>
    candidates(scope, difficulty, random).slice(0, limit).map(ayah => question(ayah, index().alike.get(ayah.key) ?? [], difficulty, random)),
  count: scope => { const { ayat, answerable } = index(); return [...filteredAyat(ayat, scope.filters, scope.range).values()].filter(answerable).length; },
};
