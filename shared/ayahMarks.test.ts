// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { ayahHref, clearForgotten, markAyah, markWord, wordMarkKey, dueMarks, markForgotten, readAyahMarks, readDueMarks, mostForgotten, rememberAyah, restoreMark, toggleForgotten } from './ayahMarks';

describe('ayahMarks', () => {
  beforeEach(() => localStorage.clear());

  it('opens a forgotten word\'s ayah', () => {
    expect(ayahHref('2:255')).toBe('/quran/read/ayah/2/255');
    expect(ayahHref('2:255:3')).toBe('/quran/read/ayah/2/255');
  });

  it('counts each time an ayah is forgotten', () => {
    markForgotten('57:3');
    markForgotten('57:3');
    markForgotten('2:255');
    expect(readAyahMarks()['57:3'].forgot).toBe(2);
  });

  it('toggles forgot and remembered on the same ayah, as a second double tap does', () => {
    const now = Date.now();
    toggleForgotten('2:2', now);
    expect(readDueMarks(now)['2:2']).toBeTruthy();
    toggleForgotten('2:2', now);
    expect(readDueMarks(now)['2:2']).toBeUndefined();
    toggleForgotten('2:2', now);
    expect(readAyahMarks()['2:2'].forgot).toBe(2);
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


describe('forgotten word positions', () => {
  beforeEach(() => localStorage.clear());

  it('keeps an ayah and its distinct words in the same offline store without word text', () => {
    markForgotten('2:255', 100);
    markForgotten(wordMarkKey('2:255', 0), 200);
    markForgotten(wordMarkKey('2:255', 4), 300);
    markForgotten(wordMarkKey('2:255', 0), 400);
    expect(JSON.parse(localStorage.getItem('ayah-forgot')!)).toEqual({
      '2:255': { forgot: 1, at: 100 },
      '2:255:0': { forgot: 2, at: 400 },
      '2:255:4': { forgot: 1, at: 300 },
    });
    expect(readAyahMarks()).toEqual(JSON.parse(localStorage.getItem('ayah-forgot')!));
    expect(markAyah('2:255:0')).toBe('2:255');
    expect(markWord('2:255:0')).toBe(0);
    expect(markWord('2:255')).toBeUndefined();
  });

  it('undoes a resting word without changing its ayah or another word', () => {
    markForgotten('2:255', 100);
    markForgotten('2:255:0', 200);
    markForgotten('2:255:4', 300);
    rememberAyah('2:255:0', 400);
    clearForgotten('2:255:0');
    expect(readAyahMarks()).toEqual({
      '2:255': { forgot: 1, at: 100 },
      '2:255:4': { forgot: 1, at: 300 },
    });
    clearForgotten('2:255:0');
    expect(Object.keys(readAyahMarks())).toEqual(['2:255', '2:255:4']);
  });

  it('rests a remembered word like an ayah and resets only that word after a mistake', () => {
    const day = 86_400_000;
    let now = 1_000;
    markForgotten('2:255', now);
    markForgotten('2:255:0', now);
    markForgotten('2:255:4', now);
    for (const days of [1, 3, 7, 30]) {
      rememberAyah('2:255:0', now);
      expect(dueMarks(readAyahMarks(), now)['2:255:0']).toBeUndefined();
      expect(readAyahMarks()['2:255:0'].due).toBe(now + days * day);
      now += days * day;
      expect(dueMarks(readAyahMarks(), now)['2:255:0']).toBeDefined();
    }
    markForgotten('2:255:0', now);
    expect(readAyahMarks()['2:255:0']).toEqual({ forgot: 2, at: now });
    expect(readAyahMarks()['2:255']).toEqual({ forgot: 1, at: 1_000 });
    expect(readAyahMarks()['2:255:4']).toEqual({ forgot: 1, at: 1_000 });
    rememberAyah('2:255:0', now);
    expect(readAyahMarks()['2:255:0'].due).toBe(now + day);
  });

  it('reads old ayah marks and word zero while discarding malformed word positions and stored text', () => {
    localStorage.setItem('ayah-forgot', JSON.stringify({
      '1:2': { forgot: 2, at: 10 },
      '1:2:0': { forgot: 1, at: 20, text: 'not stored' },
      '1:2:-1': { forgot: 1, at: 20 },
      '1:2:1.5': { forgot: 1, at: 20 },
      '1:2:0:1': { forgot: 1, at: 20 },
    }));
    expect(readAyahMarks()).toEqual({
      '1:2': { forgot: 2, at: 10 },
      '1:2:0': { forgot: 1, at: 20 },
    });
  });

  it('takes a card\'s tick back: the mark is as it was before, rest and count alike', () => {
    markForgotten('57:3', 0);
    const before = readAyahMarks()['57:3'];
    rememberAyah('57:3', 0);
    restoreMark('57:3', before);
    expect(readAyahMarks()['57:3']).toEqual(before);
    expect(Object.keys(readDueMarks(1))).toEqual(['57:3']);
    markForgotten('2:255', 0);
    restoreMark('2:255', undefined);
    expect(readAyahMarks()['2:255']).toBeUndefined();
  });
});
