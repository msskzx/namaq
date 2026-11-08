import { describe, expect, it } from 'vitest';
import { compareKeys, forgottenOrder, isHidden, nextAyah, nextForgotten, positionQuery, previousKey, readPosition, revealAyah, revealWord, stepBack, type RecitePosition } from './recite';

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

  it('walks forgotten ayat in mushaf order', () => {
    const keys = forgottenOrder(['57:3', '2:255', '57:10', 'bad']);
    expect(keys).toEqual(['2:255', '57:3', '57:10']);
    expect(nextForgotten(keys, '57:3')).toBe('57:10');
    expect(nextForgotten(keys, '57:10')).toBeNull();
  });
});
