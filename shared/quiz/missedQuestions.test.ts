// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { answeredQuestion, dueSeeds, readMissed } from './missedQuestions';

const DAY = 86_400_000;

describe('missed feed questions', () => {
  beforeEach(() => localStorage.clear());

  it('brings a missed question back after the ayah rests, longer each time it is missed again', () => {
    let now = 1_000_000;
    const rests: number[] = [];
    for (let i = 0; i < 5; i++) {
      answeredQuestion('TAFSIR', 7, false, now);
      const due = readMissed()['TAFSIR:7'].due;
      expect(dueSeeds(readMissed(), 'TAFSIR', due - 1)).toEqual([]);
      expect(dueSeeds(readMissed(), 'TAFSIR', due)).toEqual([7]);
      rests.push((due - now) / DAY);
      now = due;
    }
    expect(rests).toEqual([1, 3, 7, 30, 30]);
  });

  it('lets a question go once it is answered right, and keeps kinds apart', () => {
    answeredQuestion('SIRA', 3, false, 0);
    answeredQuestion('TAFSIR', 3, false, 0);
    answeredQuestion('SIRA', 9, false, DAY);
    expect(dueSeeds(readMissed(), 'SIRA', 10 * DAY)).toEqual([3, 9]);
    answeredQuestion('SIRA', 3, true);
    expect(dueSeeds(readMissed(), 'SIRA', 10 * DAY)).toEqual([9]);
    expect(dueSeeds(readMissed(), 'TAFSIR', 10 * DAY)).toEqual([3]);
    answeredQuestion('IRAB', 1, true);
    expect(Object.keys(readMissed())).toHaveLength(2);
  });

  it('reads a broken store as empty', () => {
    localStorage.setItem('missed-questions', '{oops');
    expect(readMissed()).toEqual({});
  });
});
