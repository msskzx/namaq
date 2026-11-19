import { describe, expect, it } from 'vitest';
import { allForgotten, forgotKeys, forgotLabel, selectedText, selectedWords, selectionOf, wordAtPoint, wordScope } from './selection';

describe('reader selection', () => {
  it('runs from the pressed word to the finger, either way', () => {
    expect(selectionOf('2:255', 4)).toEqual({ key: '2:255', from: 4, to: 4 });
    expect(selectionOf('2:255', 4, 1)).toEqual({ key: '2:255', from: 1, to: 4 });
    expect(wordScope(selectionOf('2:255', 4))).toBe('word');
    expect(wordScope(selectionOf('2:255', 4, 6))).toBe('words');
    expect(selectedWords(selectionOf('2:255', 4, 6))).toEqual([4, 5, 6]);
  });

  it('marks the ayah, or each selected word on its own', () => {
    const words = selectionOf('1:2', 1, 2);
    expect(forgotKeys('ayah', words)).toEqual(['1:2']);
    expect(forgotKeys('words', words)).toEqual(['1:2:1', '1:2:2']);
    expect(allForgotten(['1:2:1', '1:2:2'], { '1:2:1': {} })).toBe(false);
    expect(allForgotten(['1:2:1', '1:2:2'], { '1:2:1': {}, '1:2:2': {} })).toBe(true);
    expect(allForgotten([], {})).toBe(false);
  });

  it('names the one forgot button for what is selected', () => {
    expect(forgotLabel('ayah', 0, false)).toBe('نسيت الآية');
    expect(forgotLabel('ayah', 2, false)).toBe('نسيت الآية مجددًا');
    expect(forgotLabel('word', 0, false)).toBe('نسيت الكلمة');
    expect(forgotLabel('words', 0, true)).toBe('تذكّرت هذه الكلمات');
  });

  it('copies the selected words', () => {
    expect(selectedText(['الحمد', 'لله', 'رب', 'العالمين'], selectionOf('1:2', 1, 2))).toBe('لله رب');
  });

  it('finds the word under the finger, or the nearest on its line', () => {
    // Two lines, right to left: words 0 and 1 on the first, 2 on the second.
    const boxes = [{ x: 200, y: 0, w: 80, h: 40 }, { x: 100, y: 0, w: 80, h: 40 }, null, { x: 200, y: 50, w: 80, h: 40 }];
    expect(wordAtPoint(boxes, 120, 20)).toBe(1);
    expect(wordAtPoint(boxes, 190, 20)).toBe(0);
    expect(wordAtPoint(boxes, 20, 70)).toBe(3);
    expect(wordAtPoint(boxes, 150, 200)).toBe(3);
    expect(wordAtPoint([], 0, 0)).toBeNull();
  });
});
