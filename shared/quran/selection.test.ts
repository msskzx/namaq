import { describe, expect, it } from 'vitest';
import { forgotToggle, isForgotten, isPhrase, selectedText, selectionOf, wordAtPoint, wordKeys } from './selection';

describe('reader selection', () => {
  it('runs from the pressed word to the finger, either way', () => {
    expect(selectionOf('2:255', 4, 1)).toEqual({ key: '2:255', from: 1, to: 4 });
    expect(isPhrase(selectionOf('2:255', 4))).toBe(false);
    expect(isPhrase(selectionOf('2:255', 4, 6))).toBe(true);
  });

  it('marks each selected word on its own, and counts them forgotten only when every one is due', () => {
    const keys = wordKeys(selectionOf('1:2', 2, 1));
    expect(keys).toEqual(['1:2:1', '1:2:2']);
    expect(isForgotten(keys, { '1:2:1': {} })).toBe(false);
    expect(isForgotten(keys, { '1:2:1': {}, '1:2:2': {} })).toBe(true);
    expect(isForgotten([], {})).toBe(false);
  });

  it('a bulb tap rests them all once all are forgotten, else marks only the ones not yet forgotten', () => {
    const keys = ['1:2:1', '1:2:2'];
    expect(forgotToggle(keys, { '1:2:1': {} })).toEqual({ rest: [], forget: ['1:2:2'] });
    expect(forgotToggle(keys, { '1:2:1': {}, '1:2:2': {} })).toEqual({ rest: keys, forget: [] });
  });

  it('copies the selected words', () => {
    expect(selectedText(['الحمد', 'لله', 'رب', 'العالمين'], selectionOf('1:2', 1, 2))).toBe('لله رب');
  });

  it('finds the word under the finger, or the nearest one on the nearest line', () => {
    // Right to left: words 0 and 1 on the first line, a hidden word (no box), word 3 on the next line.
    const boxes = [{ x: 200, y: 0, w: 80, h: 40 }, { x: 100, y: 0, w: 80, h: 40 }, null, { x: 200, y: 50, w: 80, h: 40 }];
    expect(wordAtPoint(boxes, 120, 20)).toBe(1);
    // In the gap between two words: the nearer one.
    expect(wordAtPoint(boxes, 190, 20)).toBe(0);
    expect(wordAtPoint(boxes, 20, 70)).toBe(3);
    expect(wordAtPoint(boxes, 150, 200)).toBe(3);
    expect(wordAtPoint([], 0, 0)).toBeNull();
  });
});
