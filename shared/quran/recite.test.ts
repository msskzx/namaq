import { describe, expect, it } from 'vitest';
import { compareKeys, forgottenOrder, isHidden, nextAyah, nextForgotten, positionQuery, previousKey, readPosition, revealAyah, reviewHref, reviewPosition, forgottenAyat, nextInReview, reviewedBefore, revealWord, stepBack, type RecitePosition } from './recite';

const counts = new Map([[56, 96], [57, 29]]);
const order = ['56:95', '56:96', '57:1', '57:2', '57:3'];

describe('recite', () => {
  it('orders keys by surah then ayah', () => {
    expect(compareKeys('57:1', '56:96')).toBeGreaterThan(0);
    expect(compareKeys('2:10', '2:9')).toBeGreaterThan(0);
    expect(previousKey('57:1', counts)).toBe('56:96');
    expect(previousKey('1:1', counts)).toBeNull();
  });

  it('hides from the start ayah on and reveals ayah by ayah, word by word', () => {
    let position: RecitePosition = { start: '57:1', shown: null, words: 0 };
    expect(isHidden(position, '56:96', 0, '57:1')).toBe(false);
    expect(nextAyah(position, order)).toBe('57:1');
    expect(isHidden(position, '57:1', 0, '57:1')).toBe(true);
    position = revealWord(position, '57:1', 3);
    expect(isHidden(position, '57:1', 0, '57:1')).toBe(false);
    expect(isHidden(position, '57:1', 1, '57:1')).toBe(true);
    position = revealWord(revealWord(position, '57:1', 3), '57:1', 3);
    expect(position).toEqual({ start: '57:1', shown: '57:1', words: 0 });
    expect(nextAyah(position, order)).toBe('57:2');
    position = revealAyah(revealAyah(position, '57:2'), '57:3');
    expect(nextAyah(position, order)).toBeNull();
  });

  it('steps back a partial ayah first, then whole ayat, never before the start', () => {
    const position = { start: '57:1', shown: '57:2', words: 2 };
    expect(stepBack(position, counts)).toEqual({ start: '57:1', shown: '57:2', words: 0 });
    expect(stepBack({ ...position, words: 0 }, counts)).toEqual({ start: '57:1', shown: '57:1', words: 0 });
    expect(stepBack({ start: '57:1', shown: '57:1', words: 0 }, counts)).toEqual({ start: '57:1', shown: null, words: 0 });
  });

  it('round-trips through the URL', () => {
    const position = { start: '57:1', shown: '57:4', words: 2 };
    expect(readPosition(new URLSearchParams(positionQuery(position)))).toEqual(position);
    expect(readPosition(new URLSearchParams('recite=x'))).toBeNull();
    expect(readPosition(new URLSearchParams('recite=57:5&upto=57:4'))).toEqual({ start: '57:5', shown: null, words: 0 });
  });

  it('carries the forgotten words under review through the URL', () => {
    const position = { start: '1:2', gaps: [0, 3], shown: null, words: 0 };
    expect(readPosition(new URLSearchParams(positionQuery(position)))).toEqual(position);
    expect(readPosition(new URLSearchParams('recite=1:2&word=x'))).toEqual({ start: '1:2', shown: null, words: 0 });
    expect(readPosition(new URLSearchParams('recite=1:2&word=-1'))).toEqual({ start: '1:2', shown: null, words: 0 });
  });

  it('reviews a forgotten ayah whole, and all forgotten words of an ayah in one stop', () => {
    expect(reviewPosition('2:255')).toEqual({ start: '2:255', shown: null, words: 0 });
    expect(reviewPosition('2:255:3')).toEqual({ start: '2:255', gaps: [3], shown: null, words: 0 });
    const due = { '2:255:9': {}, '2:255:3': {}, '2:256:1': {} };
    expect(reviewPosition('2:255:9', due)).toEqual({ start: '2:255', gaps: [3, 9], shown: null, words: 0 });
    expect(reviewPosition('2:255', due)).toEqual({ start: '2:255', gaps: [3, 9], shown: null, words: 0 });
    expect(reviewPosition('2:255:3', { ...due, '2:255': {} })).toEqual({ start: '2:255', shown: null, words: 0 });
    expect(reviewHref('2:255')).toBe('/quran/read/ayah/2/255?recite=2:255&review=1');
    expect(reviewHref('2:255:3', due)).toBe('/quran/read/ayah/2/255?recite=2:255&word=3,9&review=1');
  });

  it('stops at each forgotten ayah once, and a review from a page wraps round to where it began', () => {
    const ayat = forgottenAyat(['2:255:3', '1:2', '2:255:9', '57:3', '2:255']);
    expect(ayat).toEqual(['1:2', '2:255', '57:3']);
    expect(nextInReview(ayat, '2:255', '2:255')).toBe('57:3');
    expect(nextInReview(ayat, '57:3', '2:255')).toBe('1:2');
    expect(nextInReview(ayat, '1:2', '2:255')).toBeNull();
    expect(reviewedBefore(ayat, '1:2', '2:255')).toBe(2);
    expect(nextInReview(ayat, '57:3', '1:2')).toBeNull();
  });

  it('walks forgotten words between ayat in mushaf order', () => {
    const keys = forgottenOrder(['1:3', '1:2:1', '1:2', '1:2:0']);
    expect(keys).toEqual(['1:2', '1:2:0', '1:2:1', '1:3']);
    expect(nextForgotten(keys, '1:2:0')).toBe('1:2:1');
    expect(nextForgotten(['1:2', '1:3'], '1:2:0')).toBe('1:3');
  });

  it('walks forgotten ayat in mushaf order', () => {
    const keys = forgottenOrder(['57:3', '2:255', '57:10', 'bad']);
    expect(keys).toEqual(['2:255', '57:3', '57:10']);
    expect(nextForgotten(keys, '57:3')).toBe('57:10');
    expect(nextForgotten(keys, '57:10')).toBeNull();
  });
});


describe('mixed forgotten ayat and words', () => {
  it('keeps every mark in mushaf order and visits different words of the same ayah separately', () => {
    const keys = forgottenOrder(['2:255:10', '1:2:1', '2:255', '2:255:2', '1:2:0', 'bad', '2:255:-1']);
    expect(keys).toEqual(['1:2:0', '1:2:1', '2:255', '2:255:2', '2:255:10']);
    expect(nextForgotten(keys, '1:2:0')).toBe('1:2:1');
    expect(nextForgotten(['1:2', '1:3'], '1:2:0')).toBe('1:3');
    expect(nextForgotten(keys, '2:255')).toBe('2:255:2');
    expect(nextForgotten(keys, '2:255:2')).toBe('2:255:10');
    expect(nextForgotten(keys, '2:255:10')).toBeNull();
  });
});
