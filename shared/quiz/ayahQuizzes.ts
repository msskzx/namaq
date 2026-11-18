// The four quizzes on what the books say of an ayah (owner 2026-11-18, docs/feed-cards.md): al-Sa'di's tafsir, al-Suyuti's
// balagha, the i'rab of a word, and the readers' readings. Their questions are built once by scripts/quran/buildAyahQuizzes.ts
// into shared/data/quran/ayahQuizzes.json, which holds places and ids only; here a question is read from that bank and drawn
// with the Madina pages' words and the books' own text. Nothing is built while the app runs.
import bank from '../data/quran/ayahQuizzes.json';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';
import { tafsirSadiCredit } from '../quran/tafsirSadi';
import { tafsirSadiOf } from '../quran/tafsirSadiData';
import { withoutOpeningQuote } from '../quran/ayahNotes';
import itqan from '../data/quran/itqanBalagha';
import { itqanCredit, type ItqanData } from '../quran/itqanBalagha';
import { irabWordsAt } from '../quran/irabData';
import { corpusWords } from '../quran/words';
import { qiraatOf } from '../quran/qiraatData';
import { READERS, RIWAYAT, whoReads } from '../quran/qiraat';
import { hideQuotes } from './ayahQuizText';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';

export type AyahQuizzes = {
  /** [ayah asked, wrong ayah, wrong ayah, the passage's quotes hidden (from 0)]. */
  tafsir: [string, string, string, number[]][];
  /** [first ayah, last ayah's number, al-Suyuti's paragraph (its place in itqanBalagha's entries), right heading, wrong, wrong]. */
  balagha: { labels: string[]; questions: [string, number, number, number, number, number][] };
  /** [ayah, mushaf word, right role, wrong role, wrong role]: roles by their place in `roles`. */
  irab: { roles: string[]; questions: [string, number, number, number, number][] };
  /** [ayah, word difference (its place in qiraatOf), reader (its place in READERS)]. */
  qiraat: [string, number, number][];
};

const data = bank as AyahQuizzes;

export const TAFSIR_QUIZ = 'TAFSIR';
export const BALAGHA_QUIZ = 'BALAGHA';
export const IRAB_QUIZ = 'IRAB';
export const QIRAAT_QUIZ = 'QIRAAT';
export const AYAH_QUIZ_NAMES = { [TAFSIR_QUIZ]: 'لأي آية هذا التفسير؟', [BALAGHA_QUIZ]: 'ما الأسلوب؟', [IRAB_QUIZ]: 'ما إعرابها؟', [QIRAAT_QUIZ]: 'كيف يقرؤها؟' } as const;

