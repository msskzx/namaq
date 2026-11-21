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
import { juzOf } from '../quran/juz';
import surahRows from '../data/quran/surahs.json';

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

export function orderQuestion(surahs: number[], random: Random, kind: string = SURAH_ORDER, prompt = 'رتّب هذه السور كما في المصحف'): ChoiceQuestion {
  const order = [...surahs].sort((a, b) => a - b);
  const right = order.map(String);
  return {
    key: `${kind}:${order.join(',')}`,
    family: kind,
    promptArabic: prompt,
    ...(kind === SURAH_ORDER_JUZ && { tray: true }),
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

/**
 * «رتّب الجزء كله» (owner, 2026-11-21; sketch surah-order-tray/sketch-dark.png): every surah of a juz at once, filled into
 * numbered boxes from a tray of their names (OrderTray). A surah running over two juz is asked under both, as the surah-order
 * page lists it. The home card (`run`) asks six surahs following each other in a juz instead, so the card stays within the
 * screen (sketch surah-order-tray/sketch-home-dark.png); a juz of fewer is asked whole.
 */
export const SURAH_ORDER_JUZ = 'ORDER_JUZ';
const RUN = 6;
const lastAyah = (surah: number) => surahRows.find(row => row.number === surah)!.numberOfAyat;

function juzSets(inside: number[], run: boolean): { surahs: number[]; juz: number }[] {
  if (inside.length < 2) return [];
  const spans = inside.map(surah => ({ surah, from: juzOf(`${surah}:1`), to: juzOf(`${surah}:${lastAyah(surah)}`) }));
  const juzs = [...new Set(spans.flatMap(span => Array.from({ length: span.to - span.from + 1 }, (_, i) => span.from + i)))];
  const whole = juzs.map(juz => ({ juz, surahs: spans.filter(span => span.from <= juz && juz <= span.to).map(span => span.surah) })).filter(set => set.surahs.length > 1);
  if (!run) return whole;
  return whole.flatMap(set => set.surahs.length <= RUN ? [set]
    : Array.from({ length: set.surahs.length - RUN + 1 }, (_, i) => ({ juz: set.juz, surahs: set.surahs.slice(i, i + RUN) })));
}

export const surahOrderJuzQuiz: ChoiceKind = {
  id: SURAH_ORDER_JUZ,
  name: 'رتّب سور الجزء',
  party: true,
  questions: (scope, _difficulty, random, limit = Infinity) =>
    shuffle(juzSets(inScope(scope), !!scope.filters.run), random).slice(0, limit)
      .map(set => orderQuestion(set.surahs, random, SURAH_ORDER_JUZ, `رتّب سور الجزء ${num(set.juz)}`)),
  count: scope => juzSets(inScope(scope), !!scope.filters.run).length,
};
