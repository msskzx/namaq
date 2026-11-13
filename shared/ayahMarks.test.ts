// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { dueMarks, markForgotten, readAyahMarks, readDueMarks, mostForgotten, rememberAyah } from './ayahMarks';

describe('ayahMarks', () => {
  beforeEach(() => localStorage.clear());

  it('counts each time an ayah is forgotten', () => {
    markForgotten('57:3');
    markForgotten('57:3');
    markForgotten('2:255');
    expect(readAyahMarks()['57:3'].forgot).toBe(2);
  });

  it('rests a remembered ayah 1, 3, 7, then 30 days, and forgetting it starts over', () => {
    const day = 86_400_000;
    let now = 1_000_000;
    markForgotten('57:3', now);
    const restsFor = () => {
      rememberAyah('57:3', now);
      const due = readAyahMarks()['57:3'].due!;
      expect(Object.keys(dueMarks(readAyahMarks(), due - 1))).toEqual([]);
      expect(Object.keys(dueMarks(readAyahMarks(), due))).toEqual(['57:3']);
      const days = (due - now) / day;
      now = due;
      return days;
    };
    expect([restsFor(), restsFor(), restsFor(), restsFor(), restsFor()]).toEqual([1, 3, 7, 30, 30]);
    markForgotten('57:3', now);
    expect(Object.keys(dueMarks(readAyahMarks(), now))).toEqual(['57:3']);
    expect(restsFor()).toBe(1);
    expect(readAyahMarks()['57:3'].forgot).toBe(2);
  });

  it('ignores damaged storage', () => {
    localStorage.setItem('ayah-forgot', '{"57:1":{"forgot":0},"x":{"forgot":3},"2:1":{"forgot":1}');
    expect(readAyahMarks()).toEqual({});
    localStorage.setItem('ayah-forgot', '{"57:1":{"forgot":0},"x":{"forgot":3},"2:1":{"forgot":1}}');
    expect(Object.keys(readAyahMarks())).toEqual(['2:1']);
  });

  it('lists the most forgotten ayah first, then the last forgotten', () => {
    expect(mostForgotten({ '2:255': { forgot: 3, at: 10 }, '1:1': { forgot: 1, at: 30 }, '57:3': { forgot: 1, at: 20 } })).toEqual(['2:255', '1:1', '57:3']);
  });
});

describe('readDueMarks', () => {
  beforeEach(() => localStorage.clear());

  it('leaves a resting ayah out until it is due, and keeps one object while nothing changes', () => {
    markForgotten('57:3', 0);
    markForgotten('2:255', 0);
    rememberAyah('57:3', 0);
    const first = readDueMarks(1);
    expect(Object.keys(first)).toEqual(['2:255']);
    expect(readDueMarks(2)).toBe(first);
    expect(Object.keys(readDueMarks(86_400_000)).sort()).toEqual(['2:255', '57:3']);
  });
});
