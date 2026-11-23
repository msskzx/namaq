// «في أي سورة؟» (owner, 2026-11-13): an ayah and four surahs to pick from. Easy offers surahs far from the right one.
// Medium and hard offer the surahs of the ayah's متشابهات first, then its neighbours (owner, 2026-11-17); hard also asks
// the ayat with a close look-alike first.
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
/** Fewer words than this cannot tell a surah (طه، الرحمن). */
const MIN_WORDS = 3;
/** Neighbours: this many surahs on each side; far: more than this many away. */
const NEAR = 4;
const FAR = 10;

const names = SURAH_NAMES;
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

/**
 * The wrong surahs. Easy: far ones. Medium and hard: the look-alikes' surahs, then neighbours placed so the choices do
 * not point at the answer: with no look-alike, a run of four surahs with the answer anywhere in it (not always in the
 * middle); with look-alikes, neighbours of the answer and of the look-alikes' surahs alike, so no choice stands apart.
 */
function wrongSurahs(surah: number, alike: Alike[], difficulty: Difficulty, random: Random, allowed: Set<number>): number[] {
  const picked: number[] = [];
  // Surahs inside the chosen part of the Quran first (owner, 2026-11-20).
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
    // One look-alike: one neighbour next to the answer and one next to the look-alike, two pairs. Two: a surah three or
    // four from one of them, close to none, so every choice stands alone. Either way no choice stands apart as the answer.
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
  // Too few inside: the surahs just outside the range fill the rest, so a small range still asks and teaches where it ends.
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

/** A word as a surah's name is matched: bare, without a joined «و ف ب ل ك» or the article. */
const nameWord = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وفبلك](?=ال)/, '').replace(/^ال/, '');
let surahWords: Map<number, string[]> | undefined;
/**
 * Whether the ayah says its own surah's name («حتى تأتيهم البينة» in al-Bayyinah, «يوسف» in Yusuf): the name is the answer,
 * so it is not asked (owner, 2026-11-19: no question holds its answer).
 */
export function namesItsSurah(ayah: BranchAyah) {
  surahWords ??= new Map(Object.entries(names).map(([n, name]) => [Number(n), String(name).split(/\s+/).map(nameWord).filter(Boolean)]));
  const own = surahWords.get(surahOf(ayah.key)) ?? [];
  // «هودًا»، «فتحًا»: the accusative's alif is no other word.
  const words = new Set(ayah.words.map(nameWord).flatMap(word => [word, word.replace(/ا$/, '')]));
  return own.length > 0 && own.every(word => words.has(word));
}

/** The ayat in the scope that can be asked, and the scope's surahs the wrong choices come from first. */
function inScope(scope: ChoiceScope) {
  // The same scope comes again for every question the feed and quizzes ask: its ayat are found once.
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
  // One surah: every answer is that surah.
  return { allowed, asked: allowed.size < 2 ? [] : scoped.filter(ayah => answerable(ayah) && !namesItsSurah(ayah)) };
}

/** The ayat in the scope that can be asked, in random order, the chosen difficulty's first. */
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