let ayat: Map<string, BranchAyah> | undefined;
const ayatByKey = () => (ayat ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah])));
const wordsOf = (key: string) => ayatByKey().get(key)?.words ?? [];
const where = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${SURAH_NAMES[surah]} ${num(ayah)}`;
};
const span = (count: number, from = 0) => Array.from({ length: count }, (_, i) => from + i);

/** A kind over one of the bank's lists: its questions whose ayah is in the scope, in random order. */
function bankKind<T extends [string, ...unknown[]]>(id: keyof typeof AYAH_QUIZ_NAMES, list: () => T[], ask: (row: T, random: Random) => ChoiceQuestion): ChoiceKind {
  const candidates = (scope: ChoiceScope, random: Random) => {
    const inScope = filteredAyat(ayatByKey(), scope.filters, scope.range);
    // A balagha run of ayat is asked only when its last ayah is in the scope too, and a tafsir question only when its wrong
    // ayat are, so no choice can be ruled out by being outside what is asked.
    const fits = (row: T) => inScope.has(row[0])
      && (id !== BALAGHA_QUIZ || inScope.has(`${row[0].split(':')[0]}:${row[1]}`))
      && (id !== TAFSIR_QUIZ || (inScope.has(row[1] as string) && inScope.has(row[2] as string)));
    return shuffle(list().filter(fits), random);
  };
  return {
    id,
    name: AYAH_QUIZ_NAMES[id],
    party: true,
    questions: (scope, _difficulty, random, limit = Infinity) => candidates(scope, random).slice(0, limit).map(row => ask(row, random)),
    count: scope => candidates(scope, Math.random).length,
  };
}

/** لأي آية هذا التفسير؟ Al-Sa'di's whole comment on one ayah, the ayah's own words hidden («…»), and three whole ayat. */
export const tafsirQuiz = bankKind(TAFSIR_QUIZ, () => data.tafsir, ([key, ...rest], random): ChoiceQuestion => {
  const [first, second, hidden] = rest as [string, string, number[]];
  const passage = tafsirSadiOf(key)!;
  const keys = [key, first, second];
  return {
    key: `${TAFSIR_QUIZ}:${key}`,
    family: TAFSIR_QUIZ,
    promptArabic: AYAH_QUIZ_NAMES[TAFSIR_QUIZ],
    passage: hideQuotes(withoutOpeningQuote(passage.text), hidden),
    choices: shuffle(keys, random).map(value => ({ value, labelArabic: wordsOf(value).join(' ') })),
    quranChoices: true,
    whereOf: Object.fromEntries(keys.map(value => [value, where(value)])),
    correctAnswer: key,
    ayahKey: key,
    note: { label: 'المصدر', text: tafsirSadiCredit(passage) },
    evidence: { claimKeys: [] },
  };
});

/**
 * ما الأسلوب؟ The ayat al-Suyuti quotes, his quoted words coloured, and which of his headings he cites them under. Wrong
 * headings come from his other chapters than any that cites these ayat (scripts/quran/buildAyahQuizzes.ts).
 */
export const balaghaQuiz = bankKind(BALAGHA_QUIZ, () => data.balagha.questions, ([key, ...rest], random): ChoiceQuestion => {
  const [through, entry, right, ...wrong] = rest as number[];
  const [surah, from] = key.split(':').map(Number);
  const [, , part, firstPage, lastPage, , , places] = (itqan as ItqanData).entries[entry];
  const quran: string[] = [];
  const marked: number[] = [];
  for (let ayah = from; ayah <= through; ayah++) {
    if (ayah > from) quran.push(num(ayah - 1));
    const start = quran.length;
    for (const [s, a, first, last, sure] of places) if (s === surah && a === ayah && sure === 1) marked.push(...span(last - first + 1, start + first));
    quran.push(...wordsOf(`${surah}:${ayah}`));
  }
  return {
    key: `${BALAGHA_QUIZ}:${key}`,
    family: BALAGHA_QUIZ,
    promptArabic: 'بأي أسلوب استشهد السيوطي بما لُوِّن؟',
    quran,
    number: through,
    marked: [...new Set(marked)],
    choices: shuffle([right, ...wrong], random).map(label => ({ value: String(label), labelArabic: data.balagha.labels[label] })),
    correctAnswer: String(right),
    ayahKey: key,
    note: { label: 'المصدر', text: itqanCredit({ part, pages: [firstPage, lastPage] }) },
    evidence: { claimKeys: [] },
  };
});

/** ما إعرابها؟ A word of the ayah, coloured, and its role in the sentence as the Quranic Treebank gives it. */
export const irabQuiz = bankKind(IRAB_QUIZ, () => data.irab.questions, ([key, ...rest], random): ChoiceQuestion => {
  const [at, right, ...wrong] = rest as number[];
  const line = irabWordsAt(key)[corpusWords(key, at)[0]];
  return {
    key: `${IRAB_QUIZ}:${key}`,
    family: IRAB_QUIZ,
    promptArabic: 'ما إعراب ما لُوِّن؟',
    quran: wordsOf(key),
    number: Number(key.split(':')[1]),
    marked: [at],
    choices: shuffle([right, ...wrong], random).map(role => ({ value: String(role), labelArabic: data.irab.roles[role] })),
    correctAnswer: String(right),
    ayahKey: key,
    note: { label: 'الشجرة النحوية للقرآن والمدونة القرآنية', text: line?.morph ?? '' },
    evidence: { claimKeys: [] },
  };
});

/** كيف يقرؤها؟ A word the ten readers differ on, coloured, and how one of them reads it; each reading names its readers once answered. */
export const qiraatQuiz = bankKind(QIRAAT_QUIZ, () => data.qiraat, ([key, ...rest], random): ChoiceQuestion => {
  const [at, reader] = rest as number[];
  const difference = qiraatOf(key)[at];
  const right = difference.readings.findIndex(reading => reading.rawis.some(n => RIWAYAT[n - 1].reader === READERS[reader].id));
  return {
    key: `${QIRAAT_QUIZ}:${key}:${at}`,
    family: QIRAAT_QUIZ,
    promptArabic: `كيف يقرأ ${READERS[reader].name} ما لُوِّن؟`,
    quran: wordsOf(key),
    number: Number(key.split(':')[1]),
    marked: span(difference.at[1] - difference.at[0] + 1, difference.at[0]),
    choices: shuffle(difference.readings.map((reading, i) => ({ value: String(i), labelArabic: reading.text.trim() })), random),
    quranChoices: true,
    whereOf: Object.fromEntries(difference.readings.map((reading, i) => [String(i), whoReads(reading, difference.readings, false)])),
    correctAnswer: String(right),
    ayahKey: key,
    note: { label: 'المصدر', text: 'الموسوعة القرآنية' },
    evidence: { claimKeys: [] },
  };
});
