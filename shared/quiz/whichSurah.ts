import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { normalizeWord } from '../quran/normalize';
import { byDifficulty, HARD_FROM, wordShare, type Difficulty } from './difficulty';
import { shuffle, type Random } from './random';
import { quizTrees } from './treeScope';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';
import { mushafSource } from './sources';
import { SURAH_NAMES } from '../quran/surahNames';
import { SURAHS } from '../quran/words';

export const WHICH_SURAH = 'SURAH';
const CHOICES = 4;
const MIN_WORDS = 3;
const NEAR = 4;
const FAR = 10;

const names = SURAH_NAMES;
const surahOf = (key: string) => Number(key.split(':')[0]);

type Alike = { key: string; share: number };
type Index = { ayat: Map<string, BranchAyah>; answerable: (ayah: BranchAyah) => boolean; alike: Map<string, Alike[]> };
let built: Index | undefined;

function index(): Index {
  if (built) return built;
  const all = corpus.ayat as BranchAyah[];
  const ayat = new Map(all.map(ayah => [ayah.key, ayah]));
  const text = (ayah: BranchAyah) => ayah.words.map(normalizeWord).join(' ');
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

const levelOf = (alike: Alike[] | undefined): Difficulty => !alike?.length ? 'easy' : alike[0].share >= HARD_FROM ? 'hard' : 'medium';

function wrongSurahs(surah: number, alike: Alike[], difficulty: Difficulty, random: Random, allowed: Set<number>): number[] {
  const picked: number[] = [];
  const free = (n: number) => n !== surah && !picked.includes(n) && allowed.has(n);
  const take = (candidates: number[]) => { for (const n of candidates) if (picked.length < CHOICES - 1 && free(n)) picked.push(n); };
  const every = [...allowed].sort((a, b) => a - b);
  if (difficulty === 'easy') take(shuffle(every.filter(n => Math.abs(n - surah) > FAR), random));
  else {
    take([...new Set(alike.map(item => surahOf(item.key)))]);
    if (!picked.length) {
      const start = Math.min(Math.max(surah - Math.floor(random() * CHOICES), 1), 115 - CHOICES);
      take(Array.from({ length: CHOICES }, (_, i) => start + i));
    }
    const anchors = [surah, ...picked];
    const around = (anchor: number, steps: number[]) => shuffle(steps.flatMap(step => [anchor - step, anchor + step]), random).find(free);
    if (anchors.length === 2) for (const anchor of shuffle(anchors, random)) take([around(anchor, [1, 2]) ?? 0]);
    if (anchors.length === 3) {
      const alone = (n: number) => anchors.every(anchor => Math.abs(anchor - n) > 2);
      take(shuffle(anchors, random).flatMap(anchor => shuffle([anchor - 4, anchor - 3, anchor + 3, anchor + 4], random)).filter(alone));
    }
    take(shuffle(every.filter(n => Math.abs(n - surah) <= NEAR), random));
  }
  take(shuffle(every, random));
  if (picked.length < CHOICES - 1) {
    const outside = Array.from({ length: SURAHS }, (_, i) => i + 1).filter(n => !allowed.has(n))
      .map(n => ({ n, gap: Math.min(...every.map(a => Math.abs(a - n))) }));
    for (const { n } of shuffle(outside, random).sort((a, b) => a.gap - b.gap)) if (picked.length < CHOICES - 1) picked.push(n);
  }
  return picked;
}

function question(ayah: BranchAyah, alike: Alike[], difficulty: Difficulty, random: Random, allowed: Set<number>): ChoiceQuestion {
  const surah = surahOf(ayah.key);
  const wrong = wrongSurahs(surah, alike, difficulty, random, allowed);
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
    page: { title: 'hidden' },
    ...(Object.keys(closest).length && { alike: closest }),
    sources: [mushafSource(ayah.key, ayah.page)],
    evidence: { claimKeys: [] },
  };
}

const nameWord = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وفبلك](?=ال)/, '').replace(/^ال/, '');
let surahWords: Map<number, string[]> | undefined;
export function namesItsSurah(ayah: BranchAyah) {
  surahWords ??= new Map(Object.entries(names).map(([n, name]) => [Number(n), String(name).split(/\s+/).map(nameWord).filter(Boolean)]));
  const own = surahWords.get(surahOf(ayah.key)) ?? [];
  const words = new Set(ayah.words.map(nameWord).flatMap(word => [word, word.replace(/ا$/, '')]));
  return own.length > 0 && own.every(word => words.has(word));
}

function inScope(scope: ChoiceScope) {
  const id = JSON.stringify(scope);
  let found = scopes.get(id);
  if (!found) {
    if (scopes.size > 4) scopes.delete(scopes.keys().next().value!);
    scopes.set(id, found = scopedAyat(scope));
  }
  return found;
}
const scopes = new Map<string, ReturnType<typeof scopedAyat>>();

function scopedAyat(scope: ChoiceScope) {
  const { ayat, answerable } = index();
  const scoped = [...filteredAyat(ayat, scope.filters, scope.range).values()];
  const allowed = new Set(scoped.map(ayah => surahOf(ayah.key)));
  return { allowed, asked: allowed.size < 2 ? [] : scoped.filter(ayah => answerable(ayah) && !namesItsSurah(ayah)) };
}

function candidates(asked: BranchAyah[], difficulty: Difficulty, random: Random) {
  const { alike } = index();
  return byDifficulty(shuffle(asked, random), difficulty, ayah => levelOf(alike.get(ayah.key)));
}

export const whichSurah: ChoiceKind = {
  id: WHICH_SURAH,
  name: 'في أي سورة؟',
  party: true,
  questions: (scope, difficulty, random, limit = Infinity) => {
    const { allowed, asked } = inScope(scope);
    return candidates(asked, difficulty, random).slice(0, limit).map(ayah => question(ayah, index().alike.get(ayah.key) ?? [], difficulty, random, allowed));
  },
  count: scope => inScope(scope).asked.length,
};
