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

export function placeAnswer<T>(correct: T, distractors: readonly T[], random: Random): { choices: T[]; correctIndex: number } {
  const correctIndex = Math.floor(random() * (distractors.length + 1));
  const choices = [...distractors];
  choices.splice(correctIndex, 0, correct);
  return { choices, correctIndex };
}
