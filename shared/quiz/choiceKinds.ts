import type { JuzRange } from '../quran/juz';
import { normalizeWord } from '../quran/normalize';
import { wordDiff } from '../quran/wordDiff';
import { keys, type Branch } from '../quran/branches';
import type { Difficulty } from './difficulty';
import type { Random } from './random';
import type { ScopeFilters } from './scopeParams';
import type { QuizTopic } from './settings';
import type { CompareAsk } from './compareAnswers';
import type { PageAsk } from '../quran/writeAyah';
import type { QuizSource } from './sources';

export const RECITE_SNIPPET = 'RECITE';
export const RECITED = '1';
export const FORGOT = '0';

export const PICKS = '\u001f';
export const picksOf = (answer: string | undefined) => (answer ? answer.split(PICKS) : []);
export const ticks = (question: { correctAnswers?: string[] }) => Array.isArray(question.correctAnswers);

export const orders = (question: { order?: string[] }) => Array.isArray(question.order);

export const isRightChoice = (question: { correctAnswer: string; correctAnswers?: string[]; order?: string[] }, value: string) =>
  question.order ? question.order.includes(value) : question.correctAnswers ? question.correctAnswers.includes(value) : value === question.correctAnswer;

export const recited = (question: { reveal?: unknown; page?: { recite?: unknown } }) => !!(question.reveal || question.page?.recite);


export const BOX_ASKED = '؟';
export const BOX_BLANK = '…';

export type ChoiceQuestion = {
  key: string;
  family: string;
  promptArabic: string;
  quran?: string[];
  number?: number;
  reveal?: string[];
  choices: { value: string; labelArabic: string }[];
  correctAnswer: string;
  correctAnswers?: string[];
  order?: string[];
  tray?: boolean;
  ayahKey?: string;
  page?: PageAsk;
  marked?: number[];
  explains?: Record<string, { quote: string; where: string }>;
  alike?: Record<string, { key: string; words: string[] }>;
  boxes?: string[];
  passage?: string;
  quranChoices?: boolean;
  whereOf?: Record<string, string>;
  terms?: Record<string, string>;
  note?: { label: string; text: string };
  map?: { layer: 'life' | 'after' };
  compare?: CompareAsk;
  look: QuizLook;
  witness?: { by: string; text: string; lit?: string };
  sources: QuizSource[];
  evidence: { claimKeys: string[] };
};

export type QuizLook =
  | { view: 'ties'; slug: string; mark?: string }
  | { view: 'life'; slug: string; mark?: string }
  | { view: 'nasab'; slugs: string[]; mark?: boolean; text?: true }
  | { view: 'virtues'; slugs: string[]; mark?: { slug: string; index: number } }
  | { view: 'terms'; names: string[]; mark?: string }
  | { view: 'hadith'; mark?: number }
  | { view: 'sahih'; book: 'bukhari' | 'muslim'; mark?: number }
  | { view: 'story'; slug: string; mark?: undefined }
  | { view: 'battle'; slug: string; mark?: undefined }
  | { view: 'word'; key: string; word: number; mark?: undefined }
  | { view: 'tafsir'; keys: string[]; mark?: string }
  | { view: 'balagha'; key: string; mark?: undefined }
  | { view: 'irab'; key: string; word: number; mark?: undefined }
  | { view: 'qiraat'; key: string; mark?: undefined }
  | { view: 'tuhfa'; mark?: number }
  | { view: 'ayat'; keys: string[]; mark?: string }
  | { view: 'around'; before?: string[]; after?: string[]; mark?: undefined }
  | { view: 'surahs'; surahs: number[]; mark?: undefined }
  | { view: 'prompt'; key: string; word: string; first: boolean; mark?: undefined }
  | { view: 'dhikr'; id: string; mark?: undefined }
  | { view: 'own'; mark?: undefined };

export const unmarked = (look: QuizLook | undefined): QuizLook | undefined => look && ({ ...look, mark: undefined });

export type ChoiceScope = { range: JuzRange | null; filters: ScopeFilters };

export type ChoiceKind = {
  id: QuizTopic;
  name: string;
  party: boolean;
  questions(scope: ChoiceScope, difficulty: Difficulty, random: Random, limit?: number): ChoiceQuestion[];
  count(scope: ChoiceScope): number;
};

export function mixQuestions<T>(lists: T[][], length: number, random: Random, ayatOf: (item: T) => string[] = () => []): T[] {
  const picked: T[] = [];
  const asked = new Set<string>();
  const queues = lists.filter(list => list.length).map(list => [...list]);
  while (picked.length < length && queues.some(queue => queue.length)) {
    for (const queue of queues) {
      while (queue.length && picked.length < length) {
        const item = queue.shift()!;
        const ayat = ayatOf(item);
        if (ayat.some(key => asked.has(key))) continue;
        ayat.forEach(key => asked.add(key));
        picked.push(item);
        break;
      }
    }
  }
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
}

export const questionAyat = (question: { tree?: Branch; ayahKey?: string; compare?: CompareAsk }) =>
  question.tree ? keys(question.tree) : question.compare ? [question.compare.shown.key, question.compare.asked.key] : question.ayahKey ? [question.ayahKey] : [];

export const alikeDiff = (asked: string[], alike: string[]) => wordDiff(asked.map(normalizeWord), alike.map(normalizeWord));
