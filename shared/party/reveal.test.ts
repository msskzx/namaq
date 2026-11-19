// Guard (owner sign-off 2026-11-19, docs/plans/guard-proposals.md no. 7): before the reveal a party phone gets only what
// the question shows. viewFor sends a question through an allow-list of fields, so a field added to a kind later fails
// here until someone decides whether it may travel before the reveal.
import { describe, expect, it } from 'vitest';
import { act, createParty, viewFor, type Action, type PartyQuestion, type PartyState } from './rules';
import { CHOICE_KINDS } from '../quiz/kinds';
import { seededRandom } from '../quiz/feedQuiz';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { branchQuestionPool, branchQuiz } from '../quiz/branchQuestions';
import { ayahEnds } from '../quiz/pageKinds';
import { writeAsk } from '../quiz/writeAsk';

/** Fields a phone may hold before the reveal, each with why it tells nothing the screen does not already show. */
const SHOWN: Record<string, string> = {
  key: 'replaced by the question\'s place in the party',
  family: 'the kind, named on the screen',
  promptArabic: 'the question itself (giveaway.test.ts checks it)',
  choices: 'the offered choices',
  correctAnswer: 'sent empty',
  quran: 'the Quran words shown under the prompt',
  number: 'the ayah number shown after its words',
  page: 'how the mushaf page is drawn; it names no surah',
  reveal: 'a recited snippet\'s rest, which the reader opens and grades himself',
  marked: 'the word the question asks about, marked on screen',
  look: 'the look-up view, its mark removed',
  passage: 'the book text the question asks about',
  quranChoices: 'how the choices are drawn',
  terms: 'the term each choice names, for every choice alike',
  // Known break, listed so it can only be fixed, never widened: the typed blanks' words travel in compare.asked, because
  // the screens draw the blanks from them.
  compare: 'KNOWN: asked words include the blanks',
  write: 'only which words are asked; the words wait (viewFor)',
  ayahKey: 'only on a written ayah, which names its place in the question',
};

/**
 * Known break on tree questions, listed so it can only shrink: the whole tree, its ayat and the branches page's answers
 * travel before the reveal, because the screens draw the blanks and the matrix rows from them.
 */
const TREE_KNOWN = new Set(['tree', 'asked', 'phrase', 'level', 'variants', 'prefixes', 'branches']);
/** Fields no screen shows before the reveal: the right choice's label must not hide in them. The look-up lists every choice alike, so only its mark is checked. */
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
  // The party's own kinds, built as the party worker builds them (e2e/app/partyServer.ts).
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
        expect(view.key).not.toBe(question.key);
        expect((view.look as { mark?: unknown } | undefined)?.mark).toBeUndefined();
        if (view.ayahKey !== undefined) expect(view.write, question.key).toBeDefined();
        // Nothing the screen does not show names the right choice.
        const label = (question.choices as { value: string; labelArabic: string }[] | undefined)?.find(choice => choice.value === question.correctAnswer)?.labelArabic;
        const unshown = JSON.stringify(UNSHOWN.map(field => (view as Record<string, unknown>)[field]));
        if (label) expect(unshown.includes(label), `${question.key} names «${label}»`).toBe(false);
      }
    });
  }
});
