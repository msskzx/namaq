// see docs/plans/guard-proposals.md
import { describe, expect, it } from 'vitest';
import { act, createParty, viewFor, type Action, type PartyQuestion, type PartyState } from './rules';
import { CHOICE_KINDS } from '../quiz/kinds';
import { seededRandom } from '../quiz/feedQuiz';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { branchQuestionPool, branchQuiz } from '../quiz/branchQuestions';
import { ayahEnds } from '../quiz/pageKinds';
import { writeAsk } from '../quiz/writeAsk';

const SHOWN: Record<string, string> = {
  key: 'replaced by the question\'s place in the party',
  family: 'the kind, named on the screen',
  promptArabic: 'the question itself (giveaway.test.ts checks it)',
  choices: 'the offered choices',
  correctAnswer: 'sent empty',
  correctAnswers: 'sent empty on a question with several right choices: it only tells the screen to draw ticks',
  order: 'sent empty on a question that puts its choices in order: it only tells the screen to draw the rows to drag',
  tray: 'that the order is filled in boxes from a tray, not dragged',
  quran: 'the Quran words shown under the prompt',
  number: 'the ayah number shown after its words',
  page: 'how the mushaf page is drawn; it names no surah',
  reveal: 'a recited snippet\'s rest, which the reader opens and grades himself',
  map: 'which of the atlas\'s layers the pins are drawn on; it names no place',
  marked: 'the word the question asks about, marked on screen',
  look: 'the look-up view, its mark removed',
  passage: 'the book text the question asks about',
  boxes: 'the chain shown over the choices, the asked box «؟» and the other blanks «…»',
  quranChoices: 'how the choices are drawn',
  terms: 'the term each choice names, for every choice alike',
  compare: 'KNOWN: asked words include the blanks',
  write: 'only which words are asked; the words wait (viewFor)',
  ayahKey: 'only on a written ayah, which names its place in the question',
};

const TREE_KNOWN = new Set(['tree', 'asked', 'phrase', 'level', 'variants', 'prefixes', 'branches']);
const UNSHOWN = ['key', 'compare', 'write', 'ayahKey', 'reveal'];

const run = (state: PartyState, actions: Action[]) => actions.reduce((current, action) => act(current, action, 0).state, state);
const asked = (question: PartyQuestion) => run(createParty('123456', 'p0', 'Host', 0), [
  { type: 'join', playerId: 'p0', name: 'Host' },
  { type: 'join', playerId: 'p1', name: 'Amina' },
  { type: 'start', playerId: 'p0', early: true },
  { type: 'loaded', questions: [question], surahNames: {} },
]);

const kinds: { name: string; questions: unknown[] }[] = [
  ...CHOICE_KINDS.map(kind => ({ name: kind.name, questions: kind.questions({ range: null, filters: {} }, 'medium', seededRandom(5)) })),
  { name: 'trees', questions: branchQuiz(branchQuestionPool((corpus as { ayat: BranchAyah[] }).ayat, null), 10, 3, seededRandom(5)) },
  { name: 'written ayat', questions: ayahEnds.questions({ range: null, filters: { surahs: '112' } }, 'easy', seededRandom(5))
    .map(question => ({ ...question, write: writeAsk(question.ayahKey!, question.page!, 'whole') ?? undefined })) },
];

describe('a party phone gets nothing that answers the question before the reveal', () => {
  for (const { name, questions } of kinds) {
    it(name, () => {
      expect(questions.length).toBeGreaterThan(0);
      for (const question of questions as unknown as PartyQuestion[]) {
        const view = viewFor(asked(question), 'p1', 0).question!;
        const sent = Object.entries(view).filter(([, value]) => value !== undefined).map(([field]) => field);
        expect(sent.filter(field => !(field in SHOWN) && !(view.tree && TREE_KNOWN.has(field))), question.key).toEqual([]);
        expect(view.correctAnswer).toBe('');
        if (view.correctAnswers) expect(view.correctAnswers).toEqual([]);
        expect(view.key).not.toBe(question.key);
        expect((view.look as { mark?: unknown } | undefined)?.mark).toBeUndefined();
        if (view.ayahKey !== undefined) expect(view.write, question.key).toBeDefined();
        const label = (question.choices as { value: string; labelArabic: string }[] | undefined)?.find(choice => choice.value === question.correctAnswer)?.labelArabic;
        const unshown = JSON.stringify(UNSHOWN.map(field => (view as Record<string, unknown>)[field]));
        if (label) expect(unshown.includes(label), `${question.key} names «${label}»`).toBe(false);
      }
    });
  }
});
