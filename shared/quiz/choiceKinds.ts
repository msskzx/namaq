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
import type { CompareAsk } from './compareAnswers';
import type { PageAsk } from '../quran/writeAyah';

/** A recited snippet's kind and its two answers (reciteSnippet.ts), here so screens need not load the Quran's text. */
export const RECITE_SNIPPET = 'RECITE';
export const RECITED = '1';
export const FORGOT = '0';

/**
 * A question the reader recites or writes and then grades (حفظتها or نسيتها): what it asks stays hidden until it is shown,
 * its two answers keep their order, and نسيتها puts the ayah on the forgotten shelf.
 */
/** What joins the ticks of a question of several right choices into one answer (a character no label holds). */
export const PICKS = '\u001f';
export const picksOf = (answer: string | undefined) => (answer ? answer.split(PICKS) : []);
/** Several right choices: the question ticks boxes (in a party before the reveal the list is empty, still saying so). */
export const ticks = (question: { correctAnswers?: string[] }) => Array.isArray(question.correctAnswers);

/** Whether a choice is a right one: the one answer, or one of several. */
export const isRightChoice = (question: { correctAnswer: string; correctAnswers?: string[] }, value: string) =>
  question.correctAnswers ? question.correctAnswers.includes(value) : value === question.correctAnswer;

export const recited = (question: { reveal?: unknown; page?: { recite?: unknown } }) => !!(question.reveal || question.page?.recite);

export type ChoiceQuestion = {
  key: string;
  /** The kind's id. */
  family: string;
  promptArabic: string;
  /** Quran words shown in the mushaf's font under the prompt. */
  quran?: string[];
  /** The ayah's number, shown after its words as the mushaf's end mark (owner, 2026-11-14, «في أي سورة؟»). */
  number?: number;
  /** Quran words hidden until the reader asks for them (a recited snippet's rest); the choices come after. */
  reveal?: string[];
  choices: { value: string; labelArabic: string }[];
  correctAnswer: string;
  /**
   * A question with more than one right choice (owner, 2026-11-19; sketch titles-quiz/multi-select-dark.png): the reader
   * ticks every one that holds, then checks. Both are in the choices' order, and `correctAnswer` is these joined by PICKS,
   * as a reader's ticks are sent (`picksOf` reads them back), so «all of them and nothing else» is still one string.
   */
  correctAnswers?: string[];
  /** The ayah (`surah:ayah`) the question is about, opened in the mushaf after answering. */
  ayahKey?: string;
  /** Asked on the ayah's own mushaf page instead of the words above (QuizPage): how much shows, what is written, the surah title. */
  page?: PageAsk;
  /** Words of `quran` marked in the accent colour: the word a question asks about («ما معنى؟»). */
  marked?: number[];
  /** Once answered, what a wrong choice is: the meaning of `quote` (page words, drawn in the mushaf's font) at `where` («معنى «فراتا»، المرسلات ٢٧»). */
  explains?: Record<string, { quote: string; where: string }>;
  /** For a wrong choice, the ayah in it that looks like the asked one, shown when it is picked. */
  alike?: Record<string, { key: string; words: string[] }>;
  /** A book's text the question asks about, drawn over the choices; its own quotes of the Quran (﴿…﴾) in the mushaf's font («لأي آية هذا التفسير؟»). */
  passage?: string;
  /** The choices are Quran words (whole ayat, or a word as a reader reads it), drawn in the mushaf's font. */
  quranChoices?: boolean;
  /** Once answered, a line under each choice saying what it is: an ayah's place, a reading's readers. */
  whereOf?: Record<string, string>;
  /** Once answered, the balagha term each choice names (shared/quran/balaghaTerms.ts), a tap from its definition. */
  terms?: Record<string, string>;
  /** Shown under the choices after answering, such as the line of a poem that states the rule. */
  note?: { label: string; text: string };
  /** A compare question (compareQuiz.ts): typed into its blanks, not picked from choices. */
  compare?: CompareAsk;
  /** What «ابحث عن الجواب» opens, and after the answer what shows under it: the feature's own view (QuizLook). */
  look?: QuizLook;
  evidence: { claimKeys: string[] };
};

/**
 * The feature's view a question opens to look its answer up (owner, 2026-11-19: the same view as its page and its feed
 * card, never a stand-in). `mark` points at the answer in it, so a party keeps it back until the reveal.
 * - `ties`: the person's ties round him (TiesRing), the asked person marked.
 * - `nasab`: the nasab tree of the people, where they meet named.
 * - `virtues`: the virtues each person's entry gives, the asked one marked.
 * - `terms`: the definition of each balagha term offered, the asked one marked.
 * - `hadith`: al-Nawawi's Forty with a search; the asked hadith once marked.
 * - `story` / `battle`: the sira story or battle whole, as its page draws it.
 * - `word`: the meaning books on a word of an ayah (the reader's word sheet).
 * - `tafsir`: al-Sa'di on each offered ayah, the asked one marked.
 * - `balagha` / `irab` / `qiraat`: the reader's balagha, i'rab or readings sheet of the ayah.
 * - `tuhfa`: the poem; once marked, the chapter of the verse that answers, the verse lit.
 */
export type QuizLook =
  | { view: 'ties'; slug: string; mark?: string }
  | { view: 'nasab'; slugs: string[]; mark?: boolean }
  | { view: 'virtues'; slugs: string[]; mark?: { slug: string; index: number } }
  | { view: 'terms'; names: string[]; mark?: string }
  | { view: 'hadith'; mark?: number }
  | { view: 'story'; slug: string; mark?: undefined }
  | { view: 'battle'; slug: string; mark?: undefined }
  | { view: 'word'; key: string; word: number; mark?: undefined }
  | { view: 'tafsir'; keys: string[]; mark?: string }
  | { view: 'balagha'; key: string; mark?: undefined }
  | { view: 'irab'; key: string; word: number; mark?: undefined }
  | { view: 'qiraat'; key: string; mark?: undefined }
  | { view: 'tuhfa'; mark?: number };

/** A look as a party shows it before the reveal: without what points at the answer. */
export const unmarked = (look: QuizLook | undefined): QuizLook | undefined => look && ({ ...look, mark: undefined });

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

/** The ayat a question asks about: a tree's places, a compare card's two ayat, or a choice question's ayah. */
export const questionAyat = (question: { tree?: Branch; ayahKey?: string; compare?: CompareAsk }) =>
  question.tree ? keys(question.tree) : question.compare ? [question.compare.shown.key, question.compare.asked.key] : question.ayahKey ? [question.ayahKey] : [];

/** The words where the asked ayah and a picked look-alike part, by index in each. */
export const alikeDiff = (asked: string[], alike: string[]) => wordDiff(asked.map(normalizeWord), alike.map(normalizeWord));
