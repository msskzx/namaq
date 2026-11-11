import { describe, expect, it } from 'vitest';
import { CURVE, litSpine } from './litSpine';

// Two children 100 wide: centres at 50 and 150, the parent's line meets the spine at 100.
const two = (first: number, second: number) => [{ at: first, size: 100 }, { at: second, size: 100 }];

describe('litSpine', () => {
  it('stops short of the corner of a lit end child, whichever side it sits on', () => {
    // Sideways or left to right: the first child is at the start.
    expect(litSpine(two(0, 100), [true, false], 200)).toEqual([50 + CURVE, 100]);
    expect(litSpine(two(0, 100), [false, true], 200)).toEqual([100, 150 - CURVE]);
    // Top down in Arabic: the first child sits on the right, so its corner is at the far end.
    expect(litSpine(two(100, 0), [true, false], 200)).toEqual([100, 150 - CURVE]);
    expect(litSpine(two(100, 0), [false, true], 200)).toEqual([50 + CURVE, 100]);
  });

  it('runs straight through to a middle child', () => {
    const three = [{ at: 0, size: 100 }, { at: 100, size: 100 }, { at: 200, size: 100 }];
    expect(litSpine(three, [false, true, false], 300)).toBeNull();
    expect(litSpine(three, [true, true, false], 300)).toEqual([50 + CURVE, 150]);
  });

  it('ignores places left over from children a fan no longer has', () => {
    expect(litSpine([...two(100, 0), { at: -100, size: 100 }], [true, false], 200)).toEqual([100, 150 - CURVE]);
  });

  it('lights nothing when nothing is lit or there is only one child', () => {
    expect(litSpine(two(0, 100), [false, false], 200)).toBeNull();
    expect(litSpine([{ at: 0, size: 100 }], [true], 100)).toBeNull();
  });
});
