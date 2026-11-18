// The quiz settings both the website and the phone app offer, and the party worker checks.
export const QUIZ_TOPICS = ['PEOPLE', 'BATTLES', 'RELATIONSHIPS', 'AYAT', 'EVENTS', 'PERSON_CIRCLE', 'BRANCHES', 'SURAH', 'RECITE', 'COMPARE', 'OPENINGS', 'ENDS', 'TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE', 'MEANING', 'TAFSIR', 'BALAGHA', 'IRAB', 'QIRAAT', 'SIRA'] as const;
export type QuizTopic = (typeof QUIZ_TOPICS)[number];
export type QuizTopics = readonly QuizTopic[];

/** The topics built from the Quran's text on the fly (quiz/kinds.ts), not from the question bank. */
export const CHOICE_TOPICS = ['COMPARE', 'SURAH', 'RECITE', 'OPENINGS', 'ENDS', 'MEANING', 'TAFSIR', 'BALAGHA', 'IRAB', 'QIRAAT', 'TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE', 'SIRA'] as const satisfies readonly QuizTopic[];
/** The topics recited on the page with recite mode's bar: in a party the pen writes them and the party grades the words (owner, 2026-11-17). */
export const WRITTEN_TOPICS: readonly QuizTopic[] = ['RECITE', 'OPENINGS', 'ENDS'];
/** The topics asked on the ayah's own mushaf page, so the setup offers «اكتب الآيات قبلها في الصفحة». */
export const PAGE_TOPICS: readonly QuizTopic[] = ['SURAH', 'RECITE', 'OPENINGS', 'ENDS'];
/** The topics asked over part of the Quran, so the setup offers the range filters. */
// Tuhfat al-Atfal's kinds ask the poem, so a Quran range means nothing to them.
export const RANGED_TOPICS: readonly QuizTopic[] = ['BRANCHES', 'SURAH', 'RECITE', 'COMPARE', 'OPENINGS', 'ENDS', 'MEANING', 'TAFSIR', 'BALAGHA', 'IRAB', 'QIRAAT'];

export const QUIZ_LENGTHS = [5, 10, 15] as const;
export type QuizLength = (typeof QUIZ_LENGTHS)[number];

// docs/quiz-ayah-branches.md
export const QUIZ_LEAVES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const DEFAULT_LEAVES = 3;
export const parseLeaves = (value: string | null) => {
  const n = Number(value);
  return (QUIZ_LEAVES as readonly number[]).includes(n) ? n : DEFAULT_LEAVES;
};
