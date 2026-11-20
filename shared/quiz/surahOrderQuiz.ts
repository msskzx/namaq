// «رتّب السور» (owner, 2026-11-20; sketch /mnt/project-files/surah-order-quiz/sketch-dark.png): four surahs of the chosen
// part of the Quran, shuffled, to put in the mushaf's order; neighbours by default, apart on request. No difficulty levels. Each surah in its right place earns its share (owner: partial
// answers accepted).
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';
import { SURAHS } from '../quran/words';
import { shuffle, type Random } from './random';
import { PICKS, type ChoiceKind, type ChoiceQuestion, type ChoiceScope } from './choiceKinds';
import { MUSHAF_BOOK } from './sources';

export const SURAH_ORDER = 'ORDER';
const CHOICES = 4;

const surahOf = (key: string) => Number(key.split(':')[0]);
const ayat = () => new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));

/** The surahs in the scope, in the mushaf's order. One surah has no order to ask. */
function inScope(scope: ChoiceScope) {
  const surahs = [...new Set([...filteredAyat(ayat(), scope.filters, scope.range).keys()].map(surahOf))].sort((a, b) => a - b);
  return surahs.length < 2 ? [] : surahs;
}

/** The surahs just outside the scope, nearest first, to fill a scope of fewer than four (as «في أي سورة؟» does, owner 2026-11-20). */
function filled(picked: number[], inside: number[], random: Random) {
  const outside = Array.from({ length: SURAHS }, (_, i) => i + 1).filter(n => !inside.includes(n))
    .map(n => ({ n, gap: Math.min(...inside.map(a => Math.abs(a - n))) }));
  const all = [...picked];
  for (const { n } of shuffle(outside, random).sort((a, b) => a.gap - b.gap)) if (all.length < CHOICES) all.push(n);
  return all;
}

/**
 * The questions' surahs. By default neighbours (owner, 2026-11-20): every run of four surahs following each other in the
 * scope, so the order asked is the one memorized. With «سور متباعدة» (`apart`) each surah of the scope is asked with three
 * others from anywhere in it.
 */
function sets(inside: number[], apart: boolean, random: Random): number[][] {
  if (!inside.length) return [];
  if (inside.length <= CHOICES) return [filled(inside, inside, random)];
  if (!apart) return Array.from({ length: inside.length - CHOICES + 1 }, (_, i) => inside.slice(i, i + CHOICES));
  return inside.map(surah => [surah, ...shuffle(inside.filter(n => n !== surah), random).slice(0, CHOICES - 1)]);
}

/** Shuffled so that the question never starts in the right order, which would ask nothing. */
function mixed(order: number[], random: Random) {
  for (;;) {
    const shown = shuffle(order, random);
    if (shown.some((n, i) => n !== order[i])) return shown;
  }
}

export function orderQuestion(surahs: number[], random: Random): ChoiceQuestion {
  const order = [...surahs].sort((a, b) => a - b);
  const right = order.map(String);
  return {
    key: `${SURAH_ORDER}:${order.join(',')}`,
    family: SURAH_ORDER,
    promptArabic: 'رتّب هذه السور كما في المصحف',
    choices: mixed(order, random).map(n => ({ value: String(n), labelArabic: SURAH_NAMES[n] })),
    correctAnswer: right.join(PICKS),
    order: right,
    // Each surah's number in the mushaf, shown once answered.
    whereOf: Object.fromEntries(order.map(n => [String(n), num(n)])),
    sources: [{ book: MUSHAF_BOOK, at: 'ترتيب السور' }],
    evidence: { claimKeys: [] },
  };
}

export const surahOrderQuiz: ChoiceKind = {
  id: SURAH_ORDER,
  name: 'رتّب السور',
  party: true,
  questions: (scope, _difficulty, random, limit = Infinity) =>
    shuffle(sets(inScope(scope), !!scope.filters.apart, random), random).slice(0, limit).map(surahs => orderQuestion(surahs, random)),
  count: scope => sets(inScope(scope), !!scope.filters.apart, Math.random).length,
};
