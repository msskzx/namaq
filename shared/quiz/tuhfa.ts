// Tuhfat al-Atfal's question kinds (owner, 2026-11-13): complete a verse, the next verse, and a letter's rule.
// They ask the poem, not the Quran, so the juz range, filters and difficulty do not apply.
import { completeQuestions, nextQuestions, ruleQuestions, TUHFA_COMPLETE, TUHFA_NEXT, TUHFA_RULE } from '../tajwid/questions';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { shuffle, type Random } from './random';

const kind = (id: typeof TUHFA_COMPLETE | typeof TUHFA_NEXT | typeof TUHFA_RULE, name: string, all: (random: Random) => ChoiceQuestion[]): ChoiceKind => ({
  id,
  name,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(all(random), random).slice(0, limit),
  count: () => all(Math.random).length,
});

export const tuhfaComplete = kind(TUHFA_COMPLETE, 'التحفة: أكمل البيت', completeQuestions);
export const tuhfaNext = kind(TUHFA_NEXT, 'التحفة: البيت التالي', nextQuestions);
export const tuhfaRule = kind(TUHFA_RULE, 'التحفة: حكم الحرف', ruleQuestions);
