import { describe, expect, it } from 'vitest';
import { CHOICE_KINDS } from './kinds';
import { FEED_QUIZ_KINDS, FEED_QUIZ_NAMES, feedQuizKind, openingSurah, seededRandom } from './feedQuiz';

describe('the home feed question cards', () => {
  it('give every Quran kind its turn, starting elsewhere each day', () => {
    expect(FEED_QUIZ_KINDS.map((_, slot) => feedQuizKind(10, slot)).sort()).toEqual([...FEED_QUIZ_KINDS].sort());
    expect(feedQuizKind(11, 0)).toBe(feedQuizKind(10, 1));
    expect(FEED_QUIZ_KINDS).not.toContain('PEOPLE');
  });

  it('ask the same question all day: the same seed gives the same numbers', () => {
    const a = seededRandom(7);
    const b = seededRandom(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    for (let seed = 0; seed < 500; seed++) expect(openingSurah(seed)).toSatisfy((surah: number) => surah >= 1 && surah <= 114);
    for (let seed = 0; seed < 50; seed++) expect([18, 36]).toContain(openingSurah(seed, [18, 36]));
    expect(openingSurah(1, [])).toBeNull();
  });
  it('names each kind as the quiz does', () => {
    for (const kind of CHOICE_KINDS) expect(FEED_QUIZ_NAMES[kind.id]).toBe(kind.name);
    for (const kind of FEED_QUIZ_KINDS) expect(FEED_QUIZ_NAMES[kind]).toBeTruthy();
  });
});
