// The adhkar quiz kind (owner, 2026-11-23: every feature gets a quiz kind; release 1 plan, item 5): «أكمل الذكر» from the
// adhkar already in the app (shared/adhkar.ts), al-Nawawi's al-Adhkar with a named scholar's grade on each. No new data.
// Only the words as printed are asked: when a dhikr is said is left out, since other sound reports name more times for
// some of them (رضيت بالله ربا at morning too), so a wrong time could be a right one.
import { ADHKAR, type AdhkarCitation, type AdhkarOccasion, type Dhikr } from '../adhkar';
import { num } from '../quran/arabicNumber';
import { plainText } from '../sahih';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { uniqueSources, type QuizSource } from './sources';

export const ADHKAR_COMPLETE = 'ADHKAR_COMPLETE';
export const ADHKAR_COMPLETE_NAME = 'أكمل الذكر';
const CHOICES = 4;

/** One shared rule (shared/sahih.ts plainText): no marks, hamzas folded, punctuation set aside, so «وَإِلَيْكَ النُّشُورُ» and
 * «وإليك النشور» are one ending. */
const bare = plainText;

/** «أذكار الصباح والمساء»: the times a dhikr's report names, as the adhkar page's tabs call them. */
const TIME: Record<AdhkarOccasion, string> = { morning: 'الصباح', evening: 'المساء', waking: 'الاستيقاظ', sleep: 'النوم', 'after-prayer': 'دبر الصلاة' };
export const adhkarTimes = (item: Dhikr) => {
  const times = item.occasions.map(occasion => TIME[occasion]);
  return `أذكار ${times.join(' و')}`;
};

/** al-Adhkar's page and report number, then each grade in its scholar's words with its own page. */
const at = (citation: AdhkarCitation) => `${citation.volume > 1 ? `ج ${num(citation.volume)}، ` : ''}ص ${num(citation.page)}${citation.report ? `، رقم ${num(citation.report)}` : ''}`;
const BOOKS: Record<AdhkarCitation['source'], { book: string; author: string }> = {
  'adhkar-nawawi': { book: 'الأذكار', author: 'النووي' },
  'nataij-afkar': { book: 'نتائج الأفكار', author: 'ابن حجر العسقلاني' },
};
export function dhikrSources(item: Dhikr): QuizSource[] {
  return uniqueSources([
    { ...BOOKS[item.citation.source], at: at(item.citation), url: item.citation.url },
    ...item.grades.map(grade => ({ ...BOOKS[grade.citation.source], at: at(grade.citation), quote: grade.quote, by: grade.scholar, url: grade.citation.url })),
  ]);
}

/**
 * A dhikr's ending and the words before it: its last clause (after the last «،») when that is two to five words, else
 * its last three words. None for a short dhikr (a choice of its own words would be most of it), or one whose ending is
 * said earlier in it (the start would give it away).
 */
export function dhikrEnding(text: string): { start: string; end: string } | null {
  const words = text.replace(/[.]+$/, '').trim().split(/\s+/);
  if (words.length < 6) return null;
  const comma = words.findLastIndex((word, i) => i < words.length - 1 && word.endsWith('،'));
  const clause = comma >= 0 ? words.length - 1 - comma : 0;
  const cut = clause >= 2 && clause <= 5 ? comma + 1 : words.length - 3;
  const start = words.slice(0, cut).join(' ').replace(/،$/, '');
  const end = words.slice(cut).join(' ');
  return bare(start).includes(bare(end)) ? null : { start, end };
}

/**
 * «أكمل الذكر»: a dhikr as al-Nawawi prints it, its last words hidden; the wrong choices are the endings of the other
 * adhkar, never one said anywhere in this dhikr. Under each wrong ending, once answered, the adhkar it closes.
 */
export function completeDhikrQuestions(random: Random): ChoiceQuestion[] {
  const all = ADHKAR.flatMap(item => {
    if (item.content.kind !== 'text') return [];
    const cut = dhikrEnding(item.content.text);
    return cut ? [{ item, text: item.content.text, ...cut }] : [];
  });
  return shuffle(all.flatMap(({ item, text, start, end }) => {
    const seen = new Set([bare(end)]);
    const wrong = shuffle(all.filter(other => other.item !== item && !bare(text).includes(bare(other.end))), random)
      .filter(other => !seen.has(bare(other.end)) && seen.add(bare(other.end))).slice(0, CHOICES - 1);
    if (wrong.length < CHOICES - 1) return [];
    const choices = shuffle([{ label: end, of: null as Dhikr | null }, ...wrong.map(other => ({ label: other.end, of: other.item }))], random);
    const question: ChoiceQuestion = {
      key: `${ADHKAR_COMPLETE}:${item.id}`,
      family: ADHKAR_COMPLETE,
      promptArabic: `${start} …`,
      choices: choices.map((choice, i) => ({ value: String(i), labelArabic: choice.label })),
      correctAnswer: String(choices.findIndex(choice => !choice.of)),
      whereOf: Object.fromEntries(choices.flatMap((choice, i) => (choice.of ? [[String(i), `آخر ذكر من ${adhkarTimes(choice.of)}`]] : []))),
      sources: uniqueSources([...dhikrSources(item), ...choices.flatMap(choice => (choice.of ? [{ ...BOOKS[choice.of.citation.source], at: at(choice.of.citation), url: choice.of.citation.url }] : []))]),
      evidence: { claimKeys: [] },
    };
    return [question];
  }), random);
}

/** The dhikr a question of this kind asks, by its key, so «افتح» opens its card on the adhkar page. */
export const askedDhikr = (key: string) => (key.startsWith(`${ADHKAR_COMPLETE}:`) ? ADHKAR.find(item => item.id === key.slice(ADHKAR_COMPLETE.length + 1)) : undefined);

export const adhkarCompleteQuiz: ChoiceKind = {
  id: ADHKAR_COMPLETE,
  name: ADHKAR_COMPLETE_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => completeDhikrQuestions(random).slice(0, limit),
  count: () => completeDhikrQuestions(Math.random).length,
};
