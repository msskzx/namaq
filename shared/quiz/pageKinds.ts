// The kinds recited on the ayah's own mushaf page with recite mode's bar (owner, 2026-11-17: every quiz kind lives inside
// the quizzes, the quizzes tab holds only solo and party). «أوائل السور»: a surah's name, and its first ayah to recite;
// «سمّع الآية»: an ayah named by its surah and number. The pen writes what the pen setting says; written, it is graded by
// the words, else the reader says حفظتها or نسيتها.
// Only the ayat's keys and pages are read here, for the range and filters; the words are the page's own (QuizPage).
import corpus from '../quran/quranText/corpus';
import surahRows from '../data/quran/surahs.json';
import { num } from '../quran/arabicNumber';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { shuffle } from './random';
import { FORGOT, RECITED, type ChoiceKind, type ChoiceQuestion, type ChoiceScope } from './choiceKinds';

export const OPENING = 'OPENINGS';
export const ENDS = 'ENDS';

const names = Object.fromEntries(surahRows.map(row => [row.number, row.name])) as Record<number, string>;
const CHOICES = [{ value: RECITED, labelArabic: 'حفظتها' }, { value: FORGOT, labelArabic: 'نسيتها' }];

let ayat: Map<string, BranchAyah> | undefined;
const inScope = (scope: ChoiceScope) => [...filteredAyat(ayat ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah])), scope.filters, scope.range).keys()];

const ask = (family: string, key: string, promptArabic: string): ChoiceQuestion => ({
  key: `${family}:${key}`,
  family,
  promptArabic,
  choices: CHOICES,
  correctAnswer: RECITED,
  ayahKey: key,
  // The surah is named in the question, so its title shows on the page.
  page: { shows: 0, recite: true, title: 'shown' },
  evidence: { claimKeys: [] },
});

const kind = (id: string, name: string, keys: (scope: ChoiceScope) => string[], prompt: (surah: number, ayah: number) => string): ChoiceKind => ({
  id: id as ChoiceKind['id'],
  name,
  party: false,
  questions: (scope, _difficulty, random, limit = Infinity) => shuffle(keys(scope), random).slice(0, limit).map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return ask(id, key, prompt(surah, ayah));
  }),
  count: scope => keys(scope).length,
});

export const surahOpenings = kind(OPENING, 'أوائل السور', scope => inScope(scope).filter(key => key.endsWith(':1')),
  surah => `سمّع أول آية في سورة ${names[surah]}.`);

export const ayahEnds = kind(ENDS, 'سمّع الآية', inScope,
  (surah, ayah) => `سمّع آية ${names[surah]} ${num(ayah)}.`);
