// The quiz settings both the website and the phone app offer, and the party worker checks.
export const QUIZ_TOPICS = ['PEOPLE', 'BATTLES', 'RELATIONSHIPS', 'AYAT', 'EVENTS', 'PERSON_CIRCLE', 'BRANCHES'] as const;
export type QuizTopic = (typeof QUIZ_TOPICS)[number];
export type QuizTopics = readonly QuizTopic[];

export const QUIZ_LENGTHS = [5, 10, 15] as const;
export type QuizLength = (typeof QUIZ_LENGTHS)[number];

// docs/quiz-ayah-branches.md
export const QUIZ_LEAVES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const DEFAULT_LEAVES = 3;
export const parseLeaves = (value: string | null) => {
  const n = Number(value);
  return (QUIZ_LEAVES as readonly number[]).includes(n) ? n : DEFAULT_LEAVES;
};
