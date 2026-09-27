export type Random = () => number;

export function sampleDistinct<T>(pool: readonly T[], count: number, random: Random): T[] | null {
  if (pool.length < count) return null;
  const rest = [...pool];
  const picked: T[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(random() * rest.length);
    picked.push(rest.splice(index, 1)[0]);
  }
  return picked;
}

export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Choices come back shuffled, correctness identified by value rather than
 * position -- see docs/plans/solo-quiz.md, "Why correctAnswer, not
 * correctIndex".
 */
export function shuffleChoices<T>(correct: T, distractors: readonly T[], random: Random): T[] {
  return shuffle([correct, ...distractors], random);
}
