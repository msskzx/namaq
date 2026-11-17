// The kinds written on the ayah's own mushaf page (owner, 2026-11-17: every quiz kind lives inside the quizzes, the quizzes
// tab holds only solo and party). «أوائل السور»: a surah's name, and its first ayah to write; «اكتب أول الآية وآخرها»: an
// ayah's first and last words to write in their places. Graded by what is written: حفظتها when every word is right.
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
  page: { shows: 0, write: 'ends', title: 'shown' },
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
  surah => `اكتب أول آية في سورة ${names[surah]}.`);

export const ayahEnds = kind(ENDS, 'اكتب أول الآية وآخرها', inScope,
  (surah, ayah) => `اكتب أول آية ${names[surah]} ${num(ayah)} وآخرها.`);
