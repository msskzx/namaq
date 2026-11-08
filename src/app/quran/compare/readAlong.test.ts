import { describe, expect, it } from 'vitest';
import type { PairCard } from './pairCards';
import { readPlan } from './readAlong';

const ayah = (number: number, words: string[]) => ({ number, words });
const shared = { surah: 2, ayah: 1, ayat: [ayah(1, ['a'])] };
const many = (texts: string[][]): PairCard => ({
  id: 'x',
  many: { side: 1, options: texts.map((words, i) => ({ id: String(i), ayah: ayah(i + 5, words), shared: shared.ayat[0] })) },
  sides: [shared, { surah: 3, ayah: 5, ayat: [ayah(5, texts[0])] }],
});

describe('readPlan on a one-to-many card', () => {
  it('reads a refrain once, because the card shows it once', () => {
    expect(readPlan(many([['b'], ['b'], ['b']])).map(step => [step.side, step.ayah])).toEqual([[0, 1], [1, 5]]);
  });

  it('reads each partner when they differ', () => {
    expect(readPlan(many([['b'], ['c']])).map(step => [step.side, step.ayah])).toEqual([[0, 1], [1, 5], [1, 6]]);
  });
});
