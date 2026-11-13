import { describe, expect, it } from 'vitest';
import { textDirection } from './rtl';

describe('textDirection', () => {
  it('makes every text rtl by default', () => {
    expect(textDirection({}, true)).toEqual({ direction: 'rtl', writingDirection: 'rtl' });
    expect(textDirection({}, false)).toEqual({ direction: 'rtl', writingDirection: 'rtl' });
  });
  it('keeps ltr writing (codes, numbers) ltr', () => {
    expect(textDirection({ writingDirection: 'ltr', textAlign: 'left' }, true)).toEqual({ direction: 'ltr' });
  });
  it('turns physical right into start on native, where rtl flips left and right', () => {
    expect(textDirection({ textAlign: 'right' }, true).textAlign).toBe('auto');
    expect(textDirection({ textAlign: 'left' }, true).textAlign).toBe('right');
    expect(textDirection({ textAlign: 'center' }, true).textAlign).toBeUndefined();
    expect(textDirection({ textAlign: 'justify' }, true).textAlign).toBeUndefined();
  });
  it('leaves left and right alone on the web', () => {
    expect(textDirection({ textAlign: 'right' }, false).textAlign).toBeUndefined();
    expect(textDirection({ textAlign: 'left' }, false).textAlign).toBeUndefined();
  });
});
