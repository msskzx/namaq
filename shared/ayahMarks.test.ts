// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { clearForgotten, markForgotten, readAyahMarks, recentlyForgotten } from './ayahMarks';

describe('ayahMarks', () => {
  beforeEach(() => localStorage.clear());

  it('counts each time an ayah is forgotten and clears it', () => {
    markForgotten('57:3');
    markForgotten('57:3');
    markForgotten('2:255');
    expect(readAyahMarks()['57:3'].forgot).toBe(2);
    clearForgotten('57:3');
    expect(Object.keys(readAyahMarks())).toEqual(['2:255']);
  });

  it('ignores damaged storage', () => {
    localStorage.setItem('ayah-forgot', '{"57:1":{"forgot":0},"x":{"forgot":3},"2:1":{"forgot":1}');
    expect(readAyahMarks()).toEqual({});
    localStorage.setItem('ayah-forgot', '{"57:1":{"forgot":0},"x":{"forgot":3},"2:1":{"forgot":1}}');
    expect(Object.keys(readAyahMarks())).toEqual(['2:1']);
  });

  it('lists the last forgotten ayah first', () => {
    expect(recentlyForgotten({ '2:255': { forgot: 3, at: 10 }, '1:1': { forgot: 1, at: 30 }, '57:3': { forgot: 1, at: 20 } })).toEqual(['1:1', '57:3', '2:255']);
  });
});
