// Multiple-choice question kinds (owner, 2026-11-13): each kind is a quiz topic, so its questions mix with the trees
// and the other kinds in one quiz, solo or party, on the website and in the app.
import type { JuzRange } from '../quran/juz';
import { normalizeWord } from '../quran/normalize';
import { wordDiff } from '../quran/wordDiff';
import { keys, type Branch } from '../quran/branches';
import type { Difficulty } from './difficulty';
import type { Random } from './random';
import type { ScopeFilters } from './scopeParams';
import type { QuizTopic } from './settings';

/** A recited snippet's kind and its two answers (reciteSnippet.ts), here so screens need not load the Quran's text. */
export const RECITE_SNIPPET = 'RECITE';
export const RECITED = '1';
export const FORGOT = '0';

export type ChoiceQuestion = {
  key: string;
  /** The kind's id. */
  family: string;
  promptArabic: string;
  /** Quran words shown in the mushaf's font under the prompt. */
  quran?: string[];
  /** Quran words hidden until the reader asks for them (a recited snippet's rest); the choices come after. */
  reveal?: string[];
  choices: { value: string; labelArabic: string }[];
  correctAnswer: string;
  /** The ayah (`surah:ayah`) the question is about, opened in the mushaf after answering. */
  ayahKey?: string;
  /** For a wrong choice, the ayah in it that looks like the asked one, shown when it is picked. */
  alike?: Record<string, { key: string; words: string[] }>;
  /** Shown under the choices after answering, such as the line of a poem that states the rule. */
  note?: { label: string; text: string };
  evidence: { claimKeys: string[] };
};

/** What part of the Quran a quiz asks: the trees' juz range and range filters (kinds and differences mean nothing here). */
export type ChoiceScope = { range: JuzRange | null; filters: ScopeFilters };

export type ChoiceKind = {
  id: QuizTopic;
  name: string;
  /** Asked in a party too; a kind graded by the reader alone stays solo. */
  party: boolean;
  /** Up to `limit` of the scope's questions (all without one), of the chosen difficulty first, in random order otherwise. */
  questions(scope: ChoiceScope, difficulty: Difficulty, random: Random, limit?: number): ChoiceQuestion[];
  /** How many questions the scope holds. */
  count(scope: ChoiceScope): number;
};

/**
 * One quiz from several kinds: each list in turn gives its next question until the quiz is full, so a kind with
 * thousands of questions does not crowd out one with a few. A question about an ayah another question already asks is
 * skipped, since one could give the other away (a recited snippet names its surah). Lists come ordered (difficulty
 * first); the quiz is shuffled.
 */
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

/** The ayat a question asks about: a tree's places, or a choice question's ayah. */
export const questionAyat = (question: { tree?: Branch; ayahKey?: string }) => question.tree ? keys(question.tree) : question.ayahKey ? [question.ayahKey] : [];

/** The words where the asked ayah and a picked look-alike part, by index in each. */
export const alikeDiff = (asked: string[], alike: string[]) => wordDiff(asked.map(normalizeWord), alike.map(normalizeWord));
