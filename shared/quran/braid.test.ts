import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import { braid } from './braid';

const words = (key: string) => corpus.ayat.find(ayah => ayah.key === key)!.words;
const text = (list: string[], [start, end]: [number, number]) => list.slice(start, end).join(' ').normalize('NFC');

describe('braid', () => {
  it('parts and rejoins 2:35 and 7:19 where Adam is told to dwell and eat', () => {
    const a = words('2:35');
    const b = words('7:19');
    const strands = braid(a, b);
    expect(strands.map(strand => strand.kind)).toEqual(['split', 'shared', 'split', 'shared']);
    expect(strands[0].a).toEqual([0, 2]);
    expect(strands[0].b).toEqual([0, 1]);
    expect(text(a, strands[1].a)).toBe(text(b, strands[1].b));
    expect(strands[1].a[1] - strands[1].a[0]).toBe(4);
    expect(strands[2].a[1] - strands[2].a[0]).toBe(3);
    expect(strands[2].b[1] - strands[2].b[0]).toBe(2);
    expect(strands[3].a[1]).toBe(a.length);
    expect(strands[3].b[1]).toBe(b.length);
  });

  it('covers both lists in order with no gap', () => {
    for (const [p, q] of [['2:35', '7:19'], ['42:14', '45:17'], ['2:48', '2:123'], ['26:8', '26:67'], ['1:1', '2:255']]) {
      const a = words(p);
      const b = words(q);
      const strands = braid(a, b);
      let at = [0, 0];
      for (const strand of strands) {
        expect(strand.a[0]).toBe(at[0]);
        expect(strand.b[0]).toBe(at[1]);
        if (strand.kind === 'shared') expect(strand.a[1] - strand.a[0]).toBe(strand.b[1] - strand.b[0]);
        at = [strand.a[1], strand.b[1]];
      }
      expect(at).toEqual([a.length, b.length]);
      expect(strands.every((strand, i) => i === 0 || strand.kind !== strands[i - 1].kind)).toBe(true);
    }
  });

  it('is one shared strand for identical ayat and one split when nothing long is shared', () => {
    expect(braid(words('26:8'), words('26:67')).map(strand => strand.kind)).toEqual(['shared']);
    expect(braid(['قال', 'موسى'], ['قال', 'فرعون']).map(strand => strand.kind)).toEqual(['split']);
  });
});
