import { ADHKAR, type AdhkarCitation, type AdhkarOccasion, type Dhikr } from '../adhkar';
import { num } from '../quran/arabicNumber';
import { plainText } from '../sahih';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { uniqueSources, type QuizSource } from './sources';

export const ADHKAR_COMPLETE = 'ADHKAR_COMPLETE';
export const ADHKAR_COMPLETE_NAME = 'أكمل الذكر';
const CHOICES = 4;

const bare = plainText;

const TIME: Record<AdhkarOccasion, string> = { morning: 'الصباح', evening: 'المساء', waking: 'الاستيقاظ', sleep: 'النوم', 'after-prayer': 'دبر الصلاة' };
export const adhkarTimes = (item: Dhikr) => {
  const times = item.occasions.map(occasion => TIME[occasion]);
  return `أذكار ${times.join(' و')}`;
};

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

export const askedDhikr = (key: string) => (key.startsWith(`${ADHKAR_COMPLETE}:`) ? ADHKAR.find(item => item.id === key.slice(ADHKAR_COMPLETE.length + 1)) : undefined);

export const adhkarCompleteQuiz: ChoiceKind = {
  id: ADHKAR_COMPLETE,
  name: ADHKAR_COMPLETE_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => completeDhikrQuestions(random).slice(0, limit),
  count: () => completeDhikrQuestions(Math.random).length,
};
