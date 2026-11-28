import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { normalizeWord } from '../quran/normalize';
import { SURAH_NAMES } from '../quran/surahNames';
import { BOOKS, ORDER_AIMS, orderCiteSource } from '../quran/surahOrder';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';

export const SURAH_AIM = 'SURAH_AIM';
const CHOICES = 3;

const tokens = (text: string) => text.split(/[\s،,.:؛«»()…-]+/).map(normalizeWord).filter(Boolean);
const NAMES = Object.entries(SURAH_NAMES).map(([n, name]) => ({ surah: Number(n), words: tokens(name) }));
const has = (words: string[], name: string[]) => words.some((_, i) => name.every((part, j) => words[i + j] === part));
const NEAR = 3;

export function askable(surah: number) {
  const aim = ORDER_AIMS[surah];
  if (!aim) return false;
  const words = tokens(aim.text);
  return !words.some(word => /^[وف]?(ب|ل)?اسم/.test(word)) && !NAMES.some(name => Math.abs(name.surah - surah) <= NEAR && has(words, name.words));
}

const ASKABLE = Object.keys(ORDER_AIMS).map(Number).filter(askable).sort((a, b) => a - b);
const surahOf = (key: string) => Number(key.split(':')[0]);

function inScope(scope: ChoiceScope) {
  const ayat = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
  const surahs = new Set([...filteredAyat(ayat, scope.filters, scope.range).keys()].map(surahOf));
  return ASKABLE.filter(surah => surahs.has(surah));
}

const nearest = (surah: number) => ASKABLE.filter(other => other !== surah)
  .sort((a, b) => Math.abs(a - surah) - Math.abs(b - surah) || a - b).slice(0, CHOICES - 1);

export const aimChoice = (surah: number) => ORDER_AIMS[surah].text.replace(/^(المقصود من هذه السورة|المقصود منها|مقصود السورة|مقصودها)\s*:?\s*/, '');

export function aimQuestion(surah: number, random: Random): ChoiceQuestion {
  const offered = [surah, ...nearest(surah)];
  return {
    key: `${SURAH_AIM}:${surah}`,
    family: SURAH_AIM,
    promptArabic: `ما مقصود سورة ${SURAH_NAMES[surah]} عند ${BOOKS[ORDER_AIMS[surah].src.book].by}؟`,
    choices: shuffle(offered, random).map(n => ({ value: String(n), labelArabic: aimChoice(n) })),
    correctAnswer: String(surah),
    whereOf: Object.fromEntries(offered.map(n => [String(n), `مقصود سورة ${SURAH_NAMES[n]}`])),
    look: { view: 'surahs', surahs: [surah] },
    sources: offered.map(n => orderCiteSource(ORDER_AIMS[n].src)),
    evidence: { claimKeys: [] },
  };
}

export const surahAimQuiz: ChoiceKind = {
  id: SURAH_AIM,
  name: 'ما مقصود هذه السورة؟',
  party: true,
  questions: (scope, _difficulty, random, limit = Infinity) => shuffle(inScope(scope), random).slice(0, limit).map(surah => aimQuestion(surah, random)),
  count: scope => inScope(scope).length,
};
