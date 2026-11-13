import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import { type BranchAyah } from '@shared/quran/branches';
import { branchQuestionPool, branchQuiz } from './branchQuestions';
import { byDifficulty, DIFFICULTIES, levelOf, parseDifficulty, treeScore, type Difficulty } from './difficulty';
import { quizTrees } from './treeScope';

const all = data.ayat as BranchAyah[];
const words = (key: string) => all.find(ayah => ayah.key === key)!.words;

describe('quiz difficulty', () => {
  const pool = branchQuestionPool(all, null, quizTrees(null, {}));

  it('splits the quiz trees of the whole Quran into about thirds', () => {
    const counts = Object.fromEntries(DIFFICULTIES.map(level => [level, 0])) as Record<Difficulty, number>;
    for (const group of pool.candidates) counts[pool.level(group)]++;
    for (const level of DIFFICULTIES) expect(counts[level] / pool.candidates.length, level).toBeGreaterThan(0.28);
  });

  it('calls nearly the same ayat hard and ayat that part at once easy', () => {
    // البقرة ٥٨ والأعراف ١٦١: the same story, word for word but a few.
    expect(levelOf(treeScore([words('2:58'), words('7:161')]))).toBe('hard');
    // Ayat sharing only an opening phrase.
    expect(levelOf(treeScore([words('2:21'), words('4:1')]))).toBe('easy');
  });

  it('asks the chosen level first and fills from the next ones', () => {
    const order = byDifficulty(['a', 'b', 'c', 'd'], 'easy', item => ({ a: 'hard', b: 'medium', c: 'easy', d: 'easy' } as Record<string, Difficulty>)[item]);
    expect(order).toEqual(['c', 'd', 'b', 'a']);
    let seed = 1;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (const level of DIFFICULTIES) {
      const quiz = branchQuiz(pool, 15, 3, random, level);
      expect(quiz).toHaveLength(15);
      expect(quiz.every(question => question.level === level), level).toBe(true);
    }
  });

  it('falls back to medium for anything unknown', () => {
    expect(parseDifficulty('hard')).toBe('hard');
    expect(parseDifficulty('extreme')).toBe('medium');
    expect(parseDifficulty(null)).toBe('medium');
  });
});
