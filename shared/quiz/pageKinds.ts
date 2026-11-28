import corpus from '../quran/quranText/corpus';
import { num } from '../quran/arabicNumber';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { shuffle } from './random';
import { FORGOT, RECITED, type ChoiceKind, type ChoiceQuestion, type ChoiceScope } from './choiceKinds';
import { SURAH_NAMES } from '../quran/surahNames';
import { mushafSource } from './sources';

export const OPENING = 'OPENINGS';
export const ENDS = 'ENDS';

const names = SURAH_NAMES;
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
  page: { shows: 0, recite: true, title: 'shown' },
  look: { view: 'prompt', key, word: ayat!.get(key)!.words[0], first: true },
  sources: [mushafSource(key, ayat?.get(key)?.page)],
  evidence: { claimKeys: [] },
});

const kind = (id: string, name: string, keys: (scope: ChoiceScope) => string[], prompt: (surah: number, ayah: number) => string): ChoiceKind => ({
  id: id as ChoiceKind['id'],
  name,
  party: true,
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
